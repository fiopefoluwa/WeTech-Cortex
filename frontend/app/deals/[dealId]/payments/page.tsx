"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import DealHeader from "@/app/components/DealHeader";
import { useUser } from "@/app/context/UserContext";
import {
  demoDeal,
  demoBrand,
  demoCreator,
  demoPayments,
} from "@/app/lib/demo-data";
import type { PaymentItem } from "@/app/lib/types";
import { CheckCircle2, Clock, ArrowRight, Receipt, Wallet, CreditCard } from "lucide-react";

export default function PaymentsPage() {
  const params = useParams();
  const dealId = (params?.dealId as string) || "1";
  const { role, switchRole } = useUser();

  const getStatusBadge = (status: PaymentItem["status"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/35">
            <CheckCircle2 size={12} className="text-[#1BCFB4]" />
            <span>{role === "brand" ? "Disbursed" : "Received"}</span>
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#4BCBEB]/15 text-[#027E9F] border border-[#4BCBEB]/35">
            <Clock size={12} className="text-[#027E9F]" />
            <span>{role === "brand" ? "In Escrow" : "Scheduled"}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-12">
      {/* Top Deal Header */}
      <DealHeader
        dealName={demoDeal.name}
        brandName={demoBrand.name}
        creatorName={demoCreator.name}
        status={demoDeal.status}
        agreementUpdated={demoDeal.agreementUpdated}
        dealId={dealId}
      />

      {/* Page Title Section */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1.5 font-sans">
            {role === "brand" ? "Payment Outflows" : "Creator Earnings"}
          </p>
          <h1 className="font-serif text-[22px] sm:text-[25px] font-bold text-zinc-900 leading-tight mb-1 tracking-[-0.01em]">
            Payments
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            {role === "brand"
              ? "Payments authorized and disbursed by Northstar Coffee."
              : "Payouts received and scheduled for Amara Okafor."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 mt-1">
          <div className="flex items-center gap-2.5 bg-white border border-zinc-200 px-4 py-2 rounded-xl shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                role === "brand" ? "bg-[#A05AFF]" : "bg-[#1BCFB4]"
              }`}
            />
            <span className="text-xs text-zinc-600 font-normal">
              Viewing as:{" "}
              <strong className="text-zinc-900 font-semibold">
                {role === "brand" ? "Brand (Payer)" : "Creator (Payee)"}
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
        </div>
      </div>

      {/* Financial Summary Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-[#E8E5DC] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1 font-sans">
            {role === "brand" ? "Total Committed" : "Total Contract Value"}
          </p>
          <p className="font-serif text-2xl font-bold text-zinc-900">₦340,000</p>
          <p className="text-[11px] text-zinc-500 font-light mt-1">Includes CR #02 adjustment</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E5DC] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1 font-sans">
            {role === "brand" ? "Disbursed to Date" : "Earnings Received"}
          </p>
          <p className="font-serif text-2xl font-bold text-[#0A7B69]">₦40,000</p>
          <p className="text-[11px] text-zinc-500 font-light mt-1">CR #02 settled Sept 14</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E5DC] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1 font-sans">
            {role === "brand" ? "Held in Milestone Escrow" : "Scheduled on Completion"}
          </p>
          <p className="font-serif text-2xl font-bold text-[#702AE0]">₦300,000</p>
          <p className="text-[11px] text-zinc-500 font-light mt-1">Releases upon deliverable verification</p>
        </div>
      </div>

      {/* Payments Table Card */}
      <div className="bg-white rounded-2xl border border-[#E8E5DC] p-4 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-100 pb-3">
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Agreement Event
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Financial Impact
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Payment
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Status
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 text-right font-sans">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {demoPayments.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-50/60 transition-colors group"
                >
                  {/* Agreement Event */}
                  <td className="py-4.5 px-4">
                    <span className="font-serif font-bold text-zinc-900 text-[14.5px]">
                      {item.agreementEvent}
                    </span>
                  </td>

                  {/* Financial Impact */}
                  <td className="py-4.5 px-4">
                    <span className="font-serif font-bold text-sm text-zinc-800">
                      {item.financialImpact}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="py-4.5 px-4">
                    <span className="text-xs text-zinc-600 font-light">
                      {item.payment}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4.5 px-4">{getStatusBadge(item.status)}</td>

                  {/* View Update Button -> Links to agreement page */}
                  <td className="py-4.5 px-4 text-right">
                    <Link
                      href={`/deals/${dealId}/agreement`}
                      className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>View terms</span>
                      <ArrowRight size={13} className="text-zinc-400" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Relationship Explainer Card */}
      <div className="bg-white rounded-2xl border border-[#E8E5DC] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-2 font-sans">
          CONNECTED FINANCIALS
        </p>
        <h2 className="font-serif text-[17px] sm:text-[19px] font-bold text-zinc-900 leading-tight mb-2">
          Agreement event → financial impact → payment → agreement update
        </h2>
        <p className="text-xs text-zinc-500 font-normal leading-relaxed">
          {role === "brand"
            ? "As Northstar Coffee, your disbursements are cryptographically connected to contract clauses. No surprise costs or unauthorized outflows."
            : "As Amara Okafor, every payment you receive is grounded in written contract terms. Once deliverables are verified, funds release automatically."}
        </p>
      </div>
    </div>
  );
}
