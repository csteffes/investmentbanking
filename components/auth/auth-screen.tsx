"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthSession } from "@/components/auth-sync-provider";
import styles from "@/components/auth/auth.module.css";
import { authMarqueeLogos, authValueProps } from "@/lib/auth-marketing";
import {
  buildRedirectQuery,
  sanitizeRedirectTo,
} from "@/lib/auth-routing";

type AuthMode = "login" | "register";

type AuthScreenProps = {
  description: string;
  mode: AuthMode;
};

function buildModeHref(mode: AuthMode, redirectTo: string) {
  const targetPath = mode === "login" ? "/create-account" : "/login";
  return `${targetPath}?${buildRedirectQuery(redirectTo)}`;
}

function getErrorMessage(error: string) {
  const normalized = error.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid credentials")
  ) {
    return "Invalid email or password.";
  }

  if (normalized.includes("email rate limit exceeded")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (normalized.includes("user already registered")) {
    return "An account with this email already exists.";
  }

  return error;
}

function AuthValueCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % authValueProps.length);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={styles.valueCarousel}>
      {authValueProps.map((item, index) => (
        <div
          key={item.title}
          className={`${styles.valueSlide} ${
            index === activeIndex ? styles.valueSlideActive : ""
          }`}
        >
          <div className={styles.valuePill}>{item.title}</div>
          <div className={styles.valueCopy}>{item.description}</div>
        </div>
      ))}

      <div className={styles.valueDots} aria-hidden="true">
        {authValueProps.map((item, index) => (
          <span
            key={item.title}
            className={`${styles.valueDot} ${
              index === activeIndex ? styles.valueDotActive : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function AuthLogoMarquee({ mobile = false }: { mobile?: boolean }) {
  const repeatedLogos = useMemo(
    () => [...authMarqueeLogos, ...authMarqueeLogos],
    []
  );

  return (
    <div className={mobile ? styles.mobileBand : styles.marqueeBand}>
      <p className={styles.bandLabel}>Our users are targeting firms like</p>
      <div className={styles.marqueeViewport}>
        <div className={styles.marqueeTrack}>
          <div className={styles.marqueeGroup}>
            {repeatedLogos.map((logo, index) => (
              <img
                key={`${logo.src}-${index}`}
                alt={logo.alt}
                className={styles.marqueeLogo}
                decoding="async"
                src={logo.src}
              />
            ))}
          </div>
          <div className={styles.marqueeGroup} aria-hidden="true">
            {repeatedLogos.map((logo, index) => (
              <img
                key={`${logo.src}-clone-${index}`}
                alt={logo.alt}
                className={styles.marqueeLogo}
                decoding="async"
                src={logo.src}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthBanner() {
  return (
    <aside className={styles.heroPane} aria-hidden="true">
      <div className={styles.heroBackdrop} />
      <div className={styles.heroCenter}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeadline}>
            Master superdays and land your{" "}
            <span className={styles.heroAccent}>
              offer
              <svg
                viewBox="0 0 100 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8c12-2 12 2 24 0s12-2 24 0s12 2 24 0s12-2 24 0"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <AuthValueCarousel />
        </div>
      </div>

      <AuthLogoMarquee />
    </aside>
  );
}

function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = sanitizeRedirectTo(searchParams.get("redirectTo"));
  const alternateHref = buildModeHref(mode, redirectTo);

  const {
    user,
    loading,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
  } = useAuthSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (loading || !user || successMessage) {
      return;
    }

    startTransition(() => {
      router.replace(redirectTo);
    });
  }, [loading, redirectTo, router, successMessage, user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setSubmitting(false);
      setErrorMessage("Enter both your email and password.");
      return;
    }

    if (mode === "login") {
      const result = await signInWithPassword(trimmedEmail, trimmedPassword);

      if (result.error) {
        setSubmitting(false);
        setErrorMessage(getErrorMessage(result.error));
        return;
      }

      startTransition(() => {
        router.replace(redirectTo);
      });
      return;
    }

    const result = await signUpWithPassword(trimmedEmail, trimmedPassword, redirectTo);

    if (result.error) {
      setSubmitting(false);
      setErrorMessage(getErrorMessage(result.error));
      return;
    }

    if (result.needsEmailConfirmation) {
      setSubmitting(false);
      setSuccessMessage(
        `Check ${trimmedEmail} to confirm your account and finish signing in.`
      );
      return;
    }

    startTransition(() => {
      router.replace(redirectTo);
    });
  }

  async function handleGoogleSignIn() {
    setSubmitting(true);
    setErrorMessage(null);

    const result = await signInWithGoogle(redirectTo);

    if (result.error) {
      setSubmitting(false);
      setErrorMessage(getErrorMessage(result.error));
    }
  }

  return (
    <>
      {errorMessage ? (
        <div className={`${styles.status} ${styles.statusError}`}>{errorMessage}</div>
      ) : null}

      {successMessage ? (
        <div className={`${styles.status} ${styles.statusSuccess}`}>
          {successMessage}
        </div>
      ) : null}

      <form className={styles.formStack} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={`${mode}-email`}>
            Email
          </label>
          <input
            autoComplete="email"
            className={styles.input}
            id={`${mode}-email`}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            value={email}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel} htmlFor={`${mode}-password`}>
            Password
          </label>
          <input
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className={styles.input}
            id={`${mode}-password`}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
        </div>

        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          disabled={submitting}
          type="submit"
        >
          {mode === "login" ? "Sign in" : "Register"}
        </button>
      </form>

      <div className={styles.formStack}>
        <div className={styles.divider}>or</div>

        <button
          className={`${styles.button} ${styles.buttonSecondary}`}
          disabled={submitting}
          onClick={handleGoogleSignIn}
          type="button"
        >
          Continue with Google
        </button>
      </div>

      <p className={styles.alternate}>
        {mode === "login" ? "Do not have an account?" : "Already have an account?"}{" "}
        <Link href={alternateHref}>
          {mode === "login" ? "Create one here" : "Sign in here"}
        </Link>
      </p>
    </>
  );
}

export function AuthScreen({ description, mode }: AuthScreenProps) {
  return (
    <main className={styles.shell}>
      <section className={styles.formPane}>
        <div className={styles.formScroll}>
          <div className={styles.formCard}>
            <div className={styles.brandRow}>
              <span className={styles.brandBadge}>
                <img alt="" aria-hidden="true" src="/icon.svg" />
              </span>
              <img
                alt="Superday AI"
                className={styles.brandWordmark}
                decoding="async"
                src="/assets/auth/superday-auth-wordmark.svg"
              />
            </div>

            <p className={styles.description}>{description}</p>

            <AuthForm mode={mode} />

            <p className={styles.copyright}>
              Superday AI - All rights reserved.
            </p>
          </div>
        </div>
      </section>

      <AuthBanner />
      <AuthLogoMarquee mobile />
    </main>
  );
}
