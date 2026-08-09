"use client";

import { Settings, Moon, BrainCircuit, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { MENU_ITEMS, MESSAGE_ITEMS } from "@/lib/mock-data";
import { useUIStore, MenuKey } from "@/store/uiStore";
import { useTaskStore } from "@/store/taskStore";
import { MessagePlatform } from "@/lib/mock-messages";
import { AnimatePresence, motion } from "framer-motion";

const LABEL_TO_KEY: Record<string, MenuKey> = {
  "Dashboard": "dashboard",
  "Tasks": "tasks",
  "Microsoft Team": "microsoft-team",
  "Slack": "slack",
  "GitHub": "github",
  "Messenger": "messenger",
  "Gmail": "gmail",
  "Discord": "discord",
};

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { activeMenu, setActiveMenu } = useUIStore();
  const { columns } = useTaskStore();

  const getDynamicUnreadCount = (label: string) => {
    let count = 0;
    columns.forEach(col => {
      col.tasks.forEach(task => {
        if (task.platform.name.toLowerCase() === label.toLowerCase()) count++;
      });
    });
    return count;
  };

  const handleMenuClick = (key: MenuKey) => {
    setActiveMenu(key);
    onClose?.(); // đóng mobile sidebar khi click item
  };

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto flex-1">
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-200">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent tracking-wide">
              WorkAI
            </h1>
          </div>
          {/* Close button — chỉ hiện trên mobile */}
          {onClose && (
            <button onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Main menu */}
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-slate-400 mb-3 px-3 tracking-wider">MENU</p>
          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const key = LABEL_TO_KEY[item.label] ?? item.label.toLowerCase();
              const isActive = activeMenu === key;
              return (
                <button key={item.id} onClick={() => handleMenuClick(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "text-slate-600 hover:bg-slate-100"
                  }`}>
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Messages */}
        <div className="px-4 py-4">
          <p className="text-xs font-semibold text-slate-400 mb-3 px-3 tracking-wider">MESSAGES</p>
          <nav className="space-y-1">
            {MESSAGE_ITEMS.map((item) => {
              const key = LABEL_TO_KEY[item.label] as MessagePlatform;
              const isActive = activeMenu === key;
              const unread = getDynamicUnreadCount(item.label) || item.badge || 0;
              return (
                <button key={item.id} onClick={() => handleMenuClick(key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-600 hover:bg-slate-100"
                  }`}>
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {unread > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      {unread}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 space-y-1">
        <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </a>
        <div className="flex items-center justify-between px-3 py-2.5 text-slate-600 rounded-xl">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5" />
            <span className="text-sm font-medium">Dark Mode</span>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();

  return (
    <>
      {/* ── Desktop sidebar — luôn hiện từ md trở lên ── */}
      <aside className="w-[260px] bg-[#fdfdfd] border-r border-slate-200 hidden md:flex flex-col shrink-0 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        <SidebarContent />
      </aside>

      {/* ── Mobile sidebar — slide từ trái, dùng AnimatePresence ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 35 }}
              className="fixed left-0 top-0 h-full w-[260px] bg-[#fdfdfd] z-40 shadow-2xl md:hidden"
            >
              <SidebarContent onClose={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}