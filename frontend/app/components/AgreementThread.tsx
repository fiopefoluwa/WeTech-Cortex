"use client";

import type { ThreadEvent } from "@/app/lib/types";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import AgreementThreadDrawer from "./AgreementThreadDrawer";

interface AgreementThreadProps {
  events: ThreadEvent[];
  showHeader?: boolean;
  dealId?: string;
}

export default function AgreementThread({
  events,
  showHeader = true,
  dealId = "1",
}: AgreementThreadProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E8E5DC] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1">
              Agreement Thread
            </p>
            <h2 className="font-serif text-[21px] font-bold text-zinc-900 tracking-[-0.01em]">
              The agreement, as it changed
            </h2>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
          >
            Open details
          </button>
        </div>
      )}

      {/* Right Slide-in Pop-up Modal Drawer */}
      <AgreementThreadDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        dealId={dealId}
      />

      {/* Timeline cards with connecting line */}
      <div className="relative">
        {/* Subtle connector track behind cards */}
        <div className="absolute top-1/2 left-6 right-6 h-[1.5px] bg-zinc-200/80 -translate-y-1/2 hidden lg:block z-0 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {events.map((event) => (
            <button
              type="button"
              key={event.id}
              onClick={() => setDrawerOpen(true)}
              className={`text-left rounded-xl border-r border-l p-4 bg-white transition-all duration-150 flex flex-col justify-between min-h-[140px] cursor-pointer hover:shadow-md hover:-translate-y-0.5 group ${
                event.isHighlighted
                  ? "border-[#1BCFB4]  hover:border-[#1BCFB4]"
                  :""
                  
              }`}
            >
              <div>
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-zinc-400 mb-2 font-sans">
                  {event.date}
                </p>
                <h3 className="font-serif text-[14px] font-bold text-zinc-900 mb-1.5 leading-snug group-hover:text-[#A05AFF] transition-colors">
                  {event.title}
                </h3>
                {event.details.map((detail, i) => {
                  const isMoney = detail.startsWith("₦") || detail.startsWith("+₦");
                  return (
                    <p
                      key={i}
                      className={`text-xs leading-relaxed ${
                        isMoney
                          ? "font-serif font-bold text-zinc-900 mt-0.5"
                          : "text-zinc-500 font-sans font-normal"
                      }`}
                    >
                      {detail}
                    </p>
                  );
                })}
              </div>

              {event.badge && (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/30">
                    <CheckCircle2 size={11} className="text-[#1BCFB4]" />
                    {event.badge.label}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

