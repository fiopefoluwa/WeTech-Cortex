"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import CreateDealRoomModal from "./CreateDealRoomModal";
import { useUser } from "@/app/context/UserContext";
import {
  LayoutGrid,
  FileText,
  MessageSquare,
  Layers,
  Video,
  ShieldCheck,
  GitBranch,
  Receipt,
  Clock,
  Plus,
  X,
} from "lucide-react";

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  grid: LayoutGrid,
  file: FileText,
  message: MessageSquare,
  check: Layers,
  play: Video,
  shield: ShieldCheck,
  branch: GitBranch,
  credit: Receipt,
  clock: Clock,
};

const navItems = [
  { label: "Overview", href: "", icon: "grid" },
  { label: "Agreement", href: "/agreement", icon: "file" },
  { label: "Messages", href: "/messages", icon: "message" },
  { label: "Deliverables", href: "/deliverables", icon: "check" },
  { label: "Content", href: "/content", icon: "play" },
  { label: "Licensing", href: "/licensing", icon: "shield" },
  { label: "Change Requests", href: "/change-requests", icon: "branch" },
  { label: "Payments", href: "/payments", icon: "credit" },
  { label: "Activity", href: "/activity", icon: "clock" },
];

interface SidebarProps {
  dealId: string;
  dealName: string;
  brandName: string;
  creatorName: string;
}

export default function Sidebar({
  dealId,
  dealName,
  brandName,
  creatorName,
}: SidebarProps) {
  const [createDealOpen, setCreateDealOpen] = useState(false);
  const pathname = usePathname();
  const basePath = `/deals/${dealId}`;
  const { isMobileMenuOpen, setMobileMenuOpen } = useUser();

  const renderNavContent = () => (
    <>
      {/* Brand Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
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
            <h1 className="text-[16px] font-bold tracking-tight text-white font-serif">
              AgreementOS
            </h1>
            <p className="text-[11px] text-zinc-500 font-light font-sans -mt-0.5">work made clear</p>
          </div>
        </div>
      </div>

      {/* Current Deal Room card */}
      <div className="mx-4 mb-5 px-3.5 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08]">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-zinc-500 uppercase mb-1.5 font-sans">
          Current Deal Room
        </p>
        <p className="text-[14px] font-bold text-white leading-snug font-serif">
          {dealName}
        </p>
        <p className="text-[11px] text-zinc-400 mt-0.5 font-light font-sans">
          {brandName} • {creatorName}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const fullPath =
            item.href === "" ? basePath : `${basePath}${item.href}`;
          const isActive =
            item.href === ""
              ? pathname === basePath || pathname === `${basePath}/`
              : pathname.startsWith(fullPath);
          const IconComponent = iconMap[item.icon];

          return (
            <Link
              key={item.label}
              href={fullPath}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] transition-all duration-150 ${
                isActive
                  ? "bg-gradient-to-r from-[#A05AFF] to-[#9E58FF] text-white shadow-xs font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.06] font-normal"
              }`}
            >
              {IconComponent && (
                <IconComponent
                  size={16}
                  className={isActive ? "text-white" : "text-zinc-400"}
                />
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* New Deal Room Button */}
      <div className="px-4 pb-5 pt-4 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={() => {
            setCreateDealOpen(true);
            setMobileMenuOpen(false);
          }}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-zinc-700 text-[13px] font-medium text-zinc-300 hover:bg-white/[0.08] hover:text-white hover:border-zinc-500 transition-all duration-150 cursor-pointer"
        >
          <Plus size={14} />
          <span>New Deal Room</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] min-w-[260px] h-screen max-h-screen bg-brand-dark flex-shrink-0 overflow-hidden sticky top-0 border-r border-zinc-900">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs flex animate-in fade-in duration-150"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-[280px] max-w-[85vw] h-full bg-brand-dark flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>

            {renderNavContent()}
          </div>
        </div>
      )}

      {/* Create Deal Room Modal */}
      <CreateDealRoomModal
        isOpen={createDealOpen}
        onClose={() => setCreateDealOpen(false)}
      />
    </>
  );
}
