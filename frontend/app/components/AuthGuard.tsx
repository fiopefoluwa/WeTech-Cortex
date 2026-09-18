"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";

/**
 * AuthGuard — wraps protected pages/layouts.
 * Redirects to /login if no active session is found.
 * Shows nothing (spinner) while hydrating to avoid a flash.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isHydrated } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isHydrated) return; // wait for localStorage hydration
    if (!isLoggedIn && !isRedirecting) {
      setIsRedirecting(true);
      window.location.replace("/login");
    }
  }, [isHydrated, isLoggedIn, isRedirecting]);

  // While hydrating or not logged in, show a spinner — never flash protected content
  if (!isHydrated || !isLoggedIn) {
    return (
      <div className="flex-1 flex items-center justify-center h-full min-h-screen bg-brand-cream">
        <div className="flex flex-col items-center gap-3 text-zinc-400">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-[#A05AFF] animate-spin" />
          <p className="text-xs font-normal">Checking session…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
