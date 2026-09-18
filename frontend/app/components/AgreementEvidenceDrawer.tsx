"use client";

import { useEffect } from "react";
import { X, FileText } from "lucide-react";

export type EvidenceType = "deliverables" | "update";

interface AgreementEvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  type: EvidenceType | null;
  dealName?: string;
}

export default function AgreementEvidenceDrawer({
  isOpen,
  onClose,
  type,
  dealName = "Summer Creator Campaign",
}: AgreementEvidenceDrawerProps) {
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

  if (!isOpen || !type) return null;

  const content =
    type === "deliverables"
      ? {
          title: "Deliverables §2",
          bannerTitle: "Deliverables §2",
          bannerText: "“3 TikTok videos”",
          sourceSectionTitle: "Deliverables §2",
        }
      : {
          title: "Agreement update",
          bannerTitle: "Agreement update",
          bannerText: "“3 TikTok videos, 1 YouTube Short, ₦340,000 total”",
          sourceSectionTitle: "Agreement update",
        };

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
        className="fixed inset-y-0 right-0 w-full sm:w-[480px] md:w-[500px] bg-white z-50 shadow-2xl border-l border-zinc-200 p-6 sm:p-8 md:p-10 overflow-y-auto flex flex-col justify-start animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-drawer-title"
      >
        {/* Header with Kicker and Close Button */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <FileText size={13} className="text-zinc-500" />
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase font-sans">
              Agreement Evidence
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
          id="evidence-drawer-title"
          className="font-serif text-[28px] sm:text-[34px] font-bold text-zinc-900 leading-tight mb-6"
        >
          {content.title}
        </h2>

        {/* Evidence Callout Box */}
        <div className="p-4 rounded-r-xl rounded-l-xs bg-[#4BCBEB]/10 border-l-4 border-l-[#4BCBEB] mb-8">
          <p className="text-sm font-semibold text-[#027E9F] mb-0.5">
            {content.bannerTitle}
          </p>
          <p className="text-xs text-[#027E9F] font-normal">
            {content.bannerText}
          </p>
        </div>

        {/* Why this matters here */}
        <div className="mb-8">
          <h3 className="font-serif text-[20px] sm:text-[22px] font-bold text-zinc-900 leading-snug mb-2">
            Why this matters here
          </h3>
          <p className="text-xs text-zinc-600 font-normal leading-relaxed">
            This source term is connected to the current Deal Room so all parties can
            reference the exact agreement wording, historical updates, and verified obligations.
          </p>
        </div>

        {/* Source Section Card */}
        <div className="rounded-2xl border border-zinc-200 p-5 bg-white shadow-2xs">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1.5 font-sans">
            SOURCE CLAUSE RECORD
          </p>
          <p className="text-sm font-semibold text-zinc-900 mb-1">
            {content.sourceSectionTitle}
          </p>
          <p className="text-xs text-zinc-500 font-light leading-relaxed">
            Executed agreement · {dealName} · signed Sept 10
          </p>
        </div>
      </aside>
    </>
  );
}
