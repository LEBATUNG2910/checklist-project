"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Palette, Shield, Lock, Monitor, Sun, Moon, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "appearance">("profile");

  // Profile State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch user info
  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data?.name) {
          setName(data.name);
          setEmail(data.email);
          setAvatar(data.avatar || "");
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    
    // Giả lập lưu API (Bạn có thể thay thế bằng route API update user thực tế)
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSuccessMsg("Cập nhật thông tin thành công!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto p-6 md:p-10 max-w-5xl mx-auto w-full text-slate-900 dark:text-slate-100"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Cài đặt hệ thống</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Quản lý thông tin cá nhân và tùy chỉnh trải nghiệm không gian làm việc của bạn.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 gap-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "profile"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <User className="w-4 h-4" /> Hồ sơ cá nhân
        </button>
        <button
          onClick={() => setActiveTab("appearance")}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "appearance"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          <Palette className="w-4 h-4" /> Giao diện & Hiển thị
        </button>
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Thông tin tài khoản</h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={avatar || "https://i.pravatar.cc/150?u=default"}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{name || "Người dùng"}</p>
                  <p className="text-xs text-slate-400">{email}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Tên hiển thị</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email đăng nhập</label>
                <Input
                  value={email}
                  disabled
                  className="h-11 rounded-xl bg-slate-100 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Đường dẫn ảnh đại diện (Avatar URL)</label>
                <Input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                  className="h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                {successMsg && (
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-4 h-4" /> {successMsg}
                  </span>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="ml-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-11 font-semibold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu thay đổi"}
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-2 text-red-600 dark:text-red-400">Khu vực nguy hiểm</h3>
            <p className="text-xs text-slate-400 mb-4">Các thao tác này không thể hoàn tác, hãy cẩn thận.</p>
            <Button variant="outline" className="border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl h-10 font-semibold text-xs">
              Vô hiệu hóa tài khoản
            </Button>
          </div>
        </motion.div>
      )}

      {/* TAB 2: APPEARANCE */}
      {activeTab === "appearance" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-1">Giao diện hiển thị (Theme)</h3>
            <p className="text-xs text-slate-400 mb-6">Chọn chế độ màu sắc hiển thị phù hợp với mắt của bạn.</p>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  theme === "light"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">Sáng (Light)</span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  theme === "dark"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-900/30 text-indigo-400 flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">Tối (Dark)</span>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  theme === "system"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold">Hệ thống</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}