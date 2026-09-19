"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  User,
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Zap,
} from "lucide-react";
import { useUser, DEMO_ACCOUNTS, type UserRole } from "@/app/context/UserContext";
import ChargeInspirationDrawer from "@/app/components/ChargeInspirationDrawer";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isHydrated, isLoggedIn } = useUser();

  // Mode: Sign Up first by default, with switcher to Login
  const [isSignUp, setIsSignUp] = useState(true);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("brand");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Charge Inspiration Drawer state
  const [isChargeInspirationOpen, setIsChargeInspirationOpen] = useState(false);
  const [highlightSignUpBanner, setHighlightSignUpBanner] = useState(false);

  const formCardRef = useRef<HTMLDivElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isHydrated && isLoggedIn) {
      router.replace("/deals/1");
    }
  }, [isHydrated, isLoggedIn, router]);

  const handleDemoLogin = async (demoRole: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(demoRole);
      if (res.success) {
        router.push("/deals/1");
      } else {
        setError(res.message || "Failed to sign in with demo account.");
        setLoading(false);
      }
    } catch {
      setError("Failed to sign in with demo account.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp && !name.trim()) {
      setError("Please enter your full name or company name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Backend registration integration
        const result = await register({
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          role,
        });

        if (result.success) {
          router.push("/deals/1");
        } else {
          setError(result.message || "Registration failed. Please try again.");
          setLoading(false);
        }
      } else {
        // Backend login integration
        const result = await login(email.trim(), password.trim());

        if (result.success) {
          router.push("/deals/1");
        } else {
          setError(result.message || "Invalid email or password.");
          setLoading(false);
        }
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleUnlockFromDrawer = () => {
    setIsSignUp(true);
    setHighlightSignUpBanner(true);
    setTimeout(() => {
      if (formCardRef.current) {
        formCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 150);
    setTimeout(() => setHighlightSignUpBanner(false), 4500);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-zinc-900 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      {/* Upper Screen Header Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between pb-6 pt-2">
        {/* Scope Branding Logo */}
        <Link
          href="/deals/1"
          className="inline-flex items-center gap-2.5 group transition-opacity hover:opacity-85"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[#1BCFB4]"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="text-[17px] font-bold tracking-tight text-zinc-900 font-serif block">
              Scope
            </span>
          </div>
        </Link>

        {/* Right-hand side upper screen: Charge Inspiration */}
        <button
          type="button"
          id="charge-inspiration-trigger"
          onClick={() => setIsChargeInspirationOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-50 border border-zinc-200/90 hover:border-[#A05AFF]/60 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          aria-label="Open Charge Inspiration market rates"
        >
         
          <span className="text-xs font-semibold text-zinc-900 group-hover:text-[#A05AFF] transition-colors font-sans">
            Charge Inspiration
          </span>
          <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded  text-[#702AE0]">
            Live Rates
          </span>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="max-w-5xl w-full mx-auto my-auto py-2">
        {/* Hero Section */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="font-serif text-[28px] sm:text-[36px] font-bold text-zinc-900 leading-tight mb-2 tracking-[-0.02em]">
            {isSignUp ? "Create your Scope account" : "Sign in to your deal room"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">
            {isSignUp
              ? "Join brands and creators managing commercial agreements, automated scope creep protection, and milestone escrow."
              : "Access your active deal room to review scope changes, approve deliverables, and monitor commercial licensing."}
          </p>
        </div>

        {/* Highlight notification if redirected from Charge Inspiration lock */}
        {highlightSignUpBanner && (
          <div className="max-w-2xl mx-auto mb-6 p-3.5 rounded-xl bg-[#A05AFF]/10 border border-[#A05AFF]/30 flex items-center gap-2.5 text-xs text-[#702AE0] animate-in fade-in slide-in-from-top-2 duration-300">
            <Zap size={15} className="shrink-0 text-[#A05AFF]" />
            <span>
              <strong>Unlocked from Charge Inspiration:</strong> Sign up below in 30 seconds to access all 50+ live rates and create deal rooms.
            </span>
          </div>
        )}

        {/* Two-Column Layout: Demo Evaluation on Left, Auth Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 1-Click Demo Accounts Selector */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div>
             
              <h3 className="font-serif text-lg font-bold text-zinc-900 mb-1">
                Explore active workspaces
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-3">
                Skip registration to test Scope instantly from either perspective: manage deliverables as the brand or track rights as the creator.
              </p>
            </div>

            <div className="space-y-3">
              {/* Demo Brand */}
              <div
                onClick={() => handleDemoLogin("brand")}
                className="bg-white rounded-2xl border border-zinc-200 hover:border-[#A05AFF] hover:shadow-md p-4 sm:p-5 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#A05AFF]/15 text-[#702AE0] flex items-center justify-center font-semibold text-sm">
                    <Building2 size={18} />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-[#A05AFF]/15 text-[#702AE0] border border-[#A05AFF]/30">
                    Brand / Client
                  </span>
                </div>

                <h4 className="font-serif text-base font-bold text-zinc-900 group-hover:text-[#A05AFF] transition-colors mb-0.5">
                  {DEMO_ACCOUNTS.brand.name}
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono font-light mb-2">
                  {DEMO_ACCOUNTS.brand.email}
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed mb-3">
                  Review scope adjustments, approve deliverables, issue license renewals, and oversee milestone disbursements.
                </p>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-medium text-[#A05AFF]">
                  <span className="group-hover:underline">Enter as Northstar Coffee</span>
                  <div className="w-6 h-6 rounded-full bg-[#A05AFF]/15 text-[#702AE0] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>

              {/* Demo Creator */}
              <div
                onClick={() => handleDemoLogin("creator")}
                className="bg-white rounded-2xl border border-zinc-200 hover:border-[#1BCFB4] hover:shadow-md p-4 sm:p-5 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1BCFB4]/15 text-[#0A7B69] flex items-center justify-center font-semibold text-sm">
                    <User size={18} />
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/30">
                    Creator / Talent
                  </span>
                </div>

                <h4 className="font-serif text-base font-bold text-zinc-900 group-hover:text-[#0A7B69] transition-colors mb-0.5">
                  {DEMO_ACCOUNTS.creator.name}
                </h4>
                <p className="text-[11px] text-zinc-400 font-mono font-light mb-2">
                  {DEMO_ACCOUNTS.creator.email}
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed mb-3">
                  Submit video deliverables, view real-time RightsGuard usage monitoring, and track received earnings.
                </p>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-medium text-[#0A7B69]">
                  <span className="group-hover:underline">Enter as Amara Okafor</span>
                  <div className="w-6 h-6 rounded-full bg-[#1BCFB4]/15 text-[#0A7B69] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Primary Auth Form Card */}
          <div className="lg:col-span-7">
            <div
              ref={formCardRef}
              className={`bg-white rounded-2xl border p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] w-full transition-all duration-300 ${
                highlightSignUpBanner
                  ? "border-[#A05AFF] ring-4 ring-[#A05AFF]/15 shadow-lg"
                  : "border-[#E8E5DC]"
              }`}
            >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-zinc-900">
                {isSignUp ? "Get started with Scope" : "Sign in with email"}
              </h2>
              <p className="text-xs text-zinc-500 font-normal">
                {isSignUp ? "Free public tier includes 3 deal rooms." : "Enter your account credentials."}
              </p>
            </div>

            {/* Role indicator badge when signing up */}
            {isSignUp && (
              <span
                className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                  role === "brand"
                    ? " text-[#702AE0]"
                    : " text-[#0A7B69]"
                }`}
              >
                {role === "brand" ? "Brand / Client" : "Creator / Talent"}
              </span>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FE9496]/20 border border-[#FE9496]/45 flex items-start gap-2 text-xs text-[#B82B30]">
              <AlertCircle size={15} className="text-[#B82B30] mt-0.5 shrink-0" />
              <span className="font-normal">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name field (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  {role === "brand" ? "Company or Brand Name" : "Your Full Name"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === "brand" ? "Nescafe" : "Amaka Ucherike"}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/25 focus:border-[#A05AFF] bg-zinc-50/50 font-normal"
                    required={isSignUp}
                  />
                  {role === "brand" ? (
                    <Building2
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                  ) : (
                    <User
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Email address
                </label>
                {!isSignUp && (
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setEmail(DEMO_ACCOUNTS.brand.email)}
                      className="text-[#A05AFF] hover:underline cursor-pointer font-medium"
                    >
                      Use Brand
                    </button>
                    <span className="text-zinc-300 font-light">·</span>
                    <button
                      type="button"
                      onClick={() => setEmail(DEMO_ACCOUNTS.creator.email)}
                      className="text-[#0A7B69] hover:underline cursor-pointer font-medium"
                    >
                      Use Creator
                    </button>
                  </div>
                )}
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/25 focus:border-[#A05AFF] bg-zinc-50/50 font-normal"
                  required
                />
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignUp ? "Secure password" : "Enter password"}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/25 focus:border-[#A05AFF] bg-zinc-50/50 font-normal"
                  required
                />
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Role Selection (Sign Up only) */}
            {isSignUp && (
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                  I am joining as a
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole("brand")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      role === "brand"
                        ? "border-[#A05AFF] bg-[#A05AFF]/5 ring-1 ring-[#A05AFF]"
                        : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[#702AE0]">
                      <Building2 size={14} />
                      <span className="text-xs font-semibold">Brand / Client</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-tight">
                      Hiring creators & managing campaign deliverables
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("creator")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      role === "creator"
                        ? "border-[#1BCFB4] bg-[#1BCFB4]/5 ring-1 ring-[#1BCFB4]"
                        : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[#0A7B69]">
                      <User size={14} />
                      <span className="text-xs font-semibold">Creator / Talent</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-tight">
                      Delivering work, tracking rights & earnings
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-60 mt-2"
            >
              <span>
                {loading
                  ? isSignUp
                    ? "Creating account..."
                    : "Signing in..."
                  : isSignUp
                  ? "Create Account & Start Deal Room"
                  : "Continue to Workspace"}
              </span>
            </button>
          </form>

          {/* Mini Text Switcher between Sign Up and Login */}
          <div className="mt-5 pt-4 border-t border-zinc-100 text-center">
            {isSignUp ? (
              <p className="text-xs text-zinc-500 font-normal">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  className="text-[#A05AFF] hover:underline font-semibold cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p className="text-xs text-zinc-500 font-normal">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  className="text-[#A05AFF] hover:underline font-semibold cursor-pointer"
                >
                  Create one here
                </button>
              </p>
            )}
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center pt-6 border-t border-zinc-200/60 mt-4">
        <p className="text-xs text-zinc-400 font-light">
          Scope · The Operating System for Creator Partnerships & Commercial Rights
        </p>
      </footer>

      {/* Slide-over Charge Inspiration Drawer */}
      <ChargeInspirationDrawer
        isOpen={isChargeInspirationOpen}
        onClose={() => setIsChargeInspirationOpen(false)}
        onUnlockSignUp={() => {
          setIsChargeInspirationOpen(false);
          handleUnlockFromDrawer();
        }}
        onUnlockSignIn={() => {
          setIsChargeInspirationOpen(false);
          setIsSignUp(false);
        }}
      />
    </div>
  );
}
