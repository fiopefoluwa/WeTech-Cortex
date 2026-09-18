const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://coolpractical.onrender.com";

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Robust fetch wrapper with timeout and standardized error handling.
 * Never throws uncaught promise rejections; always returns an ApiResponse.
 */
async function safeRequest<T>(
  endpoint: string,
  options?: RequestInit & { timeoutMs?: number }
): Promise<ApiResponse<T>> {
  const timeoutMs = options?.timeoutMs ?? 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMsg = `Server error (${res.status} ${res.statusText})`;
      try {
        const errorJson = await res.json();
        if (errorJson?.detail) {
          errorMsg = typeof errorJson.detail === "string" 
            ? errorJson.detail 
            : JSON.stringify(errorJson.detail);
        }
      } catch {
        // Response wasn't JSON
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
    const message = err instanceof Error ? err.message : "Network connection failed. Operating in offline/cached mode.";
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
  created_at?: string;
}

export interface BackendUser {
  id: number;
  name: string;
  role: string;
  email: string;
}

export const api = {
  deals: {
    get: (dealId: number) => safeRequest<BackendDeal>(`/deals/${dealId}`),
    create: (data: {
      name: string;
      brand_id: number;
      creator_id: number;
      description?: string;
      total_amount: number;
    }) => safeRequest<BackendDeal>("/deals/", { method: "POST", body: JSON.stringify(data) }),
  },

  agreements: {
    create: (dealId: number, rawText: string) =>
      safeRequest<Record<string, unknown>>(
        `/agreements/${dealId}?raw_text=${encodeURIComponent(rawText)}`,
        { method: "POST", timeoutMs: 45000 }
      ),
  },

  messages: {
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
  },

  changeRequests: {
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

  users: {
    get: (userId: number) => safeRequest<BackendUser>(`/users/${userId}`),
    create: (name: string, role: string, email: string) =>
      safeRequest<BackendUser>(
        `/users/?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&email=${encodeURIComponent(email)}`,
        { method: "POST" }
      ),
  },
};
