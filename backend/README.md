# HRMS Backend – Part 1: Authentication & User Model

## Setup

### 1. Copy environment variables

```bash
cp .env.example .env
```

### 2. Run Prisma migrations

**Option A: Run migrations inside Docker container**

```bash
# Start services (postgres + backend)
docker-compose up -d postgres

# Wait a few seconds for postgres to be ready, then run migrations
docker-compose exec backend npx prisma migrate dev --name init_auth

# Or run all commands in one go:
docker-compose up -d postgres && sleep 5 && docker-compose exec backend npx prisma migrate dev --name init_auth
```

**Option B: Run migrations locally (if you have Node.js installed)**

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init_auth
```

### 3. Start the backend

```bash
docker-compose up
```

Or if you want to rebuild:

```bash
docker-compose up --build
```

## API Endpoints

### Health Check
- `GET /health` - Returns server status

### Authentication

- `POST /api/auth/register` - Register a new user
  ```bash
  curl -X POST http://localhost:4000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"name":"Alice","email":"alice@example.com","password":"pass123","role":"EMPLOYEE"}'
  ```

- `POST /api/auth/login` - Login and get JWT token
  ```bash
  curl -X POST http://localhost:4000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@example.com","password":"pass123"}'
  ```

- `GET /api/auth/profile` - Get user profile (protected)
  ```bash
  curl -H "Authorization: Bearer <token>" http://localhost:4000/api/auth/profile
  ```

## User Roles

- `ADMIN` - Full access
- `HR` - HR Officer access
- `EMPLOYEE` - Employee access (default)

## Tech Stack

* Node.js + Express + TypeScript
* PostgreSQL + Prisma ORM
* JWT Authentication (jsonwebtoken)
* Password Hashing (bcryptjs)
* Docker for local development

## Development Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Development mode (with nodemon)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

