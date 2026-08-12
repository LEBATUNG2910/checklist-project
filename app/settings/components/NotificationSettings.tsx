"use client";

import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/store/userStore";

interface ToggleRowProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, description, value, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors">
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

export default function NotificationSettings() {
  const { notifications, updateNotification } = useUserStore();

  return (
    <div className="space-y-8 transition-colors duration-300">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Notifications</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Choose what updates you want to be notified about.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-5 divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
        <div className="py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Task Alerts</p>
        </div>
        <ToggleRow label="Task Assigned" description="When a task is assigned to you." value={notifications.taskAssigned} onChange={(v) => updateNotification("taskAssigned", v)} />
        <ToggleRow label="Task Completed" description="When a task you authored is marked done." value={notifications.taskCompleted} onChange={(v) => updateNotification("taskCompleted", v)} />
        <ToggleRow label="Due Date Reminder" description="24 hours before a task deadline." value={notifications.taskDue} onChange={(v) => updateNotification("taskDue", v)} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-5 divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
        <div className="py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">AI & Team</p>
        </div>
        <ToggleRow label="AI Prioritization" description="When AI Auto-Prioritize runs on your board." value={notifications.aiPrioritize} onChange={(v) => updateNotification("aiPrioritize", v)} />
        <ToggleRow label="Team Mentions" description="When someone mentions you in a task." value={notifications.teamMentions} onChange={(v) => updateNotification("teamMentions", v)} />
        <ToggleRow label="Weekly Digest" description="A weekly summary of your task progress." value={notifications.weeklyDigest} onChange={(v) => updateNotification("weeklyDigest", v)} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-5 divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
        <div className="py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Delivery</p>
        </div>
        <ToggleRow label="Email Notifications" description="Receive alerts via email." value={notifications.emailAlerts} onChange={(v) => updateNotification("emailAlerts", v)} />
        <ToggleRow label="Push Notifications" description="Browser push notifications." value={notifications.pushEnabled} onChange={(v) => updateNotification("pushEnabled", v)} />
      </div>
    </div>
  );
}