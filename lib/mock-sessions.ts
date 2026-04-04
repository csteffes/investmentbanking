import type { ReviewSessionRequest, Scorecard } from "@/lib/api-types";
import { getAdminSupabase } from "@/lib/supabase";

type PersistReviewedSessionInput = {
  userId?: string | null;
  trialId?: string | null;
  request: ReviewSessionRequest;
  review: Scorecard;
};

function splitTranscriptSegments(transcript: string) {
  return transcript
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(/^(Candidate|Coach):\s*(.+)$/i);
      return {
        speaker: match?.[1]?.toLowerCase() === "coach" ? "coach" : "candidate",
        content: (match?.[2] ?? line).trim(),
        segment_order: index,
      };
    })
    .filter((segment) => segment.content.length > 0);
}

function getScore(scores: Record<string, number> | null, ...keys: string[]) {
  if (!scores) {
    return null;
  }

  for (const key of keys) {
    if (typeof scores[key] === "number") {
      return scores[key];
    }
  }

  return null;
}

export async function persistReviewedSession({
  userId,
  trialId,
  request,
  review,
}: PersistReviewedSessionInput) {
  const supabase = getAdminSupabase();

  if (!supabase) {
    return null;
  }

  const { data: session, error: sessionError } = await supabase
    .from("mock_sessions")
    .insert({
      user_id: userId ?? null,
      trial_id: trialId ?? null,
      bank: request.bank ?? null,
      group_name: request.group ?? null,
      interview_stage: request.stage ?? null,
      mode: request.mode ?? "story",
      prompt: request.prompt ?? null,
      transcript_text: request.transcript,
      readiness_score: review.readiness,
    })
    .select("id")
    .single();

  if (sessionError || !session) {
    throw sessionError ?? new Error("Unable to create mock session.");
  }

  const segments = splitTranscriptSegments(request.transcript).map((segment) => ({
    session_id: (session as { id: string }).id,
    ...segment,
  }));

  if (segments.length > 0) {
    const { error: transcriptError } = await supabase.from("transcript_segments").insert(segments);
    if (transcriptError) {
      throw transcriptError;
    }
  }

  const { error: scorecardError } = await supabase.from("scorecards").upsert(
    {
      session_id: (session as { id: string }).id,
      technical_accuracy: getScore(review.scores, "technical_accuracy", "technical accuracy"),
      structure: getScore(review.scores, "structure"),
      communication: getScore(review.scores, "communication"),
      poise: getScore(review.scores, "poise"),
      commercial_judgment: getScore(review.scores, "commercial_judgment", "commercial judgment"),
      summary: review.summary,
      evidence: review.evidence,
      next_steps: review.next_steps,
    },
    { onConflict: "session_id" }
  );

  if (scorecardError) {
    throw scorecardError;
  }

  return (session as { id: string }).id;
}
