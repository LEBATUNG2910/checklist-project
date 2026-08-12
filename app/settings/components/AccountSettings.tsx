"use client";

import { useEffect } from "react";
import { LogOut, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";

export default function AccountSettings() {
  const { profile, fetchUserData } = useUserStore();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <div className="space-y-8 transition-colors duration-300">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Account</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your account details and preferences.</p>
      </div>

      {/* Account info card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 transition-colors">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-14 h-14 rounded-full border border-slate-200 dark:border-slate-700"
          />
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-100">{profile.name}</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors">
            <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Email</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl transition-colors">
            <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Member Since</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between transition-colors">
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Sign Out</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Sign out of your account on this device.</p>
        </div>
        <a href="/api/auth/logout">
          <Button variant="outline" className="h-10 px-5 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </a>
      </div>
    </div>
  );
}