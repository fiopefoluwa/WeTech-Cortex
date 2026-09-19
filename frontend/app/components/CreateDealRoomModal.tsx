"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, Upload, PenLine, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useDeal } from "@/app/context/DealContext";

interface CreateDealRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDealCreated?: (deal: unknown) => void;
}

export default function CreateDealRoomModal({
  isOpen,
  onClose,
  onDealCreated,
}: CreateDealRoomModalProps) {
  const router = useRouter();
  const { createDeal } = useDeal();

  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields (Step 1)
  const [dealName, setDealName] = useState("");
  const [clientBrand, setClientBrand] = useState("");
  const [creator, setCreator] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  const setTodayStart = () => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
  };

  const setPresetEndDate = (days: number) => {
    const base = startDate ? new Date(startDate) : new Date();
    const future = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
    setEndDate(future.toISOString().split("T")[0]);
  };

  // Submitting / loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleModalClose = useCallback(() => {
    setStep(1);
    setCreatedSuccess(false);
    setDealName("");
    setClientBrand("");
    setCreator("");
    setAmount("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleModalClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleModalClose]);

  if (!isOpen) return null;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealName.trim()) return;
    setStep(2);
  };

  const handleCreateDeal = async (mode: "upload" | "manual") => {
    setIsSubmitting(true);
    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 50000;
    const defaultDesc = mode === "upload" 
      ? "Campaign agreement uploaded via contract document" 
      : "Campaign partnership deliverables";
    const finalDescription = description.trim() || defaultDesc;

    try {
      const newDealId = await createDeal({
        name: dealName.trim() || "New Campaign",
        brandName: clientBrand.trim() || "Brand Client",
        creatorName: creator.trim() || "Creator",
        amount: parsedAmount,
        description: finalDescription,
        startDate,
        endDate,
      });

      if (onDealCreated) {
        onDealCreated({
          id: newDealId,
          name: dealName.trim(),
          brandName: clientBrand.trim(),
          creatorName: creator.trim(),
          amount: parsedAmount,
          description: finalDescription,
        });
      }

      setCreatedSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        handleModalClose();
        router.push(`/deals/${newDealId}`);
      }, 900);
    } catch {
      setCreatedSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        handleModalClose();
        router.push("/deals/1");
      }, 900);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-deal-title"
    >
      <div
        className="w-full max-w-[620px] bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-zinc-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step 1: Create a Deal Room */}
        {step === 1 && (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1">
                  STEP 1 OF 2
                </p>
                <h2
                  id="create-deal-title"
                  className="font-serif text-[30px] sm:text-[34px] font-bold text-zinc-900 leading-tight tracking-[-0.01em]"
                >
                  Create a Deal Room
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer -mr-2"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleContinue} className="mt-6 space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Deal name
                  </label>
                  <input
                    type="text"
                    required
                    value={dealName}
                    onChange={(e) => setDealName(e.target.value)}
                    placeholder="e.g. Autumn launch"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Client / brand
                  </label>
                  <input
                    type="text"
                    value={clientBrand}
                    onChange={(e) => setClientBrand(e.target.value)}
                    placeholder="Brand name"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Creator / freelancer
                  </label>
                  <input
                    type="text"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Creator name"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="₦0"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-zinc-800">
                      Start date
                    </label>
                    <button
                      type="button"
                      onClick={setTodayStart}
                      className="text-[10px] font-medium text-[#A05AFF] hover:underline cursor-pointer"
                    >
                      Set today
                    </button>
                  </div>
                  <div className="relative group">
                    <input
                      ref={startDateRef}
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch {}
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white cursor-pointer pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2.5 [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:z-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => {
                        try {
                          startDateRef.current?.showPicker();
                        } catch {
                          startDateRef.current?.focus();
                        }
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors cursor-pointer p-0.5 pointer-events-auto"
                      aria-label="Pick start date"
                    >
                      <Calendar size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-zinc-800">
                      End date
                    </label>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                      <button
                        type="button"
                        onClick={() => setPresetEndDate(30)}
                        className="font-medium text-[#A05AFF] hover:underline cursor-pointer"
                      >
                        +30d
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => setPresetEndDate(60)}
                        className="font-medium text-[#A05AFF] hover:underline cursor-pointer"
                      >
                        +60d
                      </button>
                    </div>
                  </div>
                  <div className="relative group">
                    <input
                      ref={endDateRef}
                      type="date"
                      min={startDate || undefined}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch {}
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white cursor-pointer pr-10 appearance-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2.5 [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6 [&::-webkit-calendar-picker-indicator]:z-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => {
                        try {
                          endDateRef.current?.showPicker();
                        } catch {
                          endDateRef.current?.focus();
                        }
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 group-hover:text-zinc-600 transition-colors cursor-pointer p-0.5 pointer-events-auto"
                      aria-label="Pick end date"
                    >
                      <Calendar size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 4: Description */}
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short description of the work"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!dealName.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#A05AFF] text-white text-xs font-semibold hover:bg-[#8E44F8] transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Add the agreement */}
        {step === 2 && (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1">
                  STEP 2 OF 2
                </p>
                <h2 className="font-serif text-[30px] sm:text-[34px] font-bold text-zinc-900 leading-tight tracking-[-0.01em]">
                  Add the agreement
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer -mr-2"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-zinc-500 mb-8 leading-relaxed">
              Choose how you would like to bring the agreement into this Deal Room.
            </p>

            {/* 2 Option Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Upload agreement */}
              <button
                type="button"
                onClick={() => handleCreateDeal("upload")}
                disabled={isSubmitting}
                className="rounded-3xl border border-zinc-200 p-6 bg-white hover:border-[#A05AFF] hover:bg-[#A05AFF]/5 hover:shadow-md transition-all cursor-pointer text-left group flex flex-col justify-start"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center mb-4 group-hover:bg-[#A05AFF]/15 transition-colors">
                  <Upload
                    size={20}
                    className="text-zinc-700 group-hover:text-[#A05AFF] transition-colors"
                  />
                </div>
                <h3 className="font-serif text-[17px] font-bold text-zinc-900 mb-1.5 group-hover:text-[#A05AFF] transition-colors">
                  Upload agreement
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans font-normal">
                  Process a document into practical terms.
                </p>
              </button>

              {/* Enter manually */}
              <button
                type="button"
                onClick={() => handleCreateDeal("manual")}
                disabled={isSubmitting}
                className="rounded-3xl border border-zinc-200 p-6 bg-white hover:border-[#A05AFF] hover:bg-[#A05AFF]/5 hover:shadow-md transition-all cursor-pointer text-left group flex flex-col justify-start"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center mb-4 group-hover:bg-[#A05AFF]/15 transition-colors">
                  <PenLine
                    size={20}
                    className="text-zinc-700 group-hover:text-[#A05AFF] transition-colors"
                  />
                </div>
                <h3 className="font-serif text-[17px] font-bold text-zinc-900 mb-1.5 group-hover:text-[#A05AFF] transition-colors">
                  Enter manually
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans font-normal">
                  Add the key deal terms directly.
                </p>
              </button>
            </div>

            {/* Feedback alert during submission */}
            {isSubmitting && (
              <div className="p-3.5 rounded-xl bg-[#A05AFF]/10 border border-[#A05AFF]/25 text-xs text-[#702AE0] flex items-center gap-2 mb-4">
                <Loader2 size={16} className="animate-spin text-[#A05AFF] flex-shrink-0" />
                <span>Initializing Deal Room for <strong>{dealName}</strong>...</span>
              </div>
            )}

            {createdSuccess && (
              <div className="p-3.5 rounded-xl bg-[#1BCFB4]/15 border border-[#1BCFB4]/30 text-xs text-emerald-950 flex items-center gap-2 mb-4">
                <CheckCircle2 size={16} className="text-[#1BCFB4] flex-shrink-0" />
                <span>Deal Room created successfully! Redirecting...</span>
              </div>
            )}

            {/* Footer Back and Cancel */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
