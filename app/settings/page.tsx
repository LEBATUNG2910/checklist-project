// app/settings/page.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import SettingsHeader    from "./components/SettingsHeader";
import ProfileSettings   from "./components/ProfileSettings";
import AccountSettings   from "./components/AccountSettings";
import NotificationSettings from "./components/NotificationSettings";
import SecuritySettings  from "./components/SecuritySettings";

const TAB_COMPONENTS: Record<string, React.ComponentType> = {
  profile:       ProfileSettings,
  account:       AccountSettings,
  notifications: NotificationSettings,
  security:      SecuritySettings,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const ActiveComponent = TAB_COMPONENTS[activeTab] ?? ProfileSettings;

  return (
    <div className="flex-1 h-full overflow-y-auto w-full transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 pb-16 pt-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
          <SettingsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}