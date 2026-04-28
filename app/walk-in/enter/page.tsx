"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { ContextIQLogo } from "@/components/contextiq/logo";

export default function WalkInEnterPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/walk-in/overview" as Route);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F8FAFC] px-6 font-sans text-[#0F172A]">
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="absolute left-0 top-0 h-1 w-full bg-[#2563EB]" />
        <div className="relative mb-6 mx-auto h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent" />
          <ContextIQLogo className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h1 className="mb-2 text-[20px] font-bold tracking-tight text-[#0F172A]">
          Entering Walk-In Experience...
        </h1>
        <p className="text-[14px] font-medium text-slate-500">
          Loading seeded workspace context and recent memory signals.
        </p>
        <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-full animate-[progress_1.5s_ease-in-out_forwards] rounded-full bg-[#2563EB]" />
        </div>
      </div>
    </div>
  );
}
