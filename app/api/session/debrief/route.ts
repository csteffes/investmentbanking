import { NextResponse } from "next/server";

import type { PracticeDebrief } from "@/lib/api-types";
import { applyUsageCookie, requireUsageAccess } from "@/lib/access-control";
import { persistMockInterviewSession } from "@/lib/mock-sessions";
import { createPracticeDebrief } from "@/lib/openai";
import { parsePracticeDebriefRequest } from "@/lib/request-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const access = await requireUsageAccess(request, "debrief");
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
    const debriefRequest = parsePracticeDebriefRequest(body);
    const debrief = (await createPracticeDebrief(debriefRequest)) as PracticeDebrief;
    const sessionId = await persistMockInterviewSession({
      userId: access.type === "authenticated" ? access.userId : null,
      trialId: access.type === "trial" ? access.trialId : null,
      request: debriefRequest,
      debrief,
    });

    const response = NextResponse.json({
      ...debrief,
      sessionId,
    });
    applyUsageCookie(response, access);

    return response;
  } catch (error) {
    const status = error instanceof Error && error.message === "Transcript is required." ? 400 : 500;
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create coach notes."
      },
      { status }
    );
  }
}
