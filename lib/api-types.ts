export type SessionMode = "story" | "technical" | "markets";

export type InterviewProfile = {
  school?: string;
  background?: string;
  bank?: string;
  group?: string;
  stage?: string;
  mode?: SessionMode;
  prompt?: string;
};

export type RealtimeSessionRequest = InterviewProfile;

export type ReviewSessionRequest = InterviewProfile & {
  transcript: string;
};

export type Scorecard = {
  summary: string;
  readiness: number | null;
  scores: Record<string, number> | null;
  evidence: string[];
  next_steps: string[];
  sessionId?: string | null;
};
