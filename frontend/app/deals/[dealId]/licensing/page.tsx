"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
  FileVideo,
} from "lucide-react";
import DealHeader from "@/app/components/DealHeader";
import DetectedUsageDrawer from "@/app/components/DetectedUsageDrawer";
import LicenseRenewalModal from "@/app/components/LicenseRenewalModal";
import { useUser } from "@/app/context/UserContext";
import {
  demoDeal,
  demoBrand,
  demoCreator,
  heroLicenseItem,
  otherLicenseItems,
} from "@/app/lib/demo-data";

export default function LicensingPage() {
  const params = useParams();
  const dealId = (params?.dealId as string) || "1";
  const { role, switchRole, setNotification } = useUser();

  const [detectedDrawerOpen, setDetectedDrawerOpen] = useState(false);
  const [renewalModalOpen, setRenewalModalOpen] = useState(false);
  const [isRenewed, setIsRenewed] = useState(false);

  const handleApproveRenewal = () => {
    setIsRenewed(true);
    setNotification("License renewal settled (+₦120,000 for 30-day ad rights).");
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
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1.5 font-sans">
            RightsGuard Protection
          </p>
          <h1 className="font-serif text-[22px] sm:text-[25px] font-bold text-zinc-900 leading-tight mb-1 tracking-[-0.01em]">
            Licensing workspace
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            Usage stays connected to what was agreed — and what actually happened.
          </p>
        </div>

        <div className="flex items-center gap-2.5 mt-1 flex-wrap">
          {/* Role badge */}
          <div className="flex items-center gap-2.5 bg-white border border-zinc-200 px-4 py-2 rounded-xl shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                role === "brand" ? "bg-[#A05AFF]" : "bg-[#1BCFB4]"
              }`}
            />
            <span className="text-xs text-zinc-600 font-normal">
              Role:{" "}
              <strong className="text-zinc-900 font-semibold">
                {role === "brand" ? "Brand Licensee" : "Creator Licensor"}
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

          {isRenewed && (
            <button
              type="button"
              onClick={() => {
                setIsRenewed(false);
                setNotification("Reset license demo state.");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 text-xs font-normal text-zinc-500 bg-white hover:bg-zinc-50 transition-colors cursor-pointer shadow-2xs"
              title="Reset demo state to initial issue"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setDetectedDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
          >
            <ShieldCheck size={15} className="text-zinc-600" />
            <span>Review detected usage</span>
          </button>
        </div>
      </div>

      {/* Hero License Card (Video #01) */}
      <div className="bg-white rounded-2xl border border-[#E8E5DC] p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)] mb-6">
        {/* Header with Title & Badge */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1 font-sans">
              Content Licensing
            </p>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-bold text-zinc-900 leading-tight mb-1">
              {heroLicenseItem.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 font-normal">
              {heroLicenseItem.platforms}
            </p>
          </div>

          {/* Right badge: Renewed / Active vs Expired */}
          {isRenewed ? (
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/35">
              <CheckCircle2 size={16} className="text-[#1BCFB4]" />
              <span className="text-xs font-semibold text-[#0A7B69]">
                Renewed / Active
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FE9496]/20 text-[#B82B30] border border-[#FE9496]/45">
              <AlertTriangle size={13} className="text-[#FE9496]" />
              Expired
            </span>
          )}
        </div>

        {/* 3-Column Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-6 border-t border-zinc-100">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1 font-sans">
              Original Period
            </p>
            <p className="font-serif text-sm sm:text-base font-bold text-zinc-900">
              {heroLicenseItem.originalPeriod}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1 font-sans">
              Actual Use Detected
            </p>
            <p className="font-serif text-sm sm:text-base font-bold text-zinc-900">
              {heroLicenseItem.actualUseDetected}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5 font-light font-sans">
              {heroLicenseItem.detectedDate}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.12em] text-zinc-400 uppercase mb-1 font-sans">
              Current Position
            </p>
            <p className="font-serif text-sm sm:text-base font-bold text-zinc-900">
              {isRenewed
                ? "Paid advertising through Nov 14"
                : heroLicenseItem.currentPosition}
            </p>
          </div>
        </div>

        {/* Bottom Banner Area */}
        {isRenewed ? (
          <div className="rounded-2xl bg-[#1BCFB4]/15 text-emerald-950 px-6 py-4 mt-6 border border-[#1BCFB4]/30">
            <p className="text-xs font-medium text-emerald-950">
              Renewal approved and settled · 30 days of commercial advertising added to Video #01.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#FE9496]/10 border border-[#FE9496]/30 p-5 sm:p-6 mt-2">
            <p className="text-sm font-semibold text-[#B82B30] mb-1">
              {role === "brand"
                ? "Action Required: Content License Exceeded"
                : "RightsGuard Alert: Commercial Use Monitored"}
            </p>
            <p className="text-xs text-zinc-700 font-normal leading-relaxed mb-5">
              {role === "brand"
                ? "Your brand's active Instagram ad exceeds original organic scope (expired Oct 1). Create renewal to maintain full commercial compliance."
                : "Northstar Coffee ran paid ads on Instagram using your video beyond the organic 30-day license. Brand was notified to purchase commercial rights."}
            </p>

            {/* 2 Grounding Clauses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div className="border-l-2 border-l-[#FE9496] pl-3.5 py-0.5">
                <p className="text-xs font-semibold text-[#B82B30] mb-0.5">
                  Licensing §5
                </p>
                <p className="text-xs text-zinc-600 font-normal">
                  “TikTok + Instagram, Organic usage, 30 days”
                </p>
              </div>

              <div className="border-l-2 border-l-[#FE9496] pl-3.5 py-0.5">
                <p className="text-xs font-semibold text-[#B82B30] mb-0.5">
                  Restrictions §6
                </p>
                <p className="text-xs text-zinc-600 font-normal">
                  “No paid advertising”
                </p>
              </div>
            </div>

            {/* CTA Button */}
            {role === "brand" ? (
              <button
                type="button"
                onClick={() => setRenewalModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#A05AFF] text-white text-xs font-semibold hover:bg-[#8E44F8] transition-colors cursor-pointer shadow-xs"
              >
                <span>Create renewal request (₦120,000)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDetectedDrawerOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1BCFB4] text-zinc-950 text-xs font-semibold hover:bg-[#15B099] transition-colors cursor-pointer shadow-xs"
              >
                <span>View evidence and compensation rights</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Other Content Licenses Section */}
      <div className="bg-white rounded-2xl border border-[#E8E5DC] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <h2 className="font-serif text-[18px] sm:text-[20px] font-bold text-zinc-900 mb-4">
          Other content licenses
        </h2>

        <div className="divide-y divide-zinc-100">
          {otherLicenseItems.map((item) => (
            <div
              key={item.id}
              className="py-4 flex items-center justify-between gap-4 flex-wrap hover:bg-zinc-50/50 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-serif font-bold text-sm text-zinc-900">
                  {item.title}
                </span>
                <span className="text-xs text-zinc-500 font-normal">
                  {item.platforms}
                </span>
                <span className="text-zinc-300 font-light">·</span>
                <span className="text-xs text-zinc-500 font-normal">{item.usageType}</span>
              </div>

              <div className="flex items-center gap-3">
                {item.status === "Active" ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 size={12} className="text-emerald-700" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                    <Clock size={12} className="text-amber-700" />
                    <span>Expiring soon</span>
                  </span>
                )}

                <Link
                  href={`/deals/${dealId}/content`}
                  className="px-4.5 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors shadow-2xs"
                >
                  Open content
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Slide-in Detected Usage Drawer */}
      <DetectedUsageDrawer
        isOpen={detectedDrawerOpen}
        onClose={() => setDetectedDrawerOpen(false)}
        onCreateRenewal={() => setRenewalModalOpen(true)}
      />

      {/* License Renewal Request Modal */}
      <LicenseRenewalModal
        isOpen={renewalModalOpen}
        onClose={() => setRenewalModalOpen(false)}
        onApprove={handleApproveRenewal}
      />
    </div>
  );
}
