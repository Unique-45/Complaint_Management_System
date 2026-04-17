"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const NAME_MAX = 80;
const HANDLE_MAX = 30;
const ROLE_MAX = 40;

function validateName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Name is required");
  if (trimmed.length > NAME_MAX) throw new Error(`Name cannot exceed ${NAME_MAX} characters`);
  return trimmed;
}

function validateHandle(handle: string) {
  const normalized = handle.trim().toLowerCase();
  if (!normalized) throw new Error("Handle is required");
  if (normalized.length > HANDLE_MAX) throw new Error(`Handle cannot exceed ${HANDLE_MAX} characters`);
  if (!/^[a-z0-9._-]+$/.test(normalized)) {
    throw new Error("Handle can only contain lowercase letters, numbers, dots, underscores, and hyphens");
  }
  return normalized;
}

function validateRole(role: string) {
  const trimmed = role.trim();
  if (!trimmed) throw new Error("Role is required");
  if (trimmed.length > ROLE_MAX) throw new Error(`Role cannot exceed ${ROLE_MAX} characters`);
  return trimmed;
}

export async function createMember(data: { name: string; handle: string; role: string }) {
  const name = validateName(data.name);
  const handle = validateHandle(data.handle);
  const role = validateRole(data.role);

  const org = await prisma.organization.findFirst();
  if (!org) throw new Error("No organization found");

  const existing = await prisma.member.findFirst({
    where: {
      orgId: org.id,
      handle: { equals: handle, mode: "insensitive" },
    },
  });

  if (existing) {
    throw new Error(`Handle @${handle} is already in use`);
  }

  const member = await prisma.member.create({
    data: {
      orgId: org.id,
      name,
      handle,
      role,
      avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(handle)}`,
    },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/triage");
  revalidatePath("/dashboard/board");
  return member;
}

export async function updateMemberRole(memberId: string, role: string) {
  const cleanRole = validateRole(role);

  await prisma.member.update({
    where: { id: memberId },
    data: { role: cleanRole },
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/triage");
  revalidatePath("/dashboard/board");
}
