# HRMS Backend – Part 3: Attendance Module

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

# Add Employee model migration
docker-compose exec backend npx prisma migrate dev --name add_employee

# Add Attendance model migration
docker-compose exec backend npx prisma migrate dev --name add_attendance

# Or run all commands in one go:
docker-compose up -d postgres
docker-compose exec backend npx prisma migrate dev --name init_auth
docker-compose exec backend npx prisma migrate dev --name add_employee
docker-compose exec backend npx prisma migrate dev --name add_attendance
```

**Option B: Run migrations locally (if you have Node.js installed)**

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init_auth
npx prisma migrate dev --name add_employee
npx prisma migrate dev --name add_attendance
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

### Employee Management (All endpoints require JWT authentication)

- `GET /api/employees` - Get all employees
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:4000/api/employees" `
    -Headers @{ "Authorization" = "Bearer $token" }
  ```

- `GET /api/employees/:id` - Get employee by ID
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:4000/api/employees/1" `
    -Headers @{ "Authorization" = "Bearer $token" }
  ```

- `POST /api/employees` - Create new employee
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:4000/api/employees" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body '{"name":"John Doe","department":"IT","designation":"Developer","salary":50000,"status":"ACTIVE"}'
  ```

- `PUT /api/employees/:id` - Update employee
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:4000/api/employees/1" `
    -Method PUT `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body '{"salary":60000,"status":"ACTIVE"}'
  ```

- `DELETE /api/employees/:id` - Delete employee
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:4000/api/employees/1" `
    -Method DELETE `
    -Headers @{ "Authorization" = "Bearer $token" }
  ```

### Attendance Management (All endpoints require JWT authentication)

- `POST /api/attendance/checkin` - Check-in for an employee
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:4000/api/attendance/checkin" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body '{"employeeId":1}'
  ```

- `POST /api/attendance/checkout` - Check-out for an employee
  ```powershell
  Invoke-RestMethod -Uri "http://localhost:4000/api/attendance/checkout" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body '{"employeeId":1}'
  ```

- `GET /api/attendance/employee/:employeeId` - Get attendance records for an employee
  ```powershell
  # Get all records
  Invoke-RestMethod -Uri "http://localhost:4000/api/attendance/employee/1" `
    -Headers @{ "Authorization" = "Bearer $token" }

  # Get records with date range
  Invoke-RestMethod -Uri "http://localhost:4000/api/attendance/employee/1?from=2025-11-01&to=2025-11-30" `
    -Headers @{ "Authorization" = "Bearer $token" }
  ```

- `GET /api/attendance/date` - Get attendance records for a specific date
  ```powershell
  # Get today's attendance
  Invoke-RestMethod -Uri "http://localhost:4000/api/attendance/date" `
    -Headers @{ "Authorization" = "Bearer $token" }

  # Get attendance for a specific date
  Invoke-RestMethod -Uri "http://localhost:4000/api/attendance/date?date=2025-11-08" `
    -Headers @{ "Authorization" = "Bearer $token" }
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

