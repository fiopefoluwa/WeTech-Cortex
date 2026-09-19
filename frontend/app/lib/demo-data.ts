import type {
  AttentionItem,
  ThreadEvent,
  ActivityItem,
  ExtractedTerm,
  ChatMessage,
  AgreementContextData,
  DeliverableItem,
  ContentItem,
  LicenseItem,
  PaymentItem,
  ChangeRequestItem,
  ActivityTimelineItem,
} from "./types";

// ─── Demo deal room ───

export const demoDeal = {
  id: 1,
  name: "Summer Creator Campaign",
  status: "active",
  totalAmount: 340000,
  originalAmount: 300000,
  agreementUpdated: true,
  createdAt: "2024-09-10T00:00:00Z",
};

export const demoBrand = {
  id: 1,
  name: "Northstar Coffee",
  role: "brand" as const,
  email: "hello@northstarcoffee.com",
};

export const demoCreator = {
  id: 2,
  name: "Amara Okafor",
  role: "creator" as const,
  email: "amara@creator.com",
};

// ─── What needs attention ───

export const attentionItems: AttentionItem[] = [
  {
    id: "cr-02",
    type: "change_request",
    status: "Approved · Paid",
    statusColor: "green",
    amount: "₦40,000",
    title: "Change Request #02",
    description:
      "Additional YouTube Shorts version outside the original TikTok scope.",
    actionLabel: "View agreement update",
    actionVariant: "primary",
  },
  {
    id: "lic-01",
    type: "license",
    status: "Expires in 4 days",
    statusColor: "red",
    label: "Video #01",
    title: "Video #01 License",
    description:
      "Organic license ended Oct 1. A paid Instagram use was detected Oct 15.",
    actionLabel: "View license",
    actionVariant: "secondary",
  },
];

// ─── Agreement thread ───

export const threadEvents: ThreadEvent[] = [
  {
    id: "thread-1",
    date: "SEPT 10",
    title: "Original Agreement",
    details: ["3 TikTok videos", "₦300,000"],
  },
  {
    id: "thread-2",
    date: "SEPT 13",
    title: "Change Request #02",
    details: ["+ 1 YouTube Short", "+₦40,000"],
  },
  {
    id: "thread-3",
    date: "SEPT 14",
    title: "Approved & Paid",
    details: ["Northstar Coffee approved"],
    badge: { label: "Paid", color: "green" },
    isHighlighted: true,
  },
  {
    id: "thread-4",
    date: "CURRENT AGREEMENT",
    title: "Agreement updated",
    details: ["3 TikToks · 1 YouTube Short", "₦340,000 total"],
    isCurrent: true,
  },
];

// ─── Activity feeds ───

export const upcomingActivities: ActivityItem[] = [
  {
    id: "ua-1",
    icon: "calendar",
    title: "Video #02 review due",
    subtitle: "Deliverable deadline",
    date: "Sept 18",
  },
  {
    id: "ua-2",
    icon: "payment",
    title: "Original deal payment milestone",
    subtitle: "₦300,000 received",
    date: "Sept 20",
  },
  {
    id: "ua-3",
    icon: "license",
    title: "Video #01 organic license ends",
    subtitle: "Licensing term §5",
    date: "Oct 1",
  },
  {
    id: "ua-4",
    icon: "change",
    title: "Change Request #02 complete",
    subtitle: "Agreement updated",
    date: "Today",
  },
];

export const recentActivities: ActivityItem[] = [
  {
    id: "ra-1",
    icon: "upload",
    title: "Video #01 submitted",
    subtitle: "Creator activity",
    date: "Sept 12",
  },
  {
    id: "ra-2",
    icon: "alert",
    title: "Additional work detected",
    subtitle: "Potential change",
    date: "Sept 13",
  },
  {
    id: "ra-3",
    icon: "approve",
    title: "Change Request #02 approved",
    subtitle: "Northstar Coffee",
    date: "Sept 14",
  },
  {
    id: "ra-4",
    icon: "money",
    title: "₦40,000 received",
    subtitle: "Payment milestone",
    date: "Sept 14",
  },
];

// ─── Sidebar nav items ───

export const navItems = [
  { label: "Overview", href: "", icon: "grid" },
  { label: "Agreement", href: "/agreement", icon: "file" },
  { label: "Messages", href: "/messages", icon: "message" },
  { label: "Deliverables", href: "/deliverables", icon: "check" },
  { label: "Content", href: "/content", icon: "play" },
  { label: "Licensing", href: "/licensing", icon: "shield" },
  { label: "Change Requests", href: "/change-requests", icon: "branch" },
  { label: "Payments", href: "/payments", icon: "credit" },
  { label: "Activity", href: "/activity", icon: "clock" },
];

// ─── Extracted Agreement Terms (Mockup exact) ───

export const agreementTerms: ExtractedTerm[] = [
  {
    id: "scope",
    label: "SCOPE",
    value: "Campaign content creation",
    clauseRef: "Section 1.1",
    excerpt:
      "The Creator agrees to perform creative digital content creation services for Brand's Q3/Q4 promotional campaign, including ideation, production, and video editing.",
    confidence: 98,
    sourceDoc: "Summer_Creator_Agreement_Final.pdf",
  },
  {
    id: "deliverables",
    label: "DELIVERABLES",
    value: "3 TikTok videos · 1 YouTube Short",
    clauseRef: "Section 2.1 & CR #02",
    excerpt:
      "Three (3) vertical format TikTok video assets (30-60s) with original audio and caption mentions. Amended on Sept 13 via approved Change Request #02 to include one (1) additional YouTube Short.",
    confidence: 96,
    sourceDoc: "Summer_Creator_Agreement_Final.pdf + CR-02",
  },
  {
    id: "financial",
    label: "FINANCIAL TERMS",
    value: "₦340,000 total",
    clauseRef: "Section 4.1 & Addendum",
    excerpt:
      "Initial fixed compensation of ₦300,000 NGN payable in milestone installments (₦300,000 base + ₦40,000 supplemental scope for YouTube Shorts adaptation). Full payment processed.",
    confidence: 99,
    sourceDoc: "Summer_Creator_Agreement_Final.pdf",
  },
  {
    id: "revisions",
    label: "REVISION RULES",
    value: "1 revision per deliverable",
    clauseRef: "Section 5.3",
    excerpt:
      "Each deliverable includes up to one (1) round of consolidated editorial revisions. Any feedback submitted after the 48-hour review window or exceeding one round will constitute extra scope.",
    confidence: 94,
    sourceDoc: "Summer_Creator_Agreement_Final.pdf",
  },
  {
    id: "licensing",
    label: "LICENSING",
    value: "TikTok + Instagram · organic usage · 30 days",
    clauseRef: "Section 6.2",
    excerpt:
      "Brand is granted non-exclusive, non-transferable rights for organic distribution across Brand's verified TikTok and Instagram accounts for thirty (30) calendar days from publication date.",
    confidence: 97,
    sourceDoc: "Summer_Creator_Agreement_Final.pdf",
  },
  {
    id: "restrictions",
    label: "RESTRICTIONS",
    value: "No paid advertising · Nigeria only",
    clauseRef: "Section 7.1",
    excerpt:
      "Under no circumstances may the content be utilized for paid digital ads, boosted posts, Whitelisting/Spark Ads, or broadcast media. Distribution is strictly geographically constrained to Nigeria.",
    confidence: 95,
    sourceDoc: "Summer_Creator_Agreement_Final.pdf",
  },
];

// ─── Messages Page Demo Data (Mockup exact) ───

export const demoChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    senderName: "Northstar Coffee",
    senderRole: "brand",
    time: "10:14",
    content:
      "The first video is looking great. Could you also create a YouTube Shorts version?",
    isScopeChangeDetected: true,
    scopeChangeBadgeText: "Potential scope change detected",
    contextRef: {
      clause: "Deliverables §2",
      text: "“3 TikTok videos”",
    },
  },
  {
    id: "msg-2",
    senderName: "Amara Okafor",
    senderRole: "creator",
    time: "10:22",
    content:
      "Absolutely — I can add that. Let’s make sure the extra deliverable is reflected in the deal.",
  },
  {
    id: "msg-3",
    senderName: "Northstar Coffee",
    senderRole: "brand",
    time: "10:29",
    content: "Agreed. Please send through the change request.",
  },
];

export const agreementContextData: AgreementContextData = {
  title: "The current scope",
  description:
    "This deal currently includes 3 TikTok videos and one approved YouTube Short.",
  clauseRef: "Deliverables §2",
  scopeText: "“3 TikTok videos + 1 YouTube Short”",
};

// ─── Deliverables Page Demo Data ───

export const demoDeliverables: DeliverableItem[] = [
  {
    id: "del-1",
    name: "Video #01",
    agreedScope: "Original · TikTok",
    status: "Approved",
    statusVariant: "green",
    deadline: "Sept 12",
    revisions: "1 / 1 revision",
    referenceClause: "Deliverables §2.1",
    referenceText:
      "First vertical video asset delivered on Sept 12 and approved by Northstar Coffee after 1 revision round.",
  },
  {
    id: "del-2",
    name: "Video #02",
    agreedScope: "Original · TikTok",
    status: "In review",
    statusVariant: "blue",
    deadline: "Sept 18",
    revisions: "0 / 1 revision",
    referenceClause: "Deliverables §2.2",
    referenceText:
      "Second vertical video submitted on Sept 14, currently in review by Northstar Coffee editorial team.",
  },
  {
    id: "del-3",
    name: "Video #03",
    agreedScope: "Original · TikTok",
    status: "Not started",
    statusVariant: "orange",
    deadline: "Sept 25",
    revisions: "0 / 1 revision",
    referenceClause: "Deliverables §2.3",
    referenceText:
      "Final TikTok asset scheduled for production following Video #02 sign-off.",
  },
  {
    id: "del-4",
    name: "YouTube Short",
    agreedScope: "Added · Change Request #02",
    status: "Submitted",
    statusVariant: "blue",
    deadline: "Sept 21",
    revisions: "0 / 1 revision",
    referenceClause: "Change Request #02",
    referenceText:
      "Supplemental YouTube Short adaptation added via approved Change Request #02 (+₦40,000 compensation).",
  },
];

// ─── Content Page Demo Data ───

export const demoContentItems: ContentItem[] = [
  {
    id: "cnt-1",
    title: "Video #01",
    platform: "TikTok · Instagram",
    submission: "Submitted / Approved",
    licenseStatus: "Expired",
    licenseVariant: "red",
    termsSummary:
      "Organic usage window of 30 days ended Oct 1. Unauthorized paid Instagram advertisement use detected on Oct 15.",
  },
  {
    id: "cnt-2",
    title: "Video #02",
    platform: "TikTok",
    submission: "Submitted / In review",
    licenseStatus: "Active",
    licenseVariant: "green",
    termsSummary:
      "Active non-exclusive organic rights on TikTok for 30 calendar days following official publication.",
  },
  {
    id: "cnt-3",
    title: "Video #03",
    platform: "TikTok",
    submission: "Not submitted",
    licenseStatus: "Expiring soon",
    licenseVariant: "orange",
    termsSummary:
      "Asset production pending. 30-day licensing clock begins upon initial asset upload.",
  },
  {
    id: "cnt-4",
    title: "YouTube Short",
    platform: "YouTube",
    submission: "Submitted / In review",
    licenseStatus: "Active",
    licenseVariant: "green",
    termsSummary:
      "Organic rights on YouTube Shorts granted in accordance with approved Change Request #02 terms.",
  },
];

// ─── Licensing Page Demo Data ───

export const heroLicenseItem: LicenseItem = {
  id: "lic-hero-1",
  title: "Video #01",
  platforms: "TikTok · Instagram · Organic usage",
  usageType: "Organic usage",
  status: "Expired",
  statusVariant: "red",
  originalPeriod: "Sept 1 → Oct 1",
  actualUseDetected: "Instagram · Paid Advertisement",
  detectedDate: "Detected Oct 15",
  currentPosition: "Organic use only; term expired",
  hasIssue: true,
};

export const otherLicenseItems: LicenseItem[] = [
  {
    id: "lic-2",
    title: "Video #02",
    platforms: "TikTok",
    usageType: "Organic",
    status: "Active",
    statusVariant: "green",
    originalPeriod: "Sept 18 → Oct 18",
    currentPosition: "Active organic distribution",
  },
  {
    id: "lic-3",
    title: "Video #03",
    platforms: "Instagram",
    usageType: "Organic",
    status: "Expiring soon",
    statusVariant: "orange",
    originalPeriod: "Sept 25 → Oct 25",
    currentPosition: "Pending delivery",
  },
  {
    id: "lic-4",
    title: "YouTube Short",
    platforms: "YouTube",
    usageType: "Organic",
    status: "Active",
    statusVariant: "green",
    originalPeriod: "Sept 21 → Oct 21",
    currentPosition: "Active organic distribution",
  },
];

// ─── Payments Page Demo Data ───

export const demoPayments: PaymentItem[] = [
  {
    id: "pay-1",
    agreementEvent: "Original agreement",
    financialImpact: "₦300,000 total",
    payment: "₦300,000 · Sept 10",
    status: "Paid",
    statusVariant: "green",
    details: "Initial upfront contract payment received upon mutual electronic signing.",
  },
  {
    id: "pay-2",
    agreementEvent: "Change Request #02",
    financialImpact: "Additional YouTube Short · +₦40,000",
    payment: "₦40,000 · Sept 14",
    status: "Paid",
    statusVariant: "green",
    details: "Milestone payment for YouTube Short creation approved and transferred by Northstar Coffee.",
  },
  {
    id: "pay-3",
    agreementEvent: "License Renewal Request",
    financialImpact: "30 days paid advertising · +₦100,000",
    payment: "Awaiting approval",
    status: "Pending",
    statusVariant: "orange",
    details: "Supplemental paid advertising license extension addendum pending brand authorization.",
  },
];

// ─── Change Request Page Demo Data ───

export const demoChangeRequest: ChangeRequestItem = {
  id: "cr-2",
  code: "#02",
  title: "Additional YouTube Shorts version",
  requestedBy: "Requested by Creator · Sept 13",
  date: "Sept 13",
  amount: "₦40,000",
  status: "Approved · Paid · Agreement updated",
  paidDate: "Paid Sept 14",
  whyExists:
    "A YouTube Shorts deliverable sits outside the original scope of 3 TikTok videos.",
  whyClause: {
    ref: "Deliverables §2",
    text: "“3 TikTok videos”",
  },
  whatHappens:
    "The financial impact is paid, the agreement thread is updated, and the new deliverable becomes agreed work.",
  whatClause: {
    ref: "Agreement update",
    text: "“3 TikTok videos, 1 YouTube Short, ₦340,000 total”",
  },
};

// ─── Activity Page Demo Data ───

export const demoActivityTimeline: ActivityTimelineItem[] = [
  {
    id: "act-1",
    date: "SEPT 10",
    title: "Agreement created",
    subtitle: "The original agreement was added to this Deal Room.",
  },
  {
    id: "act-2",
    date: "SEPT 11",
    title: "Creator joined the Deal Room",
    subtitle: "Amara Okafor joined the shared workspace.",
  },
  {
    id: "act-3",
    date: "SEPT 12",
    title: "Video #01 submitted",
    subtitle: "Actual submitted work is now linked to the original deliverable.",
  },
  {
    id: "act-4",
    date: "SEPT 13",
    title: "Potential scope change detected",
    subtitle: "A YouTube Shorts request did not match the current deliverables.",
  },
  {
    id: "act-5",
    date: "SEPT 13",
    title: "Change Request #02 created · +₦40,000",
    subtitle: "The creator proposed an additional YouTube Short.",
  },
  {
    id: "act-6",
    date: "SEPT 14",
    title: "Change Request #02 approved",
    subtitle: "Northstar Coffee approved the additional work.",
  },
  {
    id: "act-7",
    date: "SEPT 14",
    title: "₦40,000 received",
    subtitle: "The approved change-request payment was recorded.",
  },
  {
    id: "act-8",
    date: "SEPT 14",
    title: "Agreement updated",
    subtitle: "Current agreement now includes one YouTube Short.",
  },
  {
    id: "act-9",
    date: "OCT 15",
    title: "Potential licensing issue detected",
    subtitle: "Instagram paid advertising was detected after organic usage expired.",
  },
];

export function formatFriendlyDate(dateStr?: string): string {
  if (!dateStr) return "Upcoming";
  if (!dateStr.includes("-")) return dateStr;
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      }
    }
  } catch {}
  return dateStr;
}




