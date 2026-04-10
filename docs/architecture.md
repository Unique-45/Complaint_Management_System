# Architecture Notes

## Application structure

The application uses the Next.js App Router and keeps the dashboard UI inside `src/app`.

Important areas:

- `src/app/dashboard`: page entrypoints for triage, board, and settings
- `src/components`: reusable dashboard UI
- `src/server/actions`: server-side mutations for complaint workflow
- `src/stores`: small client-side state stores
- `prisma`: schema and seed data for the local database

## Data flow

1. Pages load complaint data from Prisma on the server.
2. Client components render triage and board interactions.
3. Server actions update complaint status, priority, and notes.
4. Paths are revalidated so dashboard views reflect updates.

## Main views

- `Triage Inbox`: used for screening and filtering incoming complaints
- `Active Board`: used for moving accepted complaints across workflow columns
- `Drawer`: used for detailed complaint inspection

## Local persistence

The project uses PostgreSQL locally and Prisma as the ORM layer.
