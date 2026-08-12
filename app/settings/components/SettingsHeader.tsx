"use client";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { key: "profile",       label: "Profile" },
  { key: "account",       label: "Account" },
  { key: "notifications", label: "Notifications" },
  { key: "security",      label: "Security" },
];

export default function SettingsHeader({ activeTab, setActiveTab }: Props) {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 px-8 shrink-0 transition-colors duration-300">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pt-6 pb-4 transition-colors">Settings</h1>
      <div className="flex gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all ${
              activeTab === tab.key
                ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}