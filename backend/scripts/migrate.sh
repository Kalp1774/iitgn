#!/bin/sh
# Migration helper script for Docker
# Usage: docker-compose exec backend sh scripts/migrate.sh

echo "Waiting for database to be ready..."
sleep 3

echo "Generating Prisma Client..."
npx prisma generate

echo "Running migrations..."
npx prisma migrate dev --name init_auth

echo "Migration complete!"

