"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2 } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import PriorityBadge from "./PriorityBadge";

export default function TableView() {
  const { columns, openTaskDetail, openAddModal, deleteTask } = useTaskStore();
  const [completing, setCompleting] = useState<string | null>(null);

  const allTasks = useMemo(() => {
    return columns.flatMap((col) =>
      col.tasks.map((task) => ({
        ...task,
        columnId: col.id,
        statusTitle: col.title,
        statusColor: col.colorClass,
      }))
    );
  }, [columns]);

  const handleDone = async (e: React.MouseEvent, taskId: string, columnId: string) => {
    e.stopPropagation();
    setCompleting(taskId);
    await new Promise((r) => setTimeout(r, 350));
    await deleteTask(taskId, columnId);
    setCompleting(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mx-8 mb-8 transition-colors duration-300"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold transition-colors duration-300">
              <th className="p-4 pl-4 w-10"></th>
              <th className="p-4">Task Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Platform</th>
              <th className="p-4">Assignees</th>
              <th className="p-4">Due Date</th>
              <th className="p-4 pr-6 text-right">Created</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            <AnimatePresence mode="popLayout">
              {allTasks.map((task) => {
                const isDone = completing === task.id;
                return (
                  <motion.tr
                    key={task.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isDone ? 0.4 : 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => openTaskDetail(task, task.columnId)}
                    className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer"
                  >
                    {/* Done button */}
                    <td className="p-4 pl-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleDone(e, task.id, task.columnId)}
                        title="Mark as done"
                        className="text-slate-300 dark:text-slate-600 hover:text-emerald-500 transition-colors"
                      >
                        <CheckCircle2 className={`w-5 h-5 ${isDone ? "text-emerald-500" : ""}`} />
                      </button>
                    </td>

                    {/* Task name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {task.author && (
                          <img src={task.author.avatar} alt={task.author.name}
                            className="w-7 h-7 rounded-full shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className={`font-semibold text-sm transition-colors block truncate ${isDone ? "line-through text-slate-400 dark:text-slate-600" : "text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"}`}>
                            {task.title || (task.author && `${task.author.name}'s task`) || "Untitled Task"}
                          </span>
                          {task.description && (
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate block max-w-[240px]">
                              {task.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md text-xs font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap transition-colors">
                        <span className={`w-1.5 h-1.5 rounded-full ${task.statusColor}`} />
                        {task.statusTitle}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      {task.priority
                        ? <PriorityBadge priority={task.priority} />
                        : <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                      }
                    </td>

                    {/* Platform */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <task.platform.icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-semibold">{task.platform.name}</span>
                      </div>
                    </td>

                    {/* Assignees */}
                    <td className="p-4">
                      <div className="flex -space-x-1.5">
                        {task.assignees.map((assignee, aIdx) => (
                          <img key={aIdx} src={assignee.avatar} alt={assignee.name}
                            title={assignee.name}
                            className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800" />
                        ))}
                        {task.assignees.length === 0 && (
                          <span className="text-xs text-slate-400 dark:text-slate-600 italic">Unassigned</span>
                        )}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="p-4">
                      {task.dueDate ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-md whitespace-nowrap">
                          {task.dueDate}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>

                    {/* Date (Created) */}
                    <td className="p-4 pr-6 text-right text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {task.timestamp}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>

            {allTasks.length === 0 && (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No tasks yet. Add one from the board.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex items-center gap-4 bg-slate-50/60 dark:bg-slate-800/30 transition-colors duration-300">
        {columns.map((col) => (
          <button key={col.id} onClick={() => openAddModal(col.id)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2.5 py-1.5 rounded-lg transition-all">
            <Plus className="w-3.5 h-3.5" /> Add to {col.title}
          </button>
        ))}
      </div>
    </motion.div>
  );
}