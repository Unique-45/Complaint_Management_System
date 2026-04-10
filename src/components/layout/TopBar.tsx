"use client";

import { Search, Bell, HelpCircle, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDrawerStore } from "@/stores/drawerStore";
import { useCreateIssueStore } from "@/stores/createIssueStore";

interface TopBarProps {
  orgName: string;
}

export function TopBar({ orgName }: TopBarProps) {
  const { openModal } = useCreateIssueStore();

  const openPalette = () => {
    window.dispatchEvent(new CustomEvent("open-command-palette"));
  };

  return (
    <header className="h-[48px] border-b border-[#404048] bg-[#26262c] flex items-center px-4 gap-3 flex-shrink-0">
      {/* Search / Command palette trigger */}
      <button
        onClick={openPalette}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#1f2023] border border-[#404048] rounded text-[#9191a0] text-[13px] hover:border-[#5a5a6a] hover:text-[#dcdcde] transition-all w-52 text-left"
        aria-label="Open command palette"
      >
        <Search size={13} />
        <span className="flex-1">Search or jump to…</span>
        <span className="flex items-center gap-0.5">
          <kbd className="kbd">⌘</kbd>
          <kbd className="kbd">K</kbd>
        </span>
      </button>

      {/* Breadcrumb area */}
      <div className="flex-1 flex items-center gap-1.5 text-[12px] text-[#9191a0]">
        <span className="text-[#dcdcde] font-medium">{orgName}</span>
        <span>/</span>
        <span>Dashboard</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button 
          onClick={openModal}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#7759c2] hover:bg-[#8b6fd4] text-white text-[12px] font-medium rounded transition-colors"
        >
          <Plus size={13} />
          New Issue
        </button>
        <button className="p-1.5 rounded hover:bg-[#303036] text-[#9191a0] hover:text-[#dcdcde] transition-colors relative">
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#c84040] rounded-full" />
        </button>
        <button className="p-1.5 rounded hover:bg-[#303036] text-[#9191a0] hover:text-[#dcdcde] transition-colors">
          <HelpCircle size={15} />
        </button>
        <Avatar className="w-7 h-7 cursor-pointer">
          <AvatarImage src="https://api.dicebear.com/9.x/avataaars/svg?seed=alice" />
          <AvatarFallback className="bg-[#7759c2] text-white text-[11px]">AC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
