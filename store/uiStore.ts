import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MessagePlatform } from "@/lib/mock-messages";
import { 
  LayoutDashboard, CheckSquare, Users, MessageSquare, 
  Mail, Monitor 
} from "lucide-react";
import { GithubPngIcon } from "@/lib/mock-data";

export type MenuKey = "dashboard" | "tasks" | MessagePlatform;

interface UIStore {
  activeMenu: MenuKey;
  setActiveMenu: (menu: MenuKey) => void;
  // State quản lý việc mở/đóng Sidebar trên Mobile
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      activeMenu: "tasks",
      setActiveMenu: (menu) => set({ activeMenu: menu }),
      // Khởi tạo mặc định là đóng
      isMobileMenuOpen: false,
      setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
    }),
    { name: "workai-ui" }
  )
);

export const MENU_TITLES: Record<MenuKey, { title: string; icon: React.ElementType }> = {
  dashboard: { title: "Dashboard", icon: LayoutDashboard },
  tasks: { title: "Tasks Board", icon: CheckSquare },
  "microsoft-team": { title: "Microsoft Teams", icon: Users },
  slack: { title: "Slack Messages", icon: MessageSquare },
  github: { title: "GitHub Notifications", icon: GithubPngIcon },
  messenger: { title: "Messenger", icon: MessageSquare },
  gmail: { title: "Gmail Inbox", icon: Mail },
  discord: { title: "Discord", icon: Monitor },
};