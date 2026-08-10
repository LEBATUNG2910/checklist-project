"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitPullRequest, CircleDot, GitCommit,
  Hash, Square, Star, Archive, Trash2, MailOpen, Clock,
  RefreshCw, MoreVertical, Inbox, Tag, Users2
} from "lucide-react";
import { MessagePlatform } from "@/lib/mock-messages";
import { useTaskStore } from "@/store/taskStore";

// --- CUSTOM ICONS (Do Lucide có thể thiếu icon mạng xã hội chuẩn) ---
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const MegaphoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
);
// ------------------------------------------------------------------

// Platform accent colors
const PLATFORM_STYLES: Record<MessagePlatform, { bg: string; badge: string; dot: string }> = {
  "microsoft-team": { bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  slack:            { bg: "bg-[#4a154b]/5", badge: "bg-[#4a154b]/10 text-[#4a154b]", dot: "bg-[#4a154b]" },
  github:           { bg: "bg-slate-50", badge: "bg-slate-100 text-slate-700", dot: "bg-slate-800" },
  messenger:        { bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  gmail:            { bg: "bg-red-50", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
  discord:          { bg: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
};

// MOCK DATA CHO ADS VÀ SOCIAL
const MOCK_ADS = [
  { id: "ad1", sender: "Shopee", subject: "Siêu Sale 8.8", content: "Giảm đến 50% hàng công nghệ. Freeship 0đ.", timestamp: "08:00 AM", unread: true },
  { id: "ad2", sender: "Spotify", subject: "3 months of Premium for $0", content: "Listen without limits. Try 3 months of Premium free.", timestamp: "Yesterday", unread: true },
];

const MOCK_SOCIAL = [
  { id: "soc1", platform: "Facebook", sender: "Facebook", subject: "New Mention", content: "John Doe mentioned you in a comment on a post.", timestamp: "10:30 AM", unread: true },
  { id: "soc2", platform: "Twitter", sender: "X (Twitter)", subject: "Trending", content: "Next.js 15 is trending in Technology.", timestamp: "09:15 AM", unread: false },
  { id: "soc3", platform: "Instagram", sender: "Instagram", subject: "New Follower", content: "jane_smith started following you.", timestamp: "Yesterday", unread: true },
];

// GitHub type icon
function GithubTypeIcon({ type }: { type?: string }) {
  if (type === "pr") return <GitPullRequest className="w-3.5 h-3.5 text-purple-500" />;
  if (type === "issue") return <CircleDot className="w-3.5 h-3.5 text-green-500" />;
  if (type === "commit") return <GitCommit className="w-3.5 h-3.5 text-slate-500" />;
  return null;
}

function SocialIcon({ platform }: { platform: string }) {
  if (platform === "Facebook") return <FacebookIcon className="w-3.5 h-3.5 text-blue-600" />;
  if (platform === "Twitter") return <TwitterIcon className="w-3.5 h-3.5 text-sky-500" />;
  if (platform === "Instagram") return <InstagramIcon className="w-3.5 h-3.5 text-pink-600" />;
  return <Users2 className="w-3.5 h-3.5 text-slate-500" />;
}

type TabType = "messages" | "ads" | "social";

interface Props {
  platform: MessagePlatform;
  messages?: any; // Ignored: overriding internally with real data
}

export default function MessageFeed({ platform }: Props) {
  const { columns, openTaskDetail } = useTaskStore();
  const [activeTab, setActiveTab] = useState<TabType>("messages");
  
  const isGmail = platform === "gmail";
  const isGithub = platform === "github";
  const hasChannel = ["slack", "microsoft-team", "discord"].includes(platform);
  const style = PLATFORM_STYLES[platform] || PLATFORM_STYLES["gmail"];

  // Map real data from store to the message feed UI
  const realMessages = useMemo(() => {
    return columns
      .flatMap(col => col.tasks.map(task => ({ ...task, colId: col.id })))
      .filter(task => task.platform.name.toLowerCase().replace(" ", "-") === platform)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .map(task => {
        // Detect Github event types from the real task title for visual flair
        let githubType = "issue";
        const titleLower = task.title?.toLowerCase() || "";
        if (titleLower.includes("pr") || titleLower.includes("pull request")) githubType = "pr";
        else if (titleLower.includes("commit") || titleLower.includes("push")) githubType = "commit";

        return {
          id: task.id,
          sender: task.author?.name || task.assignees?.[0]?.name || "System Notification",
          subject: task.title || "Untitled Task",
          content: task.description || "Task assigned to you. Click for more details.",
          timestamp: task.timestamp,
          unread: true, // Set to true to retain the bold styling from your design
          type: isGithub ? githubType : undefined,
          channel: hasChannel ? "general" : undefined,
          originalTask: task,
          colId: task.colId
        };
      });
  }, [columns, platform, isGithub, hasChannel]);

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
        <div 
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-3 px-5 py-3.5 border-b-[3px] cursor-pointer transition-colors ${
            activeTab === "messages" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span className="text-sm font-semibold">Messages</span>
        </div>
        <div 
          onClick={() => setActiveTab("ads")}
          className={`flex items-center gap-3 px-5 py-3.5 border-b-[3px] cursor-pointer transition-colors ${
            activeTab === "ads" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Tag className="w-4 h-4" />
          <span className="text-sm font-semibold">Advertisement</span>
        </div>
        <div 
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-3 px-5 py-3.5 border-b-[3px] cursor-pointer transition-colors ${
            activeTab === "social" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span className="text-sm font-semibold">Social Media</span>
        </div>
      </div>

      {/* ================= FIXED AD BANNER (Luôn ở top danh sách) ================= */}
      <div className="group flex items-center px-4 py-2 border-b border-[#e1ebd5] bg-[#f3f8ec] cursor-pointer transition-all shrink-0 z-10 hover:shadow-md">
        {/* Left Actions */}
        <div className="flex items-center gap-3 shrink-0 mr-4 text-slate-300">
          <Square className="w-4 h-4 hover:text-slate-600 transition-colors" />
          <Star className="w-4 h-4 hover:text-slate-600 transition-colors" />
        </div>

        {/* Sender Name & Ad Badge */}
        <div className="w-40 sm:w-48 shrink-0 truncate flex items-center gap-2">
          <span className="bg-white border border-green-200 text-green-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
            Ad
          </span>
          <span className="truncate font-bold text-slate-900">Google Cloud</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex items-center text-[14px]">
          <div className="truncate flex items-baseline">
            <span className="font-bold text-slate-900">Build faster with Gemini AI</span>
            <span className="text-slate-400 font-normal mx-2">-</span>
            <span className="text-slate-500 font-normal truncate">Claim your $300 free credits to try the new Gemini API today.</span>
          </div>
        </div>
      </div>

      {/* ================= MESSAGE LIST ================= */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {/* TAB 1: MESSAGES (Real Data) */}
            {activeTab === "messages" && (
              <>
                {realMessages.map((msg, i) => (
                  <div
                    key={msg.id}
                    onClick={() => openTaskDetail(msg.originalTask, msg.colId)}
                    className={`group flex items-center px-4 py-2 border-b border-slate-200 cursor-pointer transition-all relative ${
                      msg.unread 
                        ? "bg-white font-bold text-slate-900" 
                        : "bg-[#f2f6fc] font-medium text-slate-600"
                    } hover:shadow-md hover:border-transparent hover:z-10`}
                  >
                    
                    {/* Left Actions (Check & Star) */}
                    <div className="flex items-center gap-3 shrink-0 mr-4 text-slate-300">
                      <Square className="w-4 h-4 hover:text-slate-600 transition-colors" onClick={(e) => e.stopPropagation()} />
                      <Star className="w-4 h-4 hover:text-slate-600 transition-colors" onClick={(e) => e.stopPropagation()} />
                      <div className={`w-1.5 h-1.5 rounded-full ${style.dot} opacity-70`} />
                    </div>

                    {/* Sender Name */}
                    <div className="w-40 sm:w-48 shrink-0 truncate">
                      <span className="truncate">{msg.sender}</span>
                    </div>

                    {/* Badges & Content */}
                    <div className="flex-1 min-w-0 flex items-center text-[14px]">
                      
                      {/* Badges Container */}
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
                            {msg.channel}
                          </span>
                        )}
                      </div>

                      {/* Subject & Snippet */}
                      <div className="truncate flex items-baseline">
                        {(isGmail || isGithub || hasChannel) && (
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
                      <span className={`text-xs ${msg.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-500'} group-hover:hidden`}>
                        {msg.timestamp}
                      </span>
                      <div className="hidden group-hover:flex items-center justify-end gap-3 text-slate-400 w-full bg-white pl-2">
                        <Archive className="w-4 h-4 hover:text-slate-800 transition-colors" onClick={(e) => e.stopPropagation()} />
                        <Trash2 className="w-4 h-4 hover:text-slate-800 transition-colors" onClick={(e) => e.stopPropagation()} />
                        <MailOpen className="w-4 h-4 hover:text-slate-800 transition-colors" onClick={(e) => e.stopPropagation()} />
                        <Clock className="w-4 h-4 hover:text-slate-800 transition-colors" onClick={(e) => e.stopPropagation()} />
                      </div>
                    </div>
                  </div>
                ))}
                
                {realMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full pt-20 pb-20 text-slate-400 gap-2">
                    <Inbox className="w-10 h-10 text-slate-200" />
                    <p className="text-sm font-medium">No tasks found for {platform}</p>
                  </div>
                )}
              </>
            )}

            {/* TAB 2: ADVERTISEMENT */}
            {activeTab === "ads" && (
              <>
                {MOCK_ADS.map((ad) => (
                  <div key={ad.id} className="group flex items-center px-4 py-2 border-b border-slate-200 cursor-pointer transition-all relative bg-white font-bold text-slate-900 hover:shadow-md hover:border-transparent hover:z-10">
                    <div className="flex items-center gap-3 shrink-0 mr-4 text-slate-300">
                      <Square className="w-4 h-4 hover:text-slate-600 transition-colors" />
                      <Star className="w-4 h-4 hover:text-slate-600 transition-colors" />
                    </div>
                    <div className="w-40 sm:w-48 shrink-0 truncate flex items-center gap-2">
                      <MegaphoneIcon className="w-3.5 h-3.5 text-orange-500" />
                      <span className="truncate">{ad.sender}</span>
                    </div>
                    <div className="flex-1 min-w-0 flex items-center text-[14px]">
                      <div className="truncate flex items-baseline">
                        <span className="text-slate-900">{ad.subject}</span>
                        <span className="text-slate-400 font-normal mx-2">-</span>
                        <span className="text-slate-500 font-normal truncate">{ad.content}</span>
                      </div>
                    </div>
                    <div className="shrink-0 ml-4 flex items-center justify-end w-28">
                      <span className="text-xs font-bold text-slate-900 group-hover:hidden">{ad.timestamp}</span>
                      <div className="hidden group-hover:flex items-center justify-end gap-3 text-slate-400 w-full bg-white pl-2">
                        <Trash2 className="w-4 h-4 hover:text-slate-800 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* TAB 3: SOCIAL MEDIA */}
            {activeTab === "social" && (
              <>
                {MOCK_SOCIAL.map((social) => (
                  <div key={social.id} className={`group flex items-center px-4 py-2 border-b border-slate-200 cursor-pointer transition-all relative ${social.unread ? "bg-white font-bold text-slate-900" : "bg-[#f2f6fc] font-medium text-slate-600"} hover:shadow-md hover:border-transparent hover:z-10`}>
                    <div className="flex items-center gap-3 shrink-0 mr-4 text-slate-300">
                      <Square className="w-4 h-4 hover:text-slate-600 transition-colors" />
                      <Star className="w-4 h-4 hover:text-slate-600 transition-colors" />
                    </div>
                    <div className="w-40 sm:w-48 shrink-0 truncate flex items-center gap-2">
                      <SocialIcon platform={social.platform} />
                      <span className="truncate">{social.sender}</span>
                    </div>
                    <div className="flex-1 min-w-0 flex items-center text-[14px]">
                      <div className="truncate flex items-baseline">
                        <span className={`${social.unread ? "text-slate-900" : "text-slate-700"}`}>{social.subject}</span>
                        <span className="text-slate-400 font-normal mx-2">-</span>
                        <span className="text-slate-500 font-normal truncate">{social.content}</span>
                      </div>
                    </div>
                    <div className="shrink-0 ml-4 flex items-center justify-end w-28">
                      <span className={`text-xs ${social.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-500'} group-hover:hidden`}>{social.timestamp}</span>
                      <div className="hidden group-hover:flex items-center justify-end gap-3 text-slate-400 w-full bg-white pl-2">
                        <Archive className="w-4 h-4 hover:text-slate-800 transition-colors" />
                        <Trash2 className="w-4 h-4 hover:text-slate-800 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}