"use client";

import { useEffect } from "react";
import { X, Scale, FileText } from "lucide-react";
import Link from "next/link";

interface PotentialScopeChangeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dealId?: string;
}

export default function PotentialScopeChangeDrawer({
  isOpen,
  onClose,
  dealId = "1",
}: PotentialScopeChangeDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer */}
      <aside
        className="fixed inset-y-0 right-0 w-full sm:w-[480px] md:w-[520px] bg-white z-50 shadow-2xl border-l border-zinc-200 p-6 sm:p-8 md:p-10 overflow-y-auto flex flex-col justify-start animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scope-change-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Scale size={13} className="text-zinc-500" />
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase font-sans">
              Contract Scope Monitor
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer -mr-1.5"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Title in Fraunces */}
        <h2
          id="scope-change-drawer-title"
          className="font-serif text-[28px] sm:text-[34px] font-bold text-zinc-900 leading-tight mb-6 mt-1 tracking-[-0.01em]"
        >
          Potential Scope Change
        </h2>

        {/* Callout Card Container */}
        <div className="rounded-2xl bg-[#4BCBEB]/10 border border-[#4BCBEB]/30 p-6 mb-8">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-[#027E9F] uppercase mb-1.5 font-sans">
            COMMUNICATION → CLAUSE EVIDENCE → ADJUSTMENT
          </p>

          <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-zinc-900 leading-snug mb-4">
            YouTube Shorts version
          </h3>

          {/* Why this was flagged */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-zinc-900 mb-1">
              Why this was flagged
            </p>
            <p className="text-xs text-zinc-600 font-normal leading-relaxed">
              The current agreement specifies 3 TikTok videos. A YouTube Shorts deliverable is not currently included in the agreed production scope.
            </p>
          </div>

          {/* Clause Box */}
          <div className="border-l-2 border-l-[#4BCBEB] pl-3.5 py-0.5 mb-6">
            <p className="text-xs font-semibold text-[#027E9F] mb-0.5">
              Deliverables §2
            </p>
            <p className="text-xs text-[#027E9F]/90 font-normal">
              “3 TikTok videos”
            </p>
          </div>

          {/* Potential financial impact */}
          <div>
            <p className="text-xs font-semibold text-zinc-900 mb-1">
              Potential financial impact
            </p>
            <p className="font-serif text-[22px] sm:text-[24px] font-bold text-zinc-900 leading-tight">
              Additional amount ₦40,000
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href={`/deals/${dealId}/change-requests`}
            onClick={onClose}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#A05AFF] text-white text-xs font-medium hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs"
          >
            Create change request
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-zinc-200 text-xs font-normal text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
          >
            Dismiss
          </button>
        </div>
      </aside>
    </>
  );
}
