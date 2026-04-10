#!/usr/bin/env bash

set -euo pipefail

docker rm -f complaint-management-db >/dev/null 2>&1 || true
docker volume rm complaint_management_pgdata >/dev/null 2>&1 || true

echo "Removed local complaint database container and volume."
