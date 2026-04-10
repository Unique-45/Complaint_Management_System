#!/usr/bin/env bash

set -euo pipefail

CONTAINER_NAME="complaint-management-db"
IMAGE_NAME="postgres:16-alpine"
PORT_MAPPING="5432:5432"
VOLUME_NAME="complaint_management_pgdata"

if command -v docker >/dev/null 2>&1; then
  if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    docker start "$CONTAINER_NAME" >/dev/null
    echo "Started existing PostgreSQL container: $CONTAINER_NAME"
    exit 0
  fi

  docker run -d \
    --name "$CONTAINER_NAME" \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=complaint_management \
    -p "$PORT_MAPPING" \
    -v "$VOLUME_NAME:/var/lib/postgresql/data" \
    "$IMAGE_NAME" >/dev/null

  echo "Created PostgreSQL container: $CONTAINER_NAME"
  exit 0
fi

echo "Docker is required to start the local database." >&2
exit 1
