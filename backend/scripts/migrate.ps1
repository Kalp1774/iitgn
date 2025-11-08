# Migration helper script for Windows PowerShell
# Usage: docker-compose exec backend pwsh scripts/migrate.ps1

Write-Host "Waiting for database to be ready..."
Start-Sleep -Seconds 3

Write-Host "Generating Prisma Client..."
npx prisma generate

Write-Host "Running migrations..."
npx prisma migrate dev --name init_auth

Write-Host "Migration complete!"

