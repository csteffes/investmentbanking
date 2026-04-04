import { NextResponse } from "next/server";

import type { Scorecard } from "@/lib/api-types";
import { applyUsageCookie, requireUsageAccess } from "@/lib/access-control";
import { persistReviewedSession } from "@/lib/mock-sessions";
import { reviewTranscript } from "@/lib/openai";
import { parseReviewRequest } from "@/lib/request-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const access = await requireUsageAccess(request, "review");
    if (!access.ok) {
      return NextResponse.json(
        { error: access.error },
        {
          status: access.status,
          headers: access.retryAfter ? { "Retry-After": String(access.retryAfter) } : undefined,
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const reviewRequest = parseReviewRequest(body);
    const review = (await reviewTranscript(reviewRequest)) as Scorecard;
    const sessionId = await persistReviewedSession({
      userId: access.type === "authenticated" ? access.userId : null,
      trialId: access.type === "trial" ? access.trialId : null,
      request: reviewRequest,
      review,
    });

    const response = NextResponse.json({
      ...review,
      sessionId,
    });
    applyUsageCookie(response, access);

    return response;
  } catch (error) {
    const status = error instanceof Error && error.message === "Transcript is required." ? 400 : 500;
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to review session."
      },
      { status }
    );
  }
}
