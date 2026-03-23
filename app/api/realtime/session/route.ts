import { NextResponse } from "next/server";

import { createRealtimeSession } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, string>;
    const session = await createRealtimeSession({
      school: body.school,
      background: body.background,
      bank: body.bank,
      group: body.group,
      stage: body.stage
    });

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to create Realtime session."
      },
      { status: 500 }
    );
  }
}
