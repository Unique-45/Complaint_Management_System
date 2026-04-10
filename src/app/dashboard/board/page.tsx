import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Active Board" };

const COLUMNS = [
  { status: "BACKLOG",     label: "Backlog",     color: "#6e6e85" },
  { status: "TODO",        label: "Todo",         color: "#6e9fff" },
  { status: "IN_PROGRESS", label: "In Progress",  color: "#c8a000" },
  { status: "IN_REVIEW",   label: "In Review",    color: "#7759c2" },
  { status: "DONE",        label: "Done",         color: "#3fb950" },
] as const;

export default async function BoardPage() {
  const allIssues = await prisma.issue.findMany({
    where: {
      source: "GITHUB",
      status: { in: ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] },
    },
    include: {
      assignees: { include: { member: true } },
      labels: { include: { label: true } },
      linkedPRs: true,
      milestone: true,
    },
    orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
  });

  const milestones = await prisma.milestone.findMany({
    include: {
      _count: { select: { issues: true } },
      issues: { select: { status: true } },
    },
  });

  const closedCount = milestones[0]?.issues.filter((i) => i.status === "DONE").length ?? 0;
  const totalCount = milestones[0]?._count.issues ?? 0;

  const columns = COLUMNS.map((col) => ({
    ...col,
    issues: allIssues.filter((i) => i.status === col.status),
  }));

  return (
    <KanbanBoard
      columns={columns}
      milestone={milestones[0] ? { title: milestones[0].title, closed: closedCount, total: totalCount } : null}
    />
  );
}
