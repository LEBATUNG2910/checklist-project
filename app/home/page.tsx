"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Layout
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Task views
import BoardActions from "./components/BoardActions";
import SmartAiInput from "./components/SmartAiInput";
import TableView from "./components/TableView";
import ListView from "./components/ListView";
import KanbanView from "./components/KanbanView";

// Dashboard
import Dashboard from "../dashboard/page";

// Overlays
import AddTaskModal from "./components/Addtaskmodal";
import TaskDetailPanel from "./components/TaskDetailPanel";
import SearchDropdown from "./components/SearchDropdown";

// Message feed
import MessageFeed from "./components/MessageFeed";

// Store
import { useUIStore } from "@/store/uiStore";
import { MOCK_MESSAGES, MessagePlatform } from "@/lib/mock-messages";
import { useTaskStore } from "@/store/taskStore";

export type ViewMode = "kanban" | "list" | "table";

const MESSAGE_PLATFORMS: MessagePlatform[] = [
  "microsoft-team", "slack", "github", "messenger", "gmail", "discord",
];

export default function KanbanDashboard() {
  const { activeMenu } = useUIStore();
  const { fetchColumns, initialized, loading } = useTaskStore();
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");

  const isMessagePage = MESSAGE_PLATFORMS.includes(activeMenu as MessagePlatform);

  useEffect(() => {
    if (!initialized) {
      fetchColumns();
    }
  }, [initialized, fetchColumns]);

  return (
    // Đã thêm dark:bg-slate-950, dark:text-slate-100 và transition cho mượt
    <div className="flex h-screen bg-[#f8f9fd] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Dot grid background - Đã cấu hình lại để tự đổi màu nền chấm bi theo Theme */}
        <div
          className="absolute inset-0 z-0 opacity-[0.4] dark:opacity-[0.15] pointer-events-none transition-opacity duration-300 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#94a3b8_1px,transparent_1px)]"
          style={{
            backgroundSize: "24px 24px",
          }}
        />

        <Header />

        <AnimatePresence mode="wait">

          {/* Dashboard */}
          {activeMenu === "dashboard" && <Dashboard key="dashboard" />}

          {/* Tasks */}
          {activeMenu === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <BoardActions viewMode={viewMode} setViewMode={setViewMode} />
              <SmartAiInput />

              {/* Loading state */}
              {loading && !initialized ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Loading tasks...</p>
                  </div>
                </div>
              ) : (

              <AnimatePresence mode="wait">
                {viewMode === "table" && (
                  <motion.div key="table" className="flex-1 overflow-auto">
                    <TableView />
                  </motion.div>
                )}
                {viewMode === "list" && (
                  <motion.div key="list" className="flex-1 overflow-auto">
                    <ListView />
                  </motion.div>
                )}
                {viewMode === "kanban" && (
                  <motion.div key="kanban" className="flex-1 overflow-hidden flex flex-col">
                    <KanbanView />
                  </motion.div>
                )}
              </AnimatePresence>
              )}
            </motion.div>
          )}

          {/* Message platform pages */}
          {isMessagePage && (
            <MessageFeed
              key={activeMenu}
              platform={activeMenu as MessagePlatform}
              messages={MOCK_MESSAGES[activeMenu as MessagePlatform]}
            />
          )}

        </AnimatePresence>
      </main>

      {/* Global overlays */}
      <AddTaskModal />
      <TaskDetailPanel />
      <SearchDropdown />
    </div>
  );
}