# Seed Scripts

Scripts to set up test users for development and testing.

## Available Scripts

### 1. PowerShell Script (Windows)

```powershell
# From backend directory
.\scripts\seed-users.ps1
```

### 2. Bash Script (Linux/Mac)

```bash
# From backend directory
chmod +x scripts/seed-users.sh
bash scripts/seed-users.sh
```

### 3. Node.js Script (Cross-platform)

```bash
# From backend directory
npm run seed:users

# Or directly with tsx
npx tsx scripts/seed-users.js
```

## Test Users Created

After running any of the scripts, you'll have these test accounts:

| Role     | Email                | Password  |
|----------|----------------------|-----------|
| Admin    | admin@example.com    | admin123  |
| HR       | hr@example.com       | hr123     |
| Employee | employee@example.com | emp123    |

## Usage

1. **Make sure PostgreSQL is running:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Run the seed script:**
   ```bash
   # Windows (PowerShell)
   .\scripts\seed-users.ps1
   
   # Linux/Mac (Bash)
   bash scripts/seed-users.sh
   
   # Cross-platform (Node.js)
   npm run seed:users
   ```

3. **Verify users:**
   ```bash
   docker exec -it $(docker ps --filter "name=postgres" -q) psql -U hrms_user -d hrms_db -c "SELECT id, name, email, role FROM \"User\";"
   ```

## Notes

- Scripts use `ON CONFLICT` to update existing users (safe to run multiple times)
- Passwords are bcrypt-hashed with salt rounds of 10
- Scripts work with Docker containers or local PostgreSQL
- Node.js script is recommended for cross-platform compatibility

## Troubleshooting

### PowerShell Script Issues

If you get execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Container Not Found

Make sure Docker containers are running:
```bash
docker-compose up -d
```

### Database Connection Errors

Verify your `.env` file has correct DATABASE_URL:
```env
DATABASE_URL="postgresql://hrms_user:hrms_pass@postgres:5432/hrms_db?schema=public"
```

