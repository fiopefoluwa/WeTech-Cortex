const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://coolpractical.onrender.com";

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Robust fetch wrapper with timeout and standardized error handling.
 */
async function safeRequest<T>(
  endpoint: string,
  options?: RequestInit & { timeoutMs?: number }
): Promise<ApiResponse<T>> {
  const timeoutMs = options?.timeoutMs ?? 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Retrieve auth token from localStorage if available
  let authHeader = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("agreementos_token");
    if (token) {
      authHeader = { Authorization: `Bearer ${token}` };
    }
  }

  try {
    const isFormData = options?.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
      ...authHeader,
      ...(options?.headers as Record<string, string>),
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers,
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMsg = `Server error (${res.status} ${res.statusText})`;
      try {
        const errorJson = await res.json();
        if (errorJson?.detail) {
          errorMsg =
            typeof errorJson.detail === "string"
              ? errorJson.detail
              : JSON.stringify(errorJson.detail);
        }
      } catch {
        // Response was not JSON
      }
      return { ok: false, error: errorMsg, statusCode: res.status };
    }

    const data = (await res.json()) as T;
    return { ok: true, data, statusCode: res.status };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      return {
        ok: false,
        error: "Request timed out. The backend may be waking up.",
        statusCode: 408,
      };
    }
    const message =
      err instanceof Error
        ? err.message
        : "Network connection failed. Operating in offline/cached mode.";
    return {
      ok: false,
      error: message,
      statusCode: 0,
    };
  }
}

export interface BackendDeal {
  id: number;
  name: string;
  brand_id: number;
  creator_id: number;
  description?: string;
  total_amount: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface BackendUser {
  id: number;
  name: string;
  role: string;
  email: string;
}

export const api = {
  auth: {
    login: (data: { email: string; password?: string }) =>
      safeRequest<{
        access_token: string;
        token_type: string;
        user: BackendUser;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: data.email, password: data.password || "demo123" }),
      }),
    register: (data: { name: string; email: string; password?: string; role: "brand" | "creator" }) =>
      safeRequest<{
        access_token: string;
        token_type: string;
        user: BackendUser;
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ ...data, password: data.password || "demo123" }),
      }),
    me: () => safeRequest<BackendUser>("/auth/me"),
  },

  deals: {
    list: () => safeRequest<BackendDeal[]>("/deals/"),
    get: (dealId: number) => safeRequest<BackendDeal>(`/deals/${dealId}`),
    create: (data: {
      name: string;
      brand_id: number;
      creator_id: number;
      description?: string;
      total_amount: number;
      start_date?: string;
      end_date?: string;
    }) => safeRequest<BackendDeal>("/deals/", { method: "POST", body: JSON.stringify(data) }),
  },

  agreements: {
    get: (dealId: number) => safeRequest<{ agreement: Record<string, unknown>; terms: Record<string, unknown> }>(`/agreements/${dealId}`),
    create: (dealId: number, rawText: string) =>
      safeRequest<Record<string, unknown>>(
        `/agreements/${dealId}?raw_text=${encodeURIComponent(rawText)}`,
        { method: "POST", timeoutMs: 45000 }
      ),
    uploadPdf: (dealId: number, file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return safeRequest<Record<string, unknown>>(`/agreements/${dealId}/upload`, {
        method: "POST",
        body: formData,
        timeoutMs: 60000,
      });
    },
  },

  messages: {
    list: (dealId: number) => safeRequest<Array<{ id: number; deal_id: number; sender_id: number; content: string; classification?: string; created_at: string }>>(`/messages/${dealId}`),
    send: (data: {
      deal_id: number;
      sender_id: number;
      content: string;
    }) =>
      safeRequest<{
        message: {
          id: number;
          deal_id: number;
          sender_id: number;
          content: string;
          classification?: string;
          created_at: string;
        };
        scope_analysis: {
          classification: "normal" | "scope_change" | "revision_request" | "other";
          reason: string;
          estimated_fee: number;
        };
      }>("/messages/", {
        method: "POST",
        body: JSON.stringify(data),
        timeoutMs: 30000,
      }),
    getWebSocketUrl: (dealId: number) => {
      const host = BASE_URL.replace(/^http/, "ws");
      return `${host}/ws/deals/${dealId}`;
    },
  },

  deliverables: {
    list: (dealId: number) => safeRequest<Array<Record<string, unknown>>>(`/deliverables/${dealId}`),
    create: (data: { deal_id: number; name: string; agreed_scope: string; deadline?: string; revisions?: string }) =>
      safeRequest<Record<string, unknown>>("/deliverables/", { method: "POST", body: JSON.stringify(data) }),
    submit: (deliverableId: number, submissionUrl: string) =>
      safeRequest<Record<string, unknown>>(`/deliverables/${deliverableId}/submit`, {
        method: "POST",
        body: JSON.stringify({ submission_url: submissionUrl }),
      }),
    approve: (deliverableId: number) =>
      safeRequest<Record<string, unknown>>(`/deliverables/${deliverableId}/approve`, { method: "POST" }),
    revise: (deliverableId: number, revisionNotes: string) =>
      safeRequest<Record<string, unknown>>(`/deliverables/${deliverableId}/revise`, {
        method: "POST",
        body: JSON.stringify({ revision_notes: revisionNotes }),
      }),
  },

  licensing: {
    getOverview: (dealId: number) => safeRequest<{ licenses: Array<Record<string, unknown>>; content: Array<Record<string, unknown>>; recent_audits: Array<Record<string, unknown>> }>(`/licensing/${dealId}`),
    auditEvent: (data: {
      deal_id: number;
      license_id?: number;
      content_title: string;
      platform: string;
      usage_type: string;
      event_date: string;
    }) =>
      safeRequest<{
        audit: Record<string, unknown>;
        evaluation: { is_violation: boolean; reason: string; suggested_fee: number };
      }>("/licensing/audit", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    renew: (licenseId: number, data: { new_usage?: string; duration_days?: number; amount?: number }) =>
      safeRequest<Record<string, unknown>>(`/licensing/${licenseId}/renew`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  changeRequests: {
    list: (dealId: number) => safeRequest<Array<Record<string, unknown>>>(`/change-requests/${dealId}`),
    create: (data: {
      deal_id: number;
      description: string;
      reason: string;
      additional_amount: number;
      requested_by: number;
      message_id?: number;
    }) =>
      safeRequest<Record<string, unknown>>("/change-requests/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    approve: (crId: number) =>
      safeRequest<Record<string, unknown>>(`/change-requests/${crId}/approve`, { method: "PATCH" }),
    pay: (crId: number) =>
      safeRequest<Record<string, unknown>>(`/change-requests/${crId}/pay`, { method: "PATCH" }),
  },

  payments: {
    list: (dealId: number) => safeRequest<Array<Record<string, unknown>>>(`/payments/${dealId}`),
    checkout: (data: {
      deal_id: number;
      item_type: "deal" | "change_request" | "license_renewal";
      item_id?: number;
      amount: number;
      payer_id: number;
      description?: string;
    }) =>
      safeRequest<Record<string, unknown>>("/payments/checkout", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  activities: {
    list: (dealId: number) => safeRequest<Array<{ id: number; deal_id: number; description: string; created_at: string }>>(`/activities/${dealId}`),
  },

  users: {
    list: () => safeRequest<BackendUser[]>("/users/"),
    get: (userId: number) => safeRequest<BackendUser>(`/users/${userId}`),
    create: (name: string, role: string, email: string) =>
      safeRequest<BackendUser>(
        `/users/?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}`,
        { method: "POST" }
      ),
  },
};
