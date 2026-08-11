"use client";

import { Plus, MoreHorizontal, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskStore } from "@/store/taskStore";
import PriorityBadge from "./PriorityBadge";
import { useState } from "react";

const getStickyNoteStyle = (colIndex: number, taskIndex: number) => {
  const styles = [
    "bg-[#fef3c7] dark:bg-amber-500/10 border-[#fde68a] dark:border-amber-500/20 text-amber-900 dark:text-amber-200",
    "bg-[#dcfce7] dark:bg-emerald-500/10 border-[#bbf7d0] dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-200",
    "bg-[#fce7f3] dark:bg-pink-500/10 border-[#fbcfe8] dark:border-pink-500/20 text-pink-900 dark:text-pink-200",
    "bg-[#e0e7ff] dark:bg-indigo-500/10 border-[#c7d2fe] dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-200",
    "bg-[#e0f2fe] dark:bg-sky-500/10 border-[#bae6fd] dark:border-sky-500/20 text-sky-900 dark:text-sky-200",
  ];
  return styles[(colIndex + taskIndex) % styles.length];
};

const TASKS_PER_PAGE = 3;

export default function KanbanView() {
  const { columns, openAddModal, openTaskDetail, deleteTask } = useTaskStore();
  const [columnPages, setColumnPages] = useState<Record<string, number>>({});
  const [completing, setCompleting] = useState<string | null>(null);

  const handlePageChange = (columnId: string, pageIndex: number) => {
    setColumnPages((prev) => ({ ...prev, [columnId]: pageIndex }));
  };

  const handleDone = async (e: React.MouseEvent, taskId: string, columnId: string) => {
    e.stopPropagation();
    setCompleting(taskId);
    await new Promise((r) => setTimeout(r, 400));
    await deleteTask(taskId, columnId);
    setCompleting(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 px-4 md:px-8 pb-8 overflow-y-auto md:overflow-x-auto z-10"
    >
      <div className="flex flex-col md:flex-row gap-8 h-full items-start w-full md:min-w-max pt-2">
        {columns.map((column, colIndex) => {
          const currentPage = columnPages[column.id] || 0;
          const totalPages = Math.ceil(column.tasks.length / TASKS_PER_PAGE);
          const visibleTasks = column.tasks.slice(
            currentPage * TASKS_PER_PAGE,
            (currentPage + 1) * TASKS_PER_PAGE
          );

          return (
            <div key={column.id} className="w-full md:w-[340px] shrink-0 flex flex-col gap-5">
              {/* Column header */}
              <div className="flex items-center justify-between mb-2 sticky top-0 bg-[#f8f9fd]/90 dark:bg-slate-950/90 backdrop-blur-sm z-10 py-2 rounded-lg px-1 transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${column.colorClass} shadow-sm`} />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[17px] uppercase tracking-wide">
                    {column.title}
                  </h3>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-full shadow-sm">
                    {column.tasks.length}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                  <button onClick={() => openAddModal(column.id)}
                    className="p-1.5 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded-lg transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex flex-col gap-5 min-h-[100px] md:min-h-[300px]">
                <AnimatePresence mode="popLayout">
                  {visibleTasks.map((task, idx) => {
                    const actualIndex = currentPage * TASKS_PER_PAGE + idx;
                    const rotationAngles = [1.2, -1.5, 0.8, -1.1, 1.6, -0.9, 1.4, -1.3];
                    const rotateDeg = rotationAngles[(colIndex + actualIndex) % rotationAngles.length];
                    const stickyStyle = getStickyNoteStyle(colIndex, actualIndex);
                    const isDone = completing === task.id;

                    return (
                      <motion.div
                        key={task.id}
                        layoutId={task.id}
                        onClick={() => openTaskDetail(task, column.id)}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{
                          opacity: isDone ? 0 : 1,
                          y: isDone ? -20 : 0,
                          rotate: isDone ? 0 : rotateDeg,
                          scale: isDone ? 0.85 : 1,
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        whileHover={!isDone ? { scale: 1.03, rotate: 0, y: -5, zIndex: 50, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" } : {}}
                        whileTap={!isDone ? { cursor: "grabbing", scale: 0.98 } : {}}
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                        className={`relative p-5 rounded-bl-2xl rounded-br-md rounded-tr-2xl rounded-tl-md border ${stickyStyle} shadow-[2px_4px_12px_rgba(0,0,0,0.05)] dark:shadow-none cursor-pointer group ${isDone ? "pointer-events-none" : ""} transition-colors duration-300`}
                      >
                        {/* Tape strip */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 dark:bg-white/10 backdrop-blur-[2px] rotate-[-2deg] shadow-sm border border-white/20 dark:border-white/10" />

                        {/* Done button */}
                        <button
                          onClick={(e) => handleDone(e, task.id, column.id)}
                          title="Mark as done"
                          className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-0.5 rounded-full hover:scale-110 active:scale-95"
                        >
                          {isDone ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </motion.div>
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500/70 hover:text-emerald-500" />
                          )}
                        </button>

                        {/* Priority badge */}
                        {task.priority && (
                          <div className="absolute top-3 right-3">
                            <PriorityBadge priority={task.priority} />
                          </div>
                        )}

                        {/* Author & Timestamps */}
                        {task.author ? (
                          <div className="flex items-center gap-3 mb-4 mt-1 pl-4">
                            <img src={task.author.avatar} alt={task.author.name}
                              className="w-9 h-9 rounded-full ring-2 ring-white/50 dark:ring-white/10 shadow-sm shrink-0" />
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold truncate">{task.author.name}</h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[11px] opacity-70 font-medium">{task.timestamp}</p>
                                {task.dueDate && (
                                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                                    <Clock className="w-3 h-3" /> {task.dueDate}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4 mt-1 pr-14 pl-4">
                            <h4 className="text-[16px] font-bold mb-1 leading-snug">{task.title}</h4>
                            <div className="flex items-center gap-2">
                              <p className="text-[11px] opacity-70 font-medium">{task.timestamp}</p>
                              {task.dueDate && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                                  <Clock className="w-3 h-3" /> {task.dueDate}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Task image */}
                        {task.imageUrl && (
                          <div className="mb-4 rounded-xl overflow-hidden h-36 border border-white/30 dark:border-white/10 shadow-inner">
                            <img src={task.imageUrl} alt="attachment"
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                          </div>
                        )}

                        {/* Description */}
                        {task.description && (
                          <p className="text-[13px] opacity-80 mb-4 leading-relaxed line-clamp-3 font-medium">
                            {task.description}
                          </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/10">
                          <div className="flex items-center gap-1.5 opacity-70">
                            <task.platform.icon className="w-4 h-4" />
                            <span className="text-[11px] font-bold uppercase tracking-wider">
                              {task.platform.name}
                            </span>
                          </div>
                          <div className="flex -space-x-2">
                            {task.assignees.map((assignee, i) => (
                              <img key={i} src={assignee.avatar} alt={assignee.name}
                                className="w-7 h-7 rounded-full border-2 border-white/50 dark:border-white/10 shadow-sm" />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {column.tasks.length === 0 && (
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={() => openAddModal(column.id)}
                    className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl py-8 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all flex flex-col items-center gap-2 text-sm font-medium">
                    <Plus className="w-5 h-5" />
                    Add first task
                  </motion.button>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-2 pb-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button key={index} onClick={() => handlePageChange(column.id, index)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        index === currentPage
                          ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md scale-110"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                      }`}>
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}