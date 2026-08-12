"use client";

import { useState, useEffect } from "react";
import { Camera, Loader2, CheckCircle2, Monitor, Moon, Sun, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/store/userStore";

const THEMES = [
  { key: "light",  label: "Light",  icon: Sun,     preview: "bg-white border-slate-200 dark:border-slate-700" },
  { key: "dark",   label: "Dark",   icon: Moon,    preview: "bg-slate-900 border-slate-700 dark:border-slate-600" },
  { key: "system", label: "System", icon: Monitor, preview: "bg-gradient-to-br from-white to-slate-900 border-slate-300 dark:border-slate-600" },
];

const ACCENT_COLORS = [
  { key: "blue",   label: "Blue",   color: "bg-blue-600 dark:bg-blue-500" },
  { key: "indigo", label: "Indigo", color: "bg-indigo-600 dark:bg-indigo-500" },
  { key: "violet", label: "Violet", color: "bg-violet-600 dark:bg-violet-500" },
  { key: "emerald",label: "Green",  color: "bg-emerald-600 dark:bg-emerald-500" },
  { key: "orange", label: "Orange", color: "bg-orange-500 dark:bg-orange-400" },
  { key: "rose",   label: "Rose",   color: "bg-rose-500 dark:bg-rose-400" },
];

const FONT_SIZES = ["Small", "Medium", "Large"];

export default function ProfileSettings() {
  const { profile, isLoading: saving, updateProfile, fetchUserData } = useUserStore();
  
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [bio, setBio] = useState(profile.bio);
  const [saved, setSaved] = useState(false);

  // Fetch data từ hệ thống nếu chưa có
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Đồng bộ state của component với data từ Store sau khi fetch xong
  useEffect(() => {
    setName(profile.name);
    setAvatar(profile.avatar);
    setBio(profile.bio);
  }, [profile]);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [accent, setAccent] = useState("blue");
  const [fontSize, setFontSize] = useState("Medium");
  const [compactMode, setCompactMode] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    await updateProfile({ name, avatar, bio });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 transition-colors duration-300">
      
      {/* --- PHẦN 1: THÔNG TIN HỒ SƠ --- */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Profile Information</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Update your personal details and public profile.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={avatar || "https://i.pravatar.cc/150?u=default"}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
          />
          <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Profile Photo</p>
          <p className="text-xs text-slate-400 mt-0.5">JPG, PNG or GIF. Max size 2MB.</p>
          <Button variant="outline" size="sm" className="mt-2 h-8 text-xs rounded-lg dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            Upload Photo
          </Button>
        </div>
      </div>

      {/* Form Profile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Full Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="h-11 rounded-xl bg-transparent border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-600 transition-colors" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Email Address</label>
          <Input value={profile.email} disabled
            className="h-11 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed transition-colors" />
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Email cannot be changed here.</p>
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)}
            rows={3} placeholder="Tell your team a bit about yourself..."
            className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors" />
        </div>
      </div>

      <div className="flex items-center gap-3 pb-4">
        <Button onClick={handleSave} disabled={saving}
          className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm dark:bg-blue-600 dark:hover:bg-blue-700">
          {saving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-300" /> Saved!</>
          ) : "Save Changes"}
        </Button>
        <Button variant="ghost" className="h-10 px-5 rounded-xl text-slate-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300">Cancel</Button>
      </div>

      <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

      {/* --- PHẦN 2: TÙY CHỈNH GIAO DIỆN --- */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Appearance</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Customize how WorkAI looks for you.</p>
      </div>

      {/* Theme */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Theme</label>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ key, label, icon: Icon, preview }) => (
            <button key={key} onClick={() => setTheme(key)}
              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                theme === key 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500" 
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
              }`}>
              <div className={`w-full h-16 rounded-xl border transition-colors ${preview}`} />
              <div className="flex items-center gap-1.5 mt-2">
                <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
              </div>
              {theme === key && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Accent Color</label>
        <div className="flex gap-3 flex-wrap">
          {ACCENT_COLORS.map(({ key, label, color }) => (
            <button key={key} onClick={() => setAccent(key)} title={label}
              className={`w-9 h-9 rounded-full ${color} transition-all shadow-sm ${
                accent === key ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-950 scale-110" : "hover:scale-105"
              }`} />
          ))}
        </div>
      </div>

      {/* Font size */}
      <div className="space-y-3">
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Font Size</label>
        <div className="flex gap-2">
          {FONT_SIZES.map((size) => (
            <button key={size} onClick={() => setFontSize(size)}
              className={`px-5 py-2 rounded-xl text-sm font-medium border transition-all ${
                fontSize === size
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Compact mode */}
      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Compact Mode</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Reduce spacing for a denser layout.</p>
        </div>
        <Switch checked={compactMode} onCheckedChange={setCompactMode} />
      </div>

    </div>
  );
}