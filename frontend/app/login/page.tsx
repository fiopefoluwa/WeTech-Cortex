"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useUser, DEMO_ACCOUNTS, type UserRole } from "@/app/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, backendStatus, isHydrated, isLoggedIn } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isHydrated && isLoggedIn) {
      router.replace("/deals/1");
    }
  }, [isHydrated, isLoggedIn, router]);

  const handleDemoLogin = (role: UserRole) => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      login(role);
      router.push("/deals/1");
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = login(email.trim(), password);
      if (result.success) {
        router.push("/deals/1");
      } else {
        setError(result.message || "Failed to log in.");
        setLoading(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-zinc-900 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Brand Bar */}
      {/* <div className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/deals/1"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-85"
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
            <h1 className="text-[16px] font-bold tracking-tight text-zinc-900 font-serif">
              AgreementOS
            </h1>
          </div>
        </Link>

      
        
      </div> */}

      {/* Main Content Area */}
      <div className="max-w-4xl w-full mx-auto my-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="max-w-4xl w-full mx-auto flex items-center justify-center">
        <Link
          href="/deals/1"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-85"
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
            <h1 className="text-[16px] font-bold tracking-tight text-zinc-900 font-serif">
              AgreementOS
            </h1>
          </div>
        </Link>
      </div>
          <h1 className="font-serif text-[32px] sm:text-[38px] font-bold text-zinc-900 leading-tight mb-2 tracking-[-0.02em]">
            Sign in to your deal room
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">
            Experience AgreementOS from either perspective: manage approvals as
            the <strong className="font-semibold text-zinc-700">Brand</strong>, or submit work and track rights as the{" "}
            <strong className="font-semibold text-zinc-700">Creator</strong>.
          </p>
        </div>

        {/* Quick Demo Access (2 Cards) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase font-sans">
              1-Click Demo Accounts
            </span>
            <span className="text-[11px] font-medium text-[#A05AFF] flex items-center gap-1">
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Brand Card */}
            <div
              onClick={() => handleDemoLogin("brand")}
              className="bg-white rounded-2xl border border-zinc-200 hover:border-[#A05AFF] hover:shadow-md p-6 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl  text-[#702AE0] flex items-center justify-center font-semibold text-sm">
                    <Building2 size={18} />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-[#A05AFF]/15 text-[#702AE0] border border-[#A05AFF]/30">
                    Brand / Client
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-zinc-900 group-hover:text-[#A05AFF] transition-colors mb-1">
                  {DEMO_ACCOUNTS.brand.name}
                </h3>
                <p className="text-xs text-zinc-400 mb-3 font-mono font-light">
                  {DEMO_ACCOUNTS.brand.email}
                </p>
                <p className="text-xs text-zinc-600 font-normal leading-relaxed mb-4">
                  Review scope adjustments, approve deliverables, issue license
                  renewals, and oversee milestone disbursements.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-medium text-[#A05AFF] group-hover:underline">
                  Sign in as Northstar Coffee
                </span>
                <div className="w-7 h-7 rounded-full bg-[#A05AFF]/15 text-[#702AE0] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>

            {/* Creator Card */}
            <div
              onClick={() => handleDemoLogin("creator")}
              className="bg-white rounded-2xl border border-zinc-200 hover:border-[#1BCFB4] hover:shadow-md p-6 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl text-[#0A7B69] flex items-center justify-center font-semibold text-sm">
                    <User size={18} />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/30">
                    Creator / Talent
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-zinc-900 group-hover:text-[#0A7B69] transition-colors mb-1">
                  {DEMO_ACCOUNTS.creator.name}
                </h3>
                <p className="text-xs text-zinc-400 mb-3 font-mono font-light">
                  {DEMO_ACCOUNTS.creator.email}
                </p>
                <p className="text-xs text-zinc-600 font-normal leading-relaxed mb-4">
                  Submit video deliverables, view real-time RightsGuard usage
                  monitoring, send messages, and track received earnings.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-medium text-[#0A7B69] group-hover:underline">
                  Sign in as Amara Okafor
                </span>
                <div className="w-7 h-7 rounded-full bg-[#1BCFB4]/15 text-[#0A7B69] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Traditional Credentials Form */}
        <div className="bg-white rounded-2xl border border-[#E8E5DC] p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)] max-w-md mx-auto">
          <div className="mb-5">
            <h2 className="font-serif text-lg font-bold text-zinc-900 mb-1">
              Sign in with email
            </h2>
            <p className="text-xs text-zinc-500 font-normal">
              Or enter any brand or creator email address.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#FE9496]/20 border border-[#FE9496]/45 flex items-start gap-2 text-xs text-[#B82B30]">
              <AlertCircle size={15} className="text-[#B82B30] mt-0.5 shrink-0" />
              <span className="font-normal">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  Email address
                </label>
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
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/25 focus:border-[#A05AFF] bg-zinc-50/50 font-normal"
                  required
                />
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#A05AFF]/25 focus:border-[#A05AFF] bg-zinc-50/50 font-normal"
                />
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 font-light mt-1">
                Demo accounts do not require a specific password.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-60"
            >
              <span>{loading ? "Signing in..." : "Continue to Workspace"}</span>
             
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center pt-4 border-t border-zinc-200/60">
        <p className="text-xs text-zinc-400 font-light">
          AgreementOS · The Operating System for Creator Partnerships & Commercial Rights
        </p>
      </div>
    </div>
  );
}
