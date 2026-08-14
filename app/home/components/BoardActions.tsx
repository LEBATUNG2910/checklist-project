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
  high:   { bg: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",    dot: "bg-red-500 dark:bg-red-400",    label: "High" },
  medium: { bg: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20", dot: "bg-amber-400 dark:bg-amber-400", label: "Medium" },
  low:    { bg: "bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400 border-green-200 dark:border-emerald-500/20", dot: "bg-green-500 dark:bg-emerald-400", label: "Low" },
};

const TEAM_MEMBERS = [
  { id: "1", name: "Alex", avatarUrl: "https://i.pravatar.cc/150?u=alex" },
  { id: "2", name: "Sarah", avatarUrl: "https://i.pravatar.cc/150?u=sarah" },
  { id: "3", name: "Mike", avatarUrl: "https://i.pravatar.cc/150?u=mike" },
  { id: "4", name: "Emily", avatarUrl: "" }, 
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
        
        <div className="flex flex-1 items-center justify-between bg-white dark:bg-slate-900 shadow-sm p-1 rounded-xl border border-slate-100 dark:border-slate-800 min-w-0 transition-colors duration-300">
          
          <Button
            variant="ghost"
            onClick={() => setViewMode("table")}
            className={`flex-1 rounded-lg h-8 sm:h-9 px-1 gap-1 sm:gap-2 transition-all min-w-0 ${viewMode === "table" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <TableIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[10px] sm:text-sm font-medium truncate">Table</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setViewMode("list")}
            className={`flex-1 rounded-lg h-8 sm:h-9 px-1 gap-1 sm:gap-2 transition-all min-w-0 ${viewMode === "list" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <List className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[10px] sm:text-sm font-medium truncate">List</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => setViewMode("kanban")}
            className={`flex-1 rounded-lg h-8 sm:h-9 px-1 gap-1 sm:gap-2 transition-all min-w-0 ${viewMode === "kanban" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
          >
            <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-[10px] sm:text-sm font-medium truncate">Kanban</span>
          </Button>

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5 sm:mx-1 shrink-0 transition-colors" />

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1 flex min-w-0">
            <Button
              variant="ghost"
              onClick={handlePrioritize}
              disabled={loading}
              className={`flex-1 w-full rounded-lg h-8 sm:h-9 px-1 gap-1 sm:gap-2 transition-all text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 min-w-0 ${
                hasPriority ? "bg-indigo-50 dark:bg-indigo-900/30" : ""
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

          <AnimatePresence>
            {hasPriority && (
              <motion.button
                initial={{ opacity: 0, width: 0, scale: 0.8 }}
                animate={{ opacity: 1, width: "auto", scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.8 }}
                onClick={handleClear}
                className="flex items-center justify-center text-slate-400 hover:text-red-500 dark:hover:text-red-400 px-1 sm:px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-all overflow-hidden shrink-0"
              >
                <X className="w-3.5 h-3.5 shrink-0" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg px-3 py-2 flex items-center gap-2"
          >
            <X className="w-3.5 h-3.5 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasPriority && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-3 overflow-hidden"
          >
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
              Priority:
            </span>
            <div className="flex gap-2">
              {Object.entries(PRIORITY_STYLES).map(([key, val]) => (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${val.bg} transition-colors`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${val.dot}`} />
                  {val.label}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 w-full sm:w-auto">
              · Tasks sorted high → low within each column
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}