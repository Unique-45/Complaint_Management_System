"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Inbox,
  Kanban,
  Settings,
  Tag,
  Milestone,
  Users,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  Filter,
  Plus,
  Activity,
  Keyboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  orgName: string;
  triageCount: number;
}

const SAVED_FILTERS = [
  { label: "My Issues", href: "/dashboard/triage?assignee=me" },
  { label: "High Priority", href: "/dashboard/triage?priority=HIGH,CRITICAL" },
  { label: "Stale > 30d", href: "/dashboard/triage?stale=true" },
  { label: "Hardware Bugs", href: "/dashboard/triage?label=hardware" },
];

export function Sidebar({ orgName, triageCount }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const navItems = [
    {
      label: "Triage Inbox",
      href: "/dashboard/triage",
      icon: Inbox,
      badge: triageCount > 0 ? triageCount : null,
      active: pathname.startsWith("/dashboard/triage"),
    },
    {
      label: "Active Board",
      href: "/dashboard/board",
      icon: Kanban,
      badge: null,
      active: pathname.startsWith("/dashboard/board"),
    },
    {
      label: "Labels",
      href: "/dashboard/settings?tab=labels",
      icon: Tag,
      badge: null,
      active: false,
    },
    {
      label: "Milestones",
      href: "/dashboard/settings?tab=milestones",
      icon: Milestone,
      badge: null,
      active: false,
    },
    {
      label: "Members",
      href: "/dashboard/settings?tab=members",
      icon: Users,
      badge: null,
      active: false,
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#26262c] border-r border-[#404048] transition-all duration-200 ease-in-out flex-shrink-0 relative",
        collapsed ? "w-[52px]" : "w-[220px]"
      )}
    >
      {/* Org header */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-[#404048] min-h-[52px]">
        <div className="w-7 h-7 rounded bg-[#7759c2] flex items-center justify-center flex-shrink-0">
          <GitBranch size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#dcdcde] truncate leading-tight">{orgName}</p>
            <p className="text-[11px] text-[#9191a0] leading-tight">Maintainer Dashboard</p>
          </div>
        )}
      </div>

      {/* Toggle collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[60px] z-10 w-5 h-5 rounded-full bg-[#303036] border border-[#404048] flex items-center justify-center hover:bg-[#404048] transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={10} className="text-[#9191a0]" />
        ) : (
          <ChevronLeft size={10} className="text-[#9191a0]" />
        )}
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-1.5">
        {/* Section: Views */}
        {!collapsed && (
          <p className="px-2 pt-1 pb-1 text-[10px] font-semibold text-[#9191a0] uppercase tracking-wider select-none">
            Views
          </p>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const navEl = (
            <Link
              key={item.href}
              href={item.href}
              className={cn("gl-nav-item", item.active && "active")}
              aria-current={item.active ? "page" : undefined}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-[13px]">{item.label}</span>
                  {item.badge != null && (
                    <span className="ml-auto text-[11px] font-medium bg-[#7759c2] text-white rounded-full px-1.5 py-0.5 leading-none min-w-[18px] text-center">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger render={navEl} />
                <TooltipContent side="right" className="bg-[#303036] border-[#404048] text-[#dcdcde]">
                  <div className="flex items-center gap-2">
                    {item.label}
                    {item.badge != null && (
                      <span className="text-[11px] bg-[#7759c2] text-white rounded-full px-1.5">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          }
          return navEl;
        })}

        {!collapsed && (
          <>
            <Separator className="my-2 bg-[#404048]" />

            {/* Section: Saved Filters */}
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-[10px] font-semibold text-[#9191a0] uppercase tracking-wider select-none">
                Filters
              </p>
              <button
                onClick={() => setFiltersExpanded(!filtersExpanded)}
                className="text-[#9191a0] hover:text-[#dcdcde] transition-colors"
              >
                <Filter size={11} />
              </button>
            </div>

            {filtersExpanded && (
              <div className="space-y-0.5">
                {SAVED_FILTERS.map((f) => (
                  <Link
                    key={f.href}
                    href={f.href}
                    className="gl-nav-item text-[12px] py-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9191a0] flex-shrink-0" />
                    <span>{f.label}</span>
                  </Link>
                ))}
                <button className="gl-nav-item text-[12px] py-1 w-full text-left text-[#9191a0]">
                  <Plus size={12} className="flex-shrink-0" />
                  <span>New filter</span>
                </button>
              </div>
            )}

            <Separator className="my-2 bg-[#404048]" />

            {/* Section: Activity */}
            <button className="gl-nav-item w-full text-[13px]">
              <Activity size={16} className="flex-shrink-0" />
              <span>Activity Feed</span>
            </button>
          </>
        )}
      </nav>

      {/* Bottom: user + settings */}
      <div className="border-t border-[#404048] p-2">
        {!collapsed ? (
          <div className="flex items-center gap-2 p-1.5 rounded hover:bg-[#303036] cursor-pointer transition-colors">
            <Avatar className="w-6 h-6 flex-shrink-0">
              <AvatarImage src="https://api.dicebear.com/9.x/avataaars/svg?seed=alice" />
              <AvatarFallback className="bg-[#7759c2] text-white text-[10px]">AC</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-[#dcdcde] leading-tight font-medium truncate">Alice Chen</p>
              <p className="text-[10px] text-[#9191a0] leading-tight">Maintainer</p>
            </div>
            <Link href="/dashboard/settings">
              <Settings size={13} className="text-[#9191a0] hover:text-[#dcdcde] transition-colors" />
            </Link>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger render={
              <Link href="/dashboard/settings" className="flex items-center justify-center p-1.5 rounded hover:bg-[#303036] transition-colors">
                <Settings size={16} className="text-[#9191a0]" />
              </Link>
            } />
            <TooltipContent side="right" className="bg-[#303036] border-[#404048] text-[#dcdcde]">Settings</TooltipContent>
          </Tooltip>
        )}

        {!collapsed && (
          <button
            className="mt-1 w-full flex items-center gap-2 px-2 py-1 text-[11px] text-[#9191a0] hover:text-[#dcdcde] transition-colors"
            onClick={() => {
              const el = document.getElementById("keyboard-help-overlay");
              if (el) el.dispatchEvent(new CustomEvent("toggle-help"));
            }}
          >
            <Keyboard size={11} />
            Press <kbd className="kbd">?</kbd> for shortcuts
          </button>
        )}
      </div>
    </aside>
  );
}
