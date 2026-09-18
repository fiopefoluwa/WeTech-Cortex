interface TermCardProps {
  label: string;
  value: string;
  onViewEvidence?: () => void;
}

export default function TermCard({ label, value, onViewEvidence }: TermCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E5DC] p-6 transition-all duration-150 hover:border-zinc-300 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[148px]">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.14em] text-zinc-400 uppercase mb-3">
          {label}
        </p>
        <h3 className="font-serif text-[17px] md:text-[18px] font-bold text-zinc-900 leading-[1.35] tracking-[-0.01em] mb-4">
          {value}
        </h3>
      </div>
      <div>
        <button
          type="button"
          onClick={onViewEvidence}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#A05AFF] hover:text-[#9E58FF] hover:underline transition-colors cursor-pointer group text-left"
        >
          <span>View source evidence</span>
          <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
        </button>
      </div>
    </div>
  );
}

