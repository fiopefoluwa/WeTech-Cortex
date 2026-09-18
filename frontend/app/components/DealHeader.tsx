"use client";

import { useState } from "react";
import Link from "next/link";
import { FileCheck, FileSearch } from "lucide-react";
import ReviewExtractionModal from "./ReviewExtractionModal";

interface DealHeaderProps {
  dealName: string;
  brandName: string;
  creatorName: string;
  status: string;
  agreementUpdated?: boolean;
  onReviewExtraction?: () => void;
  dealId?: string;
}

export default function DealHeader({
  dealName,
  brandName,
  creatorName,
  status,
  agreementUpdated,
  onReviewExtraction,
  dealId = "1",
}: DealHeaderProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleReviewClick = () => {
    if (onReviewExtraction) {
      onReviewExtraction();
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <div className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1.5 font-sans">
          Deal Room · {status}
        </p>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-[22px] sm:text-[25px] font-bold text-zinc-900 leading-tight tracking-[-0.01em]">
              {dealName}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-normal">
              {brandName} · <span className="text-zinc-400 font-light">Brand</span>
              {"  /  "}
              {creatorName} · <span className="text-zinc-400 font-light">Creator</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 mt-1 flex-wrap">
            {/* Agreement updated badge */}
            {agreementUpdated && (
              <Link
                href={`/deals/${dealId}/change-requests`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-[#A05AFF]/30 text-[#702AE0] bg-[#A05AFF]/10 hover:bg-[#A05AFF]/15 transition-colors cursor-pointer shadow-2xs"
                title="View agreement update"
              >
                <FileCheck size={14} className="text-[#A05AFF]" />
                <span>Agreement updated</span>
              </Link>
            )}

            {/* Review extraction button */}
            <button
              onClick={handleReviewClick}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl text-xs font-medium border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
            >
              <FileSearch size={14} className="text-zinc-500" />
              <span>Review terms</span>
            </button>
          </div>
        </div>
      </div>

      <ReviewExtractionModal
        dealId={dealId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
