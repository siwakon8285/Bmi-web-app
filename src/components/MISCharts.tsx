'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function TrendChart({ data, period }: { data: any[], period: string }) {
  const chartData = {
    labels: data.map((d) => d.date_label),
    datasets: [
      {
        label: `Average BMI (${period})`,
        data: data.map((d) => d.avg_bmi),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
    },
    scales: {
      y: { min: 15, max: 35 }
    }
  };

  return <Line options={options} data={chartData} />;
}

export function DistributionChart({ data }: { data: number[] }) {
  const chartData = {
    labels: ['Underweight', 'Normal', 'Overweight', 'Obese'],
    datasets: [
      {
        data: data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(16, 185, 129, 0.8)', // Green
          'rgba(245, 158, 11, 0.8)', // Yellow
          'rgba(239, 68, 68, 0.8)',  // Red
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut data={chartData} />;
}
