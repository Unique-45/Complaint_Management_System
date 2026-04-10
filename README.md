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

## Scripts

- `npm run dev` starts the Next.js development server.
- `npm run lint` runs ESLint.
- `npm run db:up` starts the local PostgreSQL service through Docker Compose.
- `npm run db:push` applies the Prisma schema to the configured database.
- `npm run db:seed` inserts demo records.
- `npm run db:studio` opens Prisma Studio.
