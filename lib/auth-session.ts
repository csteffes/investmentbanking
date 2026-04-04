import { cookies } from "next/headers";

export const AUTH_ACCESS_COOKIE = "superday_access_token";
export const AUTH_REFRESH_COOKIE = "superday_refresh_token";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export type AuthSessionCookies = {
  accessToken: string | null;
  refreshToken: string | null;
};

export async function readAuthSessionCookies(): Promise<AuthSessionCookies> {
  const cookieStore = await cookies();

  return {
    accessToken: cookieStore.get(AUTH_ACCESS_COOKIE)?.value ?? null,
    refreshToken: cookieStore.get(AUTH_REFRESH_COOKIE)?.value ?? null,
  };
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  };
}
