import { NextResponse } from "next/server";

import { reviewTranscript } from "@/lib/openai";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      transcript: string;
      prompt?: string;
      bank?: string;
      group?: string;
      stage?: string;
    };

    if (!body.transcript?.trim()) {
      return NextResponse.json({ error: "Transcript is required." }, { status: 400 });
    }

    const review = await reviewTranscript(body);
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to review session."
      },
      { status: 500 }
    );
  }
}
