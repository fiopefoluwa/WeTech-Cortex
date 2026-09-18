"use client";

import { useState } from "react";
import {
  User,
  LogIn,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Building2,
  ChevronDown,
  Check,
  Menu,
} from "lucide-react";
import Link from "next/link";
import CreateDealRoomModal from "./CreateDealRoomModal";
import { useUser, type UserRole } from "@/app/context/UserContext";

export default function TopNavbar() {
  const {
    user,
    role,
    isLoggedIn,
    login,
    logout,
    switchRole,
    backendStatus,
    checkBackendHealth,
    toggleMobileMenu,
  } = useUser();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLoginAs = (targetRole: UserRole) => {
    login(targetRole);
    setIsLoginOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login(email.trim(), password);
      setIsLoginOpen(false);
    }
  };

  return (
    <>
      <header className="h-16 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md px-5 sm:px-8 md:px-10 py-3 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
        {/* Left: Mobile Menu Toggle + Breadcrumbs */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Hamburger button for mobile */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-2 -ml-1.5 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu size={19} />
          </button>

          <span className="hidden sm:inline text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase font-sans">
            WORKSPACE
          </span>
          <span className="hidden sm:inline text-zinc-300 font-light">/</span>
          <span className="text-xs sm:text-sm font-medium text-zinc-800 truncate max-w-[160px] sm:max-w-none">
            Summer Creator Campaign
          </span>

          {/* Backend Status indicator */}
          <button
            onClick={() => checkBackendHealth()}
            title={`Backend Status: ${backendStatus}. Click to test connection.`}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-normal bg-zinc-100/80 hover:bg-zinc-200/70 text-zinc-600 border border-zinc-200/60 transition-colors cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                backendStatus === "connected"
                  ? "bg-[#1BCFB4]"
                  : backendStatus === "checking"
                  ? "bg-[#4BCBEB]"
                  : "bg-zinc-400"
              }`}
            />
            <span>{backendStatus === "connected" ? "Live Server" : "Connecting..."}</span>
          </button>
        </div>

        {/* Right: User Identity & Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Persona Pill & Quick Switch Toggle */}
              <div className="flex items-center rounded-2xl bg-zinc-100/90 border border-zinc-200/70 p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={switchRole}
                  className={`flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    role === "brand"
                      ? "bg-white text-zinc-900 shadow-xs font-medium"
                      : "bg-white text-zinc-900 shadow-xs font-medium"
                  }`}
                  title="Click to switch perspective between Brand and Creator"
                >
                  <span className="hidden md:inline text-zinc-500 font-normal">Viewing as:</span>
                  <strong className="font-semibold text-zinc-900 truncate max-w-[120px] sm:max-w-none">
                    {user.name}
                  </strong>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      role === "brand"
                        ? "bg-[#A05AFF]/15 text-[#702AE0]"
                        : "bg-[#1BCFB4]/15 text-[#0A7B69]"
                    }`}
                  >
                    {role}
                  </span>
                </button>
              </div>

              {/* Account Options Menu Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2.5 rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/80 transition-colors cursor-pointer border border-zinc-200/60 bg-white/70"
                  title="Account settings and demo switcher"
                >
                  <ChevronDown size={15} />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Active Persona
                      </p>
                      <p className="text-xs font-bold text-zinc-900 mt-0.5">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-light">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-2 space-y-1">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-2 py-1">
                        Switch Demo Persona
                      </p>
                      <button
                        type="button"
                        onClick={() => handleLoginAs("brand")}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                          role === "brand"
                            ? "bg-[#A05AFF]/15 text-[#702AE0] font-semibold"
                            : "text-zinc-700 hover:bg-zinc-50 font-normal"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 size={13} className="text-[#A05AFF]" />
                          <span>Northstar Coffee (Brand)</span>
                        </div>
                        {role === "brand" && <Check size={13} className="text-[#A05AFF]" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLoginAs("creator")}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                          role === "creator"
                            ? "bg-[#1BCFB4]/15 text-[#0A7B69] font-semibold"
                            : "text-zinc-700 hover:bg-zinc-50 font-normal"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <User size={13} className="text-[#1BCFB4]" />
                          <span>Amara Okafor (Creator)</span>
                        </div>
                        {role === "creator" && <Check size={13} className="text-[#1BCFB4]" />}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 px-2 flex flex-col gap-1">
                      <Link
                        href="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors font-normal"
                      >
                        <User size={13} className="text-zinc-400" />
                        <span>Go to Login Page</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer font-normal"
                      >
                        <LogOut size={13} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer shadow-xs"
              >
                <LogIn size={14} />
                <span>Sign in</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Create Deal Room Modal */}
      <CreateDealRoomModal
        isOpen={isCreateDealOpen}
        onClose={() => setIsCreateDealOpen(false)}
      />

      {/* Login Modal */}
      {isLoginOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsLoginOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-md bg-zinc-900 flex items-center justify-center text-white">
                    <ShieldCheck size={13} />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 tracking-tight font-serif">
                    AgreementOS
                  </h2>
                </div>
                <p className="text-xs text-zinc-500 font-normal">
                  Select a persona or enter account credentials.
                </p>
              </div>
              <button
                onClick={() => setIsLoginOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-3 space-y-4">
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase mb-2">
                  1-Click Demo Personas
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleLoginAs("brand")}
                    className="p-3 rounded-xl border-2 border-zinc-200 hover:border-[#A05AFF] hover:bg-[#A05AFF]/5 text-left transition-all cursor-pointer group"
                  >
                    <p className="text-xs font-semibold text-zinc-900 group-hover:text-[#A05AFF]">
                      Northstar Coffee
                    </p>
                    <p className="text-[11px] text-zinc-500 font-light">Brand account</p>
                  </button>
                  <button
                    onClick={() => handleLoginAs("creator")}
                    className="p-3 rounded-xl border-2 border-zinc-200 hover:border-[#1BCFB4] hover:bg-[#1BCFB4]/5 text-left transition-all cursor-pointer group"
                  >
                    <p className="text-xs font-semibold text-zinc-900 group-hover:text-[#0A7B69]">
                      Amara Okafor
                    </p>
                    <p className="text-[11px] text-zinc-500 font-light">Creator account</p>
                  </button>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-zinc-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-normal text-zinc-400 uppercase tracking-wider">
                  or email credentials
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/25 focus:border-[#A05AFF] font-normal"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/25 focus:border-[#A05AFF] font-normal"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Sign in</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="font-light">AgreementOS · Work Made Clear</span>
              <Link
                href="/login"
                onClick={() => setIsLoginOpen(false)}
                className="text-[#A05AFF] hover:text-[#9E58FF] hover:underline font-medium"
              >
                Full Login Page →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
