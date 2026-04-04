import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import type { NextResponse } from "next/server";

import { env, requireEnv } from "@/lib/env";
import { getPublicSupabase } from "@/lib/supabase";

type UsageKind = "realtime" | "debrief";

type TrialState = {
  trialId: string;
  createdAt: number;
  realtimeCount: number;
  debriefCount: number;
};

type AuthenticatedAccess = {
  ok: true;
  type: "authenticated";
  userId: string;
  email: string | null;
};

type TrialAccess = {
  ok: true;
  type: "trial";
  trialId: string;
  cookieValue: string;
  remaining: number;
};

type AccessFailure = {
  ok: false;
  status: number;
  error: string;
  retryAfter?: number;
};

export type BillingAccess = AuthenticatedAccess | AccessFailure;
export type UsageAccess = AuthenticatedAccess | TrialAccess | AccessFailure;

const TRIAL_COOKIE_NAME = "superday_trial";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14;
const DEFAULT_WINDOW_MS = 60 * 1000;
const IP_RATE_LIMITS: Record<UsageKind, number> = {
  realtime: 8,
  debrief: 12,
};

const ipBuckets = new Map<string, { count: number; resetAt: number }>();

function getSessionSecret() {
  return requireEnv(
    "APP_SESSION_SECRET or OPENAI_API_KEY",
    env.appSessionSecret || env.openAiKey || env.stripeSecretKey
  );
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

function serializeTrialState(state: TrialState) {
  const payload = Buffer.from(JSON.stringify(state)).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function parseCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const parts = cookieHeader.split(/;\s*/);
  for (const part of parts) {
    const [rawName, ...valueParts] = part.split("=");
    if (rawName === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

function parseTrialState(value: string | null): TrialState | null {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = sign(payload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as TrialState;
    if (!parsed?.trialId || typeof parsed.createdAt !== "number") {
      return null;
    }

    return {
      trialId: parsed.trialId,
      createdAt: parsed.createdAt,
      realtimeCount: Number(parsed.realtimeCount) || 0,
      debriefCount: Number((parsed as { debriefCount?: number; reviewCount?: number }).debriefCount)
        || Number((parsed as { debriefCount?: number; reviewCount?: number }).reviewCount)
        || 0,
    };
  } catch {
    return null;
  }
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function takeIpRateLimit(request: Request, kind: UsageKind): AccessFailure | null {
  const now = Date.now();
  const key = `${kind}:${getClientIp(request)}`;
  const limit = IP_RATE_LIMITS[kind];
  const bucket = ipBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    ipBuckets.set(key, { count: 1, resetAt: now + DEFAULT_WINDOW_MS });
    return null;
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      status: 429,
      error: "Too many requests. Please wait a minute and try again.",
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return null;
}

function createTrialState(): TrialState {
  return {
    trialId: randomUUID(),
    createdAt: Date.now(),
    realtimeCount: 0,
    debriefCount: 0,
  };
}

async function getAuthenticatedUser(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : "";

  if (!token) {
    return null;
  }

  const supabase = getPublicSupabase();
  if (!supabase) {
    throw new Error("Supabase public auth is not configured.");
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    email: data.user.email ?? null,
  };
}

export async function requireBillingAccess(request: Request): Promise<BillingAccess> {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return {
        ok: false,
        status: 401,
        error: "Authentication is required for billing actions.",
      };
    }

    return {
      ok: true,
      type: "authenticated",
      userId: user.id,
      email: user.email,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : "Unable to validate the current user.",
    };
  }
}

export async function requireUsageAccess(
  request: Request,
  kind: UsageKind
): Promise<UsageAccess> {
  const rateLimit = takeIpRateLimit(request, kind);
  if (rateLimit) {
    return rateLimit;
  }

  try {
    const user = await getAuthenticatedUser(request);
    if (user) {
      return {
        ok: true,
        type: "authenticated",
        userId: user.id,
        email: user.email,
      };
    }
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: error instanceof Error ? error.message : "Unable to validate the current user.",
    };
  }

  const rawTrialCookie = parseCookieValue(request.headers.get("cookie"), TRIAL_COOKIE_NAME);
  const trial = parseTrialState(rawTrialCookie) ?? createTrialState();
  const currentCount = kind === "realtime" ? trial.realtimeCount : trial.debriefCount;
  const limit = kind === "realtime" ? env.trialSessionLimit : env.trialDebriefLimit;

  if (currentCount >= limit) {
    return {
      ok: false,
      status: 429,
      error: "Your free trial limit has been reached. Please sign in or upgrade to continue.",
    };
  }

  const updatedTrial: TrialState = {
    ...trial,
    realtimeCount: kind === "realtime" ? trial.realtimeCount + 1 : trial.realtimeCount,
    debriefCount: kind === "debrief" ? trial.debriefCount + 1 : trial.debriefCount,
  };

  return {
    ok: true,
    type: "trial",
    trialId: updatedTrial.trialId,
    cookieValue: serializeTrialState(updatedTrial),
    remaining: Math.max(0, limit - (currentCount + 1)),
  };
}

export function applyUsageCookie(response: NextResponse, access: UsageAccess) {
  if (!access.ok || access.type !== "trial") {
    return;
  }

  response.cookies.set({
    name: TRIAL_COOKIE_NAME,
    value: access.cookieValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}
