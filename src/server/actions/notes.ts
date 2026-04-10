"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addNote(issueId: string, authorId: string, body: string, isPublic: boolean) {
  const note = await prisma.note.create({
    data: {
      issueId,
      authorId,
      body,
      isPublic,
    },
    include: { author: true },
  });
  await prisma.issue.update({
    where: { id: issueId },
    data: { lastActivityAt: new Date() },
  });
  revalidatePath("/dashboard/triage");
  revalidatePath("/dashboard/board");
  return note;
}

export async function deleteNote(noteId: string) {
  await prisma.note.delete({ where: { id: noteId } });
  revalidatePath("/dashboard/triage");
  revalidatePath("/dashboard/board");
}
