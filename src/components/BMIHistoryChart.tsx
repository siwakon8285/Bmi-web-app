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
import { Line } from 'react-chartjs-2';

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

interface BMIHistoryChartProps {
  records: any[];
}

export default function BMIHistoryChart({ records }: BMIHistoryChartProps) {
  // Sort records by date ascending for the chart
  const sortedRecords = [...records].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const data = {
    labels: sortedRecords.map((r) => new Date(r.created_at).toLocaleDateString('th-TH')),
    datasets: [
      {
        label: 'BMI Trend',
        data: sortedRecords.map((r) => r.bmi_value),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Your BMI History',
      },
    },
    scales: {
      y: {
        min: 10,
        max: 40,
      }
    }
  };

  return <Line options={options} data={data} />;
}
