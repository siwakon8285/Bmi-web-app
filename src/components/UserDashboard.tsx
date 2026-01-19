'use client';

import { useState, useEffect } from 'react';
import { getBMICategory, getBMIColor } from '@/lib/bmi';
import BMIHistoryChart from '@/components/BMIHistoryChart';

export default function UserDashboard({ user }: { user: any }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/bmi');
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight || !height) return;

    try {
      const res = await fetch('/api/bmi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          weight: parseFloat(weight), 
          height: parseFloat(height) 
        }),
      });

      if (res.ok) {
        setWeight('');
        setHeight('');
        fetchRecords(); // Refresh list
      }
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const latestBMI = records.length > 0 ? records[0].bmi_value : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column: Input & Current Status */}
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-xl font-bold mb-4 text-gray-800">New Measurement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
            >
              Calculate & Save
            </button>
          </form>
        </div>

        {latestBMI && (
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 text-center">
            <h3 className="text-lg font-medium text-gray-600">Current BMI</h3>
            <p className="text-5xl font-bold my-2 text-gray-800">{latestBMI}</p>
            <p className={`text-xl font-semibold ${getBMIColor(latestBMI)}`}>
              {getBMICategory(latestBMI)}
            </p>
          </div>
        )}
      </div>

      {/* Right Column: History & Chart */}
      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
          <BMIHistoryChart records={records} />
        </div>

        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Recent History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.slice(0, 5).map((record: any) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.created_at).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.bmi_value}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${getBMIColor(record.bmi_value)}`}>
                      {getBMICategory(record.bmi_value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
