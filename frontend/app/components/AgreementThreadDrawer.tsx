"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface AgreementThreadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const threadHistoryItems = [
  {
    id: "item-1",
    tag: "SEPT 10 · ORIGINAL AGREEMENT",
    title: "3 TikTok videos · ₦300,000 total",
    isCurrent: false,
  },
  {
    id: "item-2",
    tag: "SEPT 13 · CHANGE REQUEST #02",
    title: "+1 YouTube Short · +₦40,000",
    isCurrent: false,
  },
  {
    id: "item-3",
    tag: "SEPT 14 · APPROVED BY NORTHSTAR COFFEE",
    title: "Payment received and agreement updated",
    isCurrent: false,
  },
  {
    id: "item-4",
    tag: "CURRENT AGREEMENT",
    title: "3 TikTok videos, 1 YouTube Short, ₦340,000 total",
    isCurrent: true,
  },
];

export default function AgreementThreadDrawer({
  isOpen,
  onClose,
}: AgreementThreadDrawerProps) {
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
        className="fixed inset-0 bg-black/25 backdrop-blur-[1.5px] z-40 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer */}
      <aside
        className="fixed inset-y-0 right-0 w-full sm:w-[480px] md:w-[500px] bg-white z-50 shadow-2xl border-l border-zinc-200 p-8 sm:p-10 overflow-y-auto flex flex-col justify-start animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="agreement-thread-drawer-title"
      >
        {/* Header with Kicker and Close Button */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
            AGREEMENT HISTORY
          </p>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer -mr-1.5"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Title in Fraunces */}
        <h2
          id="agreement-thread-drawer-title"
          className="font-serif text-[32px] sm:text-[36px] font-bold text-zinc-900 leading-tight mb-2 tracking-[-0.01em]"
        >
          The agreement thread
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-[13px] text-zinc-500 leading-relaxed mb-6">
          This is the living record of what was agreed, what changed, and how the
          deal now stands.
        </p>

        {/* List of cards */}
        <div className="space-y-3">
          {threadHistoryItems.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl p-4.5 bg-white transition-shadow ${
                item.isCurrent
                  ? "border border-[#A05AFF] shadow-[0_1px_6px_rgba(160,90,255,0.15)] ring-1 ring-[#A05AFF]/30"
                  : "border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
              }`}
            >
              <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1.5 font-sans">
                {item.tag}
              </p>
              <p className="font-serif text-[15px] font-bold text-zinc-900 leading-snug">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
