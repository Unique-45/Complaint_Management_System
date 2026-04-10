// @ts-nocheck
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tinykeys } from "tinykeys";
import { useDrawerStore } from "@/stores/drawerStore";
import { useTriageCursorStore } from "@/stores/triageCursorStore";
import { useCreateIssueStore } from "@/stores/createIssueStore";

export function KeyboardHandler() {
  const router = useRouter();
  const { closeDrawer, isOpen: isDrawerOpen } = useDrawerStore();
  const { moveCursor } = useTriageCursorStore();
  const { openModal, closeModal, isOpen: isCreateOpen } = useCreateIssueStore();

  useEffect(() => {
    let gPressed = false;
    let gTimeout: NodeJS.Timeout | null = null;

    const unsubscribe = tinykeys(window, {
      // Close things
      Escape: (e) => {
        if (isDrawerOpen) { e.preventDefault(); closeDrawer(); }
        if (isCreateOpen) { e.preventDefault(); closeModal(); }
      },
      
      // Create Issue
      c: (e) => {
        if (isInputFocused()) return;
        e.preventDefault();
        openModal();
      },

      // Vim navigation
      j: (e) => {
        if (isInputFocused()) return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("triage-cursor-move", { detail: { delta: 1 } }));
      },
      k: (e) => {
        if (isInputFocused()) return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("triage-cursor-move", { detail: { delta: -1 } }));
      },
      Enter: (e) => {
        if (isInputFocused()) return;
        window.dispatchEvent(new CustomEvent("triage-open-focused"));
      },

      // Quick actions on focused issue
      p: (e) => {
        if (isInputFocused()) return;
        window.dispatchEvent(new CustomEvent("triage-action", { detail: { action: "promote" } }));
      },
      x: (e) => {
        if (isInputFocused()) return;
        window.dispatchEvent(new CustomEvent("triage-action", { detail: { action: "spam" } }));
      },
      e: (e) => {
        if (isInputFocused()) return;
        window.dispatchEvent(new CustomEvent("triage-action", { detail: { action: "done" } }));
      },
      a: (e) => {
        if (isInputFocused()) return;
        window.dispatchEvent(new CustomEvent("triage-action", { detail: { action: "assign-to-me" } }));
      },
      m: (e) => {
        if (isInputFocused()) return;
        window.dispatchEvent(new CustomEvent("triage-action", { detail: { action: "merge" } }));
      },

      // Command palette
      "$mod+k": (e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-command-palette"));
      },

      // Shortcut overlay
      "?": (e) => {
        if (isInputFocused()) return;
        window.dispatchEvent(new CustomEvent("toggle-keyboard-help"));
      },

      // Focus mode
      f: (e) => {
        if (isInputFocused()) return;
        window.dispatchEvent(new CustomEvent("toggle-focus-mode"));
      },

      // Sequence navigation: g then {t,b,s}
      g: (e) => {
        if (isInputFocused()) return;
        gPressed = true;
        if (gTimeout) clearTimeout(gTimeout);
        gTimeout = setTimeout(() => { gPressed = false; }, 700);
      },
      t: (e) => {
        if (isInputFocused()) return;
        if (gPressed) { e.preventDefault(); gPressed = false; router.push("/dashboard/triage"); }
      },
      b: (e) => {
        if (isInputFocused()) return;
        if (gPressed) { e.preventDefault(); gPressed = false; router.push("/dashboard/board"); }
      },
      s: (e) => {
        if (isInputFocused()) return;
        if (gPressed) { e.preventDefault(); gPressed = false; router.push("/dashboard/settings"); }
      },
    });

    return () => unsubscribe();
  }, [isDrawerOpen, isCreateOpen, closeDrawer, closeModal, moveCursor, router, openModal]);

  return null;
}

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    (el as HTMLElement).isContentEditable
  );
}
