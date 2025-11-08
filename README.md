# HRMS - Human Resources Management System

A full-stack HRMS application with React frontend and Node.js/Express backend.

## 🚀 Features

### Backend (Node.js + Express + PostgreSQL)
- ✅ User Authentication (JWT)
- ✅ Employee Management (CRUD)
- ✅ Attendance Tracking (Check-in/Check-out)
- ✅ Leave Management (Apply, Approve, Reject)
- ✅ Payroll & Salary Computation
- ✅ Reports & Analytics
- ✅ Payslip PDF Export

### Frontend (React + TypeScript + Tailwind CSS)
- ✅ Modern, responsive UI
- ✅ Dashboard with statistics
- ✅ Employee management interface
- ✅ Attendance tracking interface
- ✅ Payroll management with PDF download
- ✅ Protected routes with authentication

## 📁 Project Structure

```
hrms/
├── backend/          # Node.js backend API
│   ├── src/
│   ├── prisma/
│   └── docker-compose.yml
├── frontend/         # React frontend
│   ├── src/
│   └── package.json
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for backend)
- PostgreSQL (or use Docker)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start PostgreSQL with Docker:
```bash
docker-compose up -d postgres
```

4. Run migrations:
```bash
docker-compose exec backend npx prisma migrate dev
```

5. Start backend server:
```bash
docker-compose up
```

Backend will be running on `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will be running on `http://localhost:3000`

## 🔐 Default Login

After setting up, you can register a new user or use these test credentials (if you've created them):

- Email: `admin@example.com`
- Password: `admin123`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Attendance
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/employee/:id` - Get employee attendance

### Leaves
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves` - Get all leaves
- `PUT /api/leaves/:id/review` - Approve/reject leave

### Payroll
- `POST /api/payroll/generate` - Generate payroll
- `GET /api/payroll` - Get payrolls
- `GET /api/payslip/:id/pdf` - Download payslip PDF

### Reports
- `GET /api/reports/attendance-summary` - Attendance summary
- `GET /api/reports/payroll-summary` - Payroll summary

## 🧪 Testing

### Backend API Testing

Use the PowerShell examples in `backend/README.md` or use tools like Postman/Thunder Client.

### Frontend Testing

1. Start both backend and frontend
2. Open `http://localhost:3000` in browser
3. Login with credentials
4. Navigate through the dashboard

## 📦 Technologies

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- PDF Generation (PDFKit)
- Docker

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

## 🔧 Development

### Backend Development
```bash
cd backend
docker-compose up -d postgres
docker-compose exec backend npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## 🚢 Production Build

### Backend
```bash
cd backend
docker-compose build
docker-compose up -d
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with a web server
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.
