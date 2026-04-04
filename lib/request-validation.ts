import type {
  InterviewProfile,
  PracticeDebriefRequest,
  SessionMode,
} from "@/lib/api-types";

const ALLOWED_MODES = new Set<SessionMode>(["story", "technical", "markets"]);

function readOptionalString(value: unknown, maxLength = 180) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, maxLength);
}

function readMode(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  return ALLOWED_MODES.has(value as SessionMode) ? (value as SessionMode) : undefined;
}

export function parseInterviewProfile(input: unknown): InterviewProfile {
  const body = (input ?? {}) as Record<string, unknown>;

  return {
    school: readOptionalString(body.school, 120),
    background: readOptionalString(body.background, 220),
    bank: readOptionalString(body.bank, 120),
    group: readOptionalString(body.group, 120),
    stage: readOptionalString(body.stage, 80),
    mode: readMode(body.mode),
    prompt: readOptionalString(body.prompt, 280),
  };
}

export function parsePracticeDebriefRequest(input: unknown): PracticeDebriefRequest {
  const profile = parseInterviewProfile(input);
  const body = (input ?? {}) as Record<string, unknown>;
  const transcript = readOptionalString(body.transcript, 20000);

  if (!transcript) {
    throw new Error("Transcript is required.");
  }

  return {
    ...profile,
    transcript,
  };
}
