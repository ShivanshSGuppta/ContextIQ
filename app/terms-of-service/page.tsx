import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ContextIQ",
  description:
    "ContextIQ Terms of Service covering acceptable use, integrations, AI outputs, and legal terms.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-12 font-sans text-[#0F172A]">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:p-12">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Terms of Service</h1>
        <p className="mt-4 text-sm font-medium text-slate-500">Effective date: April 28, 2026</p>

        <section className="mt-8 space-y-4 text-[15px] leading-relaxed text-slate-700">
          <p>
            These Terms of Service govern access to and use of ContextIQ, published by{" "}
            <strong>Shivansh Shanker Guppta</strong>. Contact:{" "}
            <strong>shivanshshankerguppta@gmail.com</strong>. Address:{" "}
            <strong>Virtual Address in Hyderabad</strong>.
          </p>
          <p>
            By using ContextIQ, you agree to these Terms. If you do not agree, do not use the
            service.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">1. Service Use and Accounts</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            You are responsible for account activity under your login, for maintaining security of
            credentials, and for using the service in compliance with applicable laws and platform
            rules.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">2. Acceptable Use</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] text-slate-700">
            <li>Do not misuse the service for unlawful, deceptive, or abusive activity.</li>
            <li>Do not attempt unauthorized access or disruption of service operations.</li>
            <li>Do not ingest or process data you are not authorized to use.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">3. Integrations and Permissions</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            When you connect integrations (including Gmail or LinkedIn), you represent that you are
            authorized to grant access and process that data within your organization and applicable
            law. You may disconnect integrations at any time.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">4. AI Output and User Responsibility</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            ContextIQ provides generated outputs based on available context. AI-generated content may
            be incomplete or inaccurate. You are responsible for reviewing and validating outputs
            before operational, legal, or customer-facing use.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">5. Intellectual Property</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            ContextIQ, including software and branding, is protected by applicable intellectual
            property laws. Your rights are limited to permitted use of the service under these Terms
            and applicable licensing terms.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">6. Suspension and Termination</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            Access may be suspended or terminated for violation of these Terms, legal obligations, or
            security risk. You may discontinue use at any time.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">7. Disclaimer and Limitation of Liability</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            The service is provided on an “as is” and “as available” basis without warranties to the
            fullest extent permitted by law. To the maximum extent allowed by law, liability is
            limited for indirect, incidental, special, consequential, or punitive damages.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">8. Governing Law and Disputes</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            These Terms are governed by the laws of <strong>India</strong>. Any dispute arising from
            or relating to these Terms or the service will be subject to applicable jurisdiction and
            dispute resolution processes under Indian law.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">9. Changes to Terms</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            We may update these Terms from time to time. Continued use of ContextIQ after updates
            constitutes acceptance of the revised Terms.
          </p>
        </section>
      </div>
    </main>
  );
}
