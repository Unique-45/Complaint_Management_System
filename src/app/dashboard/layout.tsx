import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { IssueDrawer } from "@/components/drawer/IssueDrawer";
import { CreateIssueModal } from "@/components/issue/CreateIssueModal";
import { KeyboardHandler } from "@/components/layout/KeyboardHandler";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const org = await prisma.organization.findFirst({
    include: {
      members: true,
      labels: true,
      milestones: true,
      _count: {
        select: {
          issues: {
            where: { status: "TRIAGE_PENDING" },
          },
        },
      },
    },
  });

  const triagePendingCount = org?._count?.issues ?? 0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#1f2023]">
      <Sidebar
        orgName={org?.name ?? "IssueTraker"}
        triageCount={triagePendingCount}
      />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar orgName={org?.name ?? "IssueTraker"} />
        <main className="flex-1 overflow-auto relative">
          {children}
        </main>
      </div>
      {/* Portalled overlay components */}
      <IssueDrawer />
      <CreateIssueModal />
      <CommandPalette />
      <KeyboardHandler />
    </div>
  );
}
