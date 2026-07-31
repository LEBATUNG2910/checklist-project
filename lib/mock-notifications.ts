// lib/mock-notifications.ts

export interface Notification {
  id: string;
  type: "task" | "mention" | "deadline" | "ai" | "system";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  avatar?: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "mention",
    title: "Leslie Alexander mentioned you",
    body: "Can you review the Brand Guideline Design task before EOD?",
    timestamp: "2 min ago",
    read: false,
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: "n2",
    type: "ai",
    title: "AI Prioritization complete",
    body: "3 tasks marked High priority — check your board.",
    timestamp: "15 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "task",
    title: "Task moved to In Review",
    body: "\"Competitor Analysis\" was moved by Darlene Robertson.",
    timestamp: "1 hr ago",
    read: false,
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "n4",
    type: "deadline",
    title: "Deadline approaching",
    body: "\"Design System Work\" is due in 2 days.",
    timestamp: "3 hrs ago",
    read: true,
  },
  {
    id: "n5",
    type: "task",
    title: "New task assigned to you",
    body: "Savannah Nguyen assigned \"API Gateway\" to you.",
    timestamp: "Yesterday",
    read: true,
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "n6",
    type: "system",
    title: "WorkAI tip",
    body: "Try the AI Auto-Prioritize button to sort tasks by urgency.",
    timestamp: "Yesterday",
    read: true,
  },
];