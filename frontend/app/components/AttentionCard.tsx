"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { AttentionItem } from "@/app/lib/types";

interface AttentionCardProps {
  item: AttentionItem;
  dealId?: string;
}

export default function AttentionCard({ item, dealId: propDealId }: AttentionCardProps) {
  const params = useParams();
  const dealId = propDealId || (params?.dealId as string) || "1";

  const targetHref =
    item.type === "change_request"
      ? `/deals/${dealId}/change-requests`
      : `/deals/${dealId}/licensing`;

  const borderClass =
    item.type === "change_request"
      ? "border-2 border-[#A05AFF]"
      : "border border-[#E8E5DC]";

  const statusStyles: Record<string, string> = {
    green: "bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/30",
    red: "bg-[#FE9496]/20 text-[#B82B30] border border-[#FE9496]/40",
    orange: "bg-[#FE9496]/20 text-[#B82B30] border border-[#FE9496]/40",
  };

  const StatusIcon =
    item.statusColor === "green"
      ? CheckCircle2
      : item.statusColor === "red"
      ? AlertCircle
      : Clock;

  return (
    <div
      className={`flex-1 rounded-2xl ${borderClass} bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] min-w-0 flex flex-col justify-between`}
    >
      <div>
        {/* Status row */}
        <div className="flex items-center justify-between mb-3.5 gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${statusStyles[item.statusColor]}`}
          >
            <StatusIcon size={12} />
            <span>{item.status}</span>
          </span>
          <span className="font-serif text-base font-bold text-zinc-900">
            {item.amount || item.label}
          </span>
        </div>

        {/* Content */}
        <h3 className="font-serif text-[17px] sm:text-[18px] font-bold text-zinc-900 mb-1.5 leading-snug">
          {item.title}
        </h3>
        <p className="text-xs text-zinc-600 font-normal mb-5 leading-relaxed font-sans">
          {item.description}
        </p>
      </div>

      {/* Action button linking to respective deal page */}
      <div>
        {item.actionVariant === "primary" ? (
          <Link
            href={targetHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A05AFF] text-white text-xs font-semibold hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs"
          >
            <span>{item.actionLabel}</span>
            <ArrowRight size={13} />
          </Link>
        ) : (
          <Link
            href={targetHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-800 text-xs font-semibold hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
          >
            <span>{item.actionLabel}</span>
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}
