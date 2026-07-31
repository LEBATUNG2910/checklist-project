"use client";

import { Table as TableIcon, List, LayoutGrid, Wand2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import Image from "next/image";

interface Props {
  viewMode: "kanban" | "list" | "table";
  setViewMode: (mode: "kanban" | "list" | "table") => void;
}

const PRIORITY_STYLES = {
  high:   { bg: "bg-red-100 text-red-700 border-red-200",    dot: "bg-red-500",    label: "High" },
  medium: { bg: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400", label: "Medium" },
  low:    { bg: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500", label: "Low" },
};

// Dữ liệu giả lập thành viên trong team (Thay bằng dữ liệu từ DB sau này)
const TEAM_MEMBERS = [
  { id: "1", name: "Alex", avatarUrl: "https://i.pravatar.cc/150?u=alex" },
  { id: "2", name: "Sarah", avatarUrl: "https://i.pravatar.cc/150?u=sarah" },
  { id: "3", name: "Mike", avatarUrl: "https://i.pravatar.cc/150?u=mike" },
  { id: "4", name: "Emily", avatarUrl: "" }, // Không có ảnh sẽ dùng ui-avatars
  { id: "5", name: "David", avatarUrl: "" },
];

export default function BoardActions({ viewMode, setViewMode }: Props) {
  const { columns, applyPriority, clearPriority } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasPriority, setHasPriority] = useState(false);

  const handlePrioritize = async () => {
    setLoading(true);
    setError("");

    const tasks = columns.flatMap((col) =>
      col.tasks.map((t) => ({
        id: t.id,
        title: t.title ?? t.author?.name ?? "Untitled",
        description: t.description,
        columnTitle: col.title,
      }))
    );

    if (tasks.length === 0) {
      setError("No tasks to prioritize.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/ai/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "AI failed. Try again.");
      } else {
        applyPriority(data.results);
        setHasPriority(true);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    clearPriority();
    setHasPriority(false);
    setError("");
  };

  return (
    <div className="px-4 md:px-8 py-4 flex flex-col gap-3 shrink-0 z-10 overflow-hidden">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
        
        {/* THANH CÔNG CỤ: 4 Nút chung 1 hàng, chia đều flex-1 */}
        <div className="flex flex-1 items-center justify-between bg-white shadow-sm p-1 rounded-xl border border-slate-100 min-w-0">
          
          <Button
            variant="ghost"
            onClick={() => setViewMode("table")}
            className={`flex-1 rounded-lg h-8 sm:h-9 px-1 gap-1 sm:gap-2 transition-all min-w-0 ${viewMode === "table" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <TableIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[10px] sm:text-sm font-medium truncate">Table</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setViewMode("list")}
            className={`flex-1 rounded-lg h-8 sm:h-9 px-1 gap-1 sm:gap-2 transition-all min-w-0 ${viewMode === "list" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <List className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[10px] sm:text-sm font-medium truncate">List</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setViewMode("kanban")}
            className={`flex-1 rounded-lg h-8 sm:h-9 px-1 gap-1 sm:gap-2 transition-all min-w-0 ${viewMode === "kanban" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[10px] sm:text-sm font-medium truncate">Kanban</span>
          </Button>

          {/* Đường kẻ chia cách */}
          <div className="w-px h-5 bg-slate-200 mx-0.5 sm:mx-1 shrink-0" />

          {/* Nút AI Sort */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 flex min-w-0">
            <Button
              variant="ghost"
              onClick={handlePrioritize}
              disabled={loading}
              className={`flex-1 w-full rounded-lg h-8 sm:h-9 px-1 gap-1 sm:gap-2 transition-all text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 min-w-0 ${
                hasPriority ? "bg-indigo-50" : ""
              }`}
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              )}
              <span className="text-[10px] sm:text-sm font-medium truncate">
                {loading ? "Wait..." : "AI Sort"}
              </span>
            </Button>
          </motion.div>

          {/* Nút Clear AI (Hiện khi đã sort) */}
          <AnimatePresence>
            {hasPriority && (
              <motion.button
                initial={{ opacity: 0, width: 0, scale: 0.8 }}
                animate={{ opacity: 1, width: "auto", scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.8 }}
                onClick={handleClear}
                className="flex items-center justify-center text-slate-400 hover:text-red-500 px-1 sm:px-2 py-1.5 rounded-lg hover:bg-red-50 transition-all overflow-hidden shrink-0"
              >
                <X className="w-3.5 h-3.5 shrink-0" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Right side: Team avatars (Hiển thị động dựa vào TEAM_MEMBERS) */}
        <div className="flex -space-x-2 shrink-0">
          {TEAM_MEMBERS.slice(0, 3).map((member, index) => (
            <Image
              key={member.id}
              src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
              alt={member.name}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-[#f8f9fd] shadow-sm"
              style={{ zIndex: 30 - index * 10 }}
              width={36}
              height={36}
              unoptimized
            />
          ))}
          
          {TEAM_MEMBERS.length > 3 && (
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border-2 border-[#f8f9fd] bg-slate-100 flex items-center justify-center text-[10px] sm:text-xs font-bold text-slate-600 z-0 shadow-sm">
              +{TEAM_MEMBERS.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2"
          >
            <X className="w-3.5 h-3.5 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Priority legend */}
      <AnimatePresence>
        {hasPriority && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-3 overflow-hidden"
          >
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Priority:
            </span>
            <div className="flex gap-2">
              {Object.entries(PRIORITY_STYLES).map(([key, val]) => (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${val.bg}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${val.dot}`} />
                  {val.label}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 w-full sm:w-auto">
              · Tasks sorted high → low within each column
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}