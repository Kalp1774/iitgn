import { useEffect, useState } from 'react';
import { payrollAPI, employeeAPI } from '../services/api';
import Layout from './Layout';

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

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-500 mt-1">Generate and manage employee payrolls</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900">
            Generate Payroll
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Month
              </label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                className="w-full px-6 py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                style={{ backgroundColor: '#875A7B' }}
              >
                Generate Payroll
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
                  Month
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Basic Salary
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {payrolls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No payroll records found. Generate a payroll to get started.
                  </td>
                </tr>
              ) : (
                payrolls.map((payroll) => (
                  <tr key={payroll.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payroll.employee?.name || `Employee ${payroll.employeeId}`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payroll.employee?.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payroll.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{payroll.basic.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{payroll.netSalary.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDownloadPDF(payroll.id)}
                        className="px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                        style={{ backgroundColor: '#FFC107', color: '#000' }}
                      >
                        Download PDF
                      </button>
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

export default Payroll;
