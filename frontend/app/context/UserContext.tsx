"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "brand" | "creator";

export interface UserPersona {
  id: number;
  name: string;
  role: UserRole;
  email: string;
  organization: string;
  title: string;
  avatarBg: string;
}

export const DEMO_ACCOUNTS: Record<UserRole, UserPersona> = {
  brand: {
    id: 1,
    name: "Northstar Coffee",
    role: "brand",
    email: "hello@northstarcoffee.com",
    organization: "Northstar Roasters Ltd.",
    title: "Brand Partnership Manager",
    avatarBg: "bg-[#A05AFF] text-white",
  },
  creator: {
    id: 2,
    name: "Amara Okafor",
    role: "creator",
    email: "amara@creator.com",
    organization: "@amara_okafor",
    title: "Lifestyle & Coffee Creator",
    avatarBg: "bg-[#1BCFB4] text-zinc-950 font-bold",
  },
};

interface UserContextType {
  user: UserPersona | null;
  role: UserRole;
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (roleOrEmail: UserRole | string, password?: string) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: () => void;
  backendStatus: "connected" | "checking" | "offline";
  checkBackendHealth: () => Promise<boolean>;
  activeNotification: string | null;
  setNotification: (msg: string | null) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "agreementos_active_persona";

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Start as null — let useEffect hydrate from localStorage
  const [user, setUser] = useState<UserPersona | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"connected" | "checking" | "offline">("checking");
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const checkBackendHealth = useCallback(async (isManualTrigger = false): Promise<boolean> => {
    try {
      if (isManualTrigger) {
        setBackendStatus("checking");
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch("https://coolpractical.onrender.com/deals/6", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        setBackendStatus("connected");
        return true;
      }
      setBackendStatus("connected");
      return true;
    } catch {
      setBackendStatus("offline");
      return false;
    }
  }, []);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.role && DEMO_ACCOUNTS[parsed.role as UserRole]) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Check backend health on mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkBackendHealth();
  }, [checkBackendHealth]);

  const notify = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const login = (roleOrEmail: UserRole | string, _password?: string) => {
    void _password;
    let selected: UserPersona;

    if (roleOrEmail === "brand" || roleOrEmail === DEMO_ACCOUNTS.brand.email) {
      selected = DEMO_ACCOUNTS.brand;
    } else if (roleOrEmail === "creator" || roleOrEmail === DEMO_ACCOUNTS.creator.email) {
      selected = DEMO_ACCOUNTS.creator;
    } else if (typeof roleOrEmail === "string" && roleOrEmail.includes("@")) {
      // Custom email login
      const isBrandEmail = roleOrEmail.includes("brand") || roleOrEmail.includes("company");
      const derivedRole: UserRole = isBrandEmail ? "brand" : "creator";
      const namePart = roleOrEmail.split("@")[0];
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      selected = {
        id: derivedRole === "brand" ? 1 : 2,
        name: formattedName,
        role: derivedRole,
        email: roleOrEmail,
        organization: derivedRole === "brand" ? `${formattedName} Co.` : `@${namePart}`,
        title: derivedRole === "brand" ? "Account Manager" : "Independent Creator",
        avatarBg: derivedRole === "brand" ? "bg-[#A05AFF] text-white" : "bg-[#1BCFB4] text-zinc-950 font-bold",
      };
    } else {
      return { success: false, message: "Invalid email or role specified." };
    }

    setUser(selected);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      // Ignore
    }
    notify(`Signed in as ${selected.name} (${selected.role === "brand" ? "Brand" : "Creator"})`);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    notify("Signed out successfully");
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }
  };

  const switchRole = () => {
    const currentRole = user?.role || "creator";
    const nextRole: UserRole = currentRole === "brand" ? "creator" : "brand";
    const nextUser = DEMO_ACCOUNTS[nextRole];
    setUser(nextUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      // Ignore
    }
    notify(`Switched perspective to ${nextUser.name} (${nextRole === "brand" ? "Brand" : "Creator"})`);
  };

  const role = user?.role || "brand";
  const isLoggedIn = user !== null;

  return (
    <UserContext.Provider
      value={{
        user,
        role,
        isLoggedIn,
        isHydrated,
        login,
        logout,
        switchRole,
        backendStatus,
        checkBackendHealth,
        activeNotification,
        setNotification: setActiveNotification,
        isMobileMenuOpen,
        setMobileMenuOpen: setIsMobileMenuOpen,
        toggleMobileMenu,
      }}
    >
      {children}

      {/* Global Toast Notification */}
      {activeNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200 pointer-events-auto">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-zinc-900 text-white text-xs font-medium rounded-xl shadow-xl border border-zinc-700/50">
            <span className="w-2 h-2 rounded-full bg-[#1BCFB4] animate-pulse" />
            <span>{activeNotification}</span>
          </div>
        </div>
      )}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
