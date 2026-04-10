# Complaint Management System

Next.js application for triaging, tracking, and managing complaints through a dashboard workflow.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create the local environment file:

```bash
cp .env.example .env
```

3. Start PostgreSQL:

```bash
npm run db:up
```

4. Push the Prisma schema and seed demo data:

```bash
npm run db:push
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Quick bootstrap

You can also run the full local bootstrap in one step:

```bash
npm run setup
```

## Manual Docker command

If you do not want to use the helper script, start PostgreSQL manually:

```bash
docker run -d \
  --name complaint-management-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=complaint_management \
  -p 5432:5432 \
  -v complaint_management_pgdata:/var/lib/postgresql/data \
  postgres:16-alpine
```

To remove the local database container and volume:

```bash
npm run db:reset
```

## Scripts

- `npm run dev` starts the Next.js development server.
- `npm run lint` runs ESLint.
- `npm run setup` prepares `.env`, starts PostgreSQL, pushes the schema, and seeds demo data.
- `npm run db:up` starts the local PostgreSQL service through Docker.
- `npm run db:reset` removes the local PostgreSQL container and its named volume.
- `npm run db:push` applies the Prisma schema to the configured database.
- `npm run db:seed` inserts demo records.
- `npm run db:studio` opens Prisma Studio.
