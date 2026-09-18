"use client";

import { useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";

interface DetectedUsageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRenewal: () => void;
}

export default function DetectedUsageDrawer({
  isOpen,
  onClose,
  onCreateRenewal,
}: DetectedUsageDrawerProps) {
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
        aria-labelledby="licensing-issue-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <ShieldCheck size={13} className="text-zinc-500" />
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase font-sans">
              Rights Monitoring
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
          id="licensing-issue-drawer-title"
          className="font-serif text-[28px] sm:text-[34px] font-bold text-zinc-900 leading-tight mb-6 mt-1 tracking-[-0.01em]"
        >
          Potential licensing issue
        </h2>

        {/* Callout Container */}
        <div className="rounded-2xl bg-[#FE9496]/15 border border-[#FE9496]/35 p-6 mb-8">
          <p className="text-xs sm:text-[13px] text-zinc-700 font-normal leading-relaxed mb-6">
            Instagram paid advertising was detected Oct 15. The signed agreement permits
            organic usage only and the initial license expired Oct 1.
          </p>

          {/* Clause 1 */}
          <div className="border-l-2 border-l-[#FE9496] pl-3.5 py-0.5 mb-4">
            <p className="text-xs font-semibold text-[#B82B30] mb-0.5">
              Licensing §5
            </p>
            <p className="text-xs text-zinc-700 font-normal">
              “TikTok + Instagram, Organic usage, 30 days”
            </p>
          </div>

          {/* Clause 2 */}
          <div className="border-l-2 border-l-[#FE9496] pl-3.5 py-0.5">
            <p className="text-xs font-semibold text-[#B82B30] mb-0.5">
              Restrictions §6
            </p>
            <p className="text-xs text-zinc-700 font-normal">
              “No paid advertising”
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onCreateRenewal();
            }}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#A05AFF] text-white text-xs font-medium hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs"
          >
            Create renewal request
          </button>
        </div>
      </aside>
    </>
  );
}
