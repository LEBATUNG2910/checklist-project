// types/dashboard.ts

export type Priority = "high" | "medium" | "low" | null;

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Platform {
  name: string;
  icon: React.ElementType;
}

export interface KanbanTask {
  id: string;
  author?: User;
  title?: string;
  timestamp: string;
  description?: string;
  imageUrl?: string;
  platform: Platform;
  assignees: User[];
  commentsCount?: number;
  priority?: Priority;
}

export interface KanbanColumn {
  id: string;
  title: string;
  colorClass: string;
  tasks: KanbanTask[];
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  isActive?: boolean;
  badge?: number;
}