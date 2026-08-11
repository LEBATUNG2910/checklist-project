"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ImageIcon, AlignLeft, Tag, Loader2, LayoutGrid, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskStore } from "@/store/taskStore";

const PLATFORMS = ["Gmail", "Slack", "GitHub", "Messenger", "Discord"];

const PLATFORM_COLORS: Record<string, string> = {
  Gmail: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20",
  Slack: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 hover:bg-purple-100 dark:hover:bg-purple-500/20",
  GitHub: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700",
  Messenger: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20",
  Discord: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20",
};

const PLATFORM_ACTIVE: Record<string, string> = {
  Gmail: "bg-red-500 text-white border-red-500 dark:bg-red-600 dark:border-red-600",
  Slack: "bg-purple-500 text-white border-purple-500 dark:bg-purple-600 dark:border-purple-600",
  GitHub: "bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:border-slate-200",
  Messenger: "bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:border-blue-600",
  Discord: "bg-indigo-500 text-white border-indigo-500 dark:bg-indigo-600 dark:border-indigo-600",
};

export default function AddTaskModal() {
  const { isAddModalOpen, addModalTargetColumnId, closeAddModal, addTask, columns } =
    useTaskStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [platform, setPlatform] = useState("Gmail");
  const [dueDate, setDueDate] = useState(""); 
  const [selectedColumnId, setSelectedColumnId] = useState(columns[0]?.id ?? "col-todo");
  const [loading, setLoading] = useState(false);
  const [showImageField, setShowImageField] = useState(false);

  const [prevIsOpen, setPrevIsOpen] = useState(isAddModalOpen);

  if (isAddModalOpen !== prevIsOpen) {
    setPrevIsOpen(isAddModalOpen);
    if (isAddModalOpen) {
      setSelectedColumnId(addModalTargetColumnId ?? columns[0]?.id ?? "col-todo");
    }
  }

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
      dueDate: dueDate || undefined, 
    });
    setTitle("");
    setDescription("");
    setImageUrl("");
    setDueDate("");
    setPlatform("Gmail");
    setShowImageField(false);
    setLoading(false);
    closeAddModal();
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
          <div className="absolute inset-0 bg-slate-900/30 dark:bg-slate-900/70 backdrop-blur-[2px] transition-colors" />

          <motion.div
            className="relative w-full max-w-lg mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${selectedColumn?.colorClass ?? "bg-blue-600"}`} />
                <h2 className="font-bold text-slate-800 dark:text-slate-100 text-[15px] transition-colors">
                  {showColumnSelector ? "New Task" : (
                    <>New task in <span className="text-blue-600 dark:text-blue-400">{selectedColumn?.title}</span></>
                  )}
                </h2>
              </div>
              <button
                onClick={closeAddModal}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {showColumnSelector && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <LayoutGrid className="w-3 h-3" /> Column <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {columns.map((col) => (
                      <button
                        key={col.id}
                        onClick={() => setSelectedColumnId(col.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                          selectedColumnId === col.id
                            ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-sm"
                            : "bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Title <span className="text-red-400">*</span>
                </label>
                <Input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="What needs to be done?"
                  className="h-11 text-sm bg-transparent border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus-visible:ring-blue-400 dark:focus-visible:ring-blue-600 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <AlignLeft className="w-3 h-3" /> Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more context (optional)..."
                  rows={3}
                  className="w-full text-sm bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                />
              </div>

              {/* Grid 2 cột cho Platform và Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
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

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Due Date
                  </label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-10 text-sm bg-transparent border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl focus-visible:ring-blue-400 dark:focus-visible:ring-blue-600 w-full transition-colors style-color-scheme"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <button
                  onClick={() => setShowImageField((v) => !v)}
                  className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors"
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
                        className="h-10 text-sm bg-transparent border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 rounded-xl focus-visible:ring-blue-400 dark:focus-visible:ring-blue-600 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900 transition-colors">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Press{" "}
                <kbd className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1 py-0.5 text-[10px] font-mono shadow-sm">
                  Enter
                </kbd>{" "}
                to save quickly
              </p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={closeAddModal}
                  className="h-9 px-4 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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