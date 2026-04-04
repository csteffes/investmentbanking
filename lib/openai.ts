import { env, requireEnv } from "@/lib/env";
import type { InterviewProfile, PracticeDebrief, PracticeDebriefRequest } from "@/lib/api-types";

function buildRealtimeInstructions(profile: InterviewProfile) {
  const parts = [
    "You are Superday AI, a realistic investment banking interviewer.",
    "Run live mock interviews with concise banker-style follow-ups and high standards.",
    "Cover behavioral, technical, deals, markets, and superday pressure when relevant.",
    "Do not mention undergrad or MBA audience assumptions unless the user does.",
    "Stay in character as the interviewer during the live session.",
    "Do not grade the candidate or break into coaching mode during the interview.",
    "Push for specificity, structure, and commercial judgment."
  ];

  if (profile.bank || profile.group || profile.stage) {
    parts.push(
      `Current target: ${profile.bank || "investment bank"} ${profile.group || "group"} at the ${profile.stage || "interview"} stage.`
    );
  }

  if (profile.school || profile.background) {
    parts.push(
      `Candidate context: ${profile.school || "candidate"} with background in ${profile.background || "finance-related experience"}.`
    );
  }

  return parts.join(" ");
}

type OpenAIResponsesPayload = {
  output_text?: string;
  output?: Array<{
    content?: Array<{ type: string; text?: string }>;
  }>;
};

function extractOutputText(payload: OpenAIResponsesPayload) {
  if (typeof payload?.output_text === "string" && payload.output_text.length > 0) {
    return payload.output_text;
  }

  if (!Array.isArray(payload?.output)) {
    return "";
  }

  return payload.output
    .flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text")
    .map((item) => item.text ?? "")
    .join("");
}

function sanitizeJsonBlock(input: string) {
  return input.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
}

function readOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizePracticeDebrief(value: unknown): PracticeDebrief {
  const raw = (value ?? {}) as {
    summary?: unknown;
    coach_notes?: unknown;
    coachNotes?: unknown;
    next_rep?: unknown;
    nextRep?: unknown;
  };

  return {
    summary: readOptionalString(raw.summary) ?? "",
    coachNotes: readStringArray(raw.coachNotes ?? raw.coach_notes),
    nextRep: readOptionalString(raw.nextRep ?? raw.next_rep),
  };
}

export async function createRealtimeSession(profile: InterviewProfile) {
  const apiKey = requireEnv("OPENAI_API_KEY", env.openAiKey);

  const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      session: {
        type: "realtime",
        model: env.openAiRealtimeModel,
        voice: env.openAiRealtimeVoice,
        instructions: buildRealtimeInstructions(profile)
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Realtime session: ${errorText}`);
  }

  return response.json();
}

export async function createPracticeDebrief(payload: PracticeDebriefRequest): Promise<PracticeDebrief> {
  const apiKey = requireEnv("OPENAI_API_KEY", env.openAiKey);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.openAiDebriefModel,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are writing the post-session debrief for an investment banking mock interview. Return JSON only with keys summary, coach_notes, and next_rep. Do not grade, score, rank, or assess. summary should be 1 to 2 sentences. coach_notes should be an array of 3 to 5 concise coaching notes grounded in the transcript. next_rep should be one specific mock interview rep to run next."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: JSON.stringify(payload)
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create practice debrief: ${errorText}`);
  }

  const data = await response.json();
  const outputText = sanitizeJsonBlock(extractOutputText(data));

  try {
    return normalizePracticeDebrief(JSON.parse(outputText));
  } catch {
    return normalizePracticeDebrief({ summary: outputText });
  }
}
