"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { IssueStatus, Priority } from "@prisma/client";

const TITLE_WORD_LIMIT = 200;

function countWords(input: string) {
  const normalized = input.trim();
  if (!normalized) return 0;
  return normalized.split(/\s+/).length;
}

function validateTitleWordLimit(title: string) {
  const words = countWords(title);
  if (words > TITLE_WORD_LIMIT) {
    throw new Error(`Title cannot exceed ${TITLE_WORD_LIMIT} words`);
  }
}

export async function promoteIssue(issueId: string) {
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      status: IssueStatus.BACKLOG,
      lastActivityAt: new Date(),
    },
  });
  revalidatePath("/dashboard/triage");
  revalidatePath("/dashboard/board");
}

export async function markSpam(issueId: string) {
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      status: IssueStatus.TRIAGE_SPAM,
      lastActivityAt: new Date(),
    },
  });
  revalidatePath("/dashboard/triage");
}

export async function markDone(issueId: string) {
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      status: IssueStatus.DONE,
      lastActivityAt: new Date(),
    },
  });
  revalidatePath("/dashboard/triage");
  revalidatePath("/dashboard/board");
}

export async function mergeInto(sourceId: string, targetId: string) {
  await prisma.issue.update({
    where: { id: sourceId },
    data: {
      duplicateOfId: targetId,
      status: IssueStatus.CLOSED,
      lastActivityAt: new Date(),
    },
  });
  revalidatePath("/dashboard/triage");
}

export async function updatePriority(issueId: string, priority: Priority) {
  await prisma.issue.update({
    where: { id: issueId },
    data: { priority, lastActivityAt: new Date() },
  });
  revalidatePath("/dashboard/triage");
  revalidatePath("/dashboard/board");
}

export async function moveKanbanCard(issueId: string, newStatus: IssueStatus) {
  await prisma.issue.update({
    where: { id: issueId },
    data: { status: newStatus, lastActivityAt: new Date() },
  });
  revalidatePath("/dashboard/board");
}

export async function updateTitle(issueId: string, title: string) {
  validateTitleWordLimit(title);

  await prisma.issue.update({
    where: { id: issueId },
    data: { title, lastActivityAt: new Date() },
  });
  revalidatePath("/dashboard/triage");
  revalidatePath("/dashboard/board");
}

export async function bulkPromote(issueIds: string[]) {
  await prisma.issue.updateMany({
    where: { id: { in: issueIds } },
    data: { status: IssueStatus.BACKLOG, lastActivityAt: new Date() },
  });
  revalidatePath("/dashboard/triage");
  revalidatePath("/dashboard/board");
}

export async function bulkSpam(issueIds: string[]) {
  await prisma.issue.updateMany({
    where: { id: { in: issueIds } },
    data: { status: IssueStatus.TRIAGE_SPAM, lastActivityAt: new Date() },
  });
  revalidatePath("/dashboard/triage");
}

export async function createIssue(data: { title: string; body: string; priority: Priority }) {
  validateTitleWordLimit(data.title);

  // Get org (assuming single org for now based on layout.tsx)
  const org = await prisma.organization.findFirst();
  if (!org) throw new Error("No organization found");

  // Determine next issue number
  const lastIssue = await prisma.issue.findFirst({
    where: { orgId: org.id },
    orderBy: { number: "desc" },
  });
  const nextNumber = (lastIssue?.number ?? 0) + 1;

  const issue = await prisma.issue.create({
    data: {
      number: nextNumber,
      title: data.title,
      body: data.body,
      priority: data.priority,
      status: IssueStatus.TODO, // Start in Todo column
      source: "GITHUB", // Track as standard issue
      orgId: org.id,
    },
  });

  revalidatePath("/dashboard/board");
  revalidatePath("/dashboard/triage");
  return issue;
}
