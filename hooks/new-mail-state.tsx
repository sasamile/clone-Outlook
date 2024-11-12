import { EmailResponse } from "@/types";
import { create } from "zustand";

interface NewMailState {
  isNewMailOpen: boolean;
  draftId: string | null;
  setNewMail: (open: boolean) => void;
  setDraftId: (id: string | null) => void;
}

interface ReplyToData {
  to: {
    id: string;
    email: string;
    name: string;
  }[];
  subject: string;
  originalBody: string;
  originalDate: string;
}

export const useNewMailStore = create<NewMailState>()((set) => ({
  isNewMailOpen: false,
  draftId: null,
  setNewMail: (open) => set({ isNewMailOpen: open }),
  setDraftId: (id) => set({ draftId: id }),
}));

interface MailStore {
  selectedEmail: EmailResponse | null;
  setSelectedEmail: (email: EmailResponse | null) => void;
  replyTo: ReplyToData | null;
  setReplyTo: (data: ReplyToData | null) => void;
}

export const useMailStore = create<MailStore>((set) => ({
  selectedEmail: null,
  setSelectedEmail: (email) => set({ selectedEmail: email }),
  replyTo: null,
  setReplyTo: (data) => set({ replyTo: data }),
}));

interface FilePreview {
  url: string;
  name: string;
  type: string;
}

interface UploadthingState {
  isUploadthingOpen: boolean;
  filesPreviews: FilePreview[];
  setisUploadthingOpen: (open: boolean) => void;
  setFilesPreviews: (files: FilePreview[]) => void;
  clearFilesPreviews: () => void;
}

export const useUploadthing = create<UploadthingState>()((set) => ({
  isUploadthingOpen: false,
  filesPreviews: [],
  setisUploadthingOpen: (open) => set({ isUploadthingOpen: open }),
  setFilesPreviews: (files) => set({ filesPreviews: files }),
  clearFilesPreviews: () => set({ filesPreviews: [] }),
}));

interface UseTrashState {
  isTrashOpen: boolean;
  setIsTrashOpen: (open: boolean) => void;
}

export const UseTrash = create<UseTrashState>()((set) => ({
  isTrashOpen: false,
  setIsTrashOpen: (open) => set({ isTrashOpen: open }),
}));
