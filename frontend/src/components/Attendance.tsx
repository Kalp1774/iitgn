import { useEffect, useState } from 'react';
import { attendanceAPI, employeeAPI } from '../services/api';

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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Management</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Check In/Out</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={handleCheckIn}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Check In
            </button>
            <button
              onClick={handleCheckOut}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Check Out
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {attendances.map((attendance) => (
            <li key={attendance.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {attendance.employee?.name || `Employee ${attendance.employeeId}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(attendance.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    {attendance.checkIn && (
                      <div className="text-sm text-gray-600">
                        In: {new Date(attendance.checkIn).toLocaleTimeString()}
                      </div>
                    )}
                    {attendance.checkOut && (
                      <div className="text-sm text-gray-600">
                        Out: {new Date(attendance.checkOut).toLocaleTimeString()}
                      </div>
                    )}
                    {attendance.totalHours && (
                      <div className="text-sm font-medium text-gray-900">
                        {attendance.totalHours.toFixed(2)} hours
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Attendance;

