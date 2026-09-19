"use client";

import { use } from "react";
import DealHeader from "@/app/components/DealHeader";
import AttentionCard from "@/app/components/AttentionCard";
import AgreementThread from "@/app/components/AgreementThread";
import ActivityFeed from "@/app/components/ActivityFeed";
import { useUser } from "@/app/context/UserContext";
import { useDeal } from "@/app/context/DealContext";
import {
  threadEvents,
  upcomingActivities,
  recentActivities,
  formatFriendlyDate,
} from "@/app/lib/demo-data";
import type { AttentionItem, ThreadEvent, ActivityItem } from "@/app/lib/types";

export default function DealRoomOverview({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = use(params);
  const { role } = useUser();
  const { getDeal } = useDeal();
  const deal = getDeal(dealId);
  const isCustomDeal = String(deal.id) !== "1";

  // Role-specific attention items
  const brandAttentionItems: AttentionItem[] = isCustomDeal
    ? [
        {
          id: "escrow-init",
          type: "change_request",
          status: "Ready to Fund",
          statusColor: "green",
          amount: `₦${deal.totalAmount.toLocaleString()}`,
          title: "Escrow Deposit Pending",
          description: `Agreed total of ₦${deal.totalAmount.toLocaleString()} for ${deal.name}: ${deal.description}. Fund escrow to activate production milestones.`,
          actionLabel: "View payment terms",
          actionVariant: "primary",
        },
        {
          id: "scope-init",
          type: "license",
          status: "Scope Active",
          statusColor: "green",
          label: "Deliverables",
          title: `${deal.creatorName} Invited`,
          description: `Deliverables: ${deal.description}. Awaiting first production draft from creator.`,
          actionLabel: "Review deliverables",
          actionVariant: "secondary",
        },
      ]
    : [
        {
          id: "cr-02",
          type: "change_request",
          status: "Approved · Paid",
          statusColor: "green",
          amount: "₦40,000",
          title: "Change Request #02",
          description:
            "Additional YouTube Shorts version outside the original TikTok scope. Approved and settled.",
          actionLabel: "View agreement update",
          actionVariant: "primary",
        },
        {
          id: "lic-01",
          type: "license",
          status: "Action Required",
          statusColor: "red",
          label: "Video #01",
          title: "Video #01 License Expired",
          description:
            "Organic license ended Oct 1. Paid Instagram use was detected. Settle license renewal.",
          actionLabel: "Review & renew license",
          actionVariant: "secondary",
        },
      ];

  const creatorAttentionItems: AttentionItem[] = isCustomDeal
    ? [
        {
          id: "creator-offer",
          type: "change_request",
          status: "Offer Received",
          statusColor: "green",
          amount: `₦${deal.totalAmount.toLocaleString()}`,
          title: `Campaign terms from ${deal.brandName}`,
          description: `${deal.brandName} initiated ${deal.name} with ₦${deal.totalAmount.toLocaleString()} total budget for: ${deal.description}.`,
          actionLabel: "Review agreement",
          actionVariant: "primary",
        },
        {
          id: "creator-escrow",
          type: "license",
          status: "Protected",
          statusColor: "green",
          label: "Milestones",
          title: "Milestone Protection Active",
          description: `Work deliverables will be verified before release. Review milestones and dates.`,
          actionLabel: "View deliverables",
          actionVariant: "secondary",
        },
      ]
    : [
        {
          id: "cr-02",
          type: "change_request",
          status: "Payment Received",
          statusColor: "green",
          amount: "₦40,000",
          title: "Change Request #02 Approved",
          description:
            "Northstar Coffee approved your YouTube Short addition and paid ₦40,000 to your earnings balance.",
          actionLabel: "View updated terms",
          actionVariant: "primary",
        },
        {
          id: "lic-01",
          type: "license",
          status: "Rights Protected",
          statusColor: "green",
          label: "RightsGuard",
          title: "Paid Ad Usage Detected",
          description:
            "A paid Instagram ad was detected past your agreed 30-day term. Brand has been notified to settle renewal.",
          actionLabel: "View detected usage",
          actionVariant: "secondary",
        },
      ];

  const activeAttentionItems = role === "brand" ? brandAttentionItems : creatorAttentionItems;

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
          details: [`${deal.brandName} · ${deal.creatorName}`, "Ready for first milestone"],
          isCurrent: true,
          isHighlighted: true,
        },
      ]
    : threadEvents;

  const displayUpcoming: ActivityItem[] = isCustomDeal
    ? [
        {
          id: "cua-1",
          icon: "calendar",
          title: "Deliverable review due",
          subtitle: deal.description,
          date: formatFriendlyDate(deal.endDate),
        },
        {
          id: "cua-2",
          icon: "payment",
          title: `Milestone payment: ₦${deal.totalAmount.toLocaleString()}`,
          subtitle: "Payment held in escrow",
          date: "On completion",
        },
      ]
    : upcomingActivities;

  const displayRecent: ActivityItem[] = isCustomDeal
    ? [
        {
          id: "cra-1",
          icon: "document",
          title: `Deal Room created: ${deal.name}`,
          subtitle: `${deal.brandName} · ${deal.creatorName}`,
          date: "Just now",
        },
        {
          id: "cra-2",
          icon: "money",
          title: `₦${deal.totalAmount.toLocaleString()} value defined`,
          subtitle: "Escrow pending",
          date: "Just now",
        },
      ]
    : recentActivities;

  return (
    <div>
      {/* Deal Header */}
      <DealHeader
        dealName={deal.name}
        brandName={deal.brandName}
        creatorName={deal.creatorName}
        status={deal.status}
        agreementUpdated={deal.agreementUpdated}
        dealId={dealId}
      />

      {/* What needs attention */}
      <section className="mb-8">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1 font-sans">
          {role === "brand" ? "Clear Next Steps for Brand" : "Clear Next Steps for Creator"}
        </p>
        <h2 className="font-serif text-[20px] sm:text-[22px] font-bold text-zinc-900 tracking-[-0.01em] mb-1">
          What needs attention
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 font-normal mb-5">
          One shared source of truth for the work, terms, and decisions that move this deal forward.
        </p>

        <div className="flex gap-4 flex-col md:flex-row">
          {activeAttentionItems.map((item) => (
            <AttentionCard key={item.id} item={item} dealId={dealId} />
          ))}
        </div>
      </section>

      {/* Agreement Thread */}
      <section className="mb-6">
        <AgreementThread events={displayEvents} dealId={dealId} />
      </section>

      {/* Activity sections */}
      <section className="flex gap-4 flex-col md:flex-row">
        <ActivityFeed
          title="Upcoming activity"
          items={displayUpcoming}
          actionLabel="Timeline"
          actionVariant="link"
          actionHref={`/deals/${dealId}/activity`}
        />
        <ActivityFeed
          title="Recent activity"
          items={displayRecent}
          actionLabel="Demo state"
          actionVariant="button"
          allowDemoToggle={true}
        />
      </section>
    </div>
  );
}
