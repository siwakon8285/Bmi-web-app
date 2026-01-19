'use client';

import { useState, useEffect } from 'react';
import { TrendChart, DistributionChart } from '@/components/MISCharts';

export default function MISDashboard() {
  const [period, setPeriod] = useState('monthly');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/mis?period=${period}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to fetch MIS data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (loading) return <div className="text-center p-10">Loading MIS Reports...</div>;
  if (!data) return <div className="text-center p-10 text-red-500">Failed to load data</div>;

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="flex justify-end">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.metrics.totalUsers}</p>
        </div>
        <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500 uppercase">Average BMI</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.metrics.avgBMI}</p>
        </div>
        <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-500 uppercase">Obesity Rate</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{data.metrics.obesityRate}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-gray-800">BMI Trends ({period})</h3>
          <div className="h-64">
            <TrendChart data={data.trends} period={period} />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur p-6 rounded-xl shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-gray-800">BMI Category Distribution</h3>
          <div className="h-64 flex justify-center">
            <DistributionChart data={data.distribution} />
          </div>
        </div>
      </div>
    </div>
  );
}
