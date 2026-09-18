// ─── Backend model types ───

export interface User {
  id: number;
  name: string;
  role: "brand" | "creator";
  email: string;
}

export interface Deal {
  id: number;
  name: string;
  brand_id: number;
  creator_id: number;
  description?: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface Agreement {
  id: number;
  deal_id: number;
  raw_text: string;
  created_at: string;
}

export interface AgreementTerm {
  id: number;
  agreement_id: number;
  scope: string;
  deliverables: string;
  price: number;
  revision_limit?: number;
  deadline?: string;
  payment_terms?: string;
}

export interface ExtractedTerm {
  id: string;
  label: string;
  value: string;
  clauseRef: string;
  excerpt: string;
  confidence: number;
  sourceDoc: string;
}

export interface Message {
  id: number;
  deal_id: number;
  sender_id: number;
  content: string;
  classification?: string;
  created_at: string;
}

export interface ChangeRequest {
  id: number;
  deal_id: number;
  message_id?: number;
  description: string;
  reason: string;
  additional_amount: number;
  requested_by: number;
  status: "pending" | "approved" | "rejected" | "paid";
  created_at: string;
}

export interface Activity {
  id: number;
  deal_id: number;
  description: string;
  created_at: string;
}

// ─── Frontend UI types ───

export interface AttentionItem {
  id: string;
  type: "change_request" | "license";
  status: string;
  statusColor: "green" | "red" | "orange";
  amount?: string;
  label?: string;
  title: string;
  description: string;
  actionLabel: string;
  actionVariant: "primary" | "secondary";
}

export interface ThreadEvent {
  id: string;
  date: string;
  title: string;
  details: string[];
  badge?: {
    label: string;
    color: "green" | "grey";
  };
  isCurrent?: boolean;
  isHighlighted?: boolean;
}

export interface ActivityItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: "brand" | "creator";
  time: string;
  content: string;
  isScopeChangeDetected?: boolean;
  scopeChangeBadgeText?: string;
  contextRef?: {
    clause: string;
    text: string;
  };
}

export interface AgreementContextData {
  title: string;
  description: string;
  clauseRef: string;
  scopeText: string;
}

export interface DeliverableItem {
  id: string;
  name: string;
  agreedScope: string;
  status: "Approved" | "In review" | "Not started" | "Submitted";
  statusVariant: "green" | "blue" | "orange";
  deadline: string;
  revisions: string;
  referenceClause: string;
  referenceText: string;
}

export interface ContentItem {
  id: string;
  title: string;
  platform: string;
  submission: string;
  licenseStatus: "Expired" | "Active" | "Expiring soon";
  licenseVariant: "red" | "green" | "orange";
  termsSummary: string;
}

export interface LicenseItem {
  id: string;
  title: string;
  platforms: string;
  usageType: string;
  status: "Expired" | "Active" | "Expiring soon";
  statusVariant: "red" | "green" | "orange";
  originalPeriod: string;
  actualUseDetected?: string;
  detectedDate?: string;
  currentPosition: string;
  hasIssue?: boolean;
}

export interface PaymentItem {
  id: string;
  agreementEvent: string;
  financialImpact: string;
  payment: string;
  status: "Paid" | "Pending" | "Failed";
  statusVariant: "green" | "orange" | "red";
  details?: string;
}

export interface ChangeRequestItem {
  id: string;
  code: string;
  title: string;
  requestedBy: string;
  date: string;
  amount: string;
  status: string;
  paidDate?: string;
  whyExists: string;
  whyClause: { ref: string; text: string };
  whatHappens: string;
  whatClause: { ref: string; text: string };
}

export interface ActivityTimelineItem {
  id: string;
  date: string;
  title: string;
  subtitle: string;
}



