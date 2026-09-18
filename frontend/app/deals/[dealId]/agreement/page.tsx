"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DealHeader from "@/app/components/DealHeader";
import TermCard from "@/app/components/TermCard";
import AgreementThread from "@/app/components/AgreementThread";
import SourceEvidenceModal from "@/app/components/SourceEvidenceModal";
import ReviewExtractionModal from "@/app/components/ReviewExtractionModal";
import {
  demoDeal,
  demoBrand,
  demoCreator,
  agreementTerms as initialTerms,
  threadEvents,
} from "@/app/lib/demo-data";
import type { ExtractedTerm } from "@/app/lib/types";

export default function AgreementPage() {
  const params = useParams();
  const dealId = (params?.dealId as string) || "1";

  const [terms, setTerms] = useState<ExtractedTerm[]>(initialTerms);
  const [selectedTerm, setSelectedTerm] = useState<ExtractedTerm | null>(null);
  const [extractionModalOpen, setExtractionModalOpen] = useState(false);

  const handleTermsExtracted = (data: unknown) => {
    if (data && typeof data === "object" && "terms" in data && Array.isArray((data as { terms: ExtractedTerm[] }).terms)) {
      setTerms((data as { terms: ExtractedTerm[] }).terms);
    }
  };

  return (
    <div className="pb-12">
      {/* Deal Header */}
      <DealHeader
        dealName={demoDeal.name}
        brandName={demoBrand.name}
        creatorName={demoCreator.name}
        status={demoDeal.status}
        agreementUpdated={demoDeal.agreementUpdated}
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
        <AgreementThread events={threadEvents} showHeader={false} />
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
