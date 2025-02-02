import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define interfaces for the component props and data structure
interface DataItem {
  row1: string;
  row2: number;
}

interface BarChartProps {
  inputarr: DataItem[];
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
}

interface CustomChartData {
  labels: string[];
  datasets: ChartDataset[];
}

const BarChart: React.FC<BarChartProps> = ({ inputarr }) => {
  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<CustomChartData>({
    labels: [],
    datasets: [{
      label: 'Bar Chart Representation',
      data: [],
      backgroundColor: []
    }]
  });

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Data Visualization',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  useEffect(() => {
    if (inputarr && inputarr.length > 0) {
      updateChartData();
    }
  }, [inputarr]);

  const updateChartData = (): void => {
    // Limit to the latest 5 elements
    const latestData = inputarr.slice(-5);
    const colors = generateRandomColors(latestData.length);
    
    // Update chart data
    setChartData({
      labels: latestData.map(item => item.row1),
      datasets: [{
        label: 'Bar Chart Representation',
        data: latestData.map(item => Number(item.row2)), // Ensure numbers
        backgroundColor: colors
      }]
    });
  };

  const generateRandomColors = (count: number): string[] => {
    // Generate random RGB colors
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
      colors.push(color);
    }
    return colors;
  };

  return (
    <div className='w-full h-[500px]'> {/* Fixed height container */}
      <Bar 
        ref={chartRef}
        data={chartData}
        options={options}
      />
    </div>
  );
}

export default BarChart;