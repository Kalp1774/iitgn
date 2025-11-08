import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

// Employee API
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id: number) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: number, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: number) => api.delete(`/employees/${id}`),
};

// Attendance API
export const attendanceAPI = {
  checkIn: (employeeId: number) => api.post('/attendance/checkin', { employeeId }),
  checkOut: (employeeId: number) => api.post('/attendance/checkout', { employeeId }),
  getByEmployee: (employeeId: number, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    return api.get(`/attendance/employee/${employeeId}?${params.toString()}`);
  },
  getByDate: (date?: string) => {
    const params = date ? `?date=${date}` : '';
    return api.get(`/attendance/date${params}`);
  },
};

// Leave API
export const leaveAPI = {
  getAll: (status?: string, type?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/leaves${query}`);
  },
  getById: (id: number) => api.get(`/leaves/${id}`),
  getByEmployee: (employeeId: number, status?: string) => {
    const params = status ? `?status=${status}` : '';
    return api.get(`/leaves/employee/${employeeId}${params}`);
  },
  apply: (data: any) => api.post('/leaves', data),
  review: (id: number, status: string, reviewedBy: number) =>
    api.put(`/leaves/${id}/review`, { status, reviewedBy }),
};

// Payroll API
export const payrollAPI = {
  generate: (employeeId: number, month: string) =>
    api.post('/payroll/generate', { employeeId, month }),
  getAll: (employeeId?: number, month?: string) => {
    const params = new URLSearchParams();
    if (employeeId) params.append('employeeId', employeeId.toString());
    if (month) params.append('month', month);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/payroll${query}`);
  },
  getById: (id: number) => api.get(`/payroll/${id}`),
  downloadPDF: (id: number) => {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE_URL}/payslip/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (!res.ok) throw new Error('Failed to download PDF');
      return res.blob();
    });
  },
};

// Reports API
export const reportsAPI = {
  attendanceSummary: (from: string, to: string) =>
    api.get(`/reports/attendance-summary?from=${from}&to=${to}`),
  payrollSummary: (month: string) =>
    api.get(`/reports/payroll-summary?month=${month}`),
};

export default api;

