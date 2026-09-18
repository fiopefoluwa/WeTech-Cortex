"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@/app/context/UserContext";

/**
 * AuthGuard — wraps protected pages/layouts.
 * Redirects to /login if no active session is found.
 * Shows nothing (spinner) while hydrating to avoid a flash.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isHydrated } = useUser();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isLoggedIn && !redirectedRef.current) {
      redirectedRef.current = true;
      window.location.replace("/login");
    }
  }, [isHydrated, isLoggedIn]);

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
