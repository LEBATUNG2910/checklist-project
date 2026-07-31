"use client";

import { motion } from "framer-motion";
import { 
  GitPullRequest, CircleDot, GitCommit,
  Hash, Square, Star, Archive, Trash2, MailOpen, Clock,
  RefreshCw, MoreVertical, Inbox, Tag, Users2
} from "lucide-react";
import { MockMessage, MessagePlatform } from "@/lib/mock-messages";

// Platform accent colors
const PLATFORM_STYLES: Record<MessagePlatform, { bg: string; badge: string; dot: string }> = {
  "microsoft-team": { bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  slack:            { bg: "bg-[#4a154b]/5", badge: "bg-[#4a154b]/10 text-[#4a154b]", dot: "bg-[#4a154b]" },
  github:           { bg: "bg-slate-50", badge: "bg-slate-100 text-slate-700", dot: "bg-slate-800" },
  messenger:        { bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  gmail:            { bg: "bg-red-50", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
  discord:          { bg: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
};

// GitHub type icon
function GithubTypeIcon({ type }: { type?: string }) {
  if (type === "pr") return <GitPullRequest className="w-3.5 h-3.5 text-purple-500" />;
  if (type === "issue") return <CircleDot className="w-3.5 h-3.5 text-green-500" />;
  if (type === "commit") return <GitCommit className="w-3.5 h-3.5 text-slate-500" />;
  return null;
}

interface Props {
  platform: MessagePlatform;
  messages: MockMessage[];
}

export default function MessageFeed({ platform, messages }: Props) {
  const isGmail = platform === "gmail";
  const isGithub = platform === "github";
  const hasChannel = ["slack", "microsoft-team", "discord"].includes(platform);
  const style = PLATFORM_STYLES[platform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col h-full bg-white rounded-tl-3xl shadow-sm border-l border-t border-slate-200 overflow-hidden ml-2 mt-2"
    >
      {/* ================= TOP ACTION BAR ================= */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100 text-slate-500 shrink-0">
        <div className="flex items-center justify-center p-1.5 hover:bg-slate-100 rounded cursor-pointer transition-colors">
          <Square className="w-4 h-4" />
        </div>
        <div className="flex items-center justify-center p-1.5 hover:bg-slate-100 rounded cursor-pointer transition-colors">
          <RefreshCw className="w-4 h-4" />
        </div>
        <div className="flex items-center justify-center p-1.5 hover:bg-slate-100 rounded cursor-pointer transition-colors">
          <MoreVertical className="w-4 h-4" />
        </div>
      </div>

      {/* ================= GMAIL TABS ================= */}
      <div className="flex items-center border-b border-slate-100 px-2 shrink-0">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b-[3px] border-blue-600 text-blue-600 cursor-pointer">
          <Inbox className="w-4 h-4" />
          <span className="text-sm font-semibold">Chính</span>
        </div>
        <div className="flex items-center gap-3 px-5 py-3.5 border-b-[3px] border-transparent text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
          <Tag className="w-4 h-4" />
          <span className="text-sm font-semibold">Quảng cáo</span>
        </div>
        <div className="flex items-center gap-3 px-5 py-3.5 border-b-[3px] border-transparent text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
          <Users2 className="w-4 h-4" />
          <span className="text-sm font-semibold">Mạng xã hội</span>
        </div>
      </div>

      {/* ================= MESSAGE LIST ================= */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }}
            className={`group flex items-center px-4 py-2 border-b border-slate-200 cursor-pointer transition-all relative ${
              msg.unread 
                ? "bg-white font-bold text-slate-900" 
                : "bg-[#f2f6fc] font-medium text-slate-600"
            } hover:shadow-md hover:border-transparent hover:z-10`}
          >
            
            {/* Left Actions (Check & Star) */}
            <div className="flex items-center gap-3 shrink-0 mr-4 text-slate-300">
              <Square className="w-4 h-4 hover:text-slate-600 transition-colors" />
              <Star className="w-4 h-4 hover:text-slate-600 transition-colors" />
              {/* Nút màu nhỏ biểu thị nền tảng (nếu không phải là Gmail) */}
              <div className={`w-1.5 h-1.5 rounded-full ${style.dot} opacity-70`} />
            </div>

            {/* Sender Name */}
            <div className="w-40 sm:w-48 shrink-0 truncate mr-4">
              <span className="truncate">{msg.sender}</span>
            </div>

            {/* Badges & Content */}
            <div className="flex-1 min-w-0 flex items-center text-[14px]">
              
              {/* Badges Container (Dạng nhãn nhỏ inline) */}
              <div className="flex items-center gap-1.5 mr-2 shrink-0">
                {isGithub && msg.type && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${style.badge}`}>
                    <GithubTypeIcon type={msg.type} />
                    {msg.type}
                  </span>
                )}
                {hasChannel && msg.channel && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${style.badge}`}>
                    <Hash className="w-2.5 h-2.5 opacity-70" />
                    {msg.channel.replace("#", "")}
                  </span>
                )}
                {isGithub && msg.repo && (
                  <span className="text-[10px] text-slate-500 font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                    {msg.repo}
                  </span>
                )}
              </div>

              {/* Subject & Snippet */}
              <div className="truncate flex items-baseline">
                {(isGmail && msg.subject) && (
                  <span className={`${msg.unread ? "text-slate-900" : "text-slate-700"}`}>
                    {msg.subject}
                  </span>
                )}
                <span className="text-slate-400 font-normal mx-2">-</span>
                <span className="text-slate-500 font-normal truncate">
                  {msg.content}
                </span>
              </div>
            </div>

            {/* Time OR Hover Actions */}
            <div className="shrink-0 ml-4 flex items-center justify-end w-28">
              
              {/* Chữ hiển thị thời gian (Sẽ bị ẩn khi hover) */}
              <span className={`text-xs ${msg.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-500'} group-hover:hidden`}>
                {msg.timestamp}
              </span>
              
              {/* Các nút hành động (Chỉ hiện khi hover) */}
              <div className="hidden group-hover:flex items-center justify-end gap-3 text-slate-400 w-full bg-white pl-2">
                <Archive className="w-4 h-4 hover:text-slate-800 transition-colors" />
                <Trash2 className="w-4 h-4 hover:text-slate-800 transition-colors" />
                <MailOpen className="w-4 h-4 hover:text-slate-800 transition-colors" />
                <Clock className="w-4 h-4 hover:text-slate-800 transition-colors" />
              </div>
              
            </div>

          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}