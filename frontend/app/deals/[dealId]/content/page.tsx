"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DealHeader from "@/app/components/DealHeader";
import { useDeal } from "@/app/context/DealContext";
import {
  demoContentItems,
} from "@/app/lib/demo-data";
import type { ContentItem } from "@/app/lib/types";
import { CheckCircle2, Clock, AlertTriangle, X, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ContentPage() {
  const params = useParams();
  const dealId = (params?.dealId as string) || "1";
  const { getDeal } = useDeal();
  const deal = getDeal(dealId);
  const isCustomDeal = String(deal.id) !== "1";

  const customContentItems: ContentItem[] = [
    {
      id: "cnt-custom-1",
      title: `${deal.name} Asset #01`,
      platform: "TikTok · Instagram",
      submission: "In Production",
      licenseStatus: "Active",
      licenseVariant: "green",
      termsSummary: `Primary content deliverable for ${deal.brandName}: ${deal.description}`,
    },
  ];

  const contentItems = isCustomDeal ? customContentItems : demoContentItems;
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);

  const getLicenseBadge = (status: ContentItem["licenseStatus"]) => {
    switch (status) {
      case "Expired":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FE9496]/20 text-[#B82B30] border border-[#FE9496]/45">
            <AlertTriangle size={12} className="text-[#B82B30]" />
            Expired
          </span>
        );
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/35">
            <CheckCircle2 size={12} className="text-[#0A7B69]" />
            Active
          </span>
        );
      case "Expiring soon":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#4BCBEB]/15 text-[#027E9F] border border-[#4BCBEB]/35">
            <Clock size={12} className="text-[#027E9F]" />
            Expiring soon
          </span>
        );
    }
  };

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
      <div className="mb-6">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1.5">
          Content Library
        </p>
        <h1 className="font-serif text-[26px] md:text-[28px] font-bold text-zinc-900 leading-tight mb-1 tracking-[-0.01em]">
          Work in this deal
        </h1>
        <p className="text-xs text-zinc-500 font-normal">
          Every asset keeps its review, licensing, and agreement context close by.
        </p>
      </div>

      {/* Content Table Card */}
      <div className="bg-white rounded-2xl border border-[#E8E5DC] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 pb-3">
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Content
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Platform
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Submission
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  License
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 text-right font-sans">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {contentItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-50/60 transition-colors group"
                >
                  {/* Content Name */}
                  <td className="py-4.5 px-4">
                    <span className="font-serif font-bold text-zinc-900 text-[14.5px]">
                      {item.title}
                    </span>
                  </td>

                  {/* Platform */}
                  <td className="py-4.5 px-4">
                    <span className="text-xs text-zinc-600 font-medium">
                      {item.platform}
                    </span>
                  </td>

                  {/* Submission Status */}
                  <td className="py-4.5 px-4">
                    <span className="text-xs text-zinc-600">
                      {item.submission}
                    </span>
                  </td>

                  {/* License Badge */}
                  <td className="py-4.5 px-4">
                    {getLicenseBadge(item.licenseStatus)}
                  </td>

                  {/* View Terms Button */}
                  <td className="py-4.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="px-3.5 py-1.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
                    >
                      View terms
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Terms Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-[#FBF9F5]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#A05AFF]" />
                <h3 className="text-xs font-semibold text-zinc-900 font-sans">
                  Licensing Terms · {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase font-sans">
                  Authorized Platform: {selectedItem.platform}
                </span>
                <h4 className="font-serif text-xl font-bold text-zinc-900 mt-1 mb-1">
                  {selectedItem.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-normal">License Status:</span>
                  {getLicenseBadge(selectedItem.licenseStatus)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E5DC] text-xs text-zinc-800 leading-relaxed font-sans font-normal">
                {selectedItem.termsSummary}
              </div>

              {selectedItem.licenseStatus === "Expired" && (
                <div className="p-3 rounded-xl bg-[#FE9496]/15 border border-[#FE9496]/35 text-xs text-[#B82B30]">
                  <p className="font-semibold mb-0.5">Commercial Breach Detected</p>
                  <p className="text-[#8B1A1E] text-[11px] leading-relaxed font-normal">
                    This video was detected in an active paid Instagram ad campaign after the organic term expired on Oct 1.
                  </p>
                  <Link
                    href="/deals/1/licensing"
                    className="inline-flex items-center gap-1 font-semibold text-[#A05AFF] hover:underline mt-2 text-xs"
                  >
                    Open in Licensing Workspace →
                  </Link>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-100 text-right">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
