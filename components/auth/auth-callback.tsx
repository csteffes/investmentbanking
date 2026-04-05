"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "@/components/auth/auth.module.css";
import { syncServerAuthSession } from "@/lib/auth-browser";
import { getBrowserSupabase } from "@/lib/browser-supabase";
import { sanitizeRedirectTo } from "@/lib/auth-routing";

export function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function completeSignIn() {
      const redirectTo = sanitizeRedirectTo(searchParams.get("redirectTo"));
      const authError = searchParams.get("error_description");

      if (authError) {
        if (!cancelled) {
          setErrorMessage(authError);
        }
        return;
      }

      const supabase = getBrowserSupabase();

      if (!supabase) {
        if (!cancelled) {
          setErrorMessage("Supabase auth is not configured.");
        }
        return;
      }

      const {
        data: { session: existingSession },
      } = await supabase.auth.getSession();

      if (existingSession) {
        await syncServerAuthSession(existingSession);
        if (!cancelled) {
          router.replace(redirectTo);
        }
        return;
      }

      const code = searchParams.get("code");

      if (!code) {
        if (!cancelled) {
          setErrorMessage("We could not finish signing you in.");
        }
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data.session) {
        if (!cancelled) {
          setErrorMessage(
            error?.message ?? "We could not finish signing you in."
          );
        }
        return;
      }

      await syncServerAuthSession(data.session);

      if (!cancelled) {
        router.replace(redirectTo);
      }
    }

    void completeSignIn();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <main className={styles.callbackScreen}>
      <div className={styles.callbackCard}>
        <img
          alt="Superday AI"
          className={styles.brandWordmark}
          decoding="async"
          src="/assets/auth/superday-auth-wordmark.svg"
        />

        {errorMessage ? (
          <>
            <h1 className={styles.callbackTitle}>Authentication failed</h1>
            <p className={styles.callbackCopy}>{errorMessage}</p>
            <div className={styles.callbackActions}>
              <Link className={`${styles.button} ${styles.buttonPrimary}`} href="/login">
                Back to login
              </Link>
              <Link
                className={`${styles.button} ${styles.buttonSecondary}`}
                href="/create-account"
              >
                Create account
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className={styles.spinner} aria-hidden="true" />
            <h1 className={styles.callbackTitle}>Finishing your sign-in</h1>
            <p className={styles.callbackCopy}>
              We are syncing your session and sending you into Superday AI.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
