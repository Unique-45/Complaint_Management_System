import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const issue = await prisma.issue.findUnique({
    where: { id },
    include: {
      assignees: { include: { member: true } },
      labels: { include: { label: true } },
      linkedPRs: true,
      milestone: true,
      duplicateOf: { select: { id: true, number: true, title: true } },
      notes: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!issue) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(issue);
}
