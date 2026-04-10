"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Inbox,
  ArrowUpRight,
  XCircle,
  CheckCircle,
  GitMerge,
  Link2,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { cn, formatRelativeDate, PRIORITY_META, STATUS_META, similarityColor, similarityBg, isStale } from "@/lib/utils";
import { useDrawerStore } from "@/stores/drawerStore";
import { useBulkSelectStore } from "@/stores/bulkSelectStore";
import { useTriageCursorStore } from "@/stores/triageCursorStore";
import { promoteIssue, markSpam, markDone, bulkPromote, bulkSpam } from "@/server/actions/issues";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BulkActionBar } from "@/components/triage/BulkActionBar";

type Issue = Awaited<ReturnType<typeof import("@prisma/client").PrismaClient.prototype.issue.findMany>>[number] & {
  assignees: Array<{ member: { id: string; name: string; handle: string; avatarUrl: string | null } }>;
  labels: Array<{ label: { id: string; name: string; color: string } }>;
  duplicateOf: { id: string; number: number; title: string } | null;
  _count: { notes: number };
};

const FILTERS = [
  { key: "pending",  label: "Pending" },
  { key: "all",      label: "All" },
  { key: "flagged",  label: "Flagged Duplicate" },
  { key: "promoted", label: "Promoted" },
  { key: "spam",     label: "Spam" },
];

export function TriageClient({ issues, activeFilter }: { issues: Issue[]; activeFilter: string }) {
  const router = useRouter();
  const { openDrawer } = useDrawerStore();
  const { selectedIds, toggleSelect, selectAll, clearSelection, isSelected } = useBulkSelectStore();
  const { cursorIdx, setCursor, moveCursor } = useTriageCursorStore();
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  // Scroll cursor into view
  useEffect(() => {
    rowRefs.current[cursorIdx]?.scrollIntoView({ block: "nearest" });
  }, [cursorIdx]);

  // Listen for global keyboard events
  useEffect(() => {
    const onMove = (e: Event) => {
      const delta = (e as CustomEvent<{ delta: number }>).detail.delta;
      moveCursor(delta, issues.length);
    };
    const onOpen = () => {
      if (issues[cursorIdx]) openDrawer(issues[cursorIdx].id);
    };
    const onAction = async (e: Event) => {
      const action = (e as CustomEvent<{ action: string }>).detail.action;
      const issue = issues[cursorIdx];
      if (!issue) return;
      if (action === "promote") {
        await promoteIssue(issue.id);
        toast.success(`#${issue.number} promoted to board`, {
          action: { label: "Undo", onClick: () => {} },
        });
        router.refresh();
      } else if (action === "spam") {
        await markSpam(issue.id);
        toast.success(`#${issue.number} marked as spam`);
        router.refresh();
      } else if (action === "done") {
        await markDone(issue.id);
        toast.success(`#${issue.number} marked as done`);
        router.refresh();
      }
    };

    window.addEventListener("triage-cursor-move", onMove);
    window.addEventListener("triage-open-focused", onOpen);
    window.addEventListener("triage-action", onAction);
    return () => {
      window.removeEventListener("triage-cursor-move", onMove);
      window.removeEventListener("triage-open-focused", onOpen);
      window.removeEventListener("triage-action", onAction);
    };
  }, [cursorIdx, issues, moveCursor, openDrawer, router]);

  const handlePromote = async (issue: Issue) => {
    await promoteIssue(issue.id);
    toast.success(`#${issue.number} promoted to board`, {
      action: { label: "Undo", onClick: () => {} },
    });
    router.refresh();
  };

  const handleSpam = async (issue: Issue) => {
    await markSpam(issue.id);
    toast.success(`#${issue.number} marked as spam`);
    router.refresh();
  };

  const allIds = issues.map((i) => i.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => isSelected(id));

  return (
    <div className="flex flex-col h-full page-enter">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#404048]">
        <div className="flex items-center gap-2">
          <Inbox size={16} className="text-[#9191a0]" />
          <h1 className="text-[15px] font-semibold text-[#dcdcde]">Triage Inbox</h1>
          <span className="text-[12px] text-[#9191a0]">— Discord thread buffer</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#9191a0]">
          <span>Use</span>
          <kbd className="kbd">j</kbd><kbd className="kbd">k</kbd>
          <span>to navigate</span>
          <kbd className="kbd">p</kbd>
          <span>promote</span>
          <kbd className="kbd">x</kbd>
          <span>spam</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center border-b border-[#404048] px-6 gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => router.push(`/dashboard/triage?filter=${f.key}`)}
            className={cn(
              "px-3 py-2.5 text-[13px] border-b-2 transition-colors",
              activeFilter === f.key
                ? "border-[#7759c2] text-[#dcdcde] font-medium"
                : "border-transparent text-[#9191a0] hover:text-[#dcdcde]"
            )}
          >
            {f.label}
            {f.key === "pending" && issues.filter(i => i.status === "TRIAGE_PENDING").length > 0 && (
              <span className="ml-1.5 text-[10px] bg-[#7759c2] text-white rounded-full px-1.5 py-0.5">
                {issues.filter(i => i.status === "TRIAGE_PENDING").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#9191a0] gap-3">
            <Inbox size={40} className="opacity-30" />
            <p className="text-[14px]">No complaints in this view</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-[#1f2023]">
              <tr className="border-b border-[#404048]">
                <th className="w-10 py-2 px-3 text-left">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(v) => v ? selectAll(allIds) : clearSelection()}
                    className="border-[#404048]"
                  />
                </th>
                <th className="py-2 px-3 text-left text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider w-16">
                  #
                </th>
                <th className="py-2 px-3 text-left text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider">
                  Title
                </th>
                <th className="py-2 px-3 text-left text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider w-28">
                  Similarity
                </th>
                <th className="py-2 px-3 text-left text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider w-32">
                  Reporter
                </th>
                <th className="py-2 px-3 text-left text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider w-20">
                  Age
                </th>
                <th className="py-2 px-3 text-left text-[11px] font-semibold text-[#9191a0] uppercase tracking-wider w-28">
                  Status
                </th>
                <th className="w-28" />
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, idx) => {
                const isKeyboardFocused = idx === cursorIdx;
                const selected = isSelected(issue.id);
                const priority = PRIORITY_META[issue.priority];
                const status = STATUS_META[issue.status];
                const stale = isStale(issue.lastActivityAt);
                const simScore = issue.similarityScore ?? 0;

                return (
                  <tr
                    key={issue.id}
                    ref={(el) => { rowRefs.current[idx] = el; }}
                    onClick={() => openDrawer(issue.id)}
                    onMouseEnter={() => setCursor(idx)}
                    className={cn(
                      "triage-row relative cursor-pointer group",
                      isKeyboardFocused && "keyboard-focused",
                      stale && "issue-stale",
                    )}
                  >
                    {/* Checkbox */}
                    <td className="py-2.5 px-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected}
                        onCheckedChange={() => toggleSelect(issue.id)}
                        className="border-[#404048]"
                      />
                    </td>

                    {/* Issue number */}
                    <td className="py-2.5 px-3">
                      <span className="issue-number">#{issue.number}</span>
                    </td>

                    {/* Title + sub-row */}
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn("text-[10px]", priority.textColor)}>{priority.icon}</span>
                          <span className="text-[13px] text-[#dcdcde] font-medium leading-tight line-clamp-1">
                            {issue.title}
                          </span>
                          {issue._count.notes > 0 && (
                            <span className="flex items-center gap-0.5 text-[11px] text-[#9191a0]">
                              <MessageSquare size={10} />
                              {issue._count.notes}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {issue.labels.map(({ label }) => (
                            <span
                              key={label.id}
                              className="gl-label"
                              style={{
                                backgroundColor: label.color + "33",
                                borderColor: label.color + "88",
                                color: label.color,
                              }}
                            >
                              {label.name}
                            </span>
                          ))}
                          {issue.duplicateOf && (
                            <span className="flex items-center gap-0.5 text-[11px] text-[#c87a00]">
                              <Link2 size={10} />
                              dup of #{issue.duplicateOf.number}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Similarity */}
                    <td className="py-2.5 px-3">
                      {issue.similarityScore != null ? (
                        <div className="flex flex-col gap-1">
                          <span className={cn("text-[12px] font-medium", similarityColor(simScore))}>
                            {Math.round(simScore * 100)}%
                          </span>
                          <div className="similarity-bar-track w-16">
                            <div
                              className="similarity-bar-fill"
                              style={{
                                width: `${simScore * 100}%`,
                                backgroundColor: simScore < 0.3 ? "#3fb950" : simScore < 0.65 ? "#c8a000" : "#c84040",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[12px] text-[#9191a0]">—</span>
                      )}
                    </td>

                    {/* Reporter */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-[#303036] flex items-center justify-center overflow-hidden flex-shrink-0">
                          {issue.discordAvatarUrl ? (
                            <img src={issue.discordAvatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[9px] text-[#9191a0]">?</span>
                          )}
                        </div>
                        <span className="text-[12px] text-[#9191a0] truncate max-w-[80px]">
                          {issue.discordAuthorName ?? "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* Age */}
                    <td className="py-2.5 px-3">
                      <span className={cn("text-[12px]", stale ? "text-[#c87a00]" : "text-[#9191a0]")}>
                        {formatRelativeDate(issue.createdAt)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium",
                          status.bgColor,
                          status.color
                        )}
                      >
                        {status.label}
                      </span>
                    </td>

                    {/* Hover actions */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger render={
                            <button
                              onClick={(e) => { e.stopPropagation(); handlePromote(issue); }}
                              className="p-1.5 rounded hover:bg-[#2a1f4d] text-[#9191a0] hover:text-[#7759c2] transition-colors"
                              aria-label="Promote to GitHub"
                            >
                              <ArrowUpRight size={13} />
                            </button>
                          } />
                          <TooltipContent className="bg-[#303036] border-[#404048] text-[11px]">
                            Promote <kbd className="kbd ml-1">p</kbd>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger render={
                            <button
                              onClick={(e) => { e.stopPropagation(); handleSpam(issue); }}
                              className="p-1.5 rounded hover:bg-[#3d0808] text-[#9191a0] hover:text-[#c84040] transition-colors"
                              aria-label="Mark as spam"
                            >
                              <XCircle size={13} />
                            </button>
                          } />
                          <TooltipContent className="bg-[#303036] border-[#404048] text-[11px]">
                            Spam <kbd className="kbd ml-1">x</kbd>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger render={
                            <button
                              onClick={(e) => { e.stopPropagation(); openDrawer(issue.id); }}
                              className="p-1.5 rounded hover:bg-[#303036] text-[#9191a0] hover:text-[#dcdcde] transition-colors"
                              aria-label="Open"
                            >
                              <ChevronRight size={13} />
                            </button>
                          } />
                          <TooltipContent className="bg-[#303036] border-[#404048] text-[11px]">
                            Open <kbd className="kbd ml-1">↵</kbd>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Bulk action bar */}
      <BulkActionBar />
    </div>
  );
}
