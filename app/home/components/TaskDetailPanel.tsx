"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, Trash2, ArrowRight, Clock, Tag, AlignLeft,
  CheckCircle2, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTaskStore } from "@/store/taskStore";
import PriorityBadge from "./PriorityBadge";

const STATUS_CONFIG = {
  "col-todo": {
    label: "To Do",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-600",
  },
  "col-progress": {
    label: "In Progress",
    color: "bg-slate-100 text-slate-700",
    dot: "bg-slate-800",
  },
  "col-review": {
    label: "In Review",
    color: "bg-orange-100 text-orange-700",
    dot: "bg-orange-400",
  },
};

export default function TaskDetailPanel() {
  const {
    selectedTask,
    selectedTaskColumnId,
    closeTaskDetail,
    updateTask,
    deleteTask,
    moveTask,
    columns,
  } = useTaskStore();

  const isOpen = !!selectedTask;

  // Local editable state
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Animation state for the "Done" button
  const [completing, setCompleting] = useState(false);

  // Sync when task changes
  useEffect(() => {
    if (selectedTask) {
      setEditTitle(selectedTask.title ?? selectedTask.author?.name ?? "");
      setEditDesc(selectedTask.description ?? "");
      setIsDirty(false);
      setCompleting(false);
    }
  }, [selectedTask?.id]);

  const handleSave = () => {
    if (!selectedTask) return;
    updateTask(selectedTask.id, {
      title: editTitle || undefined,
      description: editDesc || undefined,
    });
    setIsDirty(false);
  };

  const handleDelete = () => {
    if (!selectedTask || !selectedTaskColumnId) return;
    deleteTask(selectedTask.id, selectedTaskColumnId);
  };

  const handleDone = async () => {
    if (!selectedTask || !selectedTaskColumnId) return;
    setCompleting(true);
    // Wait for the animation to play before deleting
    await new Promise((r) => setTimeout(r, 350));
    await deleteTask(selectedTask.id, selectedTaskColumnId);
    setCompleting(false);
    closeTaskDetail();
  };

  const handleMove = (toColumnId: string) => {
    if (!selectedTask || !selectedTaskColumnId) return;
    moveTask(selectedTask.id, selectedTaskColumnId, toColumnId);
    setShowMoveMenu(false);
  };

  const currentStatus = STATUS_CONFIG[selectedTaskColumnId as keyof typeof STATUS_CONFIG];
  const otherColumns = columns.filter((c) => c.id !== selectedTaskColumnId);

  return (
    <AnimatePresence>
      {isOpen && selectedTask && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTaskDetail}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white shadow-2xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ 
              x: 0,
              opacity: completing ? 0.4 : 1,
              scale: completing ? 0.96 : 1
            }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 35 }}
          >
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                {currentStatus && (
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${currentStatus.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot}`} />
                    {currentStatus.label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {/* Done button */}
                <button
                  onClick={handleDone}
                  title="Mark as done"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
                >
                  <CheckCircle2 className={`w-5 h-5 ${completing ? "text-emerald-500" : ""}`} />
                </button>

                {/* Move button */}
                <div className="relative">
                  <button
                    onClick={() => setShowMoveMenu((v) => !v)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-all"
                  >
                    <ArrowRight className="w-3.5 h-3.5" /> Move <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {showMoveMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-slate-100 shadow-xl overflow-hidden z-10"
                      >
                        {otherColumns.map((col) => (
                          <button
                            key={col.id}
                            onClick={() => handleMove(col.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                          >
                            <span className={`w-2 h-2 rounded-full ${col.colorClass}`} />
                            {col.title}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeTaskDetail}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Scrollable Body ────────────────────────────────── */}
            <div className={`flex-1 overflow-y-auto px-6 py-5 space-y-6 ${completing ? "pointer-events-none" : ""}`}>
              {selectedTask.author && (
                <div className="flex items-center gap-3">
                  <img src={selectedTask.author.avatar} className="w-10 h-10 rounded-full ring-2 ring-slate-100" alt={selectedTask.author.name} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{selectedTask.author.name}</p>
                    <p className="text-xs text-slate-400">Task author</p>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" /> Title
                </label>
                <input
                  value={editTitle}
                  onChange={(e) => {
                    setEditTitle(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full text-lg font-bold text-slate-800 bg-slate-50 rounded-xl px-3 py-2.5 border border-transparent focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <AlignLeft className="w-3 h-3" /> Description
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => {
                    setEditDesc(e.target.value);
                    setIsDirty(true);
                  }}
                  rows={4}
                  placeholder="Add a description..."
                  className="w-full text-sm text-slate-700 bg-slate-50 rounded-xl px-3 py-2.5 border border-transparent focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none placeholder:text-slate-300"
                />
              </div>

              {selectedTask.imageUrl && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Attachment
                  </label>
                  <div className="rounded-xl overflow-hidden h-48 bg-slate-100">
                    <img src={selectedTask.imageUrl} alt="attachment" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> Platform
                  </label>
                  <div className="text-sm font-semibold text-slate-700 bg-slate-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
                    <selectedTask.platform.icon className="w-4 h-4 text-slate-500" />
                    {selectedTask.platform.name}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> Created
                  </label>
                  <div className="text-sm text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5">
                    {selectedTask.timestamp}
                  </div>
                </div>
              </div>

              {selectedTask.priority && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Priority
                  </label>
                  <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                    <PriorityBadge priority={selectedTask.priority} />
                  </div>
                </div>
              )}

              {selectedTask.assignees.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Assignees
                  </label>
                  <div className="flex flex-col gap-2">
                    {selectedTask.assignees.map((user) => (
                      <div key={user.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
                        <img src={user.avatar} className="w-7 h-7 rounded-full" alt={user.name} />
                        <span className="text-sm font-medium text-slate-700">{user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Footer ─────────────────────────────────────────── */}
            <div className="px-6 py-4 border-t border-slate-100 shrink-0 bg-slate-50/60">
              <AnimatePresence>
                {isDirty ? (
                  <motion.div
                    key="save"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-center justify-between"
                  >
                    <p className="text-xs text-slate-400">You have unsaved changes</p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditTitle(selectedTask.title ?? selectedTask.author?.name ?? "");
                          setEditDesc(selectedTask.description ?? "");
                          setIsDirty(false);
                        }}
                        className="h-9 px-4 rounded-xl text-slate-500 hover:bg-slate-100 text-sm"
                      >
                        Discard
                      </Button>
                      <Button onClick={handleSave} className="h-9 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-sm">
                        Save changes
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-slate-400 text-center"
                  >
                    Click any field to edit
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}