"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ArrowRight,
  CheckCircle2,
  Cloud,
  DollarSign,
  Mail,
  MessageSquare,
  Network,
  ShieldAlert,
  Video,
} from "lucide-react";

import { ContextIQLogo } from "@/components/contextiq/logo";

const floatingCards = [
  {
    label: "Blocker",
    copy: "David explicitly stated they cannot proceed without SOC2 Type II compliance.",
    icon: ShieldAlert,
    className: "top-[12%] left-[8%] rotate-[-3deg]",
    color: "text-[#B91C1C]",
  },
  {
    label: "Preference",
    copy: "Sarah hates long emails. Prefers bulleted lists with clear SLAs.",
    icon: MessageSquare,
    className: "bottom-[20%] right-[8%] rotate-[3deg]",
    color: "text-[#2563EB]",
  },
  {
    label: "Commitment",
    copy: "Promised to provide a revised tiered pricing model.",
    icon: CheckCircle2,
    className: "top-[25%] right-[12%] rotate-[5deg]",
    color: "text-[#22C55E]",
  },
  {
    label: "Context",
    copy: "Budget refresh in Nov. Risk of slipping to Q1 if not signed.",
    icon: DollarSign,
    className: "top-[45%] left-[5%] rotate-[-6deg]",
    color: "text-[#F97316]",
  },
];

function HydraTerminal() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const script = [
      "Listening to integration webhook stream...",
      "Parsing inbound note and activity payloads...",
      "Extracting semantic context vectors...",
      "Entity matched: David Kim (CISO)",
      "Blocker identified: SOC2 Compliance",
      "Writing nodes to Account Memory Graph...",
    ];

    let timeoutIds: Array<ReturnType<typeof setTimeout>> = [];

    const run = () => {
      setLines([]);
      script.forEach((line, index) => {
        timeoutIds.push(
          setTimeout(() => {
            setLines((current) => [...current, line]);
          }, 400 + index * 650),
        );
      });

      timeoutIds.push(setTimeout(run, 6500));
    };

    run();

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative flex h-[180px] w-full flex-col overflow-hidden rounded-xl border border-slate-700/50 bg-[#0F172A] font-mono text-[11px] leading-relaxed shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]">
      <div className="absolute left-0 top-0 z-10 flex h-8 w-full items-center gap-2 border-b border-slate-700/50 bg-slate-800/80 px-4 backdrop-blur-md">
        <div className="h-2.5 w-2.5 rounded-full bg-slate-600/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-slate-600/80" />
        <div className="h-2.5 w-2.5 rounded-full bg-slate-600/80" />
        <span className="ml-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
          HydraDB Engine
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-end space-y-2.5 overflow-hidden p-4 pt-10">
        {lines.map((line) => (
          <div key={line} className="flex items-start gap-2.5 text-slate-300">
            <span className="font-bold text-[#2563EB]">→</span>
            <span>{line}</span>
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2.5">
          <span className="font-bold text-[#2563EB]">~</span>
          <span className="inline-block h-3.5 w-2 animate-pulse bg-slate-400" />
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      onMouseMove={(event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 20;
        const y = (event.clientY / window.innerHeight - 0.5) * 20;
        setMousePos({ x, y });
      }}
      className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[#F8FAFC] font-sans text-[#0F172A]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 80%)",
        }}
      />
      <div
        className="fixed left-1/2 top-[40%] -z-10 h-[600px] w-[800px] rounded-full bg-[#2563EB]/5 blur-[120px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x * 2}px), calc(-50% + ${mousePos.y * 2 - scrollY * 0.2}px))`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 hidden h-[100vh] overflow-hidden lg:block"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        {floatingCards.map((card) => (
          <div
            key={card.copy}
            className={`absolute w-60 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-md ${card.className}`}
          >
            <div className={`mb-2 flex items-center gap-2 ${card.color}`}>
              <card.icon size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {card.label}
              </span>
            </div>
            <p className="text-[12px] font-medium leading-relaxed text-slate-600">
              {card.copy}
            </p>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-6 pb-16 pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
            <ContextIQLogo className="h-5 w-5 rounded-lg shadow-sm" />
            <span className="text-[13px] font-bold uppercase tracking-widest text-[#0F172A]">
              ContextIQ
            </span>
          </div>
          <h1 className="mb-6 text-5xl font-extrabold leading-[1.05] tracking-tighter text-[#0F172A] md:text-7xl">
            Before you speak,
            <br />
            <span className="text-slate-400">know what matters.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-[18px] font-medium leading-relaxed tracking-tight text-slate-500">
            A memory-native workspace for revenue teams. ContextIQ captures history,
            preferences, and blockers, surfacing exactly what you need to close the deal.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={"/auth/sign-in" as Route}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-8 py-3.5 text-[14px] font-bold text-white shadow-sm transition-all hover:bg-[#1D4ED8] hover:shadow-[0_4px_14px_rgba(37,99,235,0.25)] sm:w-auto"
            >
              Get Started <ArrowRight size={16} />
            </Link>
            <a
              href="#pipeline"
              className="w-full rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-[14px] font-bold text-[#0F172A] shadow-sm transition-colors hover:bg-slate-50 sm:w-auto"
            >
              See the architecture
            </a>
          </div>
        </div>
      </div>

      <div id="pipeline" className="relative z-10 mx-auto mt-16 max-w-6xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="mb-3 text-[12px] font-bold uppercase tracking-widest text-[#2563EB]">
            The Architecture
          </h2>
          <p className="text-3xl font-extrabold tracking-tight text-[#0F172A] md:text-4xl">
            How ContextIQ builds memory.
          </p>
          <p className="mt-3 text-[16px] font-medium text-slate-500">
            A continuous pipeline from raw data to actionable insight.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_4px_24px_rgba(15,23,42,0.02)]">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[12px] font-bold text-slate-600">
                1
              </div>
              <h3 className="text-[15px] font-bold uppercase tracking-widest text-[#0F172A]">
                Capture
              </h3>
            </div>
            <p className="mb-8 text-[14px] font-medium leading-relaxed text-slate-500">
              We ingest conversations, emails, notes, and structured account state into a
              single workspace memory layer.
            </p>
            <div className="mt-auto space-y-3">
              {[
                [Cloud, "Supabase", "Structured state"],
                [Video, "HydraDB", "Context graph"],
                [Mail, "Gemini", "Grounded outputs"],
              ].map(([Icon, label, status]) => (
                <div
                  key={label as string}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-[#2563EB]" size={16} />
                    <span className="text-[14px] font-bold text-[#0F172A]">
                      {label as string}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {status as string}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="scale-105 rounded-2xl border border-slate-800 bg-[#0F172A] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.3)]">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-[14px] font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                2
              </div>
              <h3 className="flex items-center gap-2.5 text-[18px] font-bold uppercase tracking-widest text-white">
                Synthesize <Network size={18} className="text-[#2563EB]" />
              </h3>
            </div>
            <p className="mb-6 text-[14px] font-medium leading-relaxed text-slate-400">
              <strong className="text-white">HydraDB</strong> handles memory ingestion and
              recall so the generation layer works from grounded account context instead of
              invented filler.
            </p>
            <HydraTerminal />
          </div>

          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_4px_24px_rgba(15,23,42,0.02)]">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[12px] font-bold text-slate-600">
                3
              </div>
              <h3 className="text-[15px] font-bold uppercase tracking-widest text-[#0F172A]">
                Act
              </h3>
            </div>
            <p className="mb-8 text-[14px] font-medium leading-relaxed text-slate-500">
              Prepare for meetings, draft follow-ups, summarize blockers, and track what
              changed recently without leaving the account page.
            </p>
            <div className="mt-auto space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/50 p-4">
                <ShieldAlert size={16} className="mt-0.5 shrink-0 text-[#B91C1C]" />
                <div>
                  <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#B91C1C]">
                    Blocker surfaced
                  </div>
                  <div className="text-[13px] font-bold leading-snug text-[#0F172A]">
                    Procurement is blocked on SOC2 proof and revised pricing.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-[#EAF1FF]/50 p-4">
                <MessageSquare size={16} className="mt-0.5 shrink-0 text-[#2563EB]" />
                <div>
                  <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">
                    Preference saved
                  </div>
                  <div className="text-[13px] font-bold leading-snug text-[#0F172A]">
                    Stakeholder prefers concise bullet summaries with explicit next steps.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 border-t border-slate-200 bg-white py-24 pb-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#0F172A] md:text-4xl">
            Stop walking into conversations blind.
          </h2>
          <p className="mb-12 text-[15px] font-medium text-slate-500">
            Open the seeded walk-in workspace to explore account state, memory recall, and
            generated outputs instantly.
          </p>
          <Link
            href={"/walk-in/enter" as Route}
            className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 text-[15px] font-bold text-[#0F172A] shadow-sm transition-all hover:border-[#2563EB]/40 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F172A] text-white">
              CI
            </div>
            Enter Walk-In Experience <ArrowRight size={18} />
          </Link>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href={"/privacy-policy" as Route}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-600 transition-colors hover:bg-slate-50"
            >
              Privacy Policy
            </Link>
            <Link
              href={"/terms-of-service" as Route}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-600 transition-colors hover:bg-slate-50"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
