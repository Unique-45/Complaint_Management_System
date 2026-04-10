# Setup Guide

## Prerequisites

- Node.js and npm
- Docker

## First run

```bash
npm install
cp .env.example .env
npm run setup
npm run dev
```

## Manual database setup

If you want to run each step separately:

```bash
npm run db:up
npm run db:push
npm run db:seed
```

## Useful commands

```bash
npm run db:reset
npm run db:studio
npm run lint
```

## Environment

The default local database connection is defined in `.env.example` and points to the `complaint_management` PostgreSQL database.
