import { Priority } from "@/types/dashboard";

const STYLES: Record<NonNullable<Priority>, { label: string; dot: string; bg: string }> = {
  high:   { label: "High",   dot: "bg-red-500 dark:bg-red-400",    bg: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20" },
  medium: { label: "Medium", dot: "bg-amber-400 dark:bg-amber-400",  bg: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20" },
  low:    { label: "Low",    dot: "bg-green-500 dark:bg-emerald-400",  bg: "bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400 border-green-200 dark:border-emerald-500/20" },
};

export default function PriorityBadge({ priority }: { priority?: Priority }) {
  if (!priority) return null;
  const s = STYLES[priority];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${s.bg} transition-colors`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} transition-colors`} />
      {s.label}
    </span>
  );
}