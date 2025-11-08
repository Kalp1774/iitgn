# HRMS - Human Resources Management System

##Team: Brahmos
Kalp Modi
Nevil Dhaduk
Dhruvi Radadiya
Dhwani Vyas

A comprehensive full-stack Human Resources Management System built with React, Node.js, Express, and PostgreSQL. Features a modern Odoo-inspired UI with complete employee management, attendance tracking, leave management, and payroll processing capabilities.

## 🚀 Features

### Authentication & Authorization
- JWT-based user authentication
- Role-based access control (Admin, HR, Employee)
- Secure password hashing with bcrypt
- Protected API routes and frontend pages

### Employee Management
- Complete CRUD operations for employees
- Employee profile management
- Department and designation tracking
- Salary management
- HR/Admin can add and delete employees

### Attendance Tracking
- Check-in/Check-out functionality
- Automatic total hours calculation
- Daily attendance records
- Attendance history tracking

### Leave Management
- Leave application system
- Leave approval/rejection workflow
- Paid and unpaid leave tracking
- Leave history and status tracking

### Payroll & Salary Computation
- Automatic payroll generation
- Salary calculation based on working days
- Present days and leave deduction
- PF and Tax calculations
- Net salary computation

### Reports & Analytics
- Attendance summary reports
- Payroll summary reports
- Employee statistics
- Data export capabilities

### Payslip Management
- PDF payslip generation
- Payslip download functionality
- Detailed salary breakdown
- Professional payslip formatting

### Frontend Features
- Modern, responsive Odoo-inspired UI design
- Clean and professional interface
- Real-time data updates
- Interactive dashboard with statistics
- Role-based UI components
- Smooth transitions and animations

## 📁 Project Structure

```
iitgn/
├── backend/                    # Node.js backend API
│   ├── src/
│   │   ├── controllers/       # Business logic controllers
│   │   ├── routes/            # API route definitions
│   │   ├── middleware/        # Authentication middleware
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript type definitions
│   │   ├── app.ts             # Express app configuration
│   │   └── server.ts          # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── scripts/               # Utility scripts
│   │   ├── seed-users.js      # User seeding script
│   │   └── seed-employees.js  # Employee seeding script
│   ├── docker-compose.yml     # Docker services configuration
│   ├── Dockerfile             # Backend Docker image
│   └── package.json
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Employees.tsx
│   │   │   ├── Attendance.tsx
│   │   │   ├── Payroll.tsx
│   │   │   └── Layout.tsx
│   │   ├── context/           # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── services/          # API service layer
│   │   │   └── api.ts
│   │   ├── App.tsx            # Main app component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── package.json
│   └── vite.config.ts
└── README.md                  # This file
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **PDF Generation**: PDFKit
- **Containerization**: Docker & Docker Compose

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **Docker** and Docker Compose
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd iitgn
```

### 2. Backend Setup

#### Step 1: Navigate to backend directory

```bash
cd backend
```

#### Step 2: Copy environment variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration if needed.

#### Step 3: Start PostgreSQL with Docker

```bash
docker-compose up -d postgres
```

Wait a few seconds for PostgreSQL to be ready.

#### Step 4: Run database migrations

```bash
docker-compose exec backend npx prisma migrate dev
```

Or run individual migrations:

```bash
docker-compose exec backend npx prisma migrate dev --name init_auth
docker-compose exec backend npx prisma migrate dev --name add_employee
docker-compose exec backend npx prisma migrate dev --name add_attendance
docker-compose exec backend npx prisma migrate dev --name add_leave_module
docker-compose exec backend npx prisma migrate dev --name add_payroll
```

#### Step 5: Seed test data (Optional but recommended)

Create test users and employees:

```bash
# Seed users only
npm run seed:users

# Seed employees only
npm run seed:employees

# Seed both users and employees
npm run seed:all
```

This will create:
- **3 test users**: Admin, HR, and Employee accounts
- **6 sample employees** with different departments and roles

#### Step 6: Start backend server

```bash
docker-compose up
```

The backend will be running on `http://localhost:4000`

### 3. Frontend Setup

#### Step 1: Navigate to frontend directory

```bash
cd ../frontend
```

#### Step 2: Install dependencies

```bash
npm install
```

#### Step 3: Start development server

```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 🔐 Default Test Accounts

After seeding the database, you can use these test accounts:

| Role     | Email                | Password  |
|----------|----------------------|-----------|
| **Admin**    | admin@example.com    | admin123  |
| **HR**       | hr@example.com       | hr123     |
| **Employee** | employee@example.com | emp123    |

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "EMPLOYEE" // Optional: ADMIN, HR, or EMPLOYEE
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```

- `GET /api/auth/profile` - Get current user profile (Protected)

### Employee Endpoints

- `GET /api/employees` - Get all employees (Protected)
- `GET /api/employees/:id` - Get employee by ID (Protected)
- `POST /api/employees` - Create new employee (Protected, HR/Admin only)
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "department": "Engineering",
    "designation": "Software Engineer",
    "salary": 75000,
    "status": "ACTIVE"
  }
  ```
- `PUT /api/employees/:id` - Update employee (Protected, HR/Admin only)
- `DELETE /api/employees/:id` - Delete employee (Protected, HR/Admin only)

### Attendance Endpoints

- `POST /api/attendance/checkin` - Check in for today (Protected)
  ```json
  {
    "employeeId": 1
  }
  ```

- `POST /api/attendance/checkout` - Check out for today (Protected)
  ```json
  {
    "employeeId": 1
  }
  ```

- `GET /api/attendance/employee/:employeeId` - Get employee attendance (Protected)
- `GET /api/attendance/date?date=YYYY-MM-DD` - Get attendance by date (Protected)

### Leave Endpoints

- `POST /api/leaves` - Apply for leave (Protected)
  ```json
  {
    "employeeId": 1,
    "startDate": "2025-01-15",
    "endDate": "2025-01-17",
    "type": "PAID",
    "reason": "Personal work"
  }
  ```

- `GET /api/leaves` - Get all leaves (Protected)
- `GET /api/leaves/employee/:employeeId` - Get employee leaves (Protected)
- `PUT /api/leaves/:id/review` - Approve/reject leave (Protected, HR/Admin only)
  ```json
  {
    "status": "APPROVED", // or "REJECTED"
    "reviewedBy": 1
  }
  ```

### Payroll Endpoints

- `POST /api/payroll/generate` - Generate payroll (Protected)
  ```json
  {
    "employeeId": 1,
    "month": "2025-01"
  }
  ```

- `GET /api/payroll` - Get all payrolls (Protected)
  - Query params: `?employeeId=1&month=2025-01`

- `GET /api/payroll/:id` - Get payroll by ID (Protected)

### Payslip Endpoints

- `GET /api/payslip/:id/pdf` - Download payslip PDF (Protected)

### Reports Endpoints

- `GET /api/reports/attendance-summary` - Get attendance summary (Protected)
  - Query params: `?from=2025-01-01&to=2025-01-31`

- `GET /api/reports/payroll-summary` - Get payroll summary (Protected)
  - Query params: `?from=2025-01-01&to=2025-01-31`

## 🎨 UI Features

### Design
- **Odoo-inspired** modern and clean interface
- **Purple, Yellow, and White** color scheme
- **Rounded corners** and subtle shadows
- **Smooth transitions** and animations
- **Responsive design** for all screen sizes
- **Professional typography** and spacing

### Pages
- **Login Page**: Clean authentication interface
- **Dashboard**: Overview with statistics cards
- **Employees**: Employee management with add/delete functionality (HR/Admin only)
- **Attendance**: Check-in/check-out interface
- **Payroll**: Payroll generation and management with PDF download

### Role-Based Features
- **Admin/HR**: Full access to all features including employee management
- **Employee**: View-only access to personal information and attendance

## 🧪 Testing

### Backend API Testing

You can test the API using:

1. **PowerShell** (Windows):
   ```powershell
   # Login
   $response = Invoke-RestMethod -Uri "http://localhost:4000/api/auth/login" `
     -Method POST `
     -Headers @{ "Content-Type" = "application/json" } `
     -Body '{"email":"admin@example.com","password":"admin123"}'
   
   $token = $response.token
   ```

2. **Postman** or **Thunder Client** (VS Code extension)

3. **curl**:
   ```bash
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"admin123"}'
   ```

### Frontend Testing

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Login with test credentials
4. Navigate through different pages and test features

## 🔧 Development

### Backend Development

```bash
cd backend

# Start PostgreSQL
docker-compose up -d postgres

# Run migrations
docker-compose exec backend npx prisma migrate dev

# Start backend in development mode
docker-compose up
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Database Management

```bash
# Generate Prisma Client
cd backend
docker-compose exec backend npx prisma generate

# Open Prisma Studio (Database GUI)
docker-compose exec backend npx prisma studio

# Reset database (CAUTION: Deletes all data)
docker-compose exec backend npx prisma migrate reset
```

## 🚢 Production Build

### Backend Production

```bash
cd backend

# Build Docker image
docker-compose build

# Start services in production mode
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### Frontend Production

```bash
cd frontend

# Build for production
npm run build

# Preview production build
npm run preview

# The built files will be in the `dist` directory
# Serve with a web server like nginx, Apache, or a CDN
```

## 📦 Environment Variables

### Backend (.env)

```env
# PostgreSQL
POSTGRES_USER=hrms_user
POSTGRES_PASSWORD=hrms_pass
POSTGRES_DB=hrms_db

# Prisma connection string
DATABASE_URL="postgresql://hrms_user:hrms_pass@postgres:5432/hrms_db?schema=public"

# Server
PORT=4000

# JWT
JWT_SECRET=super_secret_change_this_for_prod
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:4000/api
```

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected API routes with middleware
- CORS configuration
- Input validation
- SQL injection prevention (Prisma ORM)
- XSS protection

## 📝 Database Schema

The database schema includes:

- **User**: Authentication and user management
- **Employee**: Employee information and details
- **Attendance**: Daily attendance records
- **Leave**: Leave applications and approvals
- **Payroll**: Payroll records and calculations

See `backend/prisma/schema.prisma` for detailed schema definition.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

For issues, questions, or suggestions:

1. Open an issue on GitHub
2. Contact the development team
3. Check the documentation in `backend/README.md` and `frontend/README.md`

## 🎯 Future Enhancements

Potential features for future development:

- Email notifications
- Advanced reporting and analytics
- Employee performance tracking
- Document management
- Multi-language support
- Mobile app
- Real-time notifications
- Advanced search and filtering
- Data export (CSV, Excel)
- Audit logs

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by Odoo's clean UI design
- Uses industry-standard security practices

---

**Happy Coding! 🚀**
