// lib/mock-messages.ts

export type MessagePlatform = "microsoft-team" | "slack" | "github" | "messenger" | "gmail" | "discord";

export interface MockMessage {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  unread?: boolean;
  subject?: string;      // gmail
  repo?: string;         // github
  channel?: string;      // slack / discord
  type?: "pr" | "issue" | "commit" | "message"; // github
}

export const MOCK_MESSAGES: Record<MessagePlatform, MockMessage[]> = {
  "microsoft-team": [
    { id: "mt1", sender: "Leslie Alexander", avatar: "https://i.pravatar.cc/150?u=3", content: "Can everyone join the sprint review at 3PM today?", timestamp: "10:32 AM", unread: true, channel: "General" },
    { id: "mt2", sender: "Michael Foster", avatar: "https://i.pravatar.cc/150?u=12", content: "I've pushed the latest design mockups to SharePoint.", timestamp: "09:14 AM", channel: "Design" },
    { id: "mt3", sender: "Dries Vincent", avatar: "https://i.pravatar.cc/150?u=15", content: "Q3 roadmap deck is ready for review. Please check before EOD.", timestamp: "Yesterday", channel: "Product" },
    { id: "mt4", sender: "Leonard Kras", avatar: "https://i.pravatar.cc/150?u=20", content: "User research sessions are scheduled for next Tuesday.", timestamp: "Yesterday", unread: true, channel: "Research" },
    { id: "mt5", sender: "Leslie Alexander", avatar: "https://i.pravatar.cc/150?u=3", content: "Reminder: All PRDs need sign-off by Friday.", timestamp: "Mon", channel: "General" },
  ],
  slack: [
    { id: "sl1", sender: "Darlene Robertson", avatar: "https://i.pravatar.cc/150?u=1", content: "Hey team, standup in 5 minutes in #general!", timestamp: "11:00 AM", unread: true, channel: "#general" },
    { id: "sl2", sender: "Savannah Nguyen", avatar: "https://i.pravatar.cc/150?u=2", content: "The staging build is failing on the auth middleware. @tung can you take a look?", timestamp: "10:45 AM", unread: true, channel: "#dev" },
    { id: "sl3", sender: "Michael Foster", avatar: "https://i.pravatar.cc/150?u=12", content: "Merged the feature/dashboard branch into main ✅", timestamp: "09:30 AM", channel: "#dev" },
    { id: "sl4", sender: "Dries Vincent", avatar: "https://i.pravatar.cc/150?u=15", content: "Client demo pushed to Thursday. Let's sync tomorrow.", timestamp: "Yesterday", channel: "#product" },
    { id: "sl5", sender: "Leonard Kras", avatar: "https://i.pravatar.cc/150?u=20", content: "New Figma components are live in the shared library.", timestamp: "Yesterday", channel: "#design" },
  ],
  github: [
    { id: "gh1", sender: "Savannah Nguyen", avatar: "https://i.pravatar.cc/150?u=2", content: "Opened PR #42: Add Zustand persist middleware for task store", timestamp: "2 hours ago", unread: true, repo: "checklist", type: "pr" },
    { id: "gh2", sender: "Michael Foster", avatar: "https://i.pravatar.cc/150?u=12", content: "Opened issue #38: Kanban cards not rehydrating icons after reload", timestamp: "4 hours ago", unread: true, repo: "checklist", type: "issue" },
    { id: "gh3", sender: "Darlene Robertson", avatar: "https://i.pravatar.cc/150?u=1", content: "Pushed 3 commits to feat/ai-generate-task", timestamp: "Yesterday", repo: "checklist", type: "commit" },
    { id: "gh4", sender: "Leslie Alexander", avatar: "https://i.pravatar.cc/150?u=3", content: "Reviewed PR #40: SmartAiInput fallback model logic — approved ✅", timestamp: "Yesterday", repo: "checklist", type: "pr" },
    { id: "gh5", sender: "Dries Vincent", avatar: "https://i.pravatar.cc/150?u=15", content: "Closed issue #35: Dashboard metrics not updating on task add", timestamp: "2 days ago", repo: "workai-backend", type: "issue" },
  ],
  messenger: [
    { id: "ms1", sender: "Darlene Robertson", avatar: "https://i.pravatar.cc/150?u=1", content: "Hey! Did you get a chance to review the new wireframes?", timestamp: "12:01 PM", unread: true },
    { id: "ms2", sender: "Guy Hawkins", avatar: "https://i.pravatar.cc/150?u=4", content: "The client loved the new dashboard UI 🎉", timestamp: "11:20 AM", unread: true },
    { id: "ms3", sender: "Robert Fox", avatar: "https://i.pravatar.cc/150?u=5", content: "Can we reschedule tomorrow's call to 2PM?", timestamp: "Yesterday" },
    { id: "ms4", sender: "Savannah Nguyen", avatar: "https://i.pravatar.cc/150?u=2", content: "Sending over the revised contract now.", timestamp: "Yesterday" },
    { id: "ms5", sender: "Leslie Alexander", avatar: "https://i.pravatar.cc/150?u=3", content: "Thanks for the update! I'll loop in the design team.", timestamp: "Mon" },
  ],
  gmail: [
    { id: "gm1", sender: "Vercel", avatar: "https://i.pravatar.cc/150?u=30", subject: "Your deployment is live 🚀", content: "Your project checklist has been successfully deployed to production.", timestamp: "10:05 AM", unread: true },
    { id: "gm2", sender: "GitHub", avatar: "https://i.pravatar.cc/150?u=31", subject: "PR #42 needs your review", content: "Savannah Nguyen requested your review on Add Zustand persist middleware.", timestamp: "09:48 AM", unread: true },
    { id: "gm3", sender: "Dries Vincent", avatar: "https://i.pravatar.cc/150?u=15", subject: "Q3 Product Roadmap — Final Draft", content: "Hi team, please find attached the final draft of the Q3 roadmap for sign-off.", timestamp: "Yesterday" },
    { id: "gm4", sender: "Google Workspace", avatar: "https://i.pravatar.cc/150?u=32", subject: "Storage usage at 80%", content: "Your Google Workspace storage is almost full. Consider upgrading your plan.", timestamp: "Yesterday" },
    { id: "gm5", sender: "Leonard Kras", avatar: "https://i.pravatar.cc/150?u=20", subject: "User Research Report — June 2025", content: "Attached is the full user research report from last week's sessions.", timestamp: "Mon" },
  ],
  discord: [
    { id: "dc1", sender: "Darlene Robertson", avatar: "https://i.pravatar.cc/150?u=1", content: "Anyone up for a quick voice chat to unblock the API design?", timestamp: "1:15 PM", unread: true, channel: "#dev-talk" },
    { id: "dc2", sender: "Guy Hawkins", avatar: "https://i.pravatar.cc/150?u=4", content: "New bot commands are live in #bots — check them out!", timestamp: "12:30 PM", channel: "#announcements" },
    { id: "dc3", sender: "Robert Fox", avatar: "https://i.pravatar.cc/150?u=5", content: "Posted the weekend build notes in #releases", timestamp: "Yesterday", channel: "#releases" },
    { id: "dc4", sender: "Savannah Nguyen", avatar: "https://i.pravatar.cc/150?u=2", content: "The WorkAI community server just hit 500 members 🎊", timestamp: "Yesterday", channel: "#general" },
    { id: "dc5", sender: "Michael Foster", avatar: "https://i.pravatar.cc/150?u=12", content: "Friday game night — who's joining at 8PM?", timestamp: "Mon", channel: "#off-topic" },
  ],
};