import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TeamMembersManager } from "@/components/settings/TeamMembersManager";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const org = await prisma.organization.findFirst({
    include: {
      members: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          handle: true,
          avatarUrl: true,
          role: true,
        },
      },
    },
  });

  return (
    <div className="p-6 page-enter">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-[15px] font-semibold text-[#dcdcde]">Settings</h1>
        <span className="text-[12px] text-[#9191a0]">— Team & Access</span>
      </div>

      <div className="mb-4 bg-[#26262c] border border-[#404048] rounded p-4 max-w-4xl">
        <p className="text-[14px] font-medium text-[#dcdcde]">Integrations</p>
        <p className="text-[12px] text-[#9191a0] mt-0.5">
          GitHub account linking and Discord account linking are intentionally deferred and will be added later.
        </p>
      </div>

      <div>
        <TeamMembersManager initialMembers={org?.members ?? []} />
      </div>
    </div>
  );
}
