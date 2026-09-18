"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import DealHeader from "@/app/components/DealHeader";
import PotentialScopeChangeDrawer from "@/app/components/PotentialScopeChangeDrawer";
import { useUser } from "@/app/context/UserContext";
import { api } from "@/app/lib/api";
import {
  demoDeal,
  demoBrand,
  demoCreator,
  demoChatMessages,
} from "@/app/lib/demo-data";
import type { ChatMessage } from "@/app/lib/types";
import {
  CheckCircle2,
  Scale,
  Send,
  FileSearch,
} from "lucide-react";

export default function MessagesPage() {
  const params = useParams();
  const dealId = (params?.dealId as string) || "1";
  const { user, role, switchRole } = useUser();

  const [messages, setMessages] = useState<ChatMessage[]>(demoChatMessages);
  const [inputText, setInputText] = useState("");
  const [scopeDrawerOpen, setScopeDrawerOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditNotice, setAuditNotice] = useState<string | null>(null);

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = (customText || inputText).trim();
    if (!textToSend) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const senderName = role === "brand" ? "Northstar Coffee" : "Amara Okafor";
    const senderRole = role;

    // Fast client-side check so UI is immediately responsive
    const localOutOfScope =
      /instagram|reel|youtube|podcast|extra|another|edit|rights|ad|repost/i.test(
        textToSend
      );

    const tempMsgId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: tempMsgId,
      senderName,
      senderRole,
      time: timeStr,
      content: textToSend,
      ...(localOutOfScope
        ? {
            isScopeChangeDetected: true,
            scopeChangeBadgeText: "Potential scope adjustment flagged",
            contextRef: {
              clause: "Deliverables §2",
              text: "“3 TikTok videos”",
            },
          }
        : {}),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!customText) setInputText("");
    setIsAuditing(true);

    // Call live backend endpoint: POST /messages/
    try {
      const response = await api.messages.send({
        deal_id: 6, // Active backend deal with verified terms
        sender_id: role === "brand" ? 1 : 2,
        content: textToSend,
      });

      if (response.ok && response.data) {
        const analysis = response.data.scope_analysis;
        if (analysis?.classification === "scope_change") {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempMsgId
                ? {
                    ...m,
                    isScopeChangeDetected: true,
                    scopeChangeBadgeText: `Scope adjustment flagged: +₦${Number(
                      analysis.estimated_fee || 40000
                    ).toLocaleString()}`,
                    contextRef: {
                      clause: "Deliverables §2",
                      text: analysis.reason || "“3 TikTok videos”",
                    },
                  }
                : m
            )
          );
          setAuditNotice("Contract Auditor: Scope adjustment flagged");
        } else {
          // In-scope message
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempMsgId
                ? {
                    ...m,
                    isScopeChangeDetected: false,
                    scopeChangeBadgeText: undefined,
                  }
                : m
            )
          );
          setAuditNotice("Contract terms: In-scope message");
        }
      } else {
        setAuditNotice("Message recorded in Deal Room");
      }
    } catch {
      setAuditNotice("Message saved locally");
    } finally {
      setIsAuditing(false);
      setTimeout(() => setAuditNotice(null), 4000);
    }
  };

  return (
    <div className="pb-12">
      {/* Top Deal Header */}
      <DealHeader
        dealName={demoDeal.name}
        brandName={demoBrand.name}
        creatorName={demoCreator.name}
        status={demoDeal.status}
        agreementUpdated={demoDeal.agreementUpdated}
        dealId={dealId}
      />

      {/* Shared Conversation Title Section */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1 font-sans">
            Shared Conversation
          </p>
          <h1 className="font-serif text-[22px] sm:text-[25px] font-bold text-zinc-900 leading-tight mb-1 tracking-[-0.01em]">
            Messages
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            Keep requests close to the agreement they may affect.
          </p>
        </div>

        {/* Active persona status */}
        <div className="flex items-center gap-2.5 bg-white border border-zinc-200 px-4 py-2 rounded-xl shadow-2xs">
          <span
            className={`w-2 h-2 rounded-full ${
              role === "brand" ? "bg-[#A05AFF]" : "bg-[#1BCFB4]"
            }`}
          />
          <span className="text-xs text-zinc-600 font-normal">
            Chatting as:{" "}
            <strong className="text-zinc-900 font-semibold">
              {role === "brand" ? "Northstar Coffee" : "Amara Okafor"}
            </strong>
          </span>
          <button
            type="button"
            onClick={switchRole}
            className="text-[11px] text-[#A05AFF] hover:underline ml-1 font-medium cursor-pointer"
          >
            (switch)
          </button>
        </div>
      </div>

      {/* Main Full-Width Chat Section */}
      <div className="w-full bg-white rounded-2xl border border-[#E8E5DC] p-4 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          {/* Conversation Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 flex-wrap gap-2">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif text-base sm:text-lg font-bold text-zinc-900 leading-tight">
                  Northstar Coffee × Amara Okafor
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/35">
                  <CheckCircle2 size={11} className="text-[#0A7B69]" />
                  <span>Deal active</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-light">
                Summer Creator Campaign · Active Scope: Deliverables §2 (3 TikTok videos)
              </p>
            </div>

            <button
              type="button"
              onClick={() => setScopeDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition-colors shadow-2xs cursor-pointer"
            >
              <Scale size={14} className="text-[#A05AFF]" />
              <span>Review Agreement Context</span>
            </button>
          </div>

          {/* Messages Thread */}
          <div className="py-4 space-y-4 max-h-[460px] overflow-y-auto pr-1">
            {messages.map((msg) => {
              const isCurrentUser = msg.senderRole === role;

              return (
                <div
                  key={msg.id}
                  className={`space-y-1.5 flex flex-col ${
                    isCurrentUser ? "items-end" : "items-start"
                  }`}
                >
                  {/* Sender Info */}
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-800">
                      {msg.senderName} {isCurrentUser && <span className="text-[#A05AFF] font-normal">(You)</span>}
                    </span>
                    <span className="text-zinc-300 font-light">·</span>
                    <span className="text-zinc-400 font-light text-[11px]">{msg.time}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 sm:p-4 text-sm leading-relaxed max-w-[90%] sm:max-w-[75%] rounded-2xl ${
                      isCurrentUser
                        ? role === "brand"
                          ? "bg-[#A05AFF]/10 border border-[#A05AFF]/25 text-zinc-900 shadow-2xs font-normal"
                          : "bg-[#1BCFB4]/10 border border-[#1BCFB4]/25 text-zinc-900 shadow-2xs font-normal"
                        : "bg-white border border-[#E8E5DC] text-zinc-800 shadow-2xs font-normal"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>

                  {/* Scope Adjustment Flag Banner */}
                  {msg.isScopeChangeDetected && (
                    <div className="flex items-center gap-2.5 pt-1 flex-wrap max-w-[90%] sm:max-w-[75%]">
                      <button
                        type="button"
                        onClick={() => setScopeDrawerOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-[#4BCBEB]/15 text-[#027E9F] border border-[#4BCBEB]/35 hover:bg-[#4BCBEB]/25 transition-all cursor-pointer shadow-2xs"
                      >
                        <Scale size={13} className="text-[#027E9F]" />
                        <span>{msg.scopeChangeBadgeText || "Potential scope adjustment flagged"}</span>
                      </button>

                      {msg.contextRef && (
                        <button
                          type="button"
                          onClick={() => setScopeDrawerOpen(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A05AFF]/10 border border-[#A05AFF]/25 hover:bg-[#A05AFF]/20 transition-colors text-xs font-normal text-zinc-700 cursor-pointer shadow-2xs"
                        >
                          <span className="font-semibold text-[#A05AFF]">{msg.contextRef.clause}:</span>
                          <span>{msg.contextRef.text}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Message Input Box */}
        <div className="pt-3 border-t border-zinc-100">
          {/* Context Prompt Suggestions */}
          <div className="mb-2.5 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-sans">
              Quick Prompts:
            </span>
            <button
              type="button"
              onClick={() =>
                handleSendMessage(
                  undefined,
                  "Can you also post this on Instagram as a Reel?"
                )
              }
              className="text-xs px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5 font-normal"
              title="Tests contract scope detection"
            >
              <Scale size={12} className="text-[#A05AFF]" />
              <span>&quot;Can you also post on Instagram as a Reel?&quot;</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleSendMessage(
                  undefined,
                  "I've uploaded the draft of Video #01 for your review."
                )
              }
              className="text-xs px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 transition-colors cursor-pointer font-normal"
            >
              <span>&quot;I&apos;ve uploaded the draft of Video #01&quot;</span>
            </button>
          </div>

          {auditNotice && (
            <div className="mb-2 px-3 py-1.5 rounded-lg bg-[#4BCBEB]/15 border border-[#4BCBEB]/35 text-[#027E9F] flex items-center gap-1.5 animate-in fade-in duration-150 font-medium">
              <FileSearch size={12} />
              <span>{auditNotice}</span>
            </div>
          )}

          <form onSubmit={handleSendMessage}>
            <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-zinc-200 bg-white focus-within:border-[#A05AFF] focus-within:ring-2 focus-within:ring-[#A05AFF]/20 transition-all shadow-2xs">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Write as ${user?.name || "current user"}...`}
                className="flex-1 px-4 sm:px-5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none bg-transparent font-normal"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isAuditing}
                className="w-10 h-10 rounded-xl bg-[#A05AFF] text-white flex items-center justify-center hover:bg-[#8E44F8] transition-colors disabled:opacity-40 cursor-pointer flex-shrink-0 shadow-xs"
              >
                <Send size={15} />
              </button>
            </div>
          </form>
          <p className="text-[11px] text-zinc-400 font-light mt-1.5 px-1">
            Contract Scope Guard verifies requests against original deliverables.
          </p>
        </div>
      </div>

      {/* Potential Scope Change Slide-in Drawer */}
      <PotentialScopeChangeDrawer
        isOpen={scopeDrawerOpen}
        onClose={() => setScopeDrawerOpen(false)}
        dealId={dealId}
      />
    </div>
  );
}
