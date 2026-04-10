"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn, PRIORITY_META, formatRelativeDate, isStale, CI_META } from "@/lib/utils";
import { useDrawerStore } from "@/stores/drawerStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitPullRequest } from "lucide-react";

type Issue = {
  id: string; number: number; title: string;
  priority: string; status: string;
  assignees: Array<{ member: { id: string; name: string; handle: string; avatarUrl: string | null } }>;
  labels: Array<{ label: { id: string; name: string; color: string } }>;
  linkedPRs: Array<{ id: string; prNumber: number; ciStatus: string; title: string }>;
  milestone: { id: string; title: string } | null;
  createdAt: Date; lastActivityAt: Date;
};

export function IssueCard({ issue, columnColor }: { issue: Issue; columnColor: string }) {
  const { openDrawer } = useDrawerStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priority = PRIORITY_META[issue.priority as keyof typeof PRIORITY_META];
  const stale = isStale(issue.lastActivityAt);
  const pr = issue.linkedPRs[0];
  const ciMeta = pr ? CI_META[pr.ciStatus] : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => openDrawer(issue.id)}
      className={cn(
        "kanban-card select-none",
        stale && "border-l-2 border-l-[#c8a000]"
      )}
    >
      {/* Color top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t"
        style={{ backgroundColor: columnColor + "88" }}
      />

      {/* Title */}
      <p className="text-[12px] text-[#dcdcde] font-medium leading-snug line-clamp-2 mb-1.5 mt-0.5">
        {issue.title}
      </p>

      {/* Labels */}
      {issue.labels.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap mb-1.5">
          {issue.labels.slice(0, 2).map(({ label }) => (
            <span
              key={label.id}
              className="gl-label"
              style={{
                backgroundColor: label.color + "26",
                borderColor: label.color + "66",
                color: label.color,
              }}
            >
              {label.name}
            </span>
          ))}
          {issue.labels.length > 2 && (
            <span className="text-[10px] text-[#9191a0]">+{issue.labels.length - 2}</span>
          )}
        </div>
      )}

      {/* Footer row */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          <span className="issue-number">#{issue.number}</span>
          <span className={cn("text-[10px]", priority.textColor)}>{priority.icon}</span>
          {pr && ciMeta && (
            <div className="flex items-center gap-0.5 text-[10px]" title={`PR #${pr.prNumber}: ${ciMeta.label}`}>
              <GitPullRequest size={9} className={ciMeta.color} />
              <span className={cn("ci-dot", ciMeta.dot)} />
            </div>
          )}
        </div>

        {/* Assignee avatars */}
        <div className="flex items-center -space-x-1">
          {issue.assignees.slice(0, 2).map(({ member }) => (
            <Avatar key={member.id} className="w-5 h-5 border border-[#26262c]">
              <AvatarImage src={member.avatarUrl ?? ""} />
              <AvatarFallback className="bg-[#7759c2] text-white text-[8px]">
                {member.name[0]}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  );
}
