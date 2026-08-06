"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Wand2, CheckSquare, Clock, AtSign, Info, Check } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";

const TYPE_CONFIG = {
  mention:  { icon: AtSign,       color: "text-blue-500",    bg: "bg-blue-50" },
  ai:       { icon: Wand2,        color: "text-indigo-500",  bg: "bg-indigo-50" },
  task:     { icon: CheckSquare,  color: "text-emerald-500", bg: "bg-emerald-50" },
  deadline: { icon: Clock,        color: "text-orange-500",  bg: "bg-orange-50" },
  system:   { icon: Info,         color: "text-slate-400",   bg: "bg-slate-50" },
};

type NotificationType = "mention" | "ai" | "task" | "deadline" | "system";

// Extended local type to handle real tasks
interface LocalNotif {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
  // Internal references to open the panel
  taskRef?: any;
  colId?: string;
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<LocalNotif[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  
  const { columns, openTaskDetail } = useTaskStore();

  // Sync real tasks from store to local notification state
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
          read: existing ? existing.read : false, // Preserve read state locally
          avatar: task.author?.avatar || task.assignees?.[0]?.avatar,
          taskRef: task,
          colId: colId
        };
      });
      
      return mapped;
    });
  }, [columns]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click — dùng useEffect thay vì backdrop div
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    // Dùng setTimeout để tránh click button đóng ngay lập tức
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

  // Combine marking as read with opening the TaskDetailPanel
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
        className="relative text-slate-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1">
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
            className="fixed top-[72px] right-16 w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999] flex flex-col"
            style={{ maxHeight: "480px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition-colors"
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
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0 ${
                      !n.read ? "bg-blue-50/30" : ""
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
                      <p className={`text-sm leading-snug ${!n.read ? "font-semibold text-slate-800" : "font-medium text-slate-600"}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {n.body}
                      </p>
                      <p className="text-[10px] text-slate-300 mt-1 font-medium">
                        {n.timestamp}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />
                    )}
                  </button>
                );
              })}
              
              {notifications.length === 0 && (
                <div className="px-4 py-8 text-center text-slate-400 text-sm">
                  No notifications yet.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 shrink-0">
              <p className="text-[11px] text-slate-400 text-center">
                Click a notification to mark it as read and view task
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}