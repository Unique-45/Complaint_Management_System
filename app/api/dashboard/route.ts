import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let where: any = {};

    // Different views based on role
    if (user.role === "CUSTOMER") {
      where.createdById = user.id;
    } else if (user.role === "AGENT") {
      where.assignedToId = user.id;
    }

    // Get statistics
    const totalIssues = await prisma.issue.count({ where });
    const newIssues = await prisma.issue.count({
      where: { ...where, status: "NEW" },
    });
    const inProgressIssues = await prisma.issue.count({
      where: { ...where, status: "IN_PROGRESS" },
    });
    const resolvedIssues = await prisma.issue.count({
      where: { ...where, status: "RESOLVED" },
    });

    const criticalIssues = await prisma.issue.count({
      where: { ...where, priority: "CRITICAL" },
    });

    // Get issues by priority
    const byPriority = await prisma.issue.groupBy({
      by: ["priority"],
      where,
      _count: { id: true },
    });

    // Get issues by status
    const byStatus = await prisma.issue.groupBy({
      by: ["status"],
      where,
      _count: { id: true },
    });

    // Get issues by category
    const byCategory = await prisma.issue.groupBy({
      by: ["categoryId"],
      where,
      _count: { id: true },
    });

    const categories = await prisma.category.findMany({
      where: { id: { in: byCategory.map((c) => c.categoryId) } },
    });

    // Get average resolution time
    const resolvedIssuesWithTime = await prisma.issue.findMany({
      where: { ...where, status: "RESOLVED", resolvedAt: { not: null } },
      select: { createdAt: true, resolvedAt: true },
    });

    const avgResolutionTime =
      resolvedIssuesWithTime.length > 0
        ? resolvedIssuesWithTime.reduce((acc, issue) => {
            const hours =
              (issue.resolvedAt!.getTime() - issue.createdAt.getTime()) /
              (1000 * 60 * 60);
            return acc + hours;
          }, 0) / resolvedIssuesWithTime.length
        : 0;

    return NextResponse.json(
      {
        statistics: {
          totalIssues,
          newIssues,
          inProgressIssues,
          resolvedIssues,
          criticalIssues,
          avgResolutionTime: Math.round(avgResolutionTime * 100) / 100,
        },
        charts: {
          byPriority: byPriority.map((p) => ({
            priority: p.priority,
            count: p._count.id,
          })),
          byStatus: byStatus.map((s) => ({
            status: s.status,
            count: s._count.id,
          })),
          byCategory: byCategory.map((c) => {
            const category = categories.find((cat) => cat.id === c.categoryId);
            return {
              category: category?.name || "Unknown",
              count: c._count.id,
            };
          }),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
