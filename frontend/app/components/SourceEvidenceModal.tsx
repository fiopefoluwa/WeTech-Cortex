"use client";

import { X, FileText, CheckCircle2, ShieldCheck, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { ExtractedTerm } from "@/app/lib/types";

interface SourceEvidenceModalProps {
  term: ExtractedTerm | null;
  onClose: () => void;
}

export default function SourceEvidenceModal({
  term,
  onClose,
}: SourceEvidenceModalProps) {
  const [copied, setCopied] = useState(false);

  if (!term) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(term.excerpt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-[#FBF9F5]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A05AFF]" />
            <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] text-zinc-500 uppercase font-sans">
              Contract Source Verification · {term.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Term Title */}
          <div className="mb-5">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 leading-snug mb-1.5">
              {term.value}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 font-normal">
                <FileText size={13} className="text-zinc-500" />
                {term.sourceDoc}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#4BCBEB]/15 text-[#027E9F] font-medium border border-[#4BCBEB]/30">
                {term.clauseRef}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1BCFB4]/15 text-[#0A7B69] font-medium border border-[#1BCFB4]/30">
                <CheckCircle2 size={12} className="text-[#1BCFB4]" />
                Verified Term
              </span>
            </div>
          </div>

          {/* Raw contract evidence citation */}
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-sans">
              Contract Source Excerpt
            </p>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E5DC] relative font-mono text-[13px] text-zinc-800 leading-relaxed">
              <span className="text-zinc-400 select-none mr-2 font-serif italic">“</span>
              <span className="bg-[#4BCBEB]/15 px-1 py-0.5 rounded text-zinc-900 font-sans font-normal border-b border-[#4BCBEB]/40">
                {term.excerpt}
              </span>
              <span className="text-zinc-400 select-none ml-1 font-serif italic">”</span>
            </div>
          </div>

          {/* Verification explainability note */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#1BCFB4]/10 border border-[#1BCFB4]/25 text-xs text-emerald-950">
            <ShieldCheck size={18} className="text-[#1BCFB4] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Agreement Term Active</p>
              <p className="text-emerald-950/80 font-normal leading-relaxed">
                This term serves as the baseline agreement constraint. When messages, uploads, or revision requests deviate from this boundary, Scope automatically flags a scope adjustment notice.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-zinc-50 border-t border-zinc-100">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            {copied ? <Check size={14} className="text-[#1BCFB4]" /> : <Copy size={14} />}
            <span>{copied ? "Copied clause" : "Copy excerpt"}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
