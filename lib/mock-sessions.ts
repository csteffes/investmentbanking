import type { PracticeDebrief, PracticeDebriefRequest } from "@/lib/api-types";
import { getAdminSupabase } from "@/lib/supabase";

type PersistMockInterviewSessionInput = {
  userId?: string | null;
  trialId?: string | null;
  request: PracticeDebriefRequest;
  debrief: PracticeDebrief;
};

function splitTranscriptSegments(transcript: string) {
  return transcript
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(/^(Candidate|Coach|Interviewer):\s*(.+)$/i);
      return {
        speaker: /^(coach|interviewer)$/i.test(match?.[1] ?? "") ? "interviewer" : "candidate",
        content: (match?.[2] ?? line).trim(),
        segment_order: index,
      };
    })
    .filter((segment) => segment.content.length > 0);
}

export async function persistMockInterviewSession({
  userId,
  trialId,
  request,
  debrief,
}: PersistMockInterviewSessionInput) {
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
      readiness_score: null,
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

  const { error: debriefStoreError } = await supabase.from("scorecards").upsert(
    {
      session_id: (session as { id: string }).id,
      technical_accuracy: null,
      structure: null,
      communication: null,
      poise: null,
      commercial_judgment: null,
      summary: debrief.summary,
      evidence: debrief.coachNotes,
      next_steps: debrief.nextRep ? [debrief.nextRep] : [],
    },
    { onConflict: "session_id" }
  );

  if (debriefStoreError) {
    throw debriefStoreError;
  }

  return (session as { id: string }).id;
}
