import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ContextIQ",
  description:
    "ContextIQ Privacy Policy covering data handling, integrations, retention, and user rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] px-6 py-12 font-sans text-[#0F172A]">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:p-12">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-sm font-medium text-slate-500">Effective date: April 28, 2026</p>

        <section className="mt-8 space-y-4 text-[15px] leading-relaxed text-slate-700">
          <p>
            This Privacy Policy describes how <strong>Shivansh Shanker Guppta</strong>, publisher
            of ContextIQ, collects, uses, and protects information processed through ContextIQ.
            Contact: <strong>shivanshshankerguppta@gmail.com</strong>. Address:{" "}
            <strong>Virtual Address in Hyderabad</strong>.
          </p>
          <p>
            ContextIQ is a memory-native workspace for customer-facing teams. We process structured
            workspace records and integration-derived signals to provide contextual recall and
            generation workflows.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">1. Information We Collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] text-slate-700">
            <li>Account and profile information (name, email, workspace membership).</li>
            <li>Workspace records (accounts, contacts, notes, activities, generated outputs).</li>
            <li>Integration metadata and content from enabled providers such as Gmail and LinkedIn.</li>
            <li>Operational telemetry for sync status, failures, and security controls.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">2. How We Use Information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] text-slate-700">
            <li>Operate product features, authentication, and workspace persistence.</li>
            <li>Ingest and recall contextual memory for account-aware workflows.</li>
            <li>Generate user-requested outputs (meeting prep, follow-up drafts, blockers, changes).</li>
            <li>Secure, monitor, and improve reliability of integrations and sync jobs.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">3. Integrations and AI Processing</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            If you connect Gmail or LinkedIn, ContextIQ processes authorized data from those
            integrations to generate contextual signals and memory records. ContextIQ also uses AI
            providers to generate requested outputs using scoped workspace context.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">4. Processors and Infrastructure</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            ContextIQ uses infrastructure and processing services including Supabase, HydraDB,
            Gemini, and Vercel. These providers process data under their own platform terms and
            security controls.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">5. Security and Retention</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            We apply reasonable administrative and technical safeguards to protect stored and
            transmitted data. Data retention is based on operational necessity, legal obligations,
            and user account lifecycle events.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">6. User Rights and Controls</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            You may request access, correction, or deletion-related inquiries by contacting{" "}
            <strong>shivanshshankerguppta@gmail.com</strong>. Certain data may be retained where
            required for security, audit, or legal compliance.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">7. Children’s Privacy</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            ContextIQ is not directed to children and is intended for professional business use.
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-bold">8. Policy Updates</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-700">
            We may update this Privacy Policy from time to time. Updated versions will be posted on
            this page with a revised effective date.
          </p>
        </section>
      </div>
    </main>
  );
}
