import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="April 3, 2026">
      <section>
        <h2 className="text-xl font-semibold text-[#111827] mb-3">Use of the service</h2>
        <p>
          Superday AI is provided for interview preparation and educational support. You agree to
          use the platform lawfully and not attempt to misuse the application, infrastructure, or
          other users&apos; access.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#111827] mb-3">Subscriptions</h2>
        <p>
          Paid plans renew automatically unless canceled before the next billing cycle. Trial
          access, pricing, and included features may change over time as the product evolves.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#111827] mb-3">Contact</h2>
        <p>
          For questions about these terms, reach out at
          {" "}
          <a className="text-[#111827] underline underline-offset-4" href="mailto:support@superdayready.com">
            support@superdayready.com
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
