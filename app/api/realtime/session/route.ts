import { NextResponse } from "next/server";

import { applyUsageCookie, requireUsageAccess } from "@/lib/access-control";
import { logAiEvent, logServerError } from "@/lib/observability";
import { createRealtimeSession } from "@/lib/openai";
import { parseInterviewProfile } from "@/lib/request-validation";
import { guardBrowserPostRequest } from "@/lib/request-security";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const guarded = guardBrowserPostRequest(request);
    if (guarded) {
      return guarded.response;
    }

    const access = await requireUsageAccess(request, "realtime");
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
    const session = await createRealtimeSession(parseInterviewProfile(body));
    logAiEvent("Realtime session created.", {
      accessType: access.type,
      trialId: access.type === "trial" ? access.trialId : null,
      userId: access.type === "authenticated" ? access.userId : null,
    });
    const response = NextResponse.json(session, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
    applyUsageCookie(response, access);

    return response;
  } catch (error) {
    logServerError("Realtime session creation failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create Realtime session."
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
