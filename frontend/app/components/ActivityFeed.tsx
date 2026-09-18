"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowUpCircle,
  AlertTriangle,
  CheckCircle2,
  Banknote,
  Clock,
  ArrowUpRight,
  Inbox,
} from "lucide-react";
import type { ActivityItem } from "@/app/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  calendar: <Calendar size={15} className="text-zinc-400" />,
  upload: <ArrowUpCircle size={15} className="text-[#1BCFB4]" />,
  alert: <AlertTriangle size={15} className="text-[#FE9496]" />,
  approve: <CheckCircle2 size={15} className="text-[#1BCFB4]" />,
  money: <Banknote size={15} className="text-zinc-500" />,
  payment: <Banknote size={15} className="text-zinc-400" />,
  license: <Clock size={15} className="text-zinc-400" />,
  change: <ArrowUpRight size={15} className="text-zinc-400" />,
};

interface ActivityFeedProps {
  title: string;
  items: ActivityItem[];
  actionLabel?: string;
  actionVariant?: "link" | "button";
  actionHref?: string;
  allowDemoToggle?: boolean;
}

export default function ActivityFeed({
  title,
  items,
  actionLabel,
  actionVariant = "link",
  actionHref,
  allowDemoToggle = false,
}: ActivityFeedProps) {
  const [isDemoEmpty, setIsDemoEmpty] = useState(false);

  const handleButtonClick = () => {
    if (allowDemoToggle || actionLabel === "Demo state") {
      setIsDemoEmpty((prev) => !prev);
    }
  };

  return (
    <div className="flex-1 bg-white rounded-2xl border border-[#E8E5DC] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] min-w-0 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-[21px] font-bold text-zinc-900 tracking-[-0.01em]">
            {title}
          </h2>
          {actionLabel &&
            (actionVariant === "link" ? (
              actionHref ? (
                <Link
                  href={actionHref}
                  className="text-sm font-semibold text-[#A05AFF] hover:text-[#9E58FF] hover:underline cursor-pointer"
                >
                  {actionLabel}
                </Link>
              ) : (
                <button className="text-sm font-semibold text-[#A05AFF] hover:text-[#9E58FF] hover:underline cursor-pointer">
                  {actionLabel}
                </button>
              )
            ) : (
              <button
                type="button"
                onClick={handleButtonClick}
                className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
              >
                {actionLabel}
              </button>
            ))}
        </div>

        {/* Content Body */}
        {isDemoEmpty ? (
          <div className="relative py-14 flex items-center justify-center min-h-[190px]">
            <div className="absolute left-0 top-3">
              <Inbox size={22} className="text-zinc-500 stroke-[1.75]" />
            </div>
            <p className="text-sm text-zinc-500 font-normal">
              No activity in this view yet.
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-3.5 py-3.5 ${
                  index < items.length - 1 ? "border-b border-zinc-100" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-brand-cream-dark flex items-center justify-center flex-shrink-0">
                  {iconMap[item.icon] || (
                    <Clock size={15} className="text-zinc-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-[14px] font-bold text-zinc-900 truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-sans font-light">{item.subtitle}</p>
                </div>
                <span className="text-xs text-zinc-400 font-sans font-light flex-shrink-0">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
