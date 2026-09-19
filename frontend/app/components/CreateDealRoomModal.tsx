"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  PenLine,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  UploadCloud,
  FileText,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useDeal } from "@/app/context/DealContext";
import { api } from "@/app/lib/api";
import { parseTermsPayload } from "@/app/lib/term-parser";

interface CreateDealRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDealCreated?: (deal: unknown) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CreateDealRoomModal({
  isOpen,
  onClose,
  onDealCreated,
}: CreateDealRoomModalProps) {
  const router = useRouter();
  const { createDeal, updateDeal } = useDeal();

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

  // Step 2: Agreement Upload / Manual Input State
  const [agreementMode, setAgreementMode] = useState<"upload" | "manual">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [manualAgreementText, setManualAgreementText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [processingPhase, setProcessingPhase] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submitting / loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const setTodayStart = () => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
  };

  const setPresetEndDate = (days: number) => {
    const base = startDate ? new Date(startDate) : new Date();
    const future = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
    setEndDate(future.toISOString().split("T")[0]);
  };

  const handleModalClose = useCallback(() => {
    setStep(1);
    setCreatedSuccess(false);
    setIsSubmitting(false);
    setProcessingPhase("");
    setDealName("");
    setClientBrand("");
    setCreator("");
    setAmount("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setSelectedFile(null);
    setManualAgreementText("");
    setAgreementMode("upload");
    setIsDragging(false);
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleCreateDeal = async () => {
    setIsSubmitting(true);
    setProcessingPhase("Ingesting contract parameters...");
    const parsedAmount = parseInt(amount.replace(/[^0-9]/g, ""), 10) || 50000;

    let defaultDesc = "Campaign partnership deliverables";
    if (agreementMode === "upload" && selectedFile) {
      defaultDesc = `Contract uploaded from ${selectedFile.name}`;
    } else if (agreementMode === "manual" && manualAgreementText.trim()) {
      defaultDesc = manualAgreementText.trim().slice(0, 100);
    }
    const finalDescription = description.trim() || defaultDesc;

    // Build structured terms immediately
    const immediateTerms = parseTermsPayload(null, {
      dealName: dealName.trim() || "New Campaign",
      brandName: clientBrand.trim() || "Brand Client",
      creatorName: creator.trim() || "Creator",
      amount: parsedAmount,
      sourceDocName:
        selectedFile?.name ||
        `${(dealName.trim() || "Campaign").replace(/\s+/g, "_")}_Agreement.pdf`,
      rawText: agreementMode === "manual" ? manualAgreementText : undefined,
    });

    try {
      setProcessingPhase(
        selectedFile
          ? "Analyzing contract clauses with Scope AI..."
          : "Initializing Deal Room..."
      );

      const newDealId = await createDeal({
        name: dealName.trim() || "New Campaign",
        brandName: clientBrand.trim() || "Brand Client",
        creatorName: creator.trim() || "Creator",
        amount: parsedAmount,
        description: finalDescription,
        startDate,
        endDate,
        agreementFile: selectedFile
          ? {
              name: selectedFile.name,
              size: selectedFile.size,
              uploadedAt: new Date().toISOString(),
              type: selectedFile.type,
            }
          : undefined,
        extractedTerms: immediateTerms,
        agreementText: agreementMode === "manual" ? manualAgreementText : undefined,
      });

      // If a real file was provided, trigger backend FastAPI upload
      if (selectedFile) {
        try {
          setProcessingPhase("Validating deliverables and licensing constraints...");
          const uploadRes = await api.agreements.uploadPdf(
            parseInt(newDealId) || 1,
            selectedFile
          );
          if (uploadRes.ok && uploadRes.data) {
            const apiTerms = parseTermsPayload(uploadRes.data, {
              dealName: dealName.trim(),
              brandName: clientBrand.trim(),
              creatorName: creator.trim(),
              amount: parsedAmount,
              sourceDocName: selectedFile.name,
            });
            updateDeal(newDealId, { extractedTerms: apiTerms });
          }
        } catch {
          // Safe offline fallback: immediateTerms already stored
        }
      }

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
        router.push(`/deals/${newDealId}/agreement`);
      }, 700);
    } catch {
      setCreatedSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        handleModalClose();
        router.push(`/deals/1/agreement`);
      }, 700);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleModalClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 sm:p-8 relative overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step 1: Create a Deal Room */}
        {step === 1 && (
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1 font-sans">
                  STEP 1 OF 2
                </p>
                <h2 className="font-serif text-[30px] sm:text-[34px] font-bold text-zinc-900 leading-tight tracking-[-0.01em]">
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

            <p className="text-xs text-zinc-500 mb-6 leading-relaxed font-normal">
              Set up a shared space for the creator and brand to align on scope,
              track deliverables, and protect payments.
            </p>

            <form onSubmit={handleContinue} className="space-y-4">
              {/* Deal Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                  Deal name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={dealName}
                  onChange={(e) => setDealName(e.target.value)}
                  placeholder="e.g. Summer UGC Campaign"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white"
                />
              </div>

              {/* Row 1: Brand Client + Creator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Client (Brand)
                  </label>
                  <input
                    type="text"
                    value={clientBrand}
                    onChange={(e) => setClientBrand(e.target.value)}
                    placeholder="Brand name"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Creator
                  </label>
                  <input
                    type="text"
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    placeholder="Creator name"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Total Deal Value + Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Total deal value
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                      ₦
                    </span>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="50,000"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Currency
                  </label>
                  <select
                    defaultValue="NGN"
                    className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-zinc-800">
                      Start date
                    </label>
                    <button
                      type="button"
                      onClick={setTodayStart}
                      className="text-[11px] font-medium text-[#A05AFF] hover:underline cursor-pointer"
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
                    <div className="flex items-center gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setPresetEndDate(30)}
                        className="font-medium text-[#A05AFF] hover:underline cursor-pointer"
                      >
                        +30d
                      </button>
                      <span className="text-zinc-300">·</span>
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
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional brief description"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] transition-all bg-white resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!dealName.trim()}
                  className="px-6 py-2.5 rounded-xl bg-[#A05AFF] text-white text-xs font-semibold hover:bg-[#8E44F8] transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
                >
                  Continue to Agreement
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
                <h2 className="font-serif text-[28px] sm:text-[32px] font-bold text-zinc-900 leading-tight tracking-[-0.01em]">
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

            <p className="text-xs text-zinc-500 mb-5 leading-relaxed font-normal">
              Attach a contract or brief to extract deliverables, milestones, and licensing terms into this Deal Room.
            </p>

            {/* Mode Switcher */}
            <div className="flex p-1 bg-zinc-100/90 rounded-2xl mb-5 border border-zinc-200/60">
              <button
                type="button"
                onClick={() => setAgreementMode("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  agreementMode === "upload"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <UploadCloud
                  size={15}
                  className={agreementMode === "upload" ? "text-[#A05AFF]" : "text-zinc-400"}
                />
                <span>Upload document</span>
              </button>
              <button
                type="button"
                onClick={() => setAgreementMode("manual")}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  agreementMode === "manual"
                    ? "bg-white text-zinc-900 shadow-xs"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <PenLine
                  size={15}
                  className={agreementMode === "manual" ? "text-[#A05AFF]" : "text-zinc-400"}
                />
                <span>Enter key terms manually</span>
              </button>
            </div>

            {/* Upload Area */}
            {agreementMode === "upload" && (
              <div className="space-y-4 mb-6">
                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
                      isDragging
                        ? "border-[#A05AFF] bg-[#A05AFF]/10 scale-[1.01]"
                        : "border-zinc-200 hover:border-[#A05AFF]/60 hover:bg-zinc-50/70 bg-zinc-50/40"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-zinc-200/80 mx-auto flex items-center justify-center mb-3 text-zinc-600">
                      <UploadCloud size={22} className="text-[#A05AFF]" />
                    </div>
                    <p className="text-xs font-semibold text-zinc-900 mb-1">
                      Drag & drop agreement here, or{" "}
                      <span className="text-[#A05AFF] underline underline-offset-2">
                        browse files
                      </span>
                    </p>
                    <p className="text-[11px] text-zinc-400 font-normal">
                      Supports PDF, DOCX, and TXT contracts up to 25MB
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-zinc-900 truncate">
                            {selectedFile.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-zinc-500 font-normal">
                              {formatFileSize(selectedFile.size)}
                            </span>
                            <span className="text-zinc-300">·</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                              <CheckCircle2 size={11} className="text-emerald-600" />
                              Ready to extract
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Scope clause detection preview */}
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E5DC] text-xs text-zinc-700">
                  <div className="flex items-center gap-1.5 font-semibold text-zinc-900 mb-1">
                    <Sparkles size={14} className="text-[#A05AFF]" />
                    <span>Scope AI Clause Extraction</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    Once created, Scope automatically maps deliverables, fee escrow, 1 revision limit, and 30-day licensing rights as ground-truth evidence.
                  </p>
                </div>
              </div>
            )}

            {/* Manual Entry Area */}
            {agreementMode === "manual" && (
              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Contract Clauses & Deliverables
                  </label>
                  <textarea
                    rows={5}
                    value={manualAgreementText}
                    onChange={(e) => setManualAgreementText(e.target.value)}
                    placeholder="e.g. 3 TikTok videos and 1 YouTube Shorts version, ₦300,000 total compensation, 1 revision round included, 30 days organic usage rights..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/20 focus:border-[#A05AFF] bg-white resize-none leading-relaxed"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1.5">
                    Scope stores this text as ground truth and flags any scope creep requests against it.
                  </p>
                </div>
              </div>
            )}

            {/* Feedback alert during submission */}
            {isSubmitting && (
              <div className="p-3.5 rounded-xl bg-[#A05AFF]/10 border border-[#A05AFF]/25 text-xs text-[#702AE0] flex items-center gap-2 mb-4 animate-in fade-in duration-150">
                <Loader2 size={16} className="animate-spin text-[#A05AFF] flex-shrink-0" />
                <span>{processingPhase || `Initializing Deal Room for ${dealName}...`}</span>
              </div>
            )}

            {createdSuccess && (
              <div className="p-3.5 rounded-xl bg-[#1BCFB4]/15 border border-[#1BCFB4]/30 text-xs text-emerald-950 flex items-center gap-2 mb-4">
                <CheckCircle2 size={16} className="text-[#1BCFB4] flex-shrink-0" />
                <span>Agreement processed & Deal Room ready! Opening...</span>
              </div>
            )}

            {/* Footer Back, Cancel, and Submit */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateDeal}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#A05AFF] text-white text-xs font-semibold hover:bg-[#8E44F8] transition-colors cursor-pointer disabled:opacity-50 shadow-xs flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : agreementMode === "upload" && selectedFile ? (
                    <span>Create & Extract Agreement</span>
                  ) : agreementMode === "manual" && manualAgreementText.trim() ? (
                    <span>Create & Save Terms</span>
                  ) : (
                    <span>Create Deal Room</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
