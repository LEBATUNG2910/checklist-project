"use client";

import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckSquare, MessageCircle, Hash, GitPullRequest, CircleDot, GitCommit, X } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";
import { useTaskStore } from "@/store/taskStore";
import { useUIStore } from "@/store/uiStore";
import { MOCK_MESSAGES, MessagePlatform } from "@/lib/mock-messages";
import { KanbanTask } from "@/types/dashboard";

const PLATFORM_COLORS: Record<string, string> = {
  Gmail: "bg-red-100 text-red-600",
  Slack: "bg-purple-100 text-purple-600",
  GitHub: "bg-slate-100 text-slate-700",
  Messenger: "bg-blue-100 text-blue-600",
  Discord: "bg-indigo-100 text-indigo-600",
};

const MESSAGE_PLATFORM_LABELS: Record<MessagePlatform, string> = {
  "microsoft-team": "Teams",
  slack: "Slack",
  github: "GitHub",
  messenger: "Messenger",
  gmail: "Gmail",
  discord: "Discord",
};

const MESSAGE_PLATFORM_COLORS: Record<MessagePlatform, string> = {
  "microsoft-team": "bg-purple-100 text-purple-700",
  slack: "bg-[#4a154b]/10 text-[#4a154b]",
  github: "bg-slate-100 text-slate-700",
  messenger: "bg-blue-100 text-blue-600",
  gmail: "bg-red-100 text-red-600",
  discord: "bg-indigo-100 text-indigo-600",
};

function GithubIcon({ type }: { type?: string }) {
  if (type === "pr") return <GitPullRequest className="w-3.5 h-3.5 text-purple-500" />;
  if (type === "issue") return <CircleDot className="w-3.5 h-3.5 text-green-500" />;
  return <GitCommit className="w-3.5 h-3.5 text-slate-500" />;
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function SearchDropdown() {
  const { query, isOpen, closeSearch, searchBarRect } = useSearchStore();
  const { columns, openTaskDetail } = useTaskStore();
  const { setActiveMenu } = useUIStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) closeSearch();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeSearch]);

  const q = query.toLowerCase().trim();

  const matchedTasks: { task: KanbanTask; columnId: string; columnTitle: string }[] = [];
  if (q) {
    for (const col of columns) {
      for (const task of col.tasks) {
        const title = (task.title ?? task.author?.name ?? "").toLowerCase();
        const desc = (task.description ?? "").toLowerCase();
        if (title.includes(q) || desc.includes(q)) {
          matchedTasks.push({ task, columnId: col.id, columnTitle: col.title });
        }
      }
    }
  }

  type MsgResult = {
    platform: MessagePlatform;
    id: string;
    sender: string;
    content: string;
    subject?: string;
    timestamp: string;
    type?: string;
    channel?: string;
  };

  const matchedMessages: MsgResult[] = [];
  if (q) {
    for (const [platform, msgs] of Object.entries(MOCK_MESSAGES)) {
      for (const msg of msgs) {
        const haystack = `${msg.sender} ${msg.content} ${msg.subject ?? ""} ${msg.channel ?? ""}`.toLowerCase();
        if (haystack.includes(q)) {
          matchedMessages.push({ platform: platform as MessagePlatform, ...msg });
        }
      }
    }
  }

  const hasResults = matchedTasks.length > 0 || matchedMessages.length > 0;

  const handleTaskClick = (task: KanbanTask, columnId: string) => {
    openTaskDetail(task, columnId);
    setActiveMenu("tasks");
    closeSearch();
  };

  const handleMessageClick = (platform: MessagePlatform) => {
    setActiveMenu(platform);
    closeSearch();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full screen backdrop để catch clicks bên ngoài */}
          <div className="fixed inset-0 z-40" onClick={closeSearch} />

          {/* Dropdown — fixed, căn theo search bar ở header */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[72px] w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 max-h-[480px] flex flex-col"
            style={{
              left: searchBarRect
                ? searchBarRect.left + searchBarRect.width / 2 - 190
                : "50%",
            }}
          >
            <div className="overflow-y-auto flex-1">
              {!hasResults && q && (
                <div className="py-10 text-center text-slate-400 text-sm">
                  Không tìm thấy kết quả cho{" "}
                  <span className="font-semibold text-slate-600">"{query}"</span>
                </div>
              )}

              {/* Tasks */}
              {matchedTasks.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Tasks ({matchedTasks.length})
                    </span>
                  </div>
                  {matchedTasks.map(({ task, columnId, columnTitle }) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(task, columnId)}
                      className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left group"
                    >
                      <CheckSquare className="w-4 h-4 text-slate-300 group-hover:text-blue-400 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600">
                          <Highlight text={task.title ?? task.author?.name ?? "Untitled"} query={query} />
                        </p>
                        {task.description && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            <Highlight text={task.description} query={query} />
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PLATFORM_COLORS[task.platform.name] ?? "bg-slate-100 text-slate-600"}`}>
                          {task.platform.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{columnTitle}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {matchedTasks.length > 0 && matchedMessages.length > 0 && (
                <div className="border-t border-slate-100 mx-4" />
              )}

              {/* Messages */}
              {matchedMessages.length > 0 && (
                <div>
                  <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Messages ({matchedMessages.length})
                    </span>
                  </div>
                  {matchedMessages.map((msg) => (
                    <button
                      key={`${msg.platform}-${msg.id}`}
                      onClick={() => handleMessageClick(msg.platform)}
                      className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-indigo-50 transition-colors text-left group"
                    >
                      <div className="mt-0.5 shrink-0">
                        {msg.platform === "github" ? (
                          <GithubIcon type={msg.type} />
                        ) : (
                          <MessageCircle className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                            <Highlight text={msg.sender} query={query} />
                          </p>
                          {msg.channel && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5 shrink-0">
                              <Hash className="w-2.5 h-2.5" />
                              {msg.channel.replace("#", "")}
                            </span>
                          )}
                        </div>
                        {msg.subject && (
                          <p className="text-xs font-medium text-slate-600 truncate">
                            <Highlight text={msg.subject} query={query} />
                          </p>
                        )}
                        <p className="text-xs text-slate-400 truncate">
                          <Highlight text={msg.content} query={query} />
                        </p>
                      </div>
                      <div className="shrink-0 mt-0.5 flex flex-col items-end gap-1">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${MESSAGE_PLATFORM_COLORS[msg.platform]}`}>
                          {MESSAGE_PLATFORM_LABELS[msg.platform]}
                        </span>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {hasResults && (
              <div className="border-t border-slate-100 px-4 py-2 flex items-center justify-between bg-slate-50/60">
                <span className="text-[11px] text-slate-400">
                  {matchedTasks.length + matchedMessages.length} kết quả
                </span>
                <button
                  onClick={closeSearch}
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Đóng
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}