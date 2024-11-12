import { create } from 'zustand';

interface SelectedEmailsStore {
  selectedEmails: string[];
  setSelectedEmails: (emails: string[]) => void;
  clearSelectedEmails: () => void;
}

export const useSelectedEmails = create<SelectedEmailsStore>((set) => ({
  selectedEmails: [],
  setSelectedEmails: (emails) => set({ selectedEmails: emails }),
  clearSelectedEmails: () => set({ selectedEmails: [] }),
}));