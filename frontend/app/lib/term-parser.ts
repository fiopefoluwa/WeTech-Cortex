import type { ExtractedTerm } from "./types";

export interface BackendAgreementTerm {
  id?: number;
  agreement_id?: number;
  scope?: string;
  deliverables?: string;
  price?: number | string;
  revision_limit?: number;
  deadline?: string;
  payment_terms?: string;
  platforms?: string;
  usage_rights?: string;
  license_duration?: string;
  geographic_restrictions?: string;
  exclusivity?: string;
}

export interface ParseTermsOptions {
  dealName?: string;
  brandName?: string;
  creatorName?: string;
  amount?: number;
  sourceDocName?: string;
  rawText?: string;
}

/**
 * Normalizes any payload from the backend or local parser into 6 ExtractedTerm objects.
 */
export function parseTermsPayload(
  payload: unknown,
  options: ParseTermsOptions = {}
): ExtractedTerm[] {
  const sourceDoc = options.sourceDocName || "Agreement_Contract.pdf";
  const defaultAmount = options.amount || 100000;
  const brandName = options.brandName || "Brand Client";
  const creatorName = options.creatorName || "Creator";
  const dealName = options.dealName || "Creator Partnership";

  // Case 1: Already an array of ExtractedTerm
  if (Array.isArray(payload)) {
    return payload.map((term, index) => ({
      id: term.id || `term-${index}`,
      label: term.label || "TERM",
      value: term.value || "",
      clauseRef: term.clauseRef || `Section ${index + 1}.1`,
      excerpt: term.excerpt || "",
      confidence: typeof term.confidence === "number" ? term.confidence : 95,
      sourceDoc: term.sourceDoc || sourceDoc,
    }));
  }

  // Case 2: Object with terms property
  let rawTerms: Record<string, unknown> = {};
  let detectedFilename = sourceDoc;

  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (typeof obj.filename === "string" && obj.filename) {
      detectedFilename = obj.filename;
    }
    if (obj.terms && typeof obj.terms === "object") {
      if (Array.isArray(obj.terms)) {
        return parseTermsPayload(obj.terms, { ...options, sourceDocName: detectedFilename });
      }
      rawTerms = obj.terms as Record<string, unknown>;
    } else {
      rawTerms = obj;
    }
  }

  const backendTerms = rawTerms as BackendAgreementTerm;

  // Extract or fallback for each standard clause
  const scopeVal =
    backendTerms.scope ||
    (options.rawText && options.rawText.slice(0, 80)) ||
    dealName;

  const deliverablesVal =
    backendTerms.deliverables ||
    (options.rawText?.match(/(?:\d+\s*(?:TikTok|Instagram|Video|Reel|Post)s?)/i)?.[0] ??
      "3 TikTok videos and 1 YouTube Short");

  const parsedPrice =
    typeof backendTerms.price === "number"
      ? backendTerms.price
      : parseInt(String(backendTerms.price || "").replace(/[^0-9]/g, ""), 10) ||
        defaultAmount;

  const revisionLimit =
    typeof backendTerms.revision_limit === "number"
      ? backendTerms.revision_limit
      : 1;

  const platforms = backendTerms.platforms || "TikTok + Instagram";
  const usageRights = backendTerms.usage_rights || "Organic usage";
  const licenseDuration = backendTerms.license_duration || "30 days";
  const geo = backendTerms.geographic_restrictions || "Worldwide";
  const exclusivity = backendTerms.exclusivity || "Non-exclusive";

  return [
    {
      id: "scope",
      label: "SCOPE",
      value: scopeVal,
      clauseRef: "Section 1.1",
      excerpt: `Creative services for ${brandName} partnership. Primary focus: ${scopeVal}.`,
      confidence: 99,
      sourceDoc: detectedFilename,
    },
    {
      id: "deliverables",
      label: "DELIVERABLES",
      value: deliverablesVal,
      clauseRef: "Section 2.1",
      excerpt: `Agreed content assets to be delivered by ${creatorName}: ${deliverablesVal}. Platforms: ${platforms}.`,
      confidence: 98,
      sourceDoc: detectedFilename,
    },
    {
      id: "financial",
      label: "FINANCIAL TERMS",
      value: `₦${parsedPrice.toLocaleString()} total`,
      clauseRef: "Section 3.1",
      excerpt: `Total contract sum of ₦${parsedPrice.toLocaleString()} NGN deposited in Scope escrow and disbursed upon deliverable signoff.`,
      confidence: 100,
      sourceDoc: detectedFilename,
    },
    {
      id: "revisions",
      label: "REVISION RULES",
      value: `${revisionLimit} revision per deliverable`,
      clauseRef: "Section 4.2",
      excerpt: `Includes ${revisionLimit} standard round(s) of consolidated feedback returned within 48 hours of deliverable submission.`,
      confidence: 96,
      sourceDoc: detectedFilename,
    },
    {
      id: "licensing",
      label: "LICENSING",
      value: `${usageRights} · ${licenseDuration}`,
      clauseRef: "Section 5.1",
      excerpt: `Usage rights granted to ${brandName} for ${usageRights.toLowerCase()} on agreed channels for ${licenseDuration}.`,
      confidence: 97,
      sourceDoc: detectedFilename,
    },
    {
      id: "restrictions",
      label: "RESTRICTIONS",
      value: `No unauthorized paid boosting · ${geo}`,
      clauseRef: "Section 6.1",
      excerpt: `Content may not be whitelisted into paid ad spend without an active RightsGuard extension. Territory: ${geo}. Exclusivity: ${exclusivity}.`,
      confidence: 95,
      sourceDoc: detectedFilename,
    },
  ];
}
