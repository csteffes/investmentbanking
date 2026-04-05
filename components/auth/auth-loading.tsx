/* eslint-disable @next/next/no-img-element */

import styles from "@/components/auth/auth.module.css";

type AuthLoadingStateProps = {
  copy: string;
  title: string;
};

export function AuthLoadingState({ copy, title }: AuthLoadingStateProps) {
  return (
    <main className={styles.callbackScreen}>
      <div className={styles.callbackCard}>
        <img
          alt="Superday AI"
          className={styles.brandWordmark}
          decoding="async"
          src="/assets/auth/superday-auth-wordmark.svg"
        />
        <div className={styles.spinner} aria-hidden="true" />
        <h1 className={styles.callbackTitle}>{title}</h1>
        <p className={styles.callbackCopy}>{copy}</p>
      </div>
    </main>
  );
}
