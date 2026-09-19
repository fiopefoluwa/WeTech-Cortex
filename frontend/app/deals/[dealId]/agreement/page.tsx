"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FileText, UploadCloud, Sparkles, CheckCircle2 } from "lucide-react";
import DealHeader from "@/app/components/DealHeader";
import TermCard from "@/app/components/TermCard";
import AgreementThread from "@/app/components/AgreementThread";
import SourceEvidenceModal from "@/app/components/SourceEvidenceModal";
import ReviewExtractionModal, { type ModalStep } from "@/app/components/ReviewExtractionModal";
import { useDeal } from "@/app/context/DealContext";
import { parseTermsPayload } from "@/app/lib/term-parser";
import {
  agreementTerms as initialTerms,
  threadEvents,
} from "@/app/lib/demo-data";
import type { ExtractedTerm, ThreadEvent } from "@/app/lib/types";

export default function AgreementPage() {
  const params = useParams();
  const dealId = (params?.dealId as string) || "1";
  const { getDeal, updateDeal } = useDeal();
  const deal = getDeal(dealId);
  const isCustomDeal = String(deal.id) !== "1";

  const sourceDocName =
    deal.agreementFile?.name || `${deal.name.replace(/\s+/g, "_")}_Agreement.pdf`;

  const customTerms: ExtractedTerm[] = deal.extractedTerms || [
    {
      id: "scope",
      label: "SCOPE",
      value: deal.name,
      clauseRef: "Section 1.1",
      excerpt: `Creative services for ${deal.brandName} partnership. Campaign focus: ${deal.description}`,
      confidence: 99,
      sourceDoc: sourceDocName,
    },
    {
      id: "deliverables",
      label: "DELIVERABLES",
      value: deal.description,
      clauseRef: "Section 2.1",
      excerpt: `Key deliverables agreed between ${deal.brandName} and ${deal.creatorName}: ${deal.description}.`,
      confidence: 98,
      sourceDoc: sourceDocName,
    },
    {
      id: "financial",
      label: "FINANCIAL TERMS",
      value: `₦${deal.totalAmount.toLocaleString()} total`,
      clauseRef: "Section 3.1",
      excerpt: `Agreed total compensation of ₦${deal.totalAmount.toLocaleString()} NGN held in Scope escrow and disbursed upon deliverable approval.`,
      confidence: 100,
      sourceDoc: sourceDocName,
    },
    {
      id: "revisions",
      label: "REVISION RULES",
      value: "1 revision per deliverable",
      clauseRef: "Section 4.2",
      excerpt: "Includes 1 standard round of consolidated review feedback within 48 hours of deliverable upload.",
      confidence: 95,
      sourceDoc: sourceDocName,
    },
    {
      id: "licensing",
      label: "LICENSING",
      value: "Organic usage · 30 days",
      clauseRef: "Section 5.1",
      excerpt: `Usage rights granted to ${deal.brandName} for organic distribution on specified social channels for thirty (30) days.`,
      confidence: 97,
      sourceDoc: sourceDocName,
    },
    {
      id: "restrictions",
      label: "RESTRICTIONS",
      value: "No unauthorized paid ads · Nigeria",
      clauseRef: "Section 6.1",
      excerpt: "Content may not be boosted into paid advertising campaigns without an active RightsGuard license extension.",
      confidence: 96,
      sourceDoc: sourceDocName,
    },
  ];

  const activeTerms =
    deal.extractedTerms && deal.extractedTerms.length > 0
      ? deal.extractedTerms
      : isCustomDeal
      ? customTerms
      : initialTerms;

  const [selectedTerm, setSelectedTerm] = useState<ExtractedTerm | null>(null);
  const [extractionModalOpen, setExtractionModalOpen] = useState(false);
  const [modalInitialStep, setModalInitialStep] = useState<ModalStep>("review");

  const displayEvents: ThreadEvent[] = isCustomDeal
    ? [
        {
          id: "custom-thread-1",
          date: "DOCUMENT INGESTED",
          title: deal.agreementFile ? `Attached: ${deal.agreementFile.name}` : "Agreement Created",
          details: [deal.description, `₦${deal.totalAmount.toLocaleString()} total compensation`],
        },
        {
          id: "custom-thread-2",
          date: "CURRENT STATUS",
          title: `${deal.name} Active`,
          details: [`${deal.brandName} · ${deal.creatorName}`, "Escrow protection active"],
          isCurrent: true,
          isHighlighted: true,
        },
      ]
    : threadEvents;

  const handleTermsExtracted = (data: unknown) => {
    const parsed = parseTermsPayload(data, {
      dealName: deal.name,
      brandName: deal.brandName,
      creatorName: deal.creatorName,
      amount: deal.totalAmount,
      sourceDocName:
        (data as { filename?: string })?.filename ||
        deal.agreementFile?.name ||
        `${deal.name.replace(/\s+/g, "_")}_Agreement.pdf`,
    });
    updateDeal(dealId, { extractedTerms: parsed });
  };

  return (
    <div className="pb-12">
      {/* Deal Header */}
      <DealHeader
        dealName={deal.name}
        brandName={deal.brandName}
        creatorName={deal.creatorName}
        status={deal.status}
        agreementUpdated={deal.agreementUpdated}
        onReviewExtraction={() => {
          setModalInitialStep("review");
          setExtractionModalOpen(true);
        }}
        dealId={dealId}
      />

      {/* Document Source Banner */}
      <div className="bg-[#FAF8F5] border border-[#E8E5DC] rounded-2xl p-4 sm:p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E5DC] flex items-center justify-center text-[#A05AFF] shadow-2xs flex-shrink-0">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-zinc-400 font-sans">
                Active Agreement Document
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                <CheckCircle2 size={10} className="text-emerald-600" />
                Parsed & Verified
              </span>
            </div>
            <p className="font-serif text-[15px] font-bold text-zinc-900 mt-0.5 truncate">
              {sourceDocName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setModalInitialStep("upload");
              setExtractionModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
          >
            <UploadCloud size={14} className="text-[#A05AFF]" />
            <span>Upload New Agreement</span>
          </button>
          <button
            onClick={() => {
              setModalInitialStep("review");
              setExtractionModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#A05AFF] text-white hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-2xs"
          >
            <Sparkles size={14} />
            <span>Review All Clauses</span>
          </button>
        </div>
      </div>

      {/* Extracted Term cards grid (6 cards - 2 columns matching mockup) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {activeTerms.map((term) => (
          <TermCard
            key={term.id || term.label}
            label={term.label}
            value={term.value}
            onViewEvidence={() => setSelectedTerm(term)}
          />
        ))}
      </section>

      {/* Agreement Thread (Evolution Timeline matching mockup) */}
      <section>
        <AgreementThread events={displayEvents} showHeader={false} dealId={dealId} />
      </section>

      {/* Source Evidence Modal */}
      <SourceEvidenceModal
        term={selectedTerm}
        onClose={() => setSelectedTerm(null)}
      />

      {/* Review Extraction Modal (connected to FastAPI backend) */}
      <ReviewExtractionModal
        dealId={dealId}
        isOpen={extractionModalOpen}
        onClose={() => setExtractionModalOpen(false)}
        onTermsExtracted={handleTermsExtracted}
        initialStep={modalInitialStep}
      />
    </div>
  );
}

