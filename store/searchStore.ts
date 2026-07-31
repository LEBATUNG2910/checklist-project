// store/searchStore.ts
import { create } from "zustand";

interface SearchStore {
  query: string;
  isOpen: boolean;
  // Vị trí thực của search bar để dropdown căn đúng
  searchBarRect: { left: number; width: number } | null;
  setQuery: (q: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchBarRect: (rect: { left: number; width: number }) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  isOpen: false,
  searchBarRect: null,
  setQuery: (q) => set({ query: q, isOpen: q.trim().length > 0 }),
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ query: "", isOpen: false }),
  setSearchBarRect: (rect) => set({ searchBarRect: rect }),
}));