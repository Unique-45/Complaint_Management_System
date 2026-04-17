# Complaint Management System User Manual

Version: 1.0  
Date: April 17, 2026

## Scope Clarification

The UI contains references to Discord and GitHub complaint sources, but direct external platform integrations are not implemented in this version.

This is intentional and aligned with project scope: Discord/GitHub integration connectors were not part of the original SRS.

## 1. Purpose

This manual explains how to use the Complaint Management System dashboard for day-to-day complaint triage and tracking.

The app is designed for maintainers who need to:
- review incoming complaints from Discord,
- promote valid complaints into active work,
- track active work on a Kanban board,
- inspect details in a side drawer,
- create new complaints directly.

## 2. What You Need Before Starting

- Node.js and npm installed
- Docker installed and running
- Local PostgreSQL started via project scripts

From the project root, run:

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```

Open the app at:
- http://localhost:3000

The home route redirects to:
- /dashboard/triage

## 3. Dashboard Layout

The dashboard has four main parts:

1. Sidebar (left)
- Main navigation: Triage Inbox, Active Board, Settings
- Triage pending count badge
- Saved filters section
- Sidebar collapse/expand button

2. Top bar (top)
- Search / command palette trigger
- New Complaint button
- Notification and help icons

3. Main content area (center)
- Shows either Triage, Board, or Settings page

4. Overlay surfaces
- Issue Drawer (right side panel)
- Create Complaint modal
- Command palette
- Global keyboard handler

## 4. Main Navigation

### 4.1 Triage Inbox

Path:
- /dashboard/triage

Purpose:
- Review incoming Discord complaints before they become active work items.

Available filters:
- Pending
- All
- Flagged Duplicate
- Promoted
- Spam

### 4.2 Active Board

Path:
- /dashboard/board

Purpose:
- Track promoted GitHub-source complaints across Kanban stages.

Columns:
- Backlog
- Todo
- In Progress
- In Review
- Done

### 4.3 Settings

Path:
- /dashboard/settings

Purpose:
- Placeholder configuration cards for phase-2 features.

Current state:
- Informational only. No full settings editor wired yet.

## 5. Triage Inbox: How To Use

## 5.1 Read and inspect complaints

Each row shows:
- complaint number,
- title,
- labels,
- similarity score,
- reporter,
- age,
- status,
- quick action buttons on hover.

Click a row to open the Issue Drawer.

## 5.2 Promote a complaint to active board

You can promote in several ways:
- hover row and click Promote icon,
- press p on the keyboard for the focused row,
- use command palette action: Promote to GitHub,
- use drawer footer button: Promote to GitHub.

Result:
- issue status changes to Backlog,
- issue appears in Active Board,
- views refresh automatically.

## 5.3 Mark complaint as spam

You can mark spam by:
- hover row and click Spam icon,
- press x on focused row,
- use command palette action: Mark as Spam,
- use drawer footer button: Mark Spam.

Result:
- issue moves to TRIAGE_SPAM status,
- triage view refreshes.

## 5.4 Mark complaint done

Keyboard and command action exist:
- press e on focused row,
- command palette action: Mark as Done.

Result:
- issue status becomes DONE,
- it can appear in Board Done column (if source is GITHUB).

Note:
- Triage page itself only loads source DISCORD items.

## 5.5 Bulk actions

When 2 or more rows are selected, the Bulk Action Bar appears.

Working bulk actions:
- Promote All
- Spam All
- Clear Selection

Placeholder (phase-2 style feedback only):
- Mass Reply and Close
- Assign
- Label

## 6. Active Board: How To Use

## 6.1 Move cards between stages

Drag a card from one column and drop it into another column.

Result:
- card updates optimistically in UI,
- server action persists the new status,
- board refreshes on success/failure handling.

## 6.2 Read card metadata

Card includes:
- complaint number,
- priority indicator,
- labels,
- optional linked PR and CI dot,
- assignee avatars.

Click card to open Issue Drawer.

## 6.3 Milestone progress

Top-right board header may show:
- milestone title,
- closed/total count,
- progress bar and percentage.

## 7. Issue Drawer: How To Use

## 7.1 Opening and closing

Open via:
- click any triage row,
- click any board card,
- press Enter on focused triage row.

Close via:
- Esc key,
- close icon,
- click backdrop,
- footer Close button.

## 7.2 What you can view

Drawer includes:
- title, number, status, stale indicator,
- labels and priority chip,
- Discord thread context for Discord-source items,
- issue description for GitHub-source items,
- AI similarity block and duplicate hint,
- internal notes and public replies tabs,
- right sidebar metadata: assignees, labels, milestone, GitHub links/PRs.

## 7.3 Focus mode

Use key f or focus icon to toggle wide drawer mode.

## 7.4 Drawer actions

Working actions:
- Promote to GitHub (footer button)
- Mark Spam (footer button)

Actions currently shown as coming soon / phase-2:
- Merge into
- Flag Duplicate
- Create Branch
- true note persistence from textarea submit (currently UI feedback only)

## 8. Create New Complaint

Open modal by:
- clicking New Complaint in top bar,
- pressing c.

Fill:
- Title (required)
- Description
- Priority

Submit by:
- Create Complaint button,
- Ctrl+Enter (or Cmd+Enter on macOS).

Result:
- complaint is created with source GITHUB,
- initial status is TODO,
- app navigates to Active Board.

## 9. Command Palette

Open with:
- Ctrl+K (or Cmd+K),
- top bar Search or jump to button.

Contains grouped commands:
- Navigate: triage, board, settings
- Actions: assign, promote, spam, done, merge, flag duplicate
- View: toggle focus mode

Note:
- Some actions trigger placeholder behavior depending on implementation state.

## 10. Keyboard Shortcuts

Global shortcuts (outside focused text inputs):

- c: Open create complaint modal
- Esc: Close drawer / close create modal
- Ctrl+K or Cmd+K: Open command palette
- ?: Toggle keyboard help event
- f: Toggle focus mode

Triage navigation/actions:
- j: Move focus down
- k: Move focus up
- Enter: Open focused complaint
- p: Promote focused complaint
- x: Mark focused complaint as spam
- e: Mark focused complaint done
- a: Assign to me event (placeholder in current UI)
- m: Merge event (placeholder in current UI)

Go-to sequence shortcuts:
- g then t: Go to triage
- g then b: Go to board
- g then s: Go to settings

## 11. Status Reference

- TRIAGE_PENDING: New triage complaint
- TRIAGE_SPAM: Triage item marked spam
- TRIAGE_PROMOTED: Triage item promoted state (status exists; current promote flow uses BACKLOG)
- BACKLOG: Board backlog
- TODO: Ready for implementation
- IN_PROGRESS: Work in progress
- IN_REVIEW: Under review
- DONE: Completed
- CLOSED: Closed/merged duplicate terminal state

## 12. What Is Implemented vs Placeholder

Implemented and persisted:
- triage promote/spam/done actions,
- bulk promote/spam,
- board drag-and-drop status changes,
- create complaint,
- drawer data loading.

Visible but currently placeholder/phase-2 behavior:
- several settings cards,
- merge/flag duplicate actions in drawer/toolbars,
- assign to me keyboard/command effect,
- note composer send behavior only showing toast.

## 13. Troubleshooting

1. App does not load / DB connection errors
- Ensure Docker daemon is running.
- Run:
```bash
npm run db:up
npm run db:push
npm run db:seed
```

2. Empty data screens
- Seed demo data again:
```bash
npm run db:seed
```

3. Port 5432 conflict
- Stop conflicting local PostgreSQL service or edit connection string and scripts accordingly.

4. Stale UI after action
- Hard refresh browser.
- Retry action.
- Confirm terminal has no Prisma/runtime errors.

## 14. Suggested Daily Workflow

1. Start in Triage Inbox and clear critical/pending items.
2. Promote valid complaints to board.
3. Mark clear spam quickly.
4. Use Board to drive active work across columns.
5. Open Drawer for context before changing status.
6. Use Create Complaint for directly reported internal findings.
