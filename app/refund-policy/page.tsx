import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund policy" updated="April 3, 2026">
      <section>
        <h2 className="text-xl font-semibold text-[#111827] mb-3">Trials and billing</h2>
        <p>
          New users may start with the active free-trial offer. If you do not cancel before the
          trial ends, your subscription converts to the current paid plan automatically.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#111827] mb-3">Refund requests</h2>
        <p>
          Refund requests are reviewed case by case, especially for accidental charges, duplicate
          billing, or technical access issues that prevented use of the product.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#111827] mb-3">How to contact us</h2>
        <p>
          Email
          {" "}
          <a className="text-[#111827] underline underline-offset-4" href="mailto:support@superdayready.com">
            support@superdayready.com
          </a>
          {" "}
          with the email on your account and a short description of the issue.
        </p>
      </section>
    </LegalPage>
  );
}
