import { create } from "zustand";

interface CreateIssueState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useCreateIssueStore = create<CreateIssueState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));
