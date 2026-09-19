"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Receipt } from "lucide-react";
import DealHeader from "@/app/components/DealHeader";
import AgreementEvidenceDrawer, {
  type EvidenceType,
} from "@/app/components/AgreementEvidenceDrawer";
import { useUser } from "@/app/context/UserContext";
import { useDeal } from "@/app/context/DealContext";
import {
  demoChangeRequest,
} from "@/app/lib/demo-data";

export default function ChangeRequestsPage() {
  const params = useParams();
  const dealId = (params?.dealId as string) || "1";
  const { role, switchRole } = useUser();
  const { getDeal } = useDeal();
  const deal = getDeal(dealId);
  const [evidenceDrawer, setEvidenceDrawer] = useState<EvidenceType | null>(null);

  const cr = demoChangeRequest;

  return (
    <div className="pb-12">
      {/* Top Deal Header */}
      <DealHeader
        dealName={deal.name}
        brandName={deal.brandName}
        creatorName={deal.creatorName}
        status={deal.status}
        agreementUpdated={deal.agreementUpdated}
        dealId={dealId}
      />

      {/* Page Title Section */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1.5 font-sans">
            Collaborative Change
          </p>
          <h1 className="font-serif text-[22px] sm:text-[25px] font-bold text-zinc-900 leading-tight mb-1 tracking-[-0.01em]">
            Change Request {cr.code}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            A shared record of work that changed, why it changed, and what was agreed in response.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {/* Role badge */}
          <div className="flex items-center gap-2.5 bg-white border border-zinc-200 px-4 py-2 rounded-xl shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                role === "brand" ? "bg-[#A05AFF]" : "bg-[#1BCFB4]"
              }`}
            />
            <span className="text-xs text-zinc-600 font-normal">
              Perspective:{" "}
              <strong className="text-zinc-900 font-semibold">
                {role === "brand" ? "Brand" : "Creator"}
              </strong>
            </span>
            <button
              type="button"
              onClick={switchRole}
              className="text-[11px] text-[#A05AFF] hover:underline cursor-pointer ml-1 font-medium"
            >
              (switch)
            </button>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/35">
            <CheckCircle2 size={13} className="text-[#1BCFB4]" />
            <span>{cr.status}</span>
          </span>
        </div>
      </div>

      {/* Hero Change Request Card */}
      <div className="bg-white rounded-2xl border border-[#E8E5DC] p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        {/* Top Header Row inside Card */}
        <div className="flex items-start justify-between gap-6 pb-6 border-b border-zinc-100 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase font-sans">
                Additional Deliverable
              </span>
              <span className="text-zinc-300 font-light">·</span>
              <span className="text-xs text-[#A05AFF] font-medium">
                {role === "brand" ? "Approved by You" : "Requested by You"}
              </span>
            </div>
            <h2 className="font-serif text-[20px] sm:text-[23px] font-bold text-zinc-900 leading-tight mb-1">
              {cr.title}
            </h2>
            <p className="text-xs text-zinc-500 font-light">
              {role === "brand"
                ? "Requested by Amara Okafor · Approved & Settled by Northstar Coffee"
                : "Requested by You · Approved & Settled by Northstar Coffee"}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="font-serif text-[24px] sm:text-[28px] font-bold text-zinc-900 leading-none">
              {cr.amount}
            </p>
            {cr.paidDate && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0A7B69] bg-[#1BCFB4]/15 border border-[#1BCFB4]/35 px-2.5 py-0.5 rounded-full mt-2">
                <Receipt size={11} className="text-[#1BCFB4]" />
                <span>{role === "brand" ? `Disbursed ${cr.paidDate}` : `Credited ${cr.paidDate}`}</span>
              </span>
            )}
          </div>
        </div>

        {/* 2-Column Rationale Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 py-6">
          {/* Why this request exists */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-2 font-sans">
              Why this request exists
            </p>
            <p className="text-xs text-zinc-700 font-normal leading-relaxed mb-4">
              {cr.whyExists}
            </p>

            {/* Clickable Deliverables §2 callout box */}
            <button
              type="button"
              onClick={() => setEvidenceDrawer("deliverables")}
              className="w-full text-left p-3.5 rounded-r-xl rounded-l-xs bg-[#4BCBEB]/10 border-l-4 border-l-[#4BCBEB] hover:bg-[#4BCBEB]/20 transition-colors group cursor-pointer block"
            >
              <span className="font-semibold text-[#027E9F] group-hover:underline underline-offset-2 mb-0.5 block text-xs">
                {cr.whyClause.ref}
              </span>
              <span className="text-zinc-700 font-normal text-xs block">
                {cr.whyClause.text}
              </span>
            </button>
          </div>

          {/* What happens when approved */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-2 font-sans">
              What happens when approved
            </p>
            <p className="text-xs text-zinc-700 font-normal leading-relaxed mb-4">
              {cr.whatHappens}
            </p>

            {/* Clickable Agreement update callout box */}
            <button
              type="button"
              onClick={() => setEvidenceDrawer("update")}
              className="w-full text-left p-3.5 rounded-r-xl rounded-l-xs bg-[#A05AFF]/10 border-l-4 border-l-[#A05AFF] hover:bg-[#A05AFF]/15 transition-colors group cursor-pointer block"
            >
              <span className="font-semibold text-[#702AE0] group-hover:underline underline-offset-2 mb-0.5 block text-xs">
                {cr.whatClause.ref}
              </span>
              <span className="text-zinc-700 font-normal text-xs block">
                {cr.whatClause.text}
              </span>
            </button>
          </div>
        </div>

        {/* View updated agreement button */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between flex-wrap gap-3">
          <Link
            href={`/deals/${dealId}/agreement`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors shadow-2xs cursor-pointer"
          >
            <span>View updated agreement</span>
            <ArrowRight size={13} />
          </Link>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-light">
            <ShieldCheck size={14} className="text-emerald-700" />
            <span>Recorded in Deal Room audit log</span>
          </div>
        </div>
      </div>

      {/* Right Slide-in Agreement Evidence Modal Drawer */}
      <AgreementEvidenceDrawer
        isOpen={!!evidenceDrawer}
        onClose={() => setEvidenceDrawer(null)}
        type={evidenceDrawer}
        dealName={deal.name}
      />
    </div>
  );
}
