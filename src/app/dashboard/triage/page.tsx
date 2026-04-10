import { prisma } from "@/lib/prisma";
import { TriageClient } from "@/components/triage/TriageClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Triage Inbox" };

export default async function TriagePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter ?? "pending";

  const statusFilter = {
    all:      undefined,
    pending:  "TRIAGE_PENDING" as const,
    spam:     "TRIAGE_SPAM" as const,
    promoted: "TRIAGE_PROMOTED" as const,
    flagged:  undefined,
  }[filter] ?? "TRIAGE_PENDING";

  const issues = await prisma.issue.findMany({
    where: {
      source: "DISCORD",
      ...(filter === "flagged"
        ? { similarityScore: { gte: 0.6 } }
        : filter === "all"
        ? {}
        : { status: statusFilter }),
    },
    include: {
      assignees: { include: { member: true } },
      labels: { include: { label: true } },
      duplicateOf: { select: { id: true, number: true, title: true } },
      _count: { select: { notes: true } },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return <TriageClient issues={issues} activeFilter={filter} />;
}
