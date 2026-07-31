"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import PriorityBadge from "./PriorityBadge";

export default function TableView() {
  const { columns, openTaskDetail, openAddModal } = useTaskStore();

  // Flatten all tasks, carrying column info for status display
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mx-8 mb-8"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 pl-6">Task Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Platform</th>
              <th className="p-4">Assignees</th>
              <th className="p-4 pr-6 text-right">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {allTasks.map((task) => (
              <motion.tr
                key={task.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => openTaskDetail(task, task.columnId)}
                className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
              >
                {/* Task name */}
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    {task.author && (
                      <img
                        src={task.author.avatar}
                        alt={task.author.name}
                        className="w-7 h-7 rounded-full shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors block truncate">
                        {task.title ||
                          (task.author && `${task.author.name}'s task`) ||
                          "Untitled Task"}
                      </span>
                      {task.description && (
                        <span className="text-[11px] text-slate-400 truncate block max-w-[240px]">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-bold text-slate-600 whitespace-nowrap">
                    <span className={`w-1.5 h-1.5 rounded-full ${task.statusColor}`} />
                    {task.statusTitle}
                  </span>
                </td>

                {/* Priority */}
                <td className="p-4">
  {task.priority
    ? <PriorityBadge priority={task.priority} />
    : <span className="text-xs text-slate-300">—</span>
  }
</td>

                {/* Platform */}
                <td className="p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <task.platform.icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-semibold">{task.platform.name}</span>
                  </div>
                </td>

                {/* Assignees */}
                <td className="p-4">
                  <div className="flex -space-x-1.5">
                    {task.assignees.map((assignee, aIdx) => (
                      <img
                        key={aIdx}
                        src={assignee.avatar}
                        alt={assignee.name}
                        title={assignee.name}
                        className="w-6 h-6 rounded-full border-2 border-white bg-slate-100"
                      />
                    ))}
                    {task.assignees.length === 0 && (
                      <span className="text-xs text-slate-400 italic">Unassigned</span>
                    )}
                  </div>
                </td>

                {/* Date */}
                <td className="p-4 pr-6 text-right text-sm font-medium text-slate-500 whitespace-nowrap">
                  {task.timestamp}
                </td>
              </motion.tr>
            ))}

            {/* Empty state row */}
            {allTasks.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400 text-sm">
                  No tasks yet. Add one from the board.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: quick add per column */}
      <div className="border-t border-slate-100 px-6 py-3 flex items-center gap-4 bg-slate-50/60">
        {columns.map((col) => (
          <button
            key={col.id}
            onClick={() => openAddModal(col.id)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add to {col.title}
          </button>
        ))}
      </div>
    </motion.div>
  );
}