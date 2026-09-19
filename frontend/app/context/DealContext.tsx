"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useSyncExternalStore } from "react";
import { api } from "@/app/lib/api";
import { demoDeal, demoBrand, demoCreator } from "@/app/lib/demo-data";
import type { ExtractedTerm } from "@/app/lib/types";

export interface DealRoom {
  id: string;
  name: string;
  brandName: string;
  creatorName: string;
  totalAmount: number;
  originalAmount: number;
  status: string;
  description: string;
  startDate?: string;
  endDate?: string;
  agreementUpdated?: boolean;
  createdAt: string;
  agreementFile?: {
    name: string;
    size: number;
    uploadedAt: string;
    type?: string;
  };
  extractedTerms?: ExtractedTerm[];
  agreementText?: string;
}

export const DEFAULT_DEMO_DEAL: DealRoom = {
  id: "1",
  name: demoDeal.name,
  brandName: demoBrand.name,
  creatorName: demoCreator.name,
  totalAmount: demoDeal.totalAmount,
  originalAmount: demoDeal.originalAmount,
  status: demoDeal.status,
  description: "3 TikTok videos and 1 YouTube Short",
  startDate: "2024-09-10",
  endDate: "2024-10-10",
  agreementUpdated: demoDeal.agreementUpdated,
  createdAt: demoDeal.createdAt,
};

const STORAGE_KEY = "Scope_custom_deals";

interface DealContextType {
  deals: DealRoom[];
  isHydrated: boolean;
  getDeal: (dealId: string | number) => DealRoom;
  updateDeal: (dealId: string | number, updates: Partial<DealRoom>) => void;
  createDeal: (data: {
    name: string;
    brandName: string;
    creatorName: string;
    amount: number;
    description: string;
    startDate?: string;
    endDate?: string;
    agreementFile?: {
      name: string;
      size: number;
      uploadedAt: string;
      type?: string;
    };
    extractedTerms?: ExtractedTerm[];
    agreementText?: string;
  }) => Promise<string>;
}

const DealContext = createContext<DealContextType | undefined>(undefined);

export function DealProvider({ children }: { children: React.ReactNode }) {
  const [customDeals, setCustomDeals] = useState<DealRoom[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // Ignore
      }
    }
    return [];
  });

  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const allDeals = useMemo(
    () => [DEFAULT_DEMO_DEAL, ...customDeals.filter((d) => d.id !== "1")],
    [customDeals]
  );

  const getDeal = useCallback(
    (dealId: string | number): DealRoom => {
      const idStr = String(dealId);
      const found = allDeals.find((d) => String(d.id) === idStr);
      if (found) return found;

      // Check localStorage directly as fallback
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const parsed: DealRoom[] = JSON.parse(saved);
            const lsFound = parsed.find((d) => String(d.id) === idStr);
            if (lsFound) return lsFound;
          }
        } catch {
          // Ignore
        }
      }

      if (idStr === "1") {
        return DEFAULT_DEMO_DEAL;
      }

      // Generic fallback for any requested deal ID
      return {
        ...DEFAULT_DEMO_DEAL,
        id: idStr,
        name: `Deal Room #${idStr}`,
      };
    },
    [allDeals]
  );

  const updateDeal = useCallback(
    (dealId: string | number, updates: Partial<DealRoom>) => {
      const idStr = String(dealId);
      setCustomDeals((prev) => {
        const existingIndex = prev.findIndex((d) => String(d.id) === idStr);
        let updated: DealRoom[];
        if (existingIndex >= 0) {
          const current = prev[existingIndex];
          const merged: DealRoom = { ...current, ...updates };
          updated = [...prev];
          updated[existingIndex] = merged;
        } else {
          const base = allDeals.find((d) => String(d.id) === idStr) || DEFAULT_DEMO_DEAL;
          const newEntry: DealRoom = { ...base, id: idStr, ...updates };
          updated = [newEntry, ...prev.filter((d) => String(d.id) !== idStr)];
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore storage errors
        }
        return updated;
      });
    },
    [allDeals]
  );

  const createDeal = async (data: {
    name: string;
    brandName: string;
    creatorName: string;
    amount: number;
    description: string;
    startDate?: string;
    endDate?: string;
    agreementFile?: {
      name: string;
      size: number;
      uploadedAt: string;
      type?: string;
    };
    extractedTerms?: ExtractedTerm[];
    agreementText?: string;
  }): Promise<string> => {
    let newId = String(Date.now()).slice(-4);

    try {
      // Try backend creation
      const res = await api.deals.create({
        name: data.name.trim() || "New Campaign",
        brand_id: 1,
        creator_id: 2,
        description: data.description.trim(),
        total_amount: data.amount,
        start_date: data.startDate,
        end_date: data.endDate,
      });

      if (res.ok && res.data?.id) {
        newId = String(res.data.id);
        const rawAgreement =
          data.agreementText ||
          `Brand ${data.brandName} agrees to pay Creator ${data.creatorName} ${data.amount} Naira for ${data.description}.`;
        api.agreements.create(Number(newId), rawAgreement).catch(() => {});
      }
    } catch {
      // Fall back to local generated ID
    }

    const newDeal: DealRoom = {
      id: newId,
      name: data.name.trim() || "New Campaign",
      brandName: data.brandName.trim() || "Brand Client",
      creatorName: data.creatorName.trim() || "Creator",
      totalAmount: data.amount,
      originalAmount: data.amount,
      status: "active",
      description: data.description.trim() || "Campaign partnership deliverables",
      startDate: data.startDate || new Date().toISOString().split("T")[0],
      endDate: data.endDate || "",
      agreementUpdated: false,
      createdAt: new Date().toISOString(),
      agreementFile: data.agreementFile,
      extractedTerms: data.extractedTerms,
      agreementText: data.agreementText,
    };

    setCustomDeals((prev) => {
      const updated = [newDeal, ...prev.filter((d) => d.id !== newId)];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });

    return newId;
  };

  return (
    <DealContext.Provider
      value={{
        deals: allDeals,
        isHydrated,
        getDeal,
        updateDeal,
        createDeal,
      }}
    >
      {children}
    </DealContext.Provider>
  );
}

export function useDeal() {
  const context = useContext(DealContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      deals: [DEFAULT_DEMO_DEAL],
      isHydrated: true,
      getDeal: (dealId: string | number) => {
        if (typeof window !== "undefined") {
          try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
              const parsed: DealRoom[] = JSON.parse(saved);
              const found = parsed.find((d) => String(d.id) === String(dealId));
              if (found) return found;
            }
          } catch {}
        }
        return {
          ...DEFAULT_DEMO_DEAL,
          id: String(dealId),
        };
      },
      updateDeal: () => {},
      createDeal: async () => "1",
    };
  }
  return context;
}
