"use client";

import { MoreHorizontal, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useTaskStore } from "@/store/taskStore";
import PriorityBadge from "./PriorityBadge";

export default function ListView() {
  const { columns, openTaskDetail, openAddModal } = useTaskStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="px-8 pb-8 space-y-8"
    >
      {columns.map((column) => (
        <div key={column.id} className="space-y-3">
          {/* Column header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${column.colorClass}`} />
              <h3 className="font-bold text-slate-800 text-[15px] uppercase tracking-wide">
                {column.title}
              </h3>
              <span className="text-xs font-bold text-slate-500 ml-1 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full shadow-sm">
                {column.tasks.length}
              </span>
            </div>
            <button
              onClick={() => openAddModal(column.id)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add task
            </button>
          </div>

          {/* Task rows */}
          <div className="space-y-2">
            {column.tasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onClick={() => openTaskDetail(task, column.id)}
                className="bg-white border border-slate-100 p-3 rounded-xl flex items-center justify-between hover:border-blue-200 hover:shadow-sm transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="text-slate-300 group-hover:text-blue-500 shrink-0">
                    <MoreHorizontal className="w-5 h-5 rotate-90" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors truncate">
                      {task.title ||
                        (task.author && `${task.author.name}'s task`) ||
                        "Untitled Task"}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <task.platform.icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[11px] font-semibold uppercase">
                          {task.platform.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[11px] font-medium">{task.timestamp}</span>
                      </div>
                      {task.description && (
                        <span className="text-[11px] text-slate-300 truncate max-w-[180px] hidden sm:block">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 ml-4">
                  {/* Status pill */}
                  <span className="hidden md:inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-500">
                    <span className={`w-1.5 h-1.5 rounded-full ${column.colorClass}`} />
                    {column.title}
                  </span>

                  <PriorityBadge priority={task.priority} />

                  {/* Assignees */}
                  <div className="flex -space-x-1.5">
                    {task.assignees.map((assignee, idx) => (
                      <img
                        key={idx}
                        src={assignee.avatar}
                        alt={assignee.name}
                        className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 shadow-sm"
                        title={assignee.name}
                      />
                    ))}
                    {task.assignees.length === 0 && (
                      <span className="text-[11px] text-slate-300 italic">Unassigned</span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // don't open detail panel
                    }}
                    className="h-8 w-8 p-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}

            {column.tasks.length === 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => openAddModal(column.id)}
                className="w-full py-5 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 text-sm text-slate-400 font-medium hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add first task
              </motion.button>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}