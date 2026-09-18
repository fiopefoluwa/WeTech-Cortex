"use client";

import { useEffect } from "react";
import { useUser } from "./context/UserContext";

/**
 * Root page — redirects based on session:
 *   • Logged in  → /deals/1 (the demo deal room)
 *   • No session → /login
 */
export default function Home() {
  const { isLoggedIn, isHydrated } = useUser();

  useEffect(() => {
    if (!isHydrated) return; // wait for localStorage hydration
    if (isLoggedIn) {
      window.location.replace("/deals/1");
    } else {
      window.location.replace("/login");
    }
  }, [isHydrated, isLoggedIn]);

  // Show a minimal loading state while deciding
  return (
    <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-zinc-400">
        <div className="w-7 h-7 rounded-full border-2 border-zinc-200 border-t-[#A05AFF] animate-spin" />
        <p className="text-xs font-normal">Loading workspace…</p>
      </div>
    </div>
  );
}
