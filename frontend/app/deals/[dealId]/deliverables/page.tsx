"use client";

import { useState } from "react";
import DealHeader from "@/app/components/DealHeader";
import { useUser } from "@/app/context/UserContext";
import {
  demoDeal,
  demoBrand,
  demoCreator,
  demoDeliverables,
} from "@/app/lib/demo-data";
import type { DeliverableItem } from "@/app/lib/types";
import {
  CheckCircle2,
  Clock,
  X,
  FileText,
  UploadCloud,
  Check,
  FileVideo,
  Calendar,
} from "lucide-react";

export default function DeliverablesPage() {
  const { role, switchRole, setNotification } = useUser();
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>(demoDeliverables);
  const [selectedReference, setSelectedReference] = useState<DeliverableItem | null>(null);

  // Modals for actions
  const [submitModalItem, setSubmitModalItem] = useState<DeliverableItem | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [revisionModalItem, setRevisionModalItem] = useState<DeliverableItem | null>(null);
  const [revisionNotes, setRevisionNotes] = useState("");

  const handleApprove = (id: string, name: string) => {
    setDeliverables((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Approved" } : item
      )
    );
    setNotification(`Approved "${name}" — Milestone ready for payment.`);
  };

  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionModalItem) return;

    setDeliverables((prev) =>
      prev.map((item) =>
        item.id === revisionModalItem.id
          ? { ...item, status: "In review", revisions: "1 of 1 revisions used" }
          : item
      )
    );
    setNotification(`Revision requested for "${revisionModalItem.name}".`);
    setRevisionModalItem(null);
    setRevisionNotes("");
  };

  const handleSubmitDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModalItem) return;

    setDeliverables((prev) =>
      prev.map((item) =>
        item.id === submitModalItem.id
          ? { ...item, status: "In review" }
          : item
      )
    );
    setNotification(`Submitted "${submitModalItem.name}" for Brand review.`);
    setSubmitModalItem(null);
    setSubmissionUrl("");
  };

  const getStatusBadge = (status: DeliverableItem["status"]) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/30">
            <CheckCircle2 size={12} className="text-[#1BCFB4]" />
            <span>Approved</span>
          </span>
        );
      case "In review":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#4BCBEB]/15 text-[#027E9F] border border-[#4BCBEB]/30">
            <Clock size={12} className="text-[#027E9F]" />
            <span>In review</span>
          </span>
        );
      case "Not started":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            <Calendar size={12} className="text-zinc-500" />
            <span>Not started</span>
          </span>
        );
      case "Submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#A05AFF]/15 text-[#702AE0] border border-[#A05AFF]/30">
            <FileVideo size={12} className="text-[#A05AFF]" />
            <span>Submitted</span>
          </span>
        );
    }
  };

  return (
    <div className="pb-12">
      {/* Deal Header */}
      <DealHeader
        dealName={demoDeal.name}
        brandName={demoBrand.name}
        creatorName={demoCreator.name}
        status={demoDeal.status}
        agreementUpdated={demoDeal.agreementUpdated}
      />

      {/* Page Title & Role Action Toolbar */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-1.5 font-sans">
            Promised and Delivered
          </p>
          <h1 className="font-serif text-[22px] sm:text-[25px] font-bold text-zinc-900 leading-tight mb-1 tracking-[-0.01em]">
            Deliverables
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            See agreed scope and submitted work side by side.
          </p>
        </div>

        {/* Role perspective banner badge */}
        <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3.5 py-2 rounded-xl shadow-2xs">
          <span
            className={`w-2 h-2 rounded-full ${
              role === "brand" ? "bg-[#A05AFF]" : "bg-[#1BCFB4]"
            }`}
          />
          <div className="text-xs">
            <span className="text-zinc-500 font-normal">Role: </span>
            <strong className="text-zinc-900 font-semibold">
              {role === "brand" ? "Brand (Reviewer)" : "Creator (Submittal)"}
            </strong>
          </div>
          <button
            type="button"
            onClick={switchRole}
            className="text-[11px] text-[#A05AFF] hover:underline ml-1 cursor-pointer font-medium"
          >
            (switch)
          </button>
        </div>
      </div>

      {/* Deliverables Table Card */}
      <div className="bg-white rounded-2xl border border-[#E8E5DC] p-4 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-zinc-100 pb-3">
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Deliverable
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Agreed Scope
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Status
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 font-sans">
                  Deadline / Revisions
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 text-center font-sans">
                  {role === "brand" ? "Brand Action" : "Creator Action"}
                </th>
                <th className="text-[11px] font-semibold tracking-[0.12em] text-zinc-400 uppercase py-3 px-4 text-right font-sans">
                  Clause
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {deliverables.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-zinc-50/60 transition-colors group"
                >
                  {/* Deliverable Name */}
                  <td className="py-4.5 px-4">
                    <span className="font-serif font-bold text-zinc-900 text-[14.5px]">
                      {item.name}
                    </span>
                  </td>

                  {/* Agreed Scope */}
                  <td className="py-4.5 px-4">
                    <span className="text-xs text-zinc-600 font-normal">
                      {item.agreedScope}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4.5 px-4">{getStatusBadge(item.status)}</td>

                  {/* Deadline & Revisions */}
                  <td className="py-4.5 px-4">
                    <span className="text-xs text-zinc-600 font-normal">
                      {item.deadline} · <span className="font-light text-zinc-500">{item.revisions}</span>
                    </span>
                  </td>

                  {/* Role-Specific Action Controls */}
                  <td className="py-4.5 px-4 text-center">
                    {role === "brand" ? (
                      item.status === "In review" || item.status === "Submitted" ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApprove(item.id, item.name)}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#1BCFB4] hover:bg-[#15B099] text-zinc-950 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Check size={12} />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRevisionModalItem(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                          >
                            <span>Revise</span>
                          </button>
                        </div>
                      ) : item.status === "Approved" ? (
                        <span className="text-[11px] font-medium text-[#0A7B69] bg-[#1BCFB4]/15 px-3 py-1 rounded-full border border-[#1BCFB4]/30">
                          Approved by you
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-400 font-light italic">
                          Awaiting submission
                        </span>
                      )
                    ) : (
                      /* Creator Actions */
                      item.status === "Not started" ? (
                        <button
                          type="button"
                          onClick={() => setSubmitModalItem(item)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#A05AFF] hover:bg-[#8E44F8] text-white transition-colors cursor-pointer shadow-2xs"
                        >
                          <UploadCloud size={13} />
                          <span>Submit work</span>
                        </button>
                      ) : item.status === "In review" ? (
                        <span className="text-[11px] font-medium text-[#027E9F] bg-[#4BCBEB]/15 px-3 py-1 rounded-full border border-[#4BCBEB]/30">
                          In Brand review
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-[#0A7B69] bg-[#1BCFB4]/15 px-3 py-1 rounded-full border border-[#1BCFB4]/30">
                          Work Approved
                        </span>
                      )
                    )}
                  </td>

                  {/* Reference Link */}
                  <td className="py-4.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedReference(item)}
                      className="text-xs font-medium text-[#A05AFF] hover:text-[#9E58FF] hover:underline transition-colors cursor-pointer"
                    >
                      Reference
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Deliverable Modal (for Creator) */}
      {submitModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSubmitModalItem(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-zinc-900">
                Submit Deliverable · {submitModalItem.name}
              </h3>
              <button
                onClick={() => setSubmitModalItem(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmitDeliverable} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Draft Preview Link (TikTok / Drive / Dropbox)
                </label>
                <input
                  type="url"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://tiktok.com/@amara_okafor/video/..."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#A05AFF]/30 focus:border-[#A05AFF] font-normal"
                  required
                />
              </div>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                Submitting this deliverable sends an instant notification to{" "}
                <strong className="font-semibold text-zinc-700">Northstar Coffee</strong> to review and verify.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalItem(null)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-700 hover:bg-zinc-50 font-normal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#A05AFF] hover:bg-[#8E44F8] text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Revision Modal (for Brand) */}
      {revisionModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setRevisionModalItem(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-zinc-900">
                Request Revision · {revisionModalItem.name}
              </h3>
              <button
                onClick={() => setRevisionModalItem(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleRequestRevision} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Revision Notes (Within agreed scope)
                </label>
                <textarea
                  rows={3}
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="Please adjust the final outro text to highlight the seasonal blend discount code..."
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#A05AFF]/25 focus:border-[#A05AFF] font-normal"
                  required
                />
              </div>
              <p className="text-[11px] text-zinc-500 font-light">
                Per contract terms, this deal includes <strong className="font-semibold text-zinc-700">1 free revision</strong>.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setRevisionModalItem(null)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-700 hover:bg-zinc-50 font-normal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deliverable Reference Modal */}
      {selectedReference && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedReference(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-[#FBF9F5]">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-[#A05AFF]" />
                <h3 className="text-xs font-semibold text-zinc-900">
                  Deliverable Context · {selectedReference.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReference(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#4BCBEB]/15 text-[#027E9F] font-medium text-xs mb-2 border border-[#4BCBEB]/30">
                  {selectedReference.referenceClause}
                </span>
                <h4 className="font-serif text-xl font-bold text-zinc-900 mb-1">
                  {selectedReference.name} ({selectedReference.agreedScope})
                </h4>
                <p className="text-xs text-zinc-500 font-light">
                  Deadline: {selectedReference.deadline} · {selectedReference.revisions}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E5DC] text-xs text-zinc-800 leading-relaxed font-sans font-normal">
                “{selectedReference.referenceText}”
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <span className="text-zinc-500 font-normal">Status</span>
                <div>{getStatusBadge(selectedReference.status)}</div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-100 text-right">
              <button
                onClick={() => setSelectedReference(null)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
