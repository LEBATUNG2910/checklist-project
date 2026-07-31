"use client";

import { Settings, Moon, BrainCircuit } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { MENU_ITEMS, MESSAGE_ITEMS } from "@/lib/mock-data";
import { useUIStore, MenuKey } from "@/store/uiStore";
import { MessagePlatform } from "@/lib/mock-messages";
import { MOCK_MESSAGES } from "@/lib/mock-messages";

// Map sidebar label → MenuKey
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

export default function Sidebar() {
  const { activeMenu, setActiveMenu } = useUIStore();

  // Count unread per platform
  const unreadCount = (platform: MessagePlatform) =>
    MOCK_MESSAGES[platform]?.filter((m) => m.unread).length ?? 0;

  return (
    <aside className="w-[260px] bg-[#fdfdfd] border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
      <div className="overflow-y-auto">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-200">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent tracking-wide">
            WorkAI
          </h1>
        </div>

        {/* Main menu */}
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-slate-400 mb-3 px-3 tracking-wider">MENU</p>
          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const key = LABEL_TO_KEY[item.label] ?? item.label.toLowerCase();
              const isActive = activeMenu === key;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
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
              const unread = unreadCount(key) || item.badge || 0;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? "bg-slate-100 text-slate-900 font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
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
    </aside>
  );
}