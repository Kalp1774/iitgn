import { useEffect, useState } from 'react';
import { payrollAPI, employeeAPI } from '../services/api';

interface Payroll {
  id: number;
  employeeId: number;
  month: string;
  basic: number;
  netSalary: number;
  employee?: {
    name: string;
    department: string;
  };
}

const Payroll = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [payrollsRes, employeesRes] = await Promise.all([
        payrollAPI.getAll(),
        employeeAPI.getAll(),
      ]);
      setPayrolls(payrollsRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }

    try {
      await payrollAPI.generate(Number(selectedEmployee), selectedMonth);
      alert('Payroll generated successfully!');
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to generate payroll');
    }
  };

  const handleDownloadPDF = async (id: number) => {
    try {
      const blob = await payrollAPI.downloadPDF(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to download PDF');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payroll Management</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Generate Payroll</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Generate Payroll
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {payrolls.map((payroll) => (
            <li key={payroll.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {payroll.employee?.name || `Employee ${payroll.employeeId}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payroll.month} • {payroll.employee?.department}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{payroll.netSalary.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Basic: ₹{payroll.basic.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadPDF(payroll.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                    >
                      Download PDF
                    </button>
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

export default Payroll;

