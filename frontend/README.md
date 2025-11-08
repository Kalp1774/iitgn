# HRMS Frontend

React-based frontend for the HRMS application built with Vite, TypeScript, and Tailwind CSS.

## Features

- 🔐 User Authentication (Login/Logout)
- 📊 Dashboard with statistics
- 👥 Employee Management
- ⏰ Attendance Tracking (Check-in/Check-out)
- 💰 Payroll Management with PDF download
- 📱 Responsive Design

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:4000`

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:4000/api
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Employees.tsx
│   │   ├── Attendance.tsx
│   │   └── Payroll.tsx
│   ├── context/         # React contexts
│   │   └── AuthContext.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Usage

1. Start the backend server (see backend README)
2. Start the frontend: `npm run dev`
3. Open `http://localhost:3000` in your browser
4. Login with your credentials
5. Navigate through the dashboard

## API Integration

The frontend uses Axios to communicate with the backend API. All API calls are centralized in `src/services/api.ts`.

## Authentication

- JWT tokens are stored in `localStorage`
- Protected routes require authentication
- Automatic token refresh and logout on 401 errors

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

