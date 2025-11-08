import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { employeeAPI, payrollAPI, attendanceAPI } from '../services/api';

const Dashboard = () => {
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
      color: '#875A7B',
      bgGradient: 'linear-gradient(135deg, #875A7B 0%, #6d4a63 100%)',
      onClick: () => navigate('/employees'),
    },
    {
      title: 'Payrolls',
      value: stats.payrolls,
      color: '#FFC107',
      bgGradient: 'linear-gradient(135deg, #FFC107 0%, #e0a800 100%)',
      onClick: () => navigate('/payroll'),
    },
    {
      title: "Today's Attendance",
      value: stats.attendance,
      color: '#00A09D',
      bgGradient: 'linear-gradient(135deg, #00A09D 0%, #008b88 100%)',
      onClick: () => navigate('/attendance'),
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
          <p className="text-gray-500 mt-2">Welcome back! Here's what's happening today.</p>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#875A7B' }}></div>
            <p className="mt-4 text-gray-500">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card, index) => (
              <div
                key={index}
                onClick={card.onClick}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
                style={{ borderLeft: `4px solid ${card.color}` }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{card.title}</p>
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity"
                      style={{ backgroundColor: card.color }}
                    >
                      <div 
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: card.color }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-4xl font-bold" style={{ color: card.color }}>
                    {card.value}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-medium text-gray-500">
                    <span>View details</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
