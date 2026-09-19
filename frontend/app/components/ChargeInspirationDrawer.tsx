"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  TrendingUp,
  Lock,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  Pause,
  Play,
} from "lucide-react";
import {
  INITIAL_BENCHMARK_TASKS,
  SAMPLE_PLATFORM_EVENTS,
  type BenchmarkTask,
  type LivePlatformEvent,
} from "@/app/lib/charge-inspiration-data";

interface ChargeInspirationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSignUp: () => void;
  onUnlockSignIn: () => void;
}

export default function ChargeInspirationDrawer({
  isOpen,
  onClose,
  onUnlockSignUp,
  onUnlockSignIn,
}: ChargeInspirationDrawerProps) {
  const [tasks, setTasks] = useState<BenchmarkTask[]>(INITIAL_BENCHMARK_TASKS);
  const [currency, setCurrency] = useState<"NGN" | "USD">("NGN");
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [updatedTaskId, setUpdatedTaskId] = useState<string | null>(null);
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [lastSyncSeconds, setLastSyncSeconds] = useState(0);

  const drawerRef = useRef<HTMLElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Live timer for seconds since last sync
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setLastSyncSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Real-time market rate simulation updates
  useEffect(() => {
    if (!isOpen || !isLiveActive) return;

    const interval = setInterval(() => {
      // Pick a random task among the top 3 (or 4) to subtly update
      const targetIndex = Math.floor(Math.random() * 3);
      
      setTasks((prevTasks) => {
        return prevTasks.map((task, idx) => {
          if (idx !== targetIndex) return task;

          // Random percentage adjustment between -1.5% and +2.5%
          const pctDelta = (Math.random() * 4 - 1.5) / 100;
          const newMin = Math.round(task.currentMinNgn * (1 + pctDelta) / 1000) * 1000;
          const newMax = Math.round(task.currentMaxNgn * (1 + pctDelta) / 1000) * 1000;
          const newTrend = +(task.changeTrend + (pctDelta * 10)).toFixed(1);

          return {
            ...task,
            currentMinNgn: newMin,
            currentMaxNgn: newMax,
            changeTrend: newTrend,
            lastUpdatedLabel: "Just now",
          };
        });
      });

      const updatedTask = tasks[targetIndex];
      if (updatedTask) {
        setUpdatedTaskId(updatedTask.id);
        setTimeout(() => setUpdatedTaskId(null), 1800);
      }

      // Rotate platform event ticker
      setActiveEventIndex((prev) => (prev + 1) % SAMPLE_PLATFORM_EVENTS.length);
      setLastSyncSeconds(0);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, isLiveActive, tasks]);

  const formatPrice = useCallback(
    (amountNgn: number) => {
      if (currency === "USD") {
        // Approximate conversion rate ₦1,500 ~ $1
        const usd = Math.round(amountNgn / 1500);
        return `$${usd.toLocaleString()}`;
      }
      return `₦${amountNgn.toLocaleString()}`;
    },
    [currency]
  );

  const handleCopyRate = (task: BenchmarkTask) => {
    const text = `${task.title}: ${formatPrice(task.currentMinNgn)} – ${formatPrice(task.currentMaxNgn)} (${task.scope})`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedTaskId(task.id);
      setTimeout(() => setCopiedTaskId(null), 2000);
    }
  };

  if (!isOpen) return null;

  const currentEvent: LivePlatformEvent = SAMPLE_PLATFORM_EVENTS[activeEventIndex];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] z-40 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer */}
      <aside
        ref={drawerRef}
        className="fixed inset-y-0 right-0 w-full sm:w-[560px] md:w-[640px] bg-[#FAF8F5] z-50 shadow-2xl border-l border-zinc-200 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="charge-inspiration-title"
      >
        {/* Top Fixed Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-zinc-200 shrink-0">
          <div className="flex items-center justify-between mb-2.5">
            {/* Live Indicator Pill & Pause/Play control */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full  border border-[#1BCFB4]/25 text-[#0A7B69] text-[11px] font-semibold tracking-wide">
            
              <span className="uppercase tracking-wider font-mono text-[10px]">
                {isLiveActive ? "Live Stream Active" : "Stream Paused"}
              </span>
              <span className="text-zinc-300 font-light">·</span>
              <button
                type="button"
                onClick={() => setIsLiveActive(!isLiveActive)}
                className="hover:text-zinc-900 transition-colors cursor-pointer flex items-center gap-1 text-[10px] text-zinc-500 font-normal"
                title={isLiveActive ? "Pause real-time rate feed" : "Resume real-time rate feed"}
              >
                {isLiveActive ? <Pause size={10} /> : <Play size={10} />}
                <span>{lastSyncSeconds === 0 ? "Synced" : `${lastSyncSeconds}s`}</span>
              </button>
            </div>

            {/* Currency Switcher & Close Button */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg text-[11px] font-medium text-zinc-600">
                <button
                  type="button"
                  onClick={() => setCurrency("NGN")}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                    currency === "NGN"
                      ? "bg-white text-zinc-900 shadow-xs font-semibold"
                      : "text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  NGN
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency("USD")}
                  className={`px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                    currency === "USD"
                      ? "bg-white text-zinc-900 shadow-xs font-semibold"
                      : "text-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  USD
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-800 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[#A05AFF] mb-1">
                <span className="text-[10px] font-semibold tracking-wider uppercase font-sans">
                  Creator & Brand Rate Card
                </span>
              </div>
              <h2
                id="charge-inspiration-title"
                className="font-serif text-[24px] sm:text-[28px] font-bold text-zinc-900 leading-tight tracking-[-0.01em]"
              >
                Charge Inspiration
              </h2>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed mt-1">
            Real-time deliverable benchmarks gathered from verified Scope deal rooms, commercial
            licensing agreements, and active creator partnerships.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-100 text-[11px]">
            <div className="bg-zinc-50 rounded-lg p-2 border border-zinc-150">
              <span className="text-zinc-400 block text-[10px]">Verified Deals</span>
              <span className="font-semibold text-zinc-800 font-mono">820+ contracts</span>
            </div>
            <div className="bg-zinc-50 rounded-lg p-2 border border-zinc-150">
              <span className="text-zinc-400 block text-[10px]">Market Trend</span>
              <span className="font-semibold text-[#0A7B69] flex items-center gap-0.5 font-mono">
                <TrendingUp size={11} /> +10.4% MoM
              </span>
            </div>
            <div className="bg-zinc-50 rounded-lg p-2 border border-zinc-150">
              <span className="text-zinc-400 block text-[10px]">Active Rooms</span>
              <span className="font-semibold text-[#A05AFF] font-mono">38 live right now</span>
            </div>
          </div>
        </div>

        {/* Live Transaction Ticker Toast */}
        <div className="bg-[#1A1C1B] text-white px-4 py-2 text-[11px] flex items-center justify-between shrink-0 shadow-inner">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            
            <span className="text-zinc-200 truncate font-normal">
              {currentEvent.actor && typeof currentEvent.amountNgn === "number"
                ? `${currentEvent.actor} agreed to ${formatPrice(currentEvent.amountNgn)} for ${currentEvent.action}`
                : currentEvent.text}
            </span>
          </div>
          <span className="text-[#1BCFB4] font-mono text-[10px] shrink-0 ml-2 font-semibold">
            {currentEvent.timestamp}
          </span>
        </div>

        {/* Scrollable Middle Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-zinc-400 uppercase px-1">
            <span>Tasks & Scope (3 Free Previews)</span>
            <span>Recommended Pay Range</span>
          </div>

          {/* Two-Column List of Tasks */}
          <div className="space-y-3">
            {tasks.slice(0, 3).map((task) => {
              const isUpdated = updatedTaskId === task.id;
              const isCopied = copiedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all duration-300 relative group shadow-xs ${
                    isUpdated
                      ? "border-[#1BCFB4] ring-2 ring-[#1BCFB4]/25 bg-[#1BCFB4]/5"
                      : "border-zinc-200 hover:border-zinc-300 hover:shadow-sm"
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
                    {/* Left Column (Task, Category, Scope description) */}
                    <div className="sm:col-span-7">
                      
                      

                      <h3 className="font-serif text-[16px] font-bold text-zinc-900 leading-snug group-hover:text-[#A05AFF] transition-colors">
                        {task.title}
                      </h3>

                      <p className="text-xs text-zinc-500 font-normal mt-1 leading-relaxed">
                        {task.scope}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <ShieldCheck size={11} className="text-[#0A7B69]" />
                          {task.verifiedDealsCount} deal rooms audited
                        </span>
                      </div>
                    </div>

                    {/* Right Column (Pay that should be charged) */}
                    <div className="sm:col-span-5 flex flex-col sm:items-end justify-between self-stretch pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                      <div className="text-left sm:text-right">
                       
                        <div
                          className={`font-mono text-base sm:text-[17px] font-bold tracking-tight transition-colors ${
                            isUpdated ? "text-[#0A7B69]" : "text-zinc-900"
                          }`}
                        >
                          {formatPrice(task.currentMinNgn)} – {formatPrice(task.currentMaxNgn)}
                        </div>
                       
                      </div>

                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyRate(task)}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 px-2 py-1 rounded-md border border-zinc-200 transition-colors cursor-pointer"
                          title="Copy rate benchmark to clipboard"
                        >
                          {isCopied ? (
                            <>
                              <Check size={11} className="text-[#0A7B69]" />
                              <span className="text-[#0A7B69] font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy Rate</span>
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gated Section (Tasks 4+) */}
          <div className="relative pt-2">
            {/* Blurred Teaser Cards in background */}
            <div className="space-y-3 filter blur-[3px] opacity-40 select-none pointer-events-none">
              {tasks.slice(3, 6).map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif text-[15px] font-bold text-zinc-900">
                        {task.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1">
                        {task.scope}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-base font-bold text-zinc-900">
                        {formatPrice(task.currentMinNgn)} – {formatPrice(task.currentMaxNgn)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Deal Room Lock Card Overlay */}
            <div className="absolute inset-0 top-0 flex items-center justify-center p-3">
              <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-sm text-center flex flex-col items-center">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center mb-3">
                  <Lock size={15} />
                </div>

               

                <h3 className="font-serif text-[18px] sm:text-[20px] font-bold text-zinc-900 mb-1.5">
                  View more tasks in your deal room
                </h3>

                <p className="text-xs text-zinc-500 font-normal leading-relaxed max-w-sm mb-5">
                  Create your account or a deal room to view rates for paid advertising, exclusivity windows, rush turnarounds, and custom deliverables.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onUnlockSignUp();
                  }}
                  className="w-full max-w-xs py-2.5 px-4 rounded-xl bg-zinc-900 text-white font-medium text-xs hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Create a deal room to unlock</span>
                  <ArrowRight size={13} />
                </button>

                <p className="text-xs text-zinc-500 mt-3 font-normal">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onUnlockSignIn();
                    }}
                    className="text-[#A05AFF] hover:underline font-semibold cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer bar */}
       
      </aside>
    </>
  );
}
