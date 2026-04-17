"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createMember, updateMemberRole } from "@/server/actions/members";

type MemberItem = {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string | null;
  role: string;
};

export function TeamMembersManager({ initialMembers }: { initialMembers: MemberItem[] }) {
  const [members, setMembers] = useState<MemberItem[]>(initialMembers);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [role, setRole] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [savingById, setSavingById] = useState<Record<string, boolean>>({});
  const [roleDrafts, setRoleDrafts] = useState<Record<string, string>>(
    Object.fromEntries(initialMembers.map((m) => [m.id, m.role]))
  );

  const roleCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const member of members) {
      counts.set(member.role, (counts.get(member.role) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [members]);

  const knownRoles = roleCounts.map(([roleName]) => roleName);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsCreating(true);
    try {
      const created = await createMember({ name, handle, role });
      const next = [...members, created].sort((a, b) => a.name.localeCompare(b.name));
      setMembers(next);
      setRoleDrafts((prev) => ({ ...prev, [created.id]: created.role }));

      setName("");
      setHandle("");
      setRole("");
      toast.success(`Added ${created.name} (@${created.handle})`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const onSaveRole = async (memberId: string) => {
    const nextRole = (roleDrafts[memberId] ?? "").trim();
    if (!nextRole) {
      toast.error("Role is required");
      return;
    }

    setSavingById((prev) => ({ ...prev, [memberId]: true }));
    try {
      await updateMemberRole(memberId, nextRole);
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role: nextRole } : m)));
      toast.success("Role updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update role");
    } finally {
      setSavingById((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  return (
    <div className="grid gap-4 max-w-4xl">
      <section className="bg-[#26262c] border border-[#404048] rounded p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-[14px] font-medium text-[#dcdcde]">Role Catalog</p>
            <p className="text-[12px] text-[#9191a0] mt-0.5">
              Roles are flexible text values for now. Add new role names while creating users or updating roles.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {roleCounts.length === 0 ? (
            <span className="text-[12px] text-[#9191a0]">No roles yet</span>
          ) : (
            roleCounts.map(([roleName, count]) => (
              <span
                key={roleName}
                className="inline-flex items-center gap-1 text-[11px] bg-[#303036] text-[#dcdcde] px-2 py-1 rounded border border-[#404048]"
              >
                {roleName}
                <span className="text-[#9191a0]">({count})</span>
              </span>
            ))
          )}
        </div>
      </section>

      <section className="bg-[#26262c] border border-[#404048] rounded p-4">
        <p className="text-[14px] font-medium text-[#dcdcde]">Create User</p>
        <p className="text-[12px] text-[#9191a0] mt-0.5 mb-3">Create a local team member with a role.</p>

        <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1f2023] border border-[#404048] rounded px-3 py-2 text-[13px] text-[#dcdcde] placeholder:text-[#5a5a6a] focus:outline-none focus:border-[#7759c2]"
            required
          />
          <input
            type="text"
            placeholder="handle (without @)"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full bg-[#1f2023] border border-[#404048] rounded px-3 py-2 text-[13px] text-[#dcdcde] placeholder:text-[#5a5a6a] focus:outline-none focus:border-[#7759c2]"
            required
          />
          <div>
            <input
              list="known-roles"
              type="text"
              placeholder="role (e.g. maintainer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#1f2023] border border-[#404048] rounded px-3 py-2 text-[13px] text-[#dcdcde] placeholder:text-[#5a5a6a] focus:outline-none focus:border-[#7759c2]"
              required
            />
            <datalist id="known-roles">
              {knownRoles.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-1.5 rounded bg-[#7759c2] text-white text-[13px] font-medium hover:bg-[#8b6fd4] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-[#26262c] border border-[#404048] rounded p-4">
        <p className="text-[14px] font-medium text-[#dcdcde]">Team Members</p>
        <p className="text-[12px] text-[#9191a0] mt-0.5 mb-3">Update user roles anytime. GitHub/Discord account linking will be added later.</p>

        <div className="space-y-2">
          {members.length === 0 ? (
            <p className="text-[12px] text-[#9191a0]">No members found.</p>
          ) : (
            members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border border-[#404048] rounded p-2.5 bg-[#1f2023]"
              >
                <div className="flex items-center gap-2 min-w-0 sm:w-[260px]">
                  <div className="w-7 h-7 rounded-full bg-[#303036] overflow-hidden flex-shrink-0">
                    {member.avatarUrl ? (
                      <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] text-[#dcdcde] font-medium truncate">{member.name}</p>
                    <p className="text-[11px] text-[#9191a0] truncate">@{member.handle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  <input
                    list="known-roles"
                    value={roleDrafts[member.id] ?? ""}
                    onChange={(e) => setRoleDrafts((prev) => ({ ...prev, [member.id]: e.target.value }))}
                    className="w-full max-w-[260px] bg-[#26262c] border border-[#404048] rounded px-3 py-1.5 text-[12px] text-[#dcdcde] placeholder:text-[#5a5a6a] focus:outline-none focus:border-[#7759c2]"
                    placeholder="Role"
                  />
                  <button
                    type="button"
                    disabled={savingById[member.id]}
                    onClick={() => onSaveRole(member.id)}
                    className="px-3 py-1.5 rounded border border-[#404048] text-[#dcdcde] text-[12px] hover:bg-[#303036] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {savingById[member.id] ? "Saving..." : "Save Role"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
