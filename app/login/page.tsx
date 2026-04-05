import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthLoadingState } from "@/components/auth/auth-loading";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Superday AI and continue your interview prep.",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthLoadingState
          copy="Loading your Superday AI sign-in screen."
          title="Preparing sign-in"
        />
      }
    >
      <AuthScreen
        description="Welcome back! Sign in to continue."
        mode="login"
      />
    </Suspense>
  );
}
