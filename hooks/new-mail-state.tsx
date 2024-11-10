import { create } from 'zustand'

interface NewMailState {
  isNewMail: boolean
  setNewMail: (value: boolean) => void
}

export const useNewMailStore = create<NewMailState>((set) => ({
  isNewMail: false,
  setNewMail: (value) => set({ isNewMail: value }),
}))