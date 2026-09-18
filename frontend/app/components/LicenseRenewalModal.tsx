"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface LicenseRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
}

export default function LicenseRenewalModal({
  isOpen,
  onClose,
  onApprove,
}: LicenseRenewalModalProps) {
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="renewal-modal-title"
    >
      <div
        className="w-full max-w-[540px] bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
            RIGHTSGUARD
          </p>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer -mr-2"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Title in Fraunces */}
        <h2
          id="renewal-modal-title"
          className="font-serif text-[28px] sm:text-[32px] font-bold text-zinc-900 leading-tight mb-6 tracking-[-0.01em]"
        >
          License Renewal Request
        </h2>

        {/* 2-Column Info Card */}
        <div className="rounded-2xl border border-zinc-200/80 p-6 bg-white mb-6">
          <div className="grid grid-cols-2 gap-y-5 gap-x-6">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1 font-sans">
                CONTENT
              </p>
              <p className="font-serif text-[15px] font-bold text-zinc-900">
                Video #01
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1 font-sans">
                REQUESTED USAGE
              </p>
              <p className="font-serif text-[15px] font-bold text-zinc-900">
                Paid advertising
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1 font-sans">
                DURATION
              </p>
              <p className="font-serif text-[15px] font-bold text-zinc-900">
                30 days
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1 font-sans">
                ADDITIONAL AMOUNT
              </p>
              <p className="font-serif text-[15px] font-bold text-zinc-900">
                ₦100,000
              </p>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-zinc-500 leading-relaxed mb-8">
          Approving records the payment and extends this license for paid
          advertising through Nov 14.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApprove();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#A05AFF] text-white text-xs font-semibold hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs"
          >
            Approve & Pay ₦100,000
          </button>
        </div>
      </div>
    </div>
  );
}
