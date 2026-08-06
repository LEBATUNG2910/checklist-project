"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
// Đã thêm Menu icon vào import
import { Search, Plus, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore, MENU_TITLES } from "@/store/uiStore";
import { useTaskStore } from "@/store/taskStore";
import { useSearchStore } from "@/store/searchStore";
import { AnimatePresence, motion } from "framer-motion";
import NotificationDropdown from "./NotificationDropdown";

export default function Header() {
  // Lấy thêm hàm setMobileMenuOpen từ store
  const { activeMenu, setMobileMenuOpen } = useUIStore();
  const { openAddModal } = useTaskStore();
  const { query, setQuery, closeSearch, setSearchBarRect } = useSearchStore();

  const { title, icon: TitleIcon } = MENU_TITLES[activeMenu] ?? { title: "WorkAI", icon: null };
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { if (data?.name) setUser(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const measure = () => {
      if (searchWrapperRef.current) {
        const rect = searchWrapperRef.current.getBoundingClientRect();
        setSearchBarRect({ left: rect.left, width: rect.width });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [setSearchBarRect]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 shrink-0 z-40 sticky top-0">
      {/* Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Nút Hamburger menu chỉ hiển thị trên Mobile */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {TitleIcon && (
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
            <TitleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
        <h2 className="text-lg sm:text-2xl font-bold text-slate-900 truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div ref={searchWrapperRef} className="relative w-48 md:w-64 lg:w-80 hidden sm:block">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && closeSearch()}
            placeholder="Search..."
            className="w-full pl-11 pr-4 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-200 h-10 rounded-full text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-blue-300 transition-all"
          />
        </div>

        {/* Manual Task */}
        <Button
          onClick={() => openAddModal(null)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-4 sm:px-6 h-10 sm:h-11 flex shadow-sm hover:shadow-lg transition-all text-sm"
        >
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Manual Task</span>
        </Button>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-200 pl-2 sm:pl-4">
          <NotificationDropdown />

          {/* Avatar + dropdown */}
          <div ref={menuRef} className="relative z-[9999]">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center hover:bg-slate-100 rounded-xl p-1 transition-all"
            >
              <Image
                src={user?.avatar ?? `https://i.pravatar.cc/150?u=default`}
                alt={user?.name ?? "User"}
                width={36}
                height={36}
                unoptimized
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 shadow-sm"
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="fixed top-[72px] right-4 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[9999]"
                >
                  {user && (
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  )}
                  <div className="p-1.5">
                    <a
                      href="/api/auth/logout"
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}