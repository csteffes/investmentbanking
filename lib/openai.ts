import { env, requireEnv } from "@/lib/env";

type ProfilePayload = {
  school?: string;
  background?: string;
  bank?: string;
  group?: string;
  stage?: string;
};

type ReviewPayload = {
  transcript: string;
  prompt?: string;
  bank?: string;
  group?: string;
  stage?: string;
};

function buildRealtimeInstructions(profile: ProfilePayload) {
  const parts = [
    "You are Superday AI, a serious investment banking interview coach.",
    "Run realistic interview practice with concise follow-ups and high standards.",
    "Cover behavioral, technical, deals, markets, and superday pressure when relevant.",
    "Do not mention undergrad or MBA audience assumptions unless the user does.",
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

function extractOutputText(payload: any) {
  if (typeof payload?.output_text === "string" && payload.output_text.length > 0) {
    return payload.output_text;
  }

  if (!Array.isArray(payload?.output)) {
    return "";
  }

  return payload.output
    .flatMap((item: any) => item.content || [])
    .filter((item: any) => item.type === "output_text")
    .map((item: any) => item.text || "")
    .join("");
}

function sanitizeJsonBlock(input: string) {
  return input.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "").trim();
}

export async function createRealtimeSession(profile: ProfilePayload) {
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

export async function reviewTranscript(payload: ReviewPayload) {
  const apiKey = requireEnv("OPENAI_API_KEY", env.openAiKey);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.openAiReviewModel,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "You are evaluating an investment banking interview practice session. Return JSON only with keys summary, readiness, scores, evidence, and next_steps. readiness must be 0-100. scores must include technical_accuracy, structure, communication, poise, and commercial_judgment."
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
    throw new Error(`Failed to review transcript: ${errorText}`);
  }

  const data = await response.json();
  const outputText = sanitizeJsonBlock(extractOutputText(data));

  try {
    return JSON.parse(outputText);
  } catch {
    return {
      summary: outputText,
      readiness: null,
      scores: null,
      evidence: [],
      next_steps: []
    };
  }
}
