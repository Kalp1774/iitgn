# HRMS Backend – Part 0 Setup

### Run (development)

```bash
cp .env.example .env
docker-compose up
```

Open: [http://localhost:4000/health](http://localhost:4000/health) → should return

```json
{ "status": "OK", "message": "HRMS Backend running" }
```

### Tech stack

* Node.js + Express
* PostgreSQL + Prisma ORM
* Docker for local dev

### Next step

Implement Part 1 – Auth & User model.

