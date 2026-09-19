export interface BenchmarkTask {
  id: string;
  title: string;
  category: "Deliverable" | "Rights & Licensing" | "Production" | "SLA & Revisions" | "Exclusivity";
  scope: string;
  demand: "High Demand" | "Trending Up" | "Standard" | "High Value";
  baseMinNgn: number;
  baseMaxNgn: number;
  currentMinNgn: number;
  currentMaxNgn: number;
  lastUpdatedLabel: string;
  verifiedDealsCount: number;
  changeTrend: number; // percentage e.g. +8.5%
  isLocked?: boolean;
}

export interface LivePlatformEvent {
  id: string;
  actor?: string;
  action?: string;
  amountNgn?: number;
  text: string;
  timestamp: string;
  type: "deal_closed" | "scope_approved" | "license_renewed" | "turnaround_surcharge";
  amount?: string;
}

export const INITIAL_BENCHMARK_TASKS: BenchmarkTask[] = [
  {
    id: "task-01",
    title: "1x 60s TikTok UGC Video",
    category: "Deliverable",
    scope: "1 original hook + 1 CTA · 1 revision round · Organic posting",
    demand: "High Demand",
    baseMinNgn: 90000,
    baseMaxNgn: 150000,
    currentMinNgn: 90000,
    currentMaxNgn: 150000,
    lastUpdatedLabel: "Just now",
    verifiedDealsCount: 482,
    changeTrend: 12.4,
    isLocked: false,
  },
  {
    id: "task-02",
    title: "30-Day Paid Spark Ads / Meta Whitelisting",
    category: "Rights & Licensing",
    scope: "Paid ad code authorization · Territory: West Africa & Global · Paid usage cap",
    demand: "Trending Up",
    baseMinNgn: 70000,
    baseMaxNgn: 125000,
    currentMinNgn: 70000,
    currentMaxNgn: 125000,
    lastUpdatedLabel: "3m ago",
    verifiedDealsCount: 319,
    changeTrend: 18.2,
    isLocked: false,
  },
  {
    id: "task-03",
    title: "Raw B-Roll & Unedited Footage License",
    category: "Production",
    scope: "3-5 high-res unedited video assets · Internal brand archive & organic repackaging",
    demand: "Standard",
    baseMinNgn: 45000,
    baseMaxNgn: 85000,
    currentMinNgn: 45000,
    currentMaxNgn: 85000,
    lastUpdatedLabel: "1m ago",
    verifiedDealsCount: 204,
    changeTrend: 6.8,
    isLocked: false,
  },
  // Items 4+ are locked behind the deal room / sign-up preview paywall
  {
    id: "task-04",
    title: "Dedicated YouTube Integration (60–90s)",
    category: "Deliverable",
    scope: "Dedicated segment · Permanent archive · Pinned comment + link in description",
    demand: "High Value",
    baseMinNgn: 220000,
    baseMaxNgn: 380000,
    currentMinNgn: 220000,
    currentMaxNgn: 380000,
    lastUpdatedLabel: "12m ago",
    verifiedDealsCount: 167,
    changeTrend: 14.1,
    isLocked: true,
  },
  {
    id: "task-05",
    title: "Brand Category Exclusivity (30-Day Lockout)",
    category: "Exclusivity",
    scope: "Competitor lockout across FMCG & beverage verticals during active flight window",
    demand: "High Value",
    baseMinNgn: 160000,
    baseMaxNgn: 280000,
    currentMinNgn: 160000,
    currentMaxNgn: 280000,
    lastUpdatedLabel: "25m ago",
    verifiedDealsCount: 112,
    changeTrend: 9.3,
    isLocked: true,
  },
  {
    id: "task-06",
    title: "Cross-Platform Repurposing (IG Reel + YT Shorts)",
    category: "Deliverable",
    scope: "Native 9:16 re-framing · Customized on-screen captions for secondary channel",
    demand: "Trending Up",
    baseMinNgn: 60000,
    baseMaxNgn: 110000,
    currentMinNgn: 60000,
    currentMaxNgn: 110000,
    lastUpdatedLabel: "18m ago",
    verifiedDealsCount: 245,
    changeTrend: 11.0,
    isLocked: true,
  },
  {
    id: "task-07",
    title: "Emergency Rush Turnaround (<48 Hours Surcharge)",
    category: "SLA & Revisions",
    scope: "Priority editing slot · First cut within 48 hours of product delivery",
    demand: "Standard",
    baseMinNgn: 50000,
    baseMaxNgn: 95000,
    currentMinNgn: 50000,
    currentMaxNgn: 95000,
    lastUpdatedLabel: "8m ago",
    verifiedDealsCount: 98,
    changeTrend: 15.5,
    isLocked: true,
  },
];

export const SAMPLE_PLATFORM_EVENTS: LivePlatformEvent[] = [
  {
    id: "evt-1",
    actor: "A consumer brand",
    action: "TikTok UGC deliverable",
    amountNgn: 135000,
    text: "A consumer brand agreed to ₦135,000 for TikTok UGC",
    timestamp: "2s ago",
    type: "deal_closed",
  },
  {
    id: "evt-2",
    actor: "A creator",
    action: "scope adjustment for extra cutdown",
    amountNgn: 45000,
    text: "A creator approved ₦45,000 scope adjustment for extra cutdown",
    timestamp: "6s ago",
    type: "scope_approved",
  },
  {
    id: "evt-3",
    actor: "A retail brand",
    action: "30-day Meta Spark Ads license",
    amountNgn: 85000,
    text: "A retail brand renewed 30-day Meta Spark Ads license for ₦85,000",
    timestamp: "11s ago",
    type: "license_renewed",
  },
  {
    id: "evt-4",
    actor: "A media brand",
    action: "rush turnaround add-on",
    amountNgn: 60000,
    text: "A media brand agreed to ₦60,000 for rush turnaround add-on",
    timestamp: "17s ago",
    type: "turnaround_surcharge",
  },
  {
    id: "evt-5",
    actor: "A tech brand",
    action: "dedicated YouTube integration",
    amountNgn: 250000,
    text: "A tech brand agreed to ₦250,000 for dedicated YouTube integration",
    timestamp: "24s ago",
    type: "deal_closed",
  },
];
