"use client";

import { useState } from "react";
import { X, Check, Clock, AlertTriangle, PenLine } from "lucide-react";

interface ReviewExtractionModalProps {
  dealId?: string;
  isOpen: boolean;
  onClose: () => void;
  onTermsExtracted?: (terms: unknown) => void;
}

type ModalStep = "review" | "error" | "manual";

export default function ReviewExtractionModal({
  dealId = "1",
  isOpen,
  onClose,
  onTermsExtracted,
}: ReviewExtractionModalProps) {
  const [step, setStep] = useState<ModalStep>("review");
  const [manualText, setManualText] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("review");
    setIsConfirmed(false);
    setIsSaved(false);
    onClose();
  };

  const handleConfirmAgreement = () => {
    setIsConfirmed(true);
    if (onTermsExtracted) {
      onTermsExtracted({ confirmed: true, dealId });
    }
    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  const handleSaveDraft = async () => {
    setIsSaved(true);
    // If backend endpoint is available, send manual text
    try {
      if (manualText.trim()) {
        const backendUrl = "https://coolpractical.onrender.com";
        await fetch(
          `${backendUrl}/agreements/${dealId}?raw_text=${encodeURIComponent(
            manualText
          )}`,
          { method: "POST" }
        );
      }
    } catch (err) {
      console.warn("Backend agreement save note:", err);
    }

    setTimeout(() => {
      setIsSaved(false);
      setStep("review");
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 sm:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 p-1 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* STEP 1: Review extracted terms */}
        {step === "review" && (
          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-2 font-sans">
              Agreement Verification
            </p>
            <h2 className="font-serif text-[26px] sm:text-[30px] font-bold text-zinc-900 leading-tight mb-6">
              Review extracted terms
            </h2>

            {/* Checklist items */}
            <div className="divide-y divide-zinc-100 border-t border-b border-zinc-100 mb-6">
              {/* Item 1 */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/35 flex items-center justify-center">
                    <Check size={12} className="text-[#1BCFB4]" />
                  </span>
                  <div>
                    <p className="font-serif text-sm sm:text-[15px] font-bold text-zinc-900 leading-tight">
                      3 TikTok videos
                    </p>
                    <p className="text-xs text-zinc-500 font-light font-sans">Deliverables §2</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-zinc-800 font-sans">Confirmed</span>
              </div>

              {/* Item 2 */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/35 flex items-center justify-center">
                    <Check size={12} className="text-[#1BCFB4]" />
                  </span>
                  <div>
                    <p className="font-serif text-sm sm:text-[15px] font-bold text-zinc-900 leading-tight">
                      ₦300,000 total compensation
                    </p>
                    <p className="text-xs text-zinc-500 font-light font-sans">Commercial Terms §4</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-zinc-800 font-sans">Confirmed</span>
              </div>

              {/* Item 3 */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/35 flex items-center justify-center">
                    <Check size={12} className="text-[#1BCFB4]" />
                  </span>
                  <div>
                    <p className="font-serif text-sm sm:text-[15px] font-bold text-zinc-900 leading-tight">
                      30 days organic usage
                    </p>
                    <p className="text-xs text-zinc-500 font-light font-sans">Licensing §5</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-zinc-800 font-sans">Confirmed</span>
              </div>

              {/* Item 4 */}
              <div className="py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <Clock size={12} />
                  </span>
                  <div>
                    <p className="font-serif text-sm sm:text-[15px] font-bold text-zinc-900 leading-tight">
                      1 free revision included
                    </p>
                    <p className="text-xs text-zinc-500 font-light font-sans">Revisions Clause §7</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-amber-800 font-sans">Standard</span>
              </div>
            </div>

            {/* Error simulation toggle button for testing */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-light">
                Terms extracted from uploaded document
              </span>
              <button
                type="button"
                onClick={() => setStep("error")}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-800 hover:underline cursor-pointer"
              >
                Simulate parsing alert
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-normal text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleConfirmAgreement}
                className="px-5 py-2.5 rounded-xl bg-[#A05AFF] text-white text-xs font-medium hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs"
              >
                {isConfirmed ? "Confirmed!" : "Confirm Agreement"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Extraction Alert State */}
        {step === "error" && (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mb-4">
              <AlertTriangle size={22} />
            </div>

            <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1 font-sans">
              Verification Notice
            </p>
            <h2 className="font-serif text-[26px] sm:text-[28px] font-bold text-zinc-900 leading-tight mb-2">
              Unclear payment clause detected
            </h2>
            <p className="text-xs text-zinc-600 font-normal leading-relaxed mb-6">
              Clause 4 references a milestone payout structure, but specific due dates could not be verified automatically from the scanned PDF.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep("review")}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Retry verification
              </button>
              <button
                type="button"
                onClick={() => setStep("manual")}
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-800 text-xs font-medium hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Enter manually
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Manual Entry */}
        {step === "manual" && (
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#A05AFF]/15 text-[#702AE0] flex items-center justify-center mb-3">
              <PenLine size={18} />
            </div>

            <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1 font-sans">
              Manual Clause Entry
            </p>
            <h2 className="font-serif text-[24px] sm:text-[26px] font-bold text-zinc-900 leading-tight mb-2">
              Input contract terms directly
            </h2>
            <p className="text-xs text-zinc-500 font-normal mb-4 leading-relaxed">
              Paste or type the terms (deliverables, fee, deadlines) to store as the ground truth for this deal room.
            </p>

            <textarea
              rows={4}
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="e.g. 3 TikTok videos and 1 YouTube Shorts, ₦340,000 total compensation, 30 days organic licensing..."
              className="w-full p-3.5 rounded-2xl border border-zinc-200 text-xs font-normal text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/25 focus:border-[#A05AFF] mb-4"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("review")}
                className="text-xs font-normal text-zinc-500 hover:text-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-2.5 rounded-xl bg-[#A05AFF] text-white text-xs font-medium hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs"
              >
                {isSaved ? "Saved!" : "Save to Deal Room"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
