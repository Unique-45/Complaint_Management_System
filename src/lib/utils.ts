import { Priority, IssueStatus } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export const PRIORITY_META: Record<
  Priority,
  { label: string; icon: string; color: string; textColor: string }
> = {
  NONE:     { label: "No priority", icon: "⚪", color: "bg-[#3a3a4a]",  textColor: "text-[#9191a0]" },
  LOW:      { label: "Low",         icon: "🔵", color: "bg-[#1a3a5c]",  textColor: "text-[#6e9fff]" },
  MEDIUM:   { label: "Medium",      icon: "🟡", color: "bg-[#3d3000]",  textColor: "text-[#c8a000]" },
  HIGH:     { label: "High",        icon: "🟠", color: "bg-[#3d1a00]",  textColor: "text-[#c87a00]" },
  CRITICAL: { label: "Critical",    icon: "🔴", color: "bg-[#3d0808]",  textColor: "text-[#c84040]" },
};

export const STATUS_META: Record<
  IssueStatus,
  { label: string; color: string; bgColor: string }
> = {
  TRIAGE_PENDING:  { label: "Pending",   color: "text-[#c8a000]",  bgColor: "bg-[#3d3000]" },
  TRIAGE_SPAM:     { label: "Spam",      color: "text-[#9191a0]",  bgColor: "bg-[#2a2a35]" },
  TRIAGE_PROMOTED: { label: "Promoted",  color: "text-[#7759c2]",  bgColor: "bg-[#2a1f4d]" },
  BACKLOG:         { label: "Backlog",   color: "text-[#9191a0]",  bgColor: "bg-[#2a2a35]" },
  TODO:            { label: "Todo",      color: "text-[#6e9fff]",   bgColor: "bg-[#1a3a5c]" },
  IN_PROGRESS:     { label: "In Progress", color: "text-[#c8a000]", bgColor: "bg-[#3d3000]" },
  IN_REVIEW:       { label: "In Review", color: "text-[#7759c2]",  bgColor: "bg-[#2a1f4d]" },
  DONE:            { label: "Done",      color: "text-[#3fb950]",   bgColor: "bg-[#0f3320]" },
  CLOSED:          { label: "Closed",    color: "text-[#9191a0]",  bgColor: "bg-[#2a2a35]" },
};

export const CI_META: Record<string, { label: string; color: string; dot: string }> = {
  success: { label: "Passing",  color: "text-[#3fb950]",  dot: "bg-[#3fb950]" },
  failure: { label: "Failing",  color: "text-[#c84040]",  dot: "bg-[#c84040]" },
  pending: { label: "Pending",  color: "text-[#c8a000]",  dot: "bg-[#c8a000]" },
  running: { label: "Running",  color: "text-[#6e9fff]",  dot: "bg-[#6e9fff]" },
};

export function isStale(date: Date | string, thresholdDays = 30): boolean {
  const d = new Date(date);
  return (Date.now() - d.getTime()) > thresholdDays * 24 * 60 * 60 * 1000;
}

export function similarityColor(score: number): string {
  if (score < 0.3)  return "text-[#3fb950]";  // green
  if (score < 0.65) return "text-[#c8a000]";  // amber
  return "text-[#c84040]";                     // red
}

export function similarityBg(score: number): string {
  if (score < 0.3)  return "bg-[#0f3320] border-[#2d7d46]";
  if (score < 0.65) return "bg-[#3d3000] border-[#c87a00]";
  return "bg-[#3d0808] border-[#c84040]";
}
