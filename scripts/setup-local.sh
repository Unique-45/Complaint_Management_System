#!/usr/bin/env bash

set -euo pipefail

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

npm run db:up
npm run db:push
npm run db:seed

echo "Local setup complete. Run: npm run dev"
