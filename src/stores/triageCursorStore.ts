"use client";

import { create } from "zustand";

interface TriageCursorState {
  cursorIdx: number;
  setCursor: (idx: number) => void;
  moveCursor: (delta: number, max: number) => void;
}

export const useTriageCursorStore = create<TriageCursorState>((set) => ({
  cursorIdx: 0,
  setCursor: (idx) => set({ cursorIdx: idx }),
  moveCursor: (delta, max) =>
    set((state) => ({
      cursorIdx: Math.max(0, Math.min(max - 1, state.cursorIdx + delta)),
    })),
}));
