"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { Kanban, Target } from "lucide-react";
import { moveKanbanCard } from "@/server/actions/issues";
import { IssueCard } from "@/components/board/IssueCard";
import { cn } from "@/lib/utils";
import type { IssueStatus } from "@prisma/client";

type Issue = {
  id: string; number: number; title: string;
  priority: string; status: string;
  assignees: Array<{ member: { id: string; name: string; handle: string; avatarUrl: string | null } }>;
  labels: Array<{ label: { id: string; name: string; color: string } }>;
  linkedPRs: Array<{ id: string; prNumber: number; ciStatus: string; title: string }>;
  milestone: { id: string; title: string } | null;
  createdAt: Date; lastActivityAt: Date;
};

type Column = {
  status: string; label: string; color: string; issues: Issue[];
};

interface KanbanBoardProps {
  columns: Column[];
  milestone: { title: string; closed: number; total: number } | null;
}

export function KanbanBoard({ columns: initialColumns, milestone }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const activeIssue = activeId
    ? columns.flatMap((c) => c.issues).find((i) => i.id === activeId) ?? null
    : null;

  const onDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  }, []);

  const onDragEnd = useCallback(async (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const oldCol = columns.find((c) => c.issues.some((i) => i.id === active.id));
    const newCol = columns.find((c) => c.status === over.id || c.issues.some((i) => i.id === over.id));

    if (!oldCol || !newCol || oldCol.status === newCol.status) return;

    const issue = oldCol.issues.find((i) => i.id === active.id)!;

    // Optimistic update
    setColumns((prev) =>
      prev.map((col) => {
        if (col.status === oldCol.status) return { ...col, issues: col.issues.filter((i) => i.id !== active.id) };
        if (col.status === newCol.status) return { ...col, issues: [{ ...issue, status: newCol.status }, ...col.issues] };
        return col;
      })
    );

    try {
      await moveKanbanCard(issue.id, newCol.status as IssueStatus);
      toast.success(`#${issue.number} moved to ${newCol.label}`, {
        action: { label: "Undo", onClick: () => { router.refresh(); } },
      });
    } catch {
      toast.error("Failed to move card");
      router.refresh(); // rollback
    }
  }, [columns, router]);

  const progressPct = milestone && milestone.total > 0
    ? Math.round((milestone.closed / milestone.total) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full page-enter">
      {/* Board header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#404048]">
        <div className="flex items-center gap-2">
          <Kanban size={16} className="text-[#9191a0]" />
          <h1 className="text-[15px] font-semibold text-[#dcdcde]">Active Board</h1>
          <span className="text-[12px] text-[#9191a0]">— GitHub issues</span>
        </div>
        {milestone && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[12px] text-[#9191a0]">
              <Target size={12} />
              <span className="text-[#dcdcde] font-medium">{milestone.title}</span>
              <span>{milestone.closed}/{milestone.total}</span>
            </div>
            <div className="w-24 h-1.5 bg-[#303036] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3fb950] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[12px] text-[#3fb950] font-medium">{progressPct}%</span>
          </div>
        )}
      </div>

      {/* Columns */}
      <div className="flex-1 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="flex gap-3 p-4 h-full min-h-0" style={{ minWidth: `${columns.length * 260}px` }}>
            {columns.map((col) => (
              <KanbanColumn key={col.status} column={col} />
            ))}
          </div>

          <DragOverlay>
            {activeIssue && (
              <div className="kanban-card opacity-90 rotate-1 shadow-2xl w-[240px]">
                <p className="text-[13px] text-[#dcdcde] font-medium line-clamp-2">{activeIssue.title}</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

function KanbanColumn({ column }: { column: Column }) {
  return (
    <div className="flex flex-col flex-shrink-0 w-[240px]">
      {/* Column header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
          <span className="text-[12px] font-semibold text-[#dcdcde] uppercase tracking-wide">
            {column.label}
          </span>
        </div>
        <span className="text-[11px] text-[#9191a0] font-medium bg-[#303036] px-1.5 rounded">
          {column.issues.length}
        </span>
      </div>

      {/* Cards */}
      <SortableContext
        items={column.issues.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
        id={column.status}
      >
        <div
          className={cn(
            "flex flex-col gap-2 flex-1 min-h-[100px] rounded p-1 transition-colors",
            column.issues.length === 0 && "border border-dashed border-[#404048]"
          )}
          id={column.status}
        >
          {column.issues.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[11px] text-[#9191a0]">Drop here</p>
            </div>
          )}
          {column.issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} columnColor={column.color} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
