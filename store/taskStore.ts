import { create } from "zustand";
import { KanbanTask, KanbanColumn, Priority } from "@/types/dashboard";
import { Mail, MessageSquare, Monitor } from "lucide-react";
import GithubIcon from "@/components/ui/GithubIcon";

// ── Icon map (icons không serialize được nên map ở client) ────────────────────
export const PLATFORM_ICON_MAP: Record<string, React.ElementType> = {
  Gmail: Mail,
  Slack: MessageSquare,
  GitHub: GithubIcon,
  Messenger: MessageSquare,
  Discord: Monitor,
};

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

// Gắn icon vào task sau khi fetch từ API
function attachIcons(columns: KanbanColumn[]): KanbanColumn[] {
  return columns.map((col) => ({
    ...col,
    tasks: col.tasks.map((task) => ({
      ...task,
      platform: {
        name: task.platform.name,
        icon: PLATFORM_ICON_MAP[task.platform.name] ?? Mail,
      },
    })),
  }));
}

export interface NewTaskInput {
  title: string;
  description: string;
  platformName: string;
  columnId: string;
  imageUrl?: string;
}

interface TaskStore {
  // Board data
  columns: KanbanColumn[];
  loading: boolean;
  initialized: boolean;

  // Load từ API
  fetchColumns: () => Promise<void>;

  // Add Task Modal
  isAddModalOpen: boolean;
  addModalTargetColumnId: string | null;
  openAddModal: (columnId: string | null) => void;
  closeAddModal: () => void;
  addTask: (input: NewTaskInput) => Promise<void>;

  // Task Detail Panel
  selectedTask: KanbanTask | null;
  selectedTaskColumnId: string | null;
  openTaskDetail: (task: KanbanTask, columnId: string) => void;
  closeTaskDetail: () => void;
  updateTask: (taskId: string, updates: Partial<KanbanTask>) => Promise<void>;
  deleteTask: (taskId: string, columnId: string) => Promise<void>;
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string) => Promise<void>;

  // Priority
  applyPriority: (results: { id: string; priority: Priority }[]) => void;
  clearPriority: () => void;
}

export const useTaskStore = create<TaskStore>()((set, get) => ({
  columns: [],
  loading: false,
  initialized: false,

  // ── Fetch columns + tasks từ API ─────────────────────────────────────────
  fetchColumns: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await fetch("/api/columns");
      if (!res.ok) throw new Error("Failed to fetch columns");
      const data = await res.json();

      // API trả về platformName (string), cần map thành platform {name, icon}
      const columns: KanbanColumn[] = data.map((col: {
        id: string; title: string; colorClass: string;
        tasks: Array<{
          id: string; title?: string; description?: string; imageUrl?: string;
          platformName: string; priority?: Priority; timestamp: string;
          author?: { id: string; name: string; avatar: string };
          assignees: Array<{ id: string; name: string; avatar: string }>;
        }>;
      }) => ({
        id: col.id,
        title: col.title,
        colorClass: col.colorClass,
        tasks: col.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          imageUrl: t.imageUrl,
          timestamp: t.timestamp,
          priority: t.priority ?? null,
          platform: {
            name: t.platformName,
            icon: PLATFORM_ICON_MAP[t.platformName] ?? Mail,
          },
          author: t.author,
          assignees: t.assignees,
        })),
      }));

      set({ columns, initialized: true });
    } catch (err) {
      console.error("fetchColumns error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ── Add Task Modal ────────────────────────────────────────────────────────
  isAddModalOpen: false,
  addModalTargetColumnId: null,

  openAddModal: (columnId) =>
    set({ isAddModalOpen: true, addModalTargetColumnId: columnId }),

  closeAddModal: () =>
    set({ isAddModalOpen: false, addModalTargetColumnId: null }),

  addTask: async (input) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create task");
    const newTaskRaw = await res.json();

    const newTask: KanbanTask = {
      ...newTaskRaw,
      platform: {
        name: newTaskRaw.platformName,
        icon: PLATFORM_ICON_MAP[newTaskRaw.platformName] ?? Mail,
      },
    };

    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === input.columnId
          ? { ...col, tasks: [newTask, ...col.tasks] }
          : col
      ),
      isAddModalOpen: false,
      addModalTargetColumnId: null,
    }));
  },

  // ── Task Detail Panel ─────────────────────────────────────────────────────
  selectedTask: null,
  selectedTaskColumnId: null,

  openTaskDetail: (task, columnId) =>
    set({ selectedTask: task, selectedTaskColumnId: columnId }),

  closeTaskDetail: () =>
    set({ selectedTask: null, selectedTaskColumnId: null }),

  updateTask: async (taskId, updates) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    set((state) => ({
      columns: state.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      })),
      selectedTask:
        state.selectedTask?.id === taskId
          ? { ...state.selectedTask, ...updates }
          : state.selectedTask,
    }));
  },

  deleteTask: async (taskId, columnId) => {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });

    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      ),
      selectedTask: null,
      selectedTaskColumnId: null,
    }));
  },

  moveTask: async (taskId, fromColumnId, toColumnId) => {
    const { columns } = get();
    const fromCol = columns.find((c) => c.id === fromColumnId);
    const task = fromCol?.tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic update
    set((state) => ({
      columns: state.columns.map((col) => {
        if (col.id === fromColumnId)
          return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
        if (col.id === toColumnId)
          return { ...col, tasks: [task, ...col.tasks] };
        return col;
      }),
      selectedTaskColumnId: toColumnId,
    }));

    // Sync với DB
    await fetch(`/api/tasks/${taskId}/move`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetColumnId: toColumnId }),
    });
  },

  // ── Priority ──────────────────────────────────────────────────────────────
  applyPriority: (results) => {
    const priorityMap = new Map(results.map((r) => [r.id, r.priority]));
    set((state) => ({
      columns: state.columns.map((col) => ({
        ...col,
        tasks: col.tasks
          .map((t) => ({
            ...t,
            priority: priorityMap.get(t.id) ?? t.priority ?? null,
          }))
          .sort((a, b) => {
            const pa = PRIORITY_ORDER[a.priority ?? "low"] ?? 2;
            const pb = PRIORITY_ORDER[b.priority ?? "low"] ?? 2;
            return pa - pb;
          }),
      })),
    }));
  },

  clearPriority: () => {
    set((state) => ({
      columns: state.columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((t) => ({ ...t, priority: null })),
      })),
    }));
  },
}));