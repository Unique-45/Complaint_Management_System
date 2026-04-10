"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Inbox,
  Kanban,
  Settings,
  Zap,
  UserCheck,
  Flag,
  CheckCircle,
  XCircle,
  GitMerge,
  ArrowUpRight,
} from "lucide-react";

const COMMANDS = [
  { id: "go-triage",   label: "Go to Triage Inbox",   icon: Inbox,       group: "Navigate",  action: "navigate:/dashboard/triage" },
  { id: "go-board",    label: "Go to Active Board",    icon: Kanban,group: "Navigate",  action: "navigate:/dashboard/board" },
  { id: "go-settings", label: "Go to Settings",        icon: Settings,    group: "Navigate",  action: "navigate:/dashboard/settings" },
  { id: "assign-me",   label: "Assign to me",          icon: UserCheck,   group: "Actions",   action: "event:triage-action:assign-to-me" },
  { id: "promote",     label: "Promote to GitHub",     icon: ArrowUpRight,group: "Actions",   action: "event:triage-action:promote" },
  { id: "spam",        label: "Mark as Spam",          icon: XCircle,     group: "Actions",   action: "event:triage-action:spam" },
  { id: "done",        label: "Mark as Done",          icon: CheckCircle, group: "Actions",   action: "event:triage-action:done" },
  { id: "merge",       label: "Merge into issue…",     icon: GitMerge,    group: "Actions",   action: "event:triage-action:merge" },
  { id: "flag-dupe",   label: "Flag as Duplicate",     icon: Flag,        group: "Actions",   action: "event:triage-action:flag-duplicate" },
  { id: "focus-mode",  label: "Toggle Focus Mode",     icon: Zap,         group: "View",      action: "event:toggle-focus-mode" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-command-palette", handler);
    return () => window.removeEventListener("open-command-palette", handler);
  }, []);

  const runCommand = (action: string) => {
    setOpen(false);
    if (action.startsWith("navigate:")) {
      router.push(action.replace("navigate:", ""));
    } else if (action.startsWith("event:")) {
      const parts = action.replace("event:", "").split(":");
      const eventName = parts[0];
      const detail = parts[1] ? { action: parts[1] } : undefined;
      window.dispatchEvent(new CustomEvent(eventName, detail ? { detail } : undefined));
    }
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder="Search issues, run commands…"
        className="text-[13px] border-b border-[#404048]"
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty className="py-6 text-center text-[13px] text-[#9191a0]">
          No results found.
        </CommandEmpty>

        {["Navigate", "Actions", "View"].map((group) => {
          const items = COMMANDS.filter((c) => c.group === group);
          return (
            <CommandGroup
              key={group}
              heading={group}
              className="[&>div[cmdk-group-heading]]:text-[10px] [&>div[cmdk-group-heading]]:font-semibold [&>div[cmdk-group-heading]]:text-[#9191a0] [&>div[cmdk-group-heading]]:uppercase [&>div[cmdk-group-heading]]:tracking-wider [&>div[cmdk-group-heading]]:px-2 [&>div[cmdk-group-heading]]:py-1.5"
            >
              {items.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <CommandItem
                    key={cmd.id}
                    value={cmd.label}
                    onSelect={() => runCommand(cmd.action)}
                    className="flex items-center gap-2.5 py-2 px-2 text-[13px] cursor-pointer"
                  >
                    <Icon size={14} className="text-[#9191a0] flex-shrink-0" />
                    {cmd.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          );
        })}
      </CommandList>

      <div className="flex items-center gap-3 px-3 py-2 border-t border-[#404048] text-[11px] text-[#9191a0]">
        <span className="flex items-center gap-1"><kbd className="kbd">↑↓</kbd> navigate</span>
        <span className="flex items-center gap-1"><kbd className="kbd">↵</kbd> select</span>
        <span className="flex items-center gap-1"><kbd className="kbd">Esc</kbd> close</span>
      </div>
    </CommandDialog>
  );
}
