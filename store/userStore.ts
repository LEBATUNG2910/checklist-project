// store/userStore.ts
import { create } from "zustand";

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  bio: string;
}

export interface NotificationSettings {
  taskAssigned: boolean;
  taskCompleted: boolean;
  taskDue: boolean;
  aiPrioritize: boolean;
  teamMentions: boolean;
  weeklyDigest: boolean;
  emailAlerts: boolean;
  pushEnabled: boolean;
}

interface UserStore {
  profile: UserProfile;
  notifications: NotificationSettings;
  isLoading: boolean;
  hasFetched: boolean; // Đảm bảo API chỉ gọi 1 lần
  
  // Actions
  fetchUserData: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateNotification: (key: keyof NotificationSettings, value: boolean) => Promise<void>;
  changePassword: (currentPw: string, newPw: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  profile: {
    name: "Loading...",
    email: "Loading...",
    avatar: "https://i.pravatar.cc/150?u=default",
    bio: "",
  },
  notifications: {
    taskAssigned: true,
    taskCompleted: true,
    taskDue: true,
    aiPrioritize: false,
    teamMentions: true,
    weeklyDigest: false,
    emailAlerts: true,
    pushEnabled: false,
  },
  isLoading: false,
  hasFetched: false,

  fetchUserData: async () => {
    // Nếu đã lấy dữ liệu rồi thì không gọi lại API nữa
    if (get().hasFetched) return; 

    try {
      set({ isLoading: true });
      const res = await fetch("/api/auth/me");
      
      if (res.ok) {
        const data = await res.json();
        set((state) => ({
          profile: {
            ...state.profile,
            name: data.name || "User",
            email: data.email || "",
            avatar: data.avatar || "https://i.pravatar.cc/150?u=default",
            bio: data.bio || state.profile.bio,
          },
          isLoading: false,
          hasFetched: true,
        }));
      } else {
        set({ isLoading: false, hasFetched: true });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      set({ isLoading: false, hasFetched: true });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 800));
    set((state) => ({
      profile: { ...state.profile, ...data },
      isLoading: false,
    }));
  },

  updateNotification: async (key, value) => {
    set((state) => ({
      notifications: { ...state.notifications, [key]: value },
    }));
  },

  changePassword: async (currentPw, newPw) => {
    // Gọi API thật xuống Backend
    const res = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPw, newPw }),
    });

    const data = await res.json();

    // Nếu API trả về lỗi (Mật khẩu cũ sai, lỗi server...) thì ném lỗi ra cho UI bắt
    if (!res.ok) {
      throw new Error(data.message || "Cannot change password");
    }
  },
}));