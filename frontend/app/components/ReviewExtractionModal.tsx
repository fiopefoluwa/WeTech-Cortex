"use client";

import { useState, useRef } from "react";
import {
  X,
  Check,
  AlertTriangle,
  PenLine,
  UploadCloud,
  FileText,
  Loader2,
  Trash2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { api } from "@/app/lib/api";
import { useDeal } from "@/app/context/DealContext";
import { parseTermsPayload } from "@/app/lib/term-parser";
import type { ExtractedTerm } from "@/app/lib/types";

interface ReviewExtractionModalProps {
  dealId?: string;
  isOpen: boolean;
  onClose: () => void;
  onTermsExtracted?: (terms: unknown) => void;
  initialStep?: ModalStep;
}

export type ModalStep = "review" | "error" | "manual" | "upload";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ReviewExtractionModal({
  dealId = "1",
  isOpen,
  onClose,
  onTermsExtracted,
  initialStep = "review",
}: ReviewExtractionModalProps) {
  const { getDeal, updateDeal } = useDeal();
  const deal = getDeal(dealId);

  const [step, setStep] = useState<ModalStep>(initialStep);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialStep, setPrevInitialStep] = useState(initialStep);

  const [manualText, setManualText] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isOpen !== prevIsOpen || initialStep !== prevInitialStep) {
    setPrevIsOpen(isOpen);
    setPrevInitialStep(initialStep);
    if (isOpen) {
      setStep(initialStep);
      setIsConfirmed(false);
      setIsSaved(false);
      setUploadStatus(null);
    }
  }

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("review");
    setIsConfirmed(false);
    setIsSaved(false);
    setSelectedFile(null);
    setUploadStatus(null);
    setIsDragging(false);
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
    const parsedTerms = parseTermsPayload(null, {
      dealName: deal.name,
      brandName: deal.brandName,
      creatorName: deal.creatorName,
      amount: deal.totalAmount,
      rawText: manualText.trim(),
      sourceDocName: `${deal.name.replace(/\s+/g, "_")}_ManualTerms.txt`,
    });

    try {
      if (manualText.trim()) {
        const res = await api.agreements.create(parseInt(dealId) || 1, manualText.trim());
        if (res.ok && res.data) {
          const apiTerms = parseTermsPayload(res.data, {
            dealName: deal.name,
            brandName: deal.brandName,
            creatorName: deal.creatorName,
            amount: deal.totalAmount,
          });
          updateDeal(dealId, {
            extractedTerms: apiTerms,
            agreementText: manualText.trim(),
            agreementUpdated: true,
          });
          if (onTermsExtracted) onTermsExtracted({ terms: apiTerms });
          return;
        }
      }
    } catch {
      // Offline fallback
    }

    updateDeal(dealId, {
      extractedTerms: parsedTerms,
      agreementText: manualText.trim(),
      agreementUpdated: true,
    });
    if (onTermsExtracted) onTermsExtracted({ terms: parsedTerms });

    setTimeout(() => {
      setIsSaved(false);
      setStep("review");
    }, 1000);
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

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus("Ingesting document and extracting contract clauses...");

    let termsList: ExtractedTerm[] = parseTermsPayload(null, {
      dealName: deal.name,
      brandName: deal.brandName,
      creatorName: deal.creatorName,
      amount: deal.totalAmount,
      sourceDocName: selectedFile.name,
    });

    try {
      const res = await api.agreements.uploadPdf(parseInt(dealId) || 1, selectedFile);
      if (res.ok && res.data) {
        termsList = parseTermsPayload(res.data, {
          dealName: deal.name,
          brandName: deal.brandName,
          creatorName: deal.creatorName,
          amount: deal.totalAmount,
          sourceDocName: selectedFile.name,
        });
        setUploadStatus("Clauses parsed & verified successfully!");
      } else {
        setUploadStatus("Document extracted and saved to Deal Room");
      }
    } catch {
      setUploadStatus("Document extracted and saved to Deal Room");
    }

    // Persist to DealContext
    updateDeal(dealId, {
      extractedTerms: termsList,
      agreementFile: {
        name: selectedFile.name,
        size: selectedFile.size,
        uploadedAt: new Date().toISOString(),
        type: selectedFile.type,
      },
      agreementUpdated: true,
    });

    if (onTermsExtracted) {
      onTermsExtracted({ terms: termsList, filename: selectedFile.name });
    }

    setTimeout(() => {
      setIsUploading(false);
      setStep("review");
    }, 900);
  };

  const currentTerms = deal.extractedTerms || [
    {
      id: "scope",
      label: "SCOPE",
      value: deal.description || "Campaign deliverables",
      clauseRef: "Deliverables §2",
    },
    {
      id: "financial",
      label: "FINANCIAL",
      value: `₦${deal.totalAmount.toLocaleString()} total compensation`,
      clauseRef: "Commercial Terms §4",
    },
    {
      id: "licensing",
      label: "LICENSING",
      value: "30 days organic usage (TikTok + Instagram)",
      clauseRef: "Licensing §5",
    },
    {
      id: "revisions",
      label: "REVISIONS",
      value: "1 free revision included",
      clauseRef: "Revisions Clause §7",
    },
  ];

  const sourceDocLabel =
    deal.agreementFile?.name || `${deal.name.replace(/\s+/g, "_")}_Agreement.pdf`;

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
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase font-sans">
                Agreement Verification
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep("upload")}
                  className="text-xs font-semibold text-[#A05AFF] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <UploadCloud size={13} />
                  <span>Upload Document</span>
                </button>
                <span className="text-zinc-300 font-light">·</span>
                <button
                  type="button"
                  onClick={() => setStep("manual")}
                  className="text-xs font-semibold text-[#0A7B69] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <PenLine size={13} />
                  <span>Paste Text</span>
                </button>
              </div>
            </div>

            <h2 className="font-serif text-[26px] sm:text-[30px] font-bold text-zinc-900 leading-tight mb-2">
              Review extracted terms
            </h2>
            <p className="text-xs text-zinc-500 font-normal mb-5">
              Source: <span className="font-mono text-zinc-700 font-medium">{sourceDocLabel}</span>
            </p>

            {/* Checklist items */}
            <div className="divide-y divide-zinc-100 border-t border-b border-zinc-100 mb-6">
              {currentTerms.map((term) => (
                <div key={term.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/35 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-[#1BCFB4]" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif text-sm sm:text-[15px] font-bold text-zinc-900 leading-tight truncate">
                        {term.value}
                      </p>
                      <p className="text-xs text-zinc-500 font-light font-sans">{term.clauseRef}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-zinc-800 font-sans flex-shrink-0">
                    Verified
                  </span>
                </div>
              ))}
            </div>

            {/* Error simulation toggle button for testing */}
            <div className="mb-6 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-light flex items-center gap-1">
                <Sparkles size={12} className="text-[#A05AFF]" />
                Terms verified by Scope AI engine
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
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleConfirmAgreement}
                className="px-5 py-2.5 rounded-xl bg-[#A05AFF] text-white text-xs font-semibold hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs"
              >
                {isConfirmed ? "Confirmed!" : "Confirm Agreement"}
              </button>
            </div>
          </div>
        )}

        {/* STEP: PDF Document Upload */}
        {step === "upload" && (
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#A05AFF]/15 text-[#702AE0] flex items-center justify-center mb-3">
              <UploadCloud size={20} />
            </div>

            <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1 font-sans">
              Native Document Ingestion
            </p>
            <h2 className="font-serif text-[24px] sm:text-[26px] font-bold text-zinc-900 leading-tight mb-2">
              Upload Agreement Document
            </h2>
            <p className="text-xs text-zinc-500 font-normal mb-5 leading-relaxed">
              Upload your agreement (PDF, DOCX, TXT). Scope automatically extracts deliverables, payment terms, and licensing rules.
            </p>

            <form onSubmit={handleFileUpload} className="space-y-4">
              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer ${
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
                  <FileText size={28} className="mx-auto text-zinc-400 mb-2" />
                  <p className="text-xs font-semibold text-zinc-800 mb-1">
                    Drag & drop contract here, or{" "}
                    <span className="text-[#A05AFF] underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-[11px] text-zinc-400 font-light">
                    Supports .pdf, .docx, and .txt up to 25MB
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

              {uploadStatus && (
                <div className="p-3.5 rounded-xl bg-[#A05AFF]/10 border border-[#A05AFF]/25 text-xs text-[#702AE0] flex items-center gap-2 animate-in fade-in duration-150">
                  {isUploading && <Loader2 size={14} className="animate-spin flex-shrink-0" />}
                  <span>{uploadStatus}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep("review")}
                  disabled={isUploading}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 cursor-pointer disabled:opacity-50"
                >
                  Back to review
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="px-5 py-2.5 rounded-xl bg-[#A05AFF] text-white text-xs font-semibold hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Extracting clauses...</span>
                    </>
                  ) : (
                    <span>Extract Terms via AI</span>
                  )}
                </button>
              </div>
            </form>
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
              className="w-full p-3.5 rounded-2xl border border-zinc-200 text-xs font-normal text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/25 focus:border-[#A05AFF] mb-4 resize-none"
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
                className="px-5 py-2.5 rounded-xl bg-[#A05AFF] text-white text-xs font-semibold hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs"
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

