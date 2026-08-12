"use client";

import { useState } from "react";
import { Eye, EyeOff, Shield, Loader2, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";

export default function SecuritySettings() {
  const { changePassword } = useUserStore();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // States cho tính năng xóa tài khoản
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      setErrorMsg("All fields are required.");
      setStatus("error"); return;
    }
    if (newPw.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      setStatus("error"); return;
    }
    if (newPw !== confirmPw) {
      setErrorMsg("Passwords do not match.");
      setStatus("error"); return;
    }
    
    setSaving(true);
    try {
      await changePassword(currentPw, newPw);
      setStatus("success");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to change password.");
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/auth/account", { method: "DELETE" });
      if (res.ok) {
        // Chuyển hướng đến endpoint logout để dọn dẹp cookie/session
        window.location.href = "/api/auth/logout"; 
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Không thể xóa tài khoản.");
        setStatus("error");
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      setErrorMsg("Lỗi hệ thống khi xóa tài khoản.");
      setStatus("error");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-8 transition-colors duration-300">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Security</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage your password and account security.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center transition-colors">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Change Password</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Must be at least 6 characters.</p>
          </div>
        </div>

        {status === "success" && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-700 dark:text-emerald-400 transition-colors">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            Password updated successfully!
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 transition-colors">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          {[
            { label: "Current Password", value: currentPw, onChange: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(v => !v) },
            { label: "New Password",     value: newPw,     onChange: setNewPw,     show: showNew,     toggle: () => setShowNew(v => !v) },
            { label: "Confirm Password", value: confirmPw, onChange: setConfirmPw, show: showNew,     toggle: () => {} },
          ].map(({ label, value, onChange, show, toggle }) => (
            <div key={label} className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</label>
              <div className="relative">
                <Input type={show ? "text" : "password"} value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 pr-11 bg-transparent rounded-xl border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus-visible:ring-blue-400 dark:focus-visible:ring-blue-600 transition-colors" />
                <button type="button" onClick={toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleChangePassword} disabled={saving}
          className="h-10 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : "Update Password"}
        </Button>
      </div>

      <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/50 p-6 space-y-4 transition-colors">
        <div>
          <p className="text-sm font-bold text-red-700 dark:text-red-400">Danger Zone</p>
          <p className="text-xs text-red-500 dark:text-red-500/80 mt-1">Once you delete your account, all your data will be permanently removed. This action cannot be undone.</p>
        </div>
        
        {showDeleteConfirm ? (
          <div className="space-y-3 pt-2">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">Are you absolutely sure?</p>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleDeleteAccount} 
                disabled={isDeleting}
                className="h-10 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                {isDeleting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</> : "Yes, delete my account"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="h-10 px-5 rounded-xl border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline"
            onClick={() => setShowDeleteConfirm(true)}
            className="h-10 px-5 rounded-xl border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Account
          </Button>
        )}
      </div>
    </div>
  );
}