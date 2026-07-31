// app/home/components/PriorityBadge.tsx
import { Priority } from "@/types/dashboard";

const STYLES: Record<NonNullable<Priority>, { label: string; dot: string; bg: string }> = {
  high:   { label: "High",   dot: "bg-red-500",    bg: "bg-red-100 text-red-700 border-red-200" },
  medium: { label: "Medium", dot: "bg-amber-400",  bg: "bg-amber-100 text-amber-700 border-amber-200" },
  low:    { label: "Low",    dot: "bg-green-500",  bg: "bg-green-100 text-green-700 border-green-200" },
};

export default function PriorityBadge({ priority }: { priority?: Priority }) {
  if (!priority) return null;
  const s = STYLES[priority];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${s.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}