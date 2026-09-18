"use client";

import { useState } from "react";
import DealHeader from "@/app/components/DealHeader";
import {
  demoDeal,
  demoBrand,
  demoCreator,
  demoActivityTimeline,
} from "@/app/lib/demo-data";
import { ChevronRight, History } from "lucide-react";

export default function ActivityPage() {
  const [isEmptyState, setIsEmptyState] = useState(false);

  return (
    <div className="pb-12">
      {/* Top Deal Header */}
      <DealHeader
        dealName={demoDeal.name}
        brandName={demoBrand.name}
        creatorName={demoCreator.name}
        status={demoDeal.status}
        agreementUpdated={demoDeal.agreementUpdated}
      />

      {/* Page Title Section */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1.5 font-sans">
            Chronological Record
          </p>
          <h1 className="font-serif text-[26px] md:text-[28px] font-bold text-zinc-900 leading-tight mb-1 tracking-[-0.01em]">
            Activity
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            A readable timeline of the agreement and the work around it.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEmptyState(!isEmptyState)}
          className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-800 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs mt-1"
        >
          {isEmptyState ? "Show full timeline" : "Show empty state"}
        </button>
      </div>

      {/* Main Timeline Card or Empty State */}
      {isEmptyState ? (
        <div className="bg-white rounded-2xl border border-[#E8E5DC] p-8 sm:p-12 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4 text-zinc-400">
            <History size={24} />
          </div>
          <h3 className="font-serif text-xl font-bold text-zinc-900 mb-1">
            No activity recorded yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-5 leading-relaxed font-normal">
            Events will automatically appear here as agreements are negotiated, deliverables are submitted, and payments are settled.
          </p>
          <button
            onClick={() => setIsEmptyState(false)}
            className="px-4 py-2 rounded-xl bg-[#A05AFF] text-white text-xs font-medium hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs"
          >
            Load active deal history
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E5DC] p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="relative pl-8">
            {/* Continuous Vertical Timeline Line */}
            <div className="absolute top-2.5 bottom-2.5 left-[11px] w-[2px] bg-zinc-200" />

            <div className="space-y-8">
              {demoActivityTimeline.map((event) => (
                <div
                  key={event.id}
                  className="relative group cursor-pointer flex items-start justify-between gap-4"
                >
                  {/* Purple Timeline Dot */}
                  <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#A05AFF] ring-4 ring-white" />

                  {/* Event Text */}
                  <div className="pr-4">
                    <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1 font-sans">
                      {event.date}
                    </p>
                    <h3 className="font-serif text-[15px] font-bold text-zinc-900 leading-snug group-hover:text-[#A05AFF] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed font-normal">
                      {event.subtitle}
                    </p>
                  </div>

                  {/* Right Arrow */}
                  <div className="pt-1 text-zinc-400 group-hover:text-zinc-700 transition-colors">
                    <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
