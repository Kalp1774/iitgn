import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, payrollAPI, attendanceAPI } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    employees: 0,
    payrolls: 0,
    attendance: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [employeesRes, payrollsRes, attendanceRes] = await Promise.all([
        employeeAPI.getAll().catch(() => ({ data: [] })),
        payrollAPI.getAll().catch(() => ({ data: [] })),
        attendanceAPI.getByDate().catch(() => ({ data: [] })),
      ]);

      setStats({
        employees: employeesRes.data.length,
        payrolls: payrollsRes.data.length,
        attendance: attendanceRes.data.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Employees',
      value: stats.employees,
      color: 'bg-blue-500',
      onClick: () => navigate('/employees'),
    },
    {
      title: 'Payrolls',
      value: stats.payrolls,
      color: 'bg-green-500',
      onClick: () => navigate('/payroll'),
    },
    {
      title: 'Today\'s Attendance',
      value: stats.attendance,
      color: 'bg-purple-500',
      onClick: () => navigate('/attendance'),
    },
  ];

  // Admin/HR only cards
  const adminCards = [
    {
      title: 'Admin Panel',
      value: 'Manage',
      color: 'bg-red-500',
      onClick: () => navigate('/employees'),
      description: 'Manage employees and system settings',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">HRMS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.name} ({user?.role})
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
          
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                {statCards.map((card, index) => (
                  <div
                    key={index}
                    onClick={card.onClick}
                    className={`${card.color} overflow-hidden shadow rounded-lg cursor-pointer transform transition hover:scale-105`}
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="text-white text-4xl font-bold">
                            {card.value}
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-white truncate">
                              {card.title}
                            </dt>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Admin/HR only section */}
              {(user?.role === 'ADMIN' || user?.role === 'HR') && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Admin & HR Tools
                  </h3>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {adminCards.map((card, index) => (
                      <div
                        key={index}
                        onClick={card.onClick}
                        className={`${card.color} overflow-hidden shadow rounded-lg cursor-pointer transform transition hover:scale-105`}
                      >
                        <div className="p-5">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="text-white text-2xl font-bold">
                                {card.value}
                              </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                              <dl>
                                <dt className="text-sm font-medium text-white truncate">
                                  {card.title}
                                </dt>
                                <dd className="text-xs text-white opacity-75">
                                  {card.description}
                                </dd>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

