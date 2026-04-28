import { ReactNode } from "react";
import { MoreHorizontal, Network } from "lucide-react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-md border border-slate-200/80 bg-slate-50/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function HydraFooter({ memoryCount = 0 }: { memoryCount?: number }) {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
      <span>{memoryCount} memories used</span>
      <span className="flex items-center gap-1.5 text-[#2563EB]">
        <Network size={10} />
        Powered by HydraDB
      </span>
    </div>
  );
}

export function SurfaceCard({
  title,
  icon,
  children,
  memoryCount,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  memoryCount?: number;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-slate-100 bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F172A] text-white shadow-sm">
            {icon}
          </div>
          <h3 className="text-[16px] font-bold tracking-tight text-[#0F172A]">{title}</h3>
        </div>
        <button className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <div className="flex-1 p-8">{children}</div>
      <HydraFooter memoryCount={memoryCount} />
    </div>
  );
}
