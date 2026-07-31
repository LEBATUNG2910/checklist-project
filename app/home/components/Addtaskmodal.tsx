"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ImageIcon, AlignLeft, Tag, Loader2, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "@/store/taskStore";

const PLATFORMS = ["Gmail", "Slack", "GitHub", "Messenger", "Discord"];

const PLATFORM_COLORS: Record<string, string> = {
  Gmail: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
  Slack: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
  GitHub: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
  Messenger: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
  Discord: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100",
};

const PLATFORM_ACTIVE: Record<string, string> = {
  Gmail: "bg-red-500 text-white border-red-500",
  Slack: "bg-purple-500 text-white border-purple-500",
  GitHub: "bg-slate-800 text-white border-slate-800",
  Messenger: "bg-blue-500 text-white border-blue-500",
  Discord: "bg-indigo-500 text-white border-indigo-500",
};

export default function AddTaskModal() {
  const { isAddModalOpen, addModalTargetColumnId, closeAddModal, addTask, columns } =
    useTaskStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [platform, setPlatform] = useState("Gmail");
  const [selectedColumnId, setSelectedColumnId] = useState(columns[0]?.id ?? "col-todo");
  const [loading, setLoading] = useState(false);
  const [showImageField, setShowImageField] = useState(false);

  // Track previous open state to detect when the modal is toggled open
  const [prevIsOpen, setPrevIsOpen] = useState(isAddModalOpen);

  // Sync state during render instead of inside useEffect to prevent cascading renders
  if (isAddModalOpen !== prevIsOpen) {
    setPrevIsOpen(isAddModalOpen);
    if (isAddModalOpen) {
      setSelectedColumnId(addModalTargetColumnId ?? columns[0]?.id ?? "col-todo");
    }
  }

  // true = opened from Manual Task button (no preselected column)
  const showColumnSelector = !addModalTargetColumnId;

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    addTask({
      title: title.trim(),
      description: description.trim(),
      platformName: platform,
      columnId: selectedColumnId,
      imageUrl: imageUrl.trim() || undefined,
    });
    setTitle("");
    setDescription("");
    setImageUrl("");
    setPlatform("Gmail");
    setShowImageField(false);
    setLoading(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeAddModal();
  };

  const selectedColumn = columns.find((c) => c.id === selectedColumnId);

  return (
    <AnimatePresence>
      {isAddModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]" />

          <motion.div
            className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${selectedColumn?.colorClass ?? "bg-blue-600"}`} />
                <h2 className="font-bold text-slate-800 text-[15px]">
                  {showColumnSelector ? "New Task" : (
                    <>New task in <span className="text-blue-600">{selectedColumn?.title}</span></>
                  )}
                </h2>
              </div>
              <button
                onClick={closeAddModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">

              {/* Column selector — only shows when opened from Manual Task */}
              {showColumnSelector && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <LayoutGrid className="w-3 h-3" /> Column <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {columns.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => setSelectedColumnId(col.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                          selectedColumnId === col.id
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${col.colorClass}`} />
                        {col.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Title <span className="text-red-400">*</span>
                </label>
                <Input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="What needs to be done?"
                  className="h-11 text-sm border-slate-200 rounded-xl focus-visible:ring-blue-400 placeholder:text-slate-300"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <AlignLeft className="w-3 h-3" /> Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more context (optional)..."
                  rows={3}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-300 text-slate-700"
                />
              </div>

              {/* Platform */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> Platform
                </label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        platform === p ? PLATFORM_ACTIVE[p] : PLATFORM_COLORS[p]
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <button
                  onClick={() => setShowImageField((v) => !v)}
                  className="text-[11px] font-semibold text-slate-400 hover:text-blue-500 flex items-center gap-1.5 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  {showImageField ? "Remove image" : "Add image URL (optional)"}
                </button>
                <AnimatePresence>
                  {showImageField && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-2"
                    >
                      <Input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="h-10 text-sm border-slate-200 rounded-xl focus-visible:ring-blue-400 placeholder:text-slate-300"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <p className="text-[11px] text-slate-400">
                Press{" "}
                <kbd className="bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] font-mono shadow-sm">
                  Enter
                </kbd>{" "}
                to save quickly
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={closeAddModal}
                  className="h-9 px-4 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!title.trim() || loading}
                  className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-40"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Task"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}