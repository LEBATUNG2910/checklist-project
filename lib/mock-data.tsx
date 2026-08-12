// lib/mock-data.tsx
import { 
  LayoutDashboard, CheckSquare, Users, MessageSquare, 
  Mail, Monitor,
} from "lucide-react";
import { User, KanbanColumn, MenuItem } from "@/types/dashboard";
import GithubIcon from "@/components/ui/GithubIcon";

export const GithubPngIcon = GithubIcon;

export const CURRENT_USER: User = {
  id: "u_me",
  name: "Lê Bá Tùng",
  avatar: "https://i.pravatar.cc/150?u=tung",
};

const USERS = {
  darlene: { id: "u1", name: "Darlene Robertson", avatar: "https://i.pravatar.cc/150?u=1" },
  savannah: { id: "u2", name: "Savannah Nguyen", avatar: "https://i.pravatar.cc/150?u=2" },
  leslie: { id: "u3", name: "Leslie Alexander", avatar: "https://i.pravatar.cc/150?u=3" },
  guy1: { id: "u4", name: "Guy Hawkins", avatar: "https://i.pravatar.cc/150?u=4" },
  guy2: { id: "u5", name: "Robert Fox", avatar: "https://i.pravatar.cc/150?u=5" },
};

export const MENU_ITEMS: MenuItem[] = [
  { id: "m1", label: "Dashboard", icon: LayoutDashboard },
  { id: "m2", label: "Tasks", icon: CheckSquare, isActive: true },
];

export const MESSAGE_ITEMS: MenuItem[] = [
  { id: "msg1", label: "Microsoft Team", icon: Users },
  { id: "msg2", label: "Slack", icon: MessageSquare },
  { id: "msg3", label: "GitHub", icon: GithubIcon, badge: 2 },
  { id: "msg4", label: "Messenger", icon: MessageSquare },
  { id: "msg5", label: "Gmail", icon: Mail },
  { id: "msg6", label: "Discord", icon: Monitor },
];

export const KANBAN_BOARD: KanbanColumn[] = [
  {
    id: "col-todo",
    title: "To Do",
    colorClass: "bg-blue-600",
    tasks: [
      {
        id: "t1",
        author: USERS.darlene,
        timestamp: "02/24 12:11 PM",
        description: "Lorem Ipsum is simply dummy text printing and typesetting industry. Lorem Ipsum has been...",
        platform: { name: "GitHub", icon: GithubIcon },
        assignees: [USERS.guy1, USERS.guy2],
      },
      {
        id: "t2",
        author: USERS.savannah,
        timestamp: "04/24 1:14 PM",
        platform: { name: "Gmail", icon: Mail },
        assignees: [USERS.guy1],
      },
      {
        id: "t3",
        author: USERS.darlene,
        timestamp: "11/23 2:44 AM",
        description: "Lorem Ipsum is simply dummy text into a printing and typesetting.",
        platform: { name: "Discord", icon: Monitor },
        assignees: [USERS.guy1, USERS.guy2],
      }
    ]
  },
  {
    id: "col-progress",
    title: "In Progress",
    colorClass: "bg-slate-800",
    tasks: [
      {
        id: "t4",
        author: USERS.leslie,
        timestamp: "02/22 09:33 AM",
        description: "Do the best password option when login & send email for doting this...",
        platform: { name: "Slack", icon: MessageSquare },
        assignees: [],
      },
      {
        id: "t5",
        title: "Graphic Design Work",
        timestamp: "02/22 09:33 AM",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500&auto=format&fit=crop",
        platform: { name: "Messenger", icon: MessageSquare },
        assignees: [USERS.guy1, USERS.guy2],
      }
    ]
  },
  {
    id: "col-review",
    title: "In Review",
    colorClass: "bg-orange-400",
    tasks: [
      {
        id: "t6",
        title: "Brand Guideline Design",
        timestamp: "02/22 09:33 AM",
        platform: { name: "Gmail", icon: Mail },
        assignees: [CURRENT_USER],
      },
      {
        id: "t7",
        title: "Competitor Analysis",
        timestamp: "02/22 09:33 AM",
        description: "Do the best password option when login & send email for doting this...",
        platform: { name: "GitHub", icon: GithubIcon },
        assignees: [],
      },
      {
        id: "t8",
        title: "Design System Work",
        timestamp: "02/22 09:33 AM",
        imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=500&auto=format&fit=crop",
        platform: { name: "Messenger", icon: MessageSquare },
        assignees: [USERS.guy1, CURRENT_USER],
      }
    ]
  }
];

export const DASHBOARD_METRICS = [
  { id: "m1", title: "TOTAL VELOCITY", value: "42", suffix: "/ 50 pts target", status: "+12% vs last", statusColor: "text-blue-600", bgIcon: "bg-blue-50" },
  { id: "m2", title: "TEAM CAPACITY", value: "84%", suffix: "Utilized", status: "Peak load", statusColor: "text-orange-600", bgIcon: "bg-orange-50" },
  { id: "m3", title: "NEXT MILESTONE", value: "4 Days", suffix: "Beta Launch", status: "Critical", statusColor: "text-red-600", bgIcon: "bg-red-50" },
  { id: "m4", title: "AI RISK ASSESSMENT", value: "Minor dependency bottleneck...", suffix: "", status: "Healthy", statusColor: "text-emerald-500", bgIcon: "bg-emerald-50" },
];

export const ACTIVE_CONTRIBUTORS = [
  { id: "c1", name: "Leslie Alexander", role: "Lead Designer", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: "c2", name: "Michael Foster", role: "Senior Frontend", avatar: "https://i.pravatar.cc/150?u=12" },
  { id: "c3", name: "Dries Vincent", role: "Product Manager", avatar: "https://i.pravatar.cc/150?u=15" },
  { id: "c4", name: "Leonard Kras", role: "UX Researcher", avatar: "https://i.pravatar.cc/150?u=20" },
];