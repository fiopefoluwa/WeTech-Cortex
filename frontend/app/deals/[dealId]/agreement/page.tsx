"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DealHeader from "@/app/components/DealHeader";
import TermCard from "@/app/components/TermCard";
import AgreementThread from "@/app/components/AgreementThread";
import SourceEvidenceModal from "@/app/components/SourceEvidenceModal";
import ReviewExtractionModal from "@/app/components/ReviewExtractionModal";
import { useDeal } from "@/app/context/DealContext";
import {
  agreementTerms as initialTerms,
  threadEvents,
} from "@/app/lib/demo-data";
import type { ExtractedTerm, ThreadEvent } from "@/app/lib/types";

export default function AgreementPage() {
  const params = useParams();
  const dealId = (params?.dealId as string) || "1";
  const { getDeal } = useDeal();
  const deal = getDeal(dealId);
  const isCustomDeal = String(deal.id) !== "1";

  const customTerms: ExtractedTerm[] = [
    {
      id: "scope",
      label: "SCOPE",
      value: deal.name,
      clauseRef: "Section 1.1",
      excerpt: `Creative services for ${deal.brandName} partnership. Campaign focus: ${deal.description}`,
      confidence: 99,
      sourceDoc: `${deal.name.replace(/\s+/g, "_")}_Agreement.pdf`,
    },
    {
      id: "deliverables",
      label: "DELIVERABLES",
      value: deal.description,
      clauseRef: "Section 2.1",
      excerpt: `Key deliverables agreed between ${deal.brandName} and ${deal.creatorName}: ${deal.description}.`,
      confidence: 98,
      sourceDoc: `${deal.name.replace(/\s+/g, "_")}_Agreement.pdf`,
    },
    {
      id: "financial",
      label: "FINANCIAL TERMS",
      value: `₦${deal.totalAmount.toLocaleString()} total`,
      clauseRef: "Section 3.1",
      excerpt: `Agreed total compensation of ₦${deal.totalAmount.toLocaleString()} NGN held in Scope escrow and disbursed upon deliverable approval.`,
      confidence: 100,
      sourceDoc: `${deal.name.replace(/\s+/g, "_")}_Agreement.pdf`,
    },
    {
      id: "revisions",
      label: "REVISION RULES",
      value: "1 revision per deliverable",
      clauseRef: "Section 4.2",
      excerpt: "Includes 1 standard round of consolidated review feedback within 48 hours of deliverable upload.",
      confidence: 95,
      sourceDoc: `${deal.name.replace(/\s+/g, "_")}_Agreement.pdf`,
    },
    {
      id: "licensing",
      label: "LICENSING",
      value: "Organic usage · 30 days",
      clauseRef: "Section 5.1",
      excerpt: `Usage rights granted to ${deal.brandName} for organic distribution on specified social channels for thirty (30) days.`,
      confidence: 97,
      sourceDoc: `${deal.name.replace(/\s+/g, "_")}_Agreement.pdf`,
    },
    {
      id: "restrictions",
      label: "RESTRICTIONS",
      value: "No unauthorized paid ads · Nigeria",
      clauseRef: "Section 6.1",
      excerpt: "Content may not be boosted into paid advertising campaigns without an active RightsGuard license extension.",
      confidence: 96,
      sourceDoc: `${deal.name.replace(/\s+/g, "_")}_Agreement.pdf`,
    },
  ];

  const [terms, setTerms] = useState<ExtractedTerm[]>(isCustomDeal ? customTerms : initialTerms);
  const [selectedTerm, setSelectedTerm] = useState<ExtractedTerm | null>(null);
  const [extractionModalOpen, setExtractionModalOpen] = useState(false);

  const displayEvents: ThreadEvent[] = isCustomDeal
    ? [
        {
          id: "custom-thread-1",
          date: "INITIAL TERMS",
          title: "Agreement Created",
          details: [deal.description, `₦${deal.totalAmount.toLocaleString()} total`],
        },
        {
          id: "custom-thread-2",
          date: "CURRENT STATUS",
          title: `${deal.name} Active`,
          details: [`${deal.brandName} · ${deal.creatorName}`, "Pending first milestone"],
          isCurrent: true,
          isHighlighted: true,
        },
      ]
    : threadEvents;

  const handleTermsExtracted = (data: unknown) => {
    if (data && typeof data === "object" && "terms" in data && Array.isArray((data as { terms: ExtractedTerm[] }).terms)) {
      setTerms((data as { terms: ExtractedTerm[] }).terms);
    }
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
        onReviewExtraction={() => setExtractionModalOpen(true)}
        dealId={dealId}
      />

      {/* Extracted Term cards grid (6 cards - 2 columns matching mockup) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {terms.map((term) => (
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
        <AgreementThread events={displayEvents} showHeader={false} />
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
      />
    </div>
  );
}
