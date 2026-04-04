"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import { getBrowserSupabase } from "@/lib/browser-supabase";

type AuthSessionContextValue = {
  user: User | null;
  loading: boolean;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

async function syncServerSession(
  session:
    | {
        access_token: string;
        refresh_token: string;
      }
    | null
) {
  if (session?.access_token) {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      }),
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

export function AuthSyncProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => supabase !== null);

  useEffect(() => {
    if (!supabase) {
      return;
    }
    const supabaseClient = supabase;

    let ignore = false;

    async function initialize() {
      const { data } = await supabaseClient.auth.getSession();
      if (ignore) {
        return;
      }

      setUser(data.session?.user ?? null);
      await syncServerSession(
        data.session
          ? {
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token,
            }
          : null
      );
      setLoading(false);
    }

    void initialize();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      void syncServerSession(
        session
          ? {
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            }
          : null
      );
      setLoading(false);
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithMagicLink = useCallback(
    async (email: string) => {
      if (!supabase) {
        return {
          error: "Supabase auth is not configured.",
        };
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/mock-interview`,
        },
      });

      return {
        error: error?.message ?? null,
      };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    if (!supabase) {
      await syncServerSession(null);
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
    await syncServerSession(null);
    setUser(null);
  }, [supabase]);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      user,
      loading,
      signInWithMagicLink,
      signOut,
    }),
    [loading, signInWithMagicLink, signOut, user]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within AuthSyncProvider.");
  }

  return context;
}
