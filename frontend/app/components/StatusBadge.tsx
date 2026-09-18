
interface StatusBadgeProps {
  label: string;
  variant: "green" | "red" | "orange" | "grey" | "blue" | "cyan" | "violet" | "outline";
  icon?: React.ReactNode;
  size?: "sm" | "md";
}

export default function StatusBadge({
  label,
  variant,
  icon,
  size = "sm",
}: StatusBadgeProps) {
  const sizeClasses =
    size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  const variantClasses: Record<string, string> = {
    green: "bg-[#1BCFB4]/15 text-[#0A7B69] border border-[#1BCFB4]/35",
    red: "bg-[#FE9496]/20 text-[#B82B30] border border-[#FE9496]/45",
    orange: "bg-[#FE9496]/20 text-[#B82B30] border border-[#FE9496]/45",
    grey: "bg-zinc-100 text-zinc-600 border border-zinc-200",
    blue: "bg-[#A05AFF]/15 text-[#702AE0] border border-[#A05AFF]/35",
    cyan: "bg-[#4BCBEB]/15 text-[#027E9F] border border-[#4BCBEB]/35",
    violet: "bg-[#9E58FF]/15 text-[#6B21D8] border border-[#9E58FF]/35",
    outline: "bg-transparent text-zinc-600 border border-zinc-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses} ${variantClasses[variant]}`}
    >
      {icon}
      {label}
    </span>
  );
}
