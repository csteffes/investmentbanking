import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCallback } from "@/components/auth/auth-callback";
import { AuthLoadingState } from "@/components/auth/auth-loading";

export const metadata: Metadata = {
  title: "Signing You In",
  description: "Complete your Superday AI authentication.",
};

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <AuthLoadingState
          copy="We are syncing your session and sending you into Superday AI."
          title="Finishing your sign-in"
        />
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
