"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Wand2, CheckSquare, Clock, AtSign, Info, Check } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";

const TYPE_CONFIG = {
  mention:  { icon: AtSign,       color: "text-blue-500 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-500/20" },
  ai:       { icon: Wand2,        color: "text-indigo-500 dark:text-indigo-400",  bg: "bg-indigo-50 dark:bg-indigo-500/20" },
  task:     { icon: CheckSquare,  color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/20" },
  deadline: { icon: Clock,        color: "text-orange-500 dark:text-orange-400",  bg: "bg-orange-50 dark:bg-orange-500/20" },
  system:   { icon: Info,         color: "text-slate-400 dark:text-slate-500",   bg: "bg-slate-50 dark:bg-slate-800" },
};

type NotificationType = "mention" | "ai" | "task" | "deadline" | "system";

interface LocalNotif {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  taskRef?: any;
  colId?: string;
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<LocalNotif[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  
  const { columns, openTaskDetail } = useTaskStore();

  useEffect(() => {
    const allTasks = columns.flatMap(col => 
      col.tasks.map(task => ({ task, colId: col.id, colTitle: col.title }))
    );
    
    setNotifications(prev => {
      const prevMap = new Map(prev.map(p => [p.id, p]));
      
      const mapped: LocalNotif[] = allTasks.map(({ task, colId, colTitle }) => {
        const existing = prevMap.get(task.id);
        return {
          id: task.id,
          type: "task",
          title: `New task in ${colTitle}`,
          body: task.title || (task.author ? `${task.author.name}'s task` : "Untitled Task"),
          timestamp: task.timestamp,
          read: existing ? existing.read : false, 
          avatar: task.author?.avatar || task.assignees?.[0]?.avatar,
          taskRef: task,
          colId: colId
        };
      });
      
      return mapped;
    });
  }, [columns]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handler);
    };
  }, [open]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleNotificationClick = (n: LocalNotif) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === n.id ? { ...notif, read: true } : notif))
    );
    if (n.taskRef && n.colId) {
      openTaskDetail(n.taskRef, n.colId);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 border-2 border-white dark:border-slate-950 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 transition-colors">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[72px] right-16 w-[360px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[9999] flex flex-col transition-colors duration-300"
            style={{ maxHeight: "480px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0 transition-colors">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {notifications.map((n) => {
                const cfg = TYPE_CONFIG[n.type];
                const Icon = cfg.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left border-b border-slate-50 dark:border-slate-800/50 last:border-0 ${
                      !n.read ? "bg-blue-50/30 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    {n.avatar ? (
                      <div className="relative shrink-0">
                        <img src={n.avatar} className="w-9 h-9 rounded-full" alt="" />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${cfg.bg}`}>
                          <Icon className={`w-2.5 h-2.5 ${cfg.color}`} />
                        </span>
                      </div>
                    ) : (
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${cfg.bg}`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-slate-800 dark:text-slate-200" : "font-medium text-slate-600 dark:text-slate-400"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {n.body}
                      </p>
                      <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1 font-medium">
                        {n.timestamp}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })}
              
              {notifications.length === 0 && (
                <div className="px-4 py-8 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No notifications yet.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900 shrink-0 transition-colors">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">
                Click a notification to mark it as read and view task
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}