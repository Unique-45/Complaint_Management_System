# Complaint Management System Overview

This project is a Next.js based complaint management dashboard.

## Main areas

- `Triage Inbox`: incoming complaints that still need review.
- `Active Board`: complaints that have been accepted for work and are tracked through workflow stages.
- `Settings`: supporting data such as labels, milestones, and members.

## Core flow

1. A complaint enters the system.
2. It is reviewed in triage.
3. Valid complaints are promoted to the active board.
4. The team moves them through backlog, todo, in progress, in review, and done.

## Local stack

- Next.js app router frontend
- Prisma ORM
- PostgreSQL for local development
- Docker helper scripts for local database setup
