"use client";

import { use } from "react";
import DealHeader from "@/app/components/DealHeader";
import AttentionCard from "@/app/components/AttentionCard";
import AgreementThread from "@/app/components/AgreementThread";
import ActivityFeed from "@/app/components/ActivityFeed";
import { useUser } from "@/app/context/UserContext";
import {
  demoDeal,
  demoBrand,
  demoCreator,
  threadEvents,
  upcomingActivities,
  recentActivities,
} from "@/app/lib/demo-data";
import type { AttentionItem } from "@/app/lib/types";

export default function DealRoomOverview({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = use(params);
  const { role } = useUser();

  // Role-specific attention items
  const brandAttentionItems: AttentionItem[] = [
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

  const creatorAttentionItems: AttentionItem[] = [
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

  return (
    <div>
      {/* Deal Header */}
      <DealHeader
        dealName={demoDeal.name}
        brandName={demoBrand.name}
        creatorName={demoCreator.name}
        status={demoDeal.status}
        agreementUpdated={demoDeal.agreementUpdated}
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
        <AgreementThread events={threadEvents} />
      </section>

      {/* Activity sections */}
      <section className="flex gap-4 flex-col md:flex-row">
        <ActivityFeed
          title="Upcoming activity"
          items={upcomingActivities}
          actionLabel="Timeline"
          actionVariant="link"
          actionHref={`/deals/${dealId}/activity`}
        />
        <ActivityFeed
          title="Recent activity"
          items={recentActivities}
          actionLabel="Demo state"
          actionVariant="button"
          allowDemoToggle={true}
        />
      </section>
    </div>
  );
}
