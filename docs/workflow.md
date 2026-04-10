# Complaint Workflow

## Triage

The triage view is used to inspect newly received complaints before they become active work items.

Typical triage actions:

- promote a complaint to the board
- mark a complaint as spam
- review duplicate similarity hints
- inspect reporter details and notes

## Board

The board tracks accepted complaints in a Kanban-style workflow.

Board stages:

- `Backlog`
- `Todo`
- `In Progress`
- `In Review`
- `Done`

Complaints created from the dashboard are inserted into the active board flow and can then be moved across stages.

## Local setup

From the project root:

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```
