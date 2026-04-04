import { NextResponse } from "next/server";

import {
  AUTH_ACCESS_COOKIE,
  AUTH_REFRESH_COOKIE,
  authCookieOptions,
  readAuthSessionCookies,
} from "@/lib/auth-session";
import { readTrialIdFromCookieHeader } from "@/lib/access-control";
import { claimTrialSessionsForUser } from "@/lib/mock-sessions";
import { guardBrowserPostRequest } from "@/lib/request-security";
import { getPublicSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  const { accessToken } = await readAuthSessionCookies();

  if (!accessToken) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const supabase = getPublicSupabase();
  if (!supabase) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json(
    {
      authenticated: true,
      user: {
        id: data.user.id,
        email: data.user.email ?? null,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  const guarded = guardBrowserPostRequest(request);
  if (guarded) {
    return guarded.response;
  }

  const body = (await request.json().catch(() => null)) as
    | { accessToken?: string; refreshToken?: string | null }
    | null;

  const accessToken = typeof body?.accessToken === "string" ? body.accessToken.trim() : "";
  const refreshToken = typeof body?.refreshToken === "string" ? body.refreshToken.trim() : "";

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const supabase = getPublicSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase auth is not configured." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return NextResponse.json(
      { error: "Unable to validate the current session." },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }

  const response = NextResponse.json(
    {
      authenticated: true,
      user: {
        id: data.user.id,
        email: data.user.email ?? null,
      },
    },
    { headers: { "Cache-Control": "no-store" } }
  );

  const trialId = readTrialIdFromCookieHeader(request.headers.get("cookie"));
  if (trialId) {
    await claimTrialSessionsForUser(data.user.id, trialId);
  }

  response.cookies.set(AUTH_ACCESS_COOKIE, accessToken, authCookieOptions());
  response.cookies.set(AUTH_REFRESH_COOKIE, refreshToken, authCookieOptions());

  return response;
}

export async function DELETE(request: Request) {
  const guarded = guardBrowserPostRequest(request);
  if (guarded) {
    return guarded.response;
  }

  const response = NextResponse.json(
    { authenticated: false },
    { headers: { "Cache-Control": "no-store" } }
  );

  response.cookies.set(AUTH_ACCESS_COOKIE, "", { ...authCookieOptions(), maxAge: 0 });
  response.cookies.set(AUTH_REFRESH_COOKIE, "", { ...authCookieOptions(), maxAge: 0 });

  return response;
}
