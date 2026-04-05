import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthLoadingState } from "@/components/auth/auth-loading";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your Superday AI account and start practicing today.",
};

export default function CreateAccountPage() {
  return (
    <Suspense
      fallback={
        <AuthLoadingState
          copy="Loading your Superday AI onboarding screen."
          title="Preparing account setup"
        />
      }
    >
      <AuthScreen
        description="Create your account to get started"
        mode="register"
      />
    </Suspense>
  );
}
