export const DEFAULT_AUTH_REDIRECT = "/mock-interview";

export function sanitizeRedirectTo(value: string | null | undefined) {
  const candidate = value?.trim();

  if (!candidate) {
    return DEFAULT_AUTH_REDIRECT;
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return candidate;
}

export function buildRedirectQuery(redirectTo: string) {
  const params = new URLSearchParams();
  params.set("redirectTo", sanitizeRedirectTo(redirectTo));
  return params.toString();
}

export function buildAuthCallbackUrl(origin: string, redirectTo: string) {
  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("redirectTo", sanitizeRedirectTo(redirectTo));
  return callbackUrl.toString();
}
