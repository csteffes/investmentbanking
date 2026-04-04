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

export type PracticeDebriefRequest = InterviewProfile & {
  transcript: string;
};

export type PracticeDebrief = {
  summary: string;
  coachNotes: string[];
  nextRep: string | null;
  sessionId?: string | null;
};
