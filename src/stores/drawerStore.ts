"use client";

import { create } from "zustand";

interface DrawerState {
  isOpen: boolean;
  issueId: string | null;
  openDrawer: (issueId: string) => void;
  closeDrawer: () => void;
}

export const useDrawerStore = create<DrawerState>((set) => ({
  isOpen: false,
  issueId: null,
  openDrawer: (issueId) => set({ isOpen: true, issueId }),
  closeDrawer: () => set({ isOpen: false, issueId: null }),
}));
