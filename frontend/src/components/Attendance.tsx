import { useEffect, useState } from 'react';
import { attendanceAPI, employeeAPI } from '../services/api';
import Layout from './Layout';

interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  totalHours: number | null;
  employee?: {
    name: string;
  };
}

const Attendance = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [attendanceRes, employeesRes] = await Promise.all([
        attendanceAPI.getByDate(),
        employeeAPI.getAll(),
      ]);
      setAttendances(attendanceRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }

    try {
      await attendanceAPI.checkIn(Number(selectedEmployee));
      alert('Checked in successfully!');
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }

    try {
      await attendanceAPI.checkOut(Number(selectedEmployee));
      alert('Checked out successfully!');
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to check out');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-500 mt-1">Track employee attendance and working hours</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">
            Check In/Out
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Employee
              </label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end space-x-3">
              <button
                onClick={handleCheckIn}
                className="flex-1 px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                style={{ backgroundColor: '#00A09D' }}
              >
                Check In
              </button>
              <button
                onClick={handleCheckOut}
                className="flex-1 px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                style={{ backgroundColor: '#dc3545' }}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr style={{ backgroundColor: '#F8F9FA' }}>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Total Hours
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No attendance records for today.
                  </td>
                </tr>
              ) : (
                attendances.map((attendance) => (
                  <tr key={attendance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {attendance.employee?.name || `Employee ${attendance.employeeId}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(attendance.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attendance.checkIn
                        ? new Date(attendance.checkIn).toLocaleTimeString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attendance.checkOut
                        ? new Date(attendance.checkOut).toLocaleTimeString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {attendance.totalHours ? `${attendance.totalHours.toFixed(2)} hrs` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Attendance;
