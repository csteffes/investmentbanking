"use client";

import type { Session } from "@supabase/supabase-js";

type SyncableSession = Pick<Session, "access_token" | "refresh_token"> | null;

function toSessionPayload(session: SyncableSession) {
  if (!session?.access_token) {
    return null;
  }

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
  };
}

export async function syncServerAuthSession(session: SyncableSession) {
  const payload = toSessionPayload(session);

  if (payload) {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return;
  }

  await fetch("/api/auth/session", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: "{}",
  });
}
