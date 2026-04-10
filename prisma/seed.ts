import { IssueSource, IssueStatus, Priority } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up
  await prisma.note.deleteMany();
  await prisma.linkedPR.deleteMany();
  await prisma.issueAssignee.deleteMany();
  await prisma.issueLabel.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.label.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.member.deleteMany();
  await prisma.organization.deleteMany();

  // Create org
  const org = await prisma.organization.create({
    data: {
      name: "Complaint Management Cell",
      slug: "complaint-management-cell",
      avatarUrl: null,
    },
  });

  // Create members
  const [alice, bob, carol, dave] = await Promise.all([
    prisma.member.create({
      data: {
        orgId: org.id,
        name: "Aarav Mehta",
        handle: "aarav",
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=aarav`,
        role: "maintainer",
      },
    }),
    prisma.member.create({
      data: {
        orgId: org.id,
        name: "Nisha Kapoor",
        handle: "nisha",
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=nisha`,
        role: "maintainer",
      },
    }),
    prisma.member.create({
      data: {
        orgId: org.id,
        name: "Rohan Sethi",
        handle: "rohan",
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=rohan`,
        role: "contributor",
      },
    }),
    prisma.member.create({
      data: {
        orgId: org.id,
        name: "Ishita Verma",
        handle: "ishita",
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=ishita`,
        role: "maintainer",
      },
    }),
  ]);

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({ data: { orgId: org.id, name: "bug", color: "#c84040" } }),
    prisma.label.create({ data: { orgId: org.id, name: "enhancement", color: "#7759c2" } }),
    prisma.label.create({ data: { orgId: org.id, name: "regression", color: "#c87a00" } }),
    prisma.label.create({ data: { orgId: org.id, name: "hardware", color: "#2d7d46" } }),
    prisma.label.create({ data: { orgId: org.id, name: "wayland", color: "#1a6fa8" } }),
    prisma.label.create({ data: { orgId: org.id, name: "wontfix", color: "#6e6e85" } }),
    prisma.label.create({ data: { orgId: org.id, name: "performance", color: "#c84040" } }),
    prisma.label.create({ data: { orgId: org.id, name: "good first issue", color: "#2d7d46" } }),
  ]);

  const [lBug, lEnhancement, lRegression, lHardware, lWayland, lWontfix, lPerf, lGfi] = labels;

  // Create milestones
  const [mv24, mv25] = await Promise.all([
    prisma.milestone.create({
      data: {
        orgId: org.id,
        title: "v2.4 — Stable",
        dueDate: new Date("2026-05-01"),
      },
    }),
    prisma.milestone.create({
      data: {
        orgId: org.id,
        title: "v2.5 — Features",
        dueDate: new Date("2026-07-01"),
      },
    }),
  ]);

  // Helper to subtract days
  const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

  // TRIAGE ISSUES (Discord source, awaiting promotion)
  const triageIssues = [
    {
      number: 301,
      title: "Hyprland crashes immediately on Wayland 1.4.2 upgrade",
      body: "After upgrading wayland-protocols to 1.4.2, hyprland crashes on startup with SIGSEGV. Downgrading fixes it.",
      source: IssueSource.DISCORD,
      status: IssueStatus.TRIAGE_PENDING,
      priority: Priority.CRITICAL,
      discordAuthorName: "kira_dev",
      discordAvatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=kira`,
      discordThreadId: "disc-thread-001",
      similarityScore: 0.18,
      labels: [lBug.id, lWayland.id, lRegression.id],
      assignee: alice.id,
      daysAgo: 1,
      discordReplies: [
        { author: "kira_dev", body: "I tested on two machines, same result both times.", timestamp: daysAgo(1) },
        { author: "xanthe99", body: "Same here, also getting it with mesa 24.1", timestamp: daysAgo(0.9) },
      ],
    },
    {
      number: 302,
      title: "Screen tearing on NVIDIA RTX 4090 with proprietary driver",
      body: "Constant screen tearing when moving windows fast. Using driver 550.78, g-sync display. Works fine on AMD.",
      source: IssueSource.DISCORD,
      status: IssueStatus.TRIAGE_PENDING,
      priority: Priority.HIGH,
      discordAuthorName: "gamer_flux",
      discordAvatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=gamer`,
      discordThreadId: "disc-thread-002",
      similarityScore: 0.72,
      duplicateOfNumber: 247,
      labels: [lBug.id, lHardware.id],
      daysAgo: 2,
      discordReplies: [],
    },
    {
      number: 303,
      title: "Animations freeze for 2-3 seconds after system wake from sleep",
      body: "After waking from suspend, all animations hang. Mouse moves fine but windows refuse to animate for about 3 seconds.",
      source: IssueSource.DISCORD,
      status: IssueStatus.TRIAGE_PENDING,
      priority: Priority.MEDIUM,
      discordAuthorName: "laptopuser42",
      discordAvatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=laptop`,
      discordThreadId: "disc-thread-003",
      similarityScore: 0.31,
      labels: [lBug.id, lPerf.id],
      assignee: bob.id,
      daysAgo: 3,
      discordReplies: [
        { author: "laptopuser42", body: "Happens every time, not random.", timestamp: daysAgo(3) },
      ],
    },
    {
      number: 304,
      title: "hyprctl reload causes all keybindings to stop working",
      body: "Running `hyprctl reload` works for most things but keybinds stop firing. Have to kill and restart hyprland.",
      source: IssueSource.DISCORD,
      status: IssueStatus.TRIAGE_PENDING,
      priority: Priority.HIGH,
      discordAuthorName: "terminalowl",
      discordAvatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=terminalowl`,
      discordThreadId: "disc-thread-004",
      similarityScore: 0.08,
      labels: [lBug.id],
      daysAgo: 4,
      discordReplies: [],
    },
    {
      number: 305,
      title: "XWayland apps have blurry text on HiDPI display",
      body: "All XWayland apps render at 1x scale regardless of monitor scaling setting. Wayland-native apps are fine.",
      source: IssueSource.DISCORD,
      status: IssueStatus.TRIAGE_PENDING,
      priority: Priority.MEDIUM,
      discordAuthorName: "hidpi_woes",
      discordAvatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=hidpi`,
      discordThreadId: "disc-thread-005",
      similarityScore: 0.44,
      labels: [lBug.id, lWayland.id],
      daysAgo: 5,
      discordReplies: [
        { author: "hidpi_woes", body: "I'm on a 4K monitor with 2x scaling.", timestamp: daysAgo(5) },
        { author: "retina_pal", body: "Same, 2560x1440 with 1.5x — all xwayland blurry.", timestamp: daysAgo(4.5) },
      ],
    },
    {
      number: 306,
      title: "Feature request: add opacity rules per window class",
      body: "Would be great to set different opacity levels for different app classes in hyprland.conf instead of global.",
      source: IssueSource.DISCORD,
      status: IssueStatus.TRIAGE_PENDING,
      priority: Priority.LOW,
      discordAuthorName: "ricing_god",
      discordAvatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=ricing`,
      discordThreadId: "disc-thread-006",
      similarityScore: 0.05,
      labels: [lEnhancement.id],
      daysAgo: 7,
      discordReplies: [],
    },
    {
      number: 307,
      title: "hyprland crashes when connecting second monitor via HDMI",
      body: "SIGSEGV when plugging in second monitor. Single monitor setup works fine.",
      source: IssueSource.DISCORD,
      status: IssueStatus.TRIAGE_PENDING,
      priority: Priority.CRITICAL,
      discordAuthorName: "dual_monitor_pain",
      discordAvatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=dual`,
      discordThreadId: "disc-thread-007",
      similarityScore: 0.65,
      duplicateOfNumber: 301,
      labels: [lBug.id, lHardware.id, lRegression.id],
      assignee: dave.id,
      daysAgo: 1,
      discordReplies: [],
    },
    {
      number: 308,
      title: "Window rules regex not matching app_id with special characters",
      body: "windowrule = float, ^(org\\.kde\\.)$ style patterns break with dots. Square bracket escaping needed.",
      source: IssueSource.DISCORD,
      status: IssueStatus.TRIAGE_SPAM,
      priority: Priority.NONE,
      discordAuthorName: "regex_rage",
      discordAvatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=regex`,
      discordThreadId: "disc-thread-008",
      similarityScore: 0.12,
      labels: [lBug.id],
      daysAgo: 10,
      discordReplies: [],
    },
    {
      number: 309,
      title: "IPC socket disconnects randomly after 30 minutes uptime",
      body: "hyprctl becomes unresponsive after ~30 mins. Socket file exists but commands return connection refused.",
      source: IssueSource.DISCORD,
      status: IssueStatus.TRIAGE_PROMOTED,
      priority: Priority.HIGH,
      discordAuthorName: "ipc_hell",
      discordAvatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=ipc`,
      discordThreadId: "disc-thread-009",
      similarityScore: 0.21,
      labels: [lBug.id],
      assignee: carol.id,
      daysAgo: 6,
      discordReplies: [],
    },
  ];

  // GITHUB ISSUES (promoted, on the board)
  const boardIssues = [
    {
      number: 247,
      title: "Screen tearing on NVIDIA proprietary driver (general)",
      body: "Multiple users report screen tearing with NVIDIA proprietary drivers. Affects G-Sync and non-G-Sync displays.",
      source: IssueSource.GITHUB,
      status: IssueStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      githubIssueNumber: 247,
      githubIssueUrl: "https://github.com/hyprwm/Hyprland/issues/247",
      labels: [lBug.id, lHardware.id],
      assignee: alice.id,
      milestoneId: mv24.id,
      daysAgo: 14,
      prs: [
        { prNumber: 112, title: "fix: nvidia tearing with explicit sync", ciStatus: "failure", prUrl: "https://github.com/hyprwm/Hyprland/pull/112" },
      ],
    },
    {
      number: 251,
      title: "Add support for hyprland.conf hot-reload without restart",
      body: "Implement full hot-reload of config including keybinds, monitor configs, and window rules.",
      source: IssueSource.GITHUB,
      status: IssueStatus.TODO,
      priority: Priority.MEDIUM,
      githubIssueNumber: 251,
      githubIssueUrl: "https://github.com/hyprwm/Hyprland/issues/251",
      labels: [lEnhancement.id],
      assignee: bob.id,
      milestoneId: mv25.id,
      daysAgo: 21,
      prs: [],
    },
    {
      number: 255,
      title: "XWayland HiDPI scaling regression in v0.38",
      body: "XWayland apps no longer respect the fractional scale set per monitor since v0.38.0.",
      source: IssueSource.GITHUB,
      status: IssueStatus.IN_REVIEW,
      priority: Priority.HIGH,
      githubIssueNumber: 255,
      githubIssueUrl: "https://github.com/hyprwm/Hyprland/issues/255",
      labels: [lBug.id, lRegression.id, lWayland.id],
      assignee: carol.id,
      milestoneId: mv24.id,
      daysAgo: 8,
      prs: [
        { prNumber: 118, title: "fix: xwayland fractional scale per monitor", ciStatus: "success", prUrl: "https://github.com/hyprwm/Hyprland/pull/118" },
      ],
    },
    {
      number: 260,
      title: "Implement per-application opacity rules",
      body: "Allow opacity = 0.9 [class:Alacritty] syntax in windowrule blocks.",
      source: IssueSource.GITHUB,
      status: IssueStatus.BACKLOG,
      priority: Priority.LOW,
      githubIssueNumber: 260,
      githubIssueUrl: "https://github.com/hyprwm/Hyprland/issues/260",
      labels: [lEnhancement.id, lGfi.id],
      milestoneId: mv25.id,
      daysAgo: 30,
      prs: [],
    },
    {
      number: 263,
      title: "IPC socket stability improvements",
      body: "The hyprland IPC socket drops connections after extended uptime. Needs keepalive or reconnect logic.",
      source: IssueSource.GITHUB,
      status: IssueStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      githubIssueNumber: 263,
      githubIssueUrl: "https://github.com/hyprwm/Hyprland/issues/263",
      labels: [lBug.id],
      assignee: dave.id,
      milestoneId: mv24.id,
      daysAgo: 5,
      prs: [
        { prNumber: 121, title: "fix: ipc socket keepalive", ciStatus: "pending", prUrl: "https://github.com/hyprwm/Hyprland/pull/121" },
      ],
    },
    {
      number: 264,
      title: "Improve animation interpolation for bezier curves",
      body: "Current bezier implementation has rounding errors at high frame rates causing micro-stutters.",
      source: IssueSource.GITHUB,
      status: IssueStatus.BACKLOG,
      priority: Priority.MEDIUM,
      githubIssueNumber: 264,
      githubIssueUrl: "https://github.com/hyprwm/Hyprland/issues/264",
      labels: [lPerf.id, lEnhancement.id],
      milestoneId: mv25.id,
      daysAgo: 45,
      prs: [],
    },
    {
      number: 268,
      title: "Fix window border radius clipping with rounded corners",
      body: "When rounding is set > 8, the border clips into the window content area by 1-2px.",
      source: IssueSource.GITHUB,
      status: IssueStatus.DONE,
      priority: Priority.LOW,
      githubIssueNumber: 268,
      githubIssueUrl: "https://github.com/hyprwm/Hyprland/issues/268",
      labels: [lBug.id],
      assignee: alice.id,
      milestoneId: mv24.id,
      daysAgo: 12,
      prs: [
        { prNumber: 125, title: "fix: border radius clipping", ciStatus: "success", prUrl: "https://github.com/hyprwm/Hyprland/pull/125" },
      ],
    },
    {
      number: 269,
      title: "Wayland crash on second monitor hotplug (HDMI)",
      body: "Hyprland segfaults when a second monitor is connected. Stack trace points to drm/output.c line 487.",
      source: IssueSource.GITHUB,
      status: IssueStatus.TODO,
      priority: Priority.CRITICAL,
      githubIssueNumber: 269,
      githubIssueUrl: "https://github.com/hyprwm/Hyprland/issues/269",
      labels: [lBug.id, lWayland.id, lHardware.id],
      assignee: dave.id,
      milestoneId: mv24.id,
      daysAgo: 3,
      prs: [],
    },
  ];

  // Create all triage issues
  const issueMap: Record<number, string> = {};

  for (const t of triageIssues) {
    const issue = await prisma.issue.create({
      data: {
        number: t.number,
        title: t.title,
        body: t.body,
        source: t.source,
        status: t.status,
        priority: t.priority,
        orgId: org.id,
        discordAuthorName: t.discordAuthorName,
        discordAvatarUrl: t.discordAvatarUrl,
        discordThreadId: t.discordThreadId,
        similarityScore: t.similarityScore,
        discordReplies: t.discordReplies as any,
        createdAt: daysAgo(t.daysAgo),
        lastActivityAt: daysAgo(t.daysAgo),
        labels: { create: t.labels.map((id) => ({ labelId: id })) },
        assignees: t.assignee ? { create: [{ memberId: t.assignee }] } : undefined,
      },
    });
    issueMap[t.number] = issue.id;
  }

  // Create board issues
  for (const b of boardIssues) {
    const issue = await prisma.issue.create({
      data: {
        number: b.number,
        title: b.title,
        body: b.body,
        source: b.source,
        status: b.status,
        priority: b.priority,
        orgId: org.id,
        githubIssueNumber: b.githubIssueNumber,
        githubIssueUrl: b.githubIssueUrl,
        milestoneId: b.milestoneId,
        createdAt: daysAgo(b.daysAgo),
        lastActivityAt: daysAgo(b.daysAgo),
        labels: { create: b.labels.map((id) => ({ labelId: id })) },
        assignees: b.assignee ? { create: [{ memberId: b.assignee }] } : undefined,
        linkedPRs: b.prs.length > 0 ? {
          create: b.prs.map((pr) => ({
            prNumber: pr.prNumber,
            prUrl: pr.prUrl,
            ciStatus: pr.ciStatus,
            title: pr.title,
          })),
        } : undefined,
      },
    });
    issueMap[b.number] = issue.id;
  }

  // Wire duplicate relationships
  const issue302 = await prisma.issue.findFirst({ where: { number: 302, orgId: org.id } });
  const issue307 = await prisma.issue.findFirst({ where: { number: 307, orgId: org.id } });
  const issue247 = await prisma.issue.findFirst({ where: { number: 247, orgId: org.id } });
  const issue301 = await prisma.issue.findFirst({ where: { number: 301, orgId: org.id } });

  if (issue302 && issue247) {
    await prisma.issue.update({ where: { id: issue302.id }, data: { duplicateOfId: issue247.id } });
  }
  if (issue307 && issue301) {
    await prisma.issue.update({ where: { id: issue307.id }, data: { duplicateOfId: issue301.id } });
  }

  // Add internal notes to a few issues
  const issue255 = await prisma.issue.findFirst({ where: { number: 255, orgId: org.id } });
  if (issue255) {
    await prisma.note.createMany({
      data: [
        { issueId: issue255.id, authorId: carol.id, body: "PR #118 is ready for review. CI is green. @alice can you take a look?", isPublic: false },
        { issueId: issue255.id, authorId: alice.id, body: "Looks good from my end. Will merge once we get a second approval.", isPublic: false },
        { issueId: issue255.id, authorId: carol.id, body: "We're tracking this — a fix is in review and will be in v2.4.", isPublic: true },
      ],
    });
  }

  if (issue247) {
    await prisma.note.createMany({
      data: [
        { issueId: issue247.id, authorId: alice.id, body: "Root cause: missing explicit sync protocol support. PR in draft.", isPublic: false },
        { issueId: issue247.id, authorId: bob.id, body: "I can reproduce on my RTX 3080 as well. Driver 545.x+", isPublic: false },
      ],
    });
  }

  console.log("✅ Seed complete!");
  console.log(`   Org: ${org.name}`);
  console.log(`   Members: ${[alice, bob, carol, dave].map(m => m.handle).join(", ")}`);
  console.log(`   Labels: ${labels.map(l => l.name).join(", ")}`);
  console.log(`   Issues: ${triageIssues.length + boardIssues.length} total`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
