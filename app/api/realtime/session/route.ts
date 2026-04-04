import { NextResponse } from "next/server";

import { applyUsageCookie, requireUsageAccess } from "@/lib/access-control";
import { createRealtimeSession } from "@/lib/openai";
import { parseInterviewProfile } from "@/lib/request-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
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
    const response = NextResponse.json(session);
    applyUsageCookie(response, access);

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create Realtime session."
      },
      { status: 500 }
    );
  }
}
