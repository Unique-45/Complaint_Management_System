import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="p-6 page-enter">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-[15px] font-semibold text-[#dcdcde]">Settings</h1>
        <span className="text-[12px] text-[#9191a0]">— Integrations & Configuration</span>
      </div>

      <div className="grid gap-4 max-w-2xl">
        {["Repository Linking", "Discord Integration", "Labels Manager", "Milestones", "Team Members", "AI Config"].map((s) => (
          <div key={s} className="bg-[#26262c] border border-[#404048] rounded p-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-medium text-[#dcdcde]">{s}</p>
              <p className="text-[12px] text-[#9191a0] mt-0.5">Configure {s.toLowerCase()} settings</p>
            </div>
            <span className="text-[11px] bg-[#303036] text-[#9191a0] px-2 py-1 rounded border border-[#404048]">
              Phase 2
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
