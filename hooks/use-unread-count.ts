import { create } from "zustand";

// Definir las carpetas posibles como un tipo
export type FolderType =
  | "inbox"
  | "sent"
  | "drafts"
  | "starred"
  | "trash"
  | "archive";

// Interface para los contadores usando Record
export type UnreadCounts = Record<FolderType, number>;

// Interface para el store
interface UnreadCountsStore {
  counts: UnreadCounts;
  isLoading: boolean;
  error: Error | null;
  setCounts: (counts: UnreadCounts) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  updateCount: (folder: FolderType, delta: number) => void;
}

// Valores iniciales
const initialCounts: UnreadCounts = {
  inbox: 0,
  sent: 0,
  drafts: 0,
  starred: 0,
  trash: 0,
  archive: 0,
};

export const useUnreadCountsStore = create<UnreadCountsStore>((set) => ({
  counts: initialCounts,
  isLoading: false,
  error: null,
  setCounts: (counts) => set({ counts }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  updateCount: (folder: FolderType, delta: number) =>
    set((state) => ({
      counts: {
        ...state.counts,
        [folder]: Math.max(0, state.counts[folder] + delta),
      },
    })),
}));
