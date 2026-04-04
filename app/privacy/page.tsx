import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="April 3, 2026">
      <section>
        <h2 className="text-xl font-semibold text-[#111827] mb-3">What we collect</h2>
        <p>
          Superday AI may collect account details, billing details, interview preferences,
          transcripts, uploaded resumes, and product usage data needed to operate the platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#111827] mb-3">How we use it</h2>
        <p>
          We use this information to deliver interview practice, save your progress, improve
          feedback quality, process subscriptions, and support your account.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#111827] mb-3">Data handling</h2>
        <p>
          We work with infrastructure providers to host application data, payments, and analytics.
          We do not sell your personal information. You can email
          {" "}
          <a className="text-[#111827] underline underline-offset-4" href="mailto:support@superdayready.com">
            support@superdayready.com
          </a>
          {" "}
          for privacy-related requests.
        </p>
      </section>
    </LegalPage>
  );
}
