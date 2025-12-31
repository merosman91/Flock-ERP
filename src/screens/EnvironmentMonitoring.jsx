import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getFlocks } from '../services/dbService';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function EnvironmentMonitoring() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [flock, setFlock] = useState(null);

  useEffect(() => {
    const loadFlock = async () => {
      const flocks = await getFlocks();
      const found = flocks.find(f => f.id === parseInt(id));
      if (found) setFlock(found);
    };
    loadFlock();
  }, [id]);

  // Mock environmental data for last 7 days
  const days = Array.from({ length: 7 }, (_, i) => i + 1);
  const tempData = [28, 29, 27, 30, 31, 29, 28];
  const humidityData = [65, 63, 67, 62, 60, 64, 66];
  const co2Data = [1200, 1150, 1300, 1250, 1400, 1100, 1180];
  const airSpeedData = [1.2, 1.3, 1.1, 1.4, 1.5, 1.2, 1.3];

  const tempChart = {
    labels: days.map(d => `${t('day')} ${d}`),
    datasets: [{
      label: t('temperatureC'),
      data: tempData,
      borderColor: '#dc2626',
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
      tension: 0.3
    }]
  };

  const humidityChart = {
    labels: days.map(d => `${t('day')} ${d}`),
    datasets: [{
      label: t('humidityPercent'),
       humidityData,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.3
    }]
  };

  const co2Chart = {
    labels: days.map(d => `${t('day')} ${d}`),
    datasets: [{
      label: t('co2Ppm'),
       co2Data,
      borderColor: '#7c2d12',
      backgroundColor: 'rgba(124, 45, 18, 0.1)',
      tension: 0.3
    }]
  };

  const airSpeedChart = {
    labels: days.map(d => `${t('day')} ${d}`),
    datasets: [{
      label: t('airSpeedMs'),
      data: airSpeedData,
      borderColor: '#059669',
      backgroundColor: 'rgba(5, 150, 105, 0.1)',
      tension: 0.3
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { rtl: i18n.language === 'ar' }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: false }
    }
  };

  if (!flock) {
    return <div className="p-4">{t('loading')}...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate(`/flocks/${id}`)} className="text-emerald-600 dark:text-emerald-400">
          ← {t('back')}
        </button>
        <h1 className="text-xl font-bold">{t('environmentMonitoring')}</h1>
        <div className="w-8"></div>
      </div>

      {/* Current Readings */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <ReadingCard label={t('temperature')} value="28°C" color="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" />
        <ReadingCard label={t('humidity')} value="65%" color="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" />
        <ReadingCard label={t('co2')} value="1200 ppm" color="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" />
        <ReadingCard label={t('airSpeed')} value="1.2 m/s" color="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" />
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <ChartSection title={t('temperature')} data={tempChart} options={options} />
        <ChartSection title={t('humidity')} data={humidityChart} options={options} />
        <ChartSection title={t('co2')} data={co2Chart} options={options} />
        <ChartSection title={t('airSpeed')} data={airSpeedChart} options={options} />
      </div>

      {/* Control Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button className="bg-emerald-600 text-white py-3 rounded shadow">
          {t('turnOnVentilation')}
        </button>
        <button className="bg-amber-600 text-white py-3 rounded shadow">
          {t('setTargets')}
        </button>
      </div>
    </div>
  );
}

function ReadingCard({ label, value, color }) {
  return (
    <div className={`${color} p-3 rounded text-center`}>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}

function ChartSection({ title, data, options }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="h-40">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
