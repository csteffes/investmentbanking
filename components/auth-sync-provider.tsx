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
import type { Session, User } from "@supabase/supabase-js";

import { syncServerAuthSession } from "@/lib/auth-browser";
import { getBrowserSupabase } from "@/lib/browser-supabase";
import {
  buildAuthCallbackUrl,
  DEFAULT_AUTH_REDIRECT,
  sanitizeRedirectTo,
} from "@/lib/auth-routing";

type AuthSessionContextValue = {
  user: User | null;
  loading: boolean;
  signInWithPassword: (
    email: string,
    password: string
  ) => Promise<{ error: string | null; session: Session | null }>;
  signUpWithPassword: (
    email: string,
    password: string,
    redirectTo?: string
  ) => Promise<{
    error: string | null;
    needsEmailConfirmation: boolean;
    session: Session | null;
  }>;
  signInWithGoogle: (
    redirectTo?: string
  ) => Promise<{ error: string | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

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
      await syncServerAuthSession(data.session);
      setLoading(false);
    }

    void initialize();

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      void syncServerAuthSession(session);
      setLoading(false);
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return {
          error: "Supabase auth is not configured.",
          session: null,
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data.session) {
        await syncServerAuthSession(data.session);
      }

      return {
        error: error?.message ?? null,
        session: data.session ?? null,
      };
    },
    [supabase]
  );

  const signUpWithPassword = useCallback(
    async (email: string, password: string, redirectTo?: string) => {
      if (!supabase) {
        return {
          error: "Supabase auth is not configured.",
          needsEmailConfirmation: false,
          session: null,
        };
      }

      const callbackUrl = buildAuthCallbackUrl(
        window.location.origin,
        sanitizeRedirectTo(redirectTo)
      );

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: callbackUrl,
        },
      });

      if (data.session) {
        await syncServerAuthSession(data.session);
      }

      return {
        error: error?.message ?? null,
        needsEmailConfirmation: !error && !data.session,
        session: data.session ?? null,
      };
    },
    [supabase]
  );

  const signInWithGoogle = useCallback(
    async (redirectTo?: string) => {
      if (!supabase) {
        return {
          error: "Supabase auth is not configured.",
        };
      }

      const callbackUrl = buildAuthCallbackUrl(
        window.location.origin,
        sanitizeRedirectTo(redirectTo)
      );

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) {
        return {
          error: error.message,
        };
      }

      if (data.url) {
        window.location.assign(data.url);
      }

      return {
        error: null,
      };
    },
    [supabase]
  );

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
          emailRedirectTo: buildAuthCallbackUrl(
            window.location.origin,
            DEFAULT_AUTH_REDIRECT
          ),
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
      await syncServerAuthSession(null);
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
    await syncServerAuthSession(null);
    setUser(null);
  }, [supabase]);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      user,
      loading,
      signInWithPassword,
      signUpWithPassword,
      signInWithGoogle,
      signInWithMagicLink,
      signOut,
    }),
    [
      loading,
      signInWithGoogle,
      signInWithMagicLink,
      signInWithPassword,
      signOut,
      signUpWithPassword,
      user,
    ]
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
