import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [flocks, setFlocks] = useState([]);

  useEffect(() => {
    const loadFlocks = async () => {
      const data = await getFlocks();
      setFlocks(data);
    };
    loadFlocks();
  }, []);

  const days = Array.from({ length: 7 }, (_, i) => i + 1);
  const feedData = [120, 135, 150, 160, 175, 190, 210];
  const tempData = [28, 29, 27, 30, 31, 29, 28];
  const mortalityData = [0.8, 1.0, 0.9, 1.2, 1.1, 0.7, 0.6];

  const feedChart = {
    labels: days.map(d => `${t('day')} ${d}`),
    datasets: [{
      label: t('feedConsumed'),
       feedData,
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      tension: 0.3
    }]
  };

  const tempChart = {
    labels: days.map(d => `${t('day')} ${d}`),
    datasets: [{
      label: t('temperature'),
       tempData,
      borderColor: '#dc2626',
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
      tension: 0.3
    }]
  };

  const mortalityChart = {
    labels: days.map(d => `${t('day')} ${d}`),
    datasets: [{
      label: t('mortalityRate'),
       mortalityData,
      borderColor: '#7c2d12',
      backgroundColor: 'rgba(124, 45, 18, 0.1)',
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
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{t('dashboard')}</h1>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* KPIs */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title={t('temperature')} value="28°C" color="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" />
        <KpiCard title={t('humidity')} value="65%" color="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" />
        <KpiCard title={t('feedConsumed')} value="190 kg" color="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300" />
        <KpiCard title={t('mortalityRate')} value="1.1%" color="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" />
      </div>

      {/* Active Batches */}
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold">{t('batches')}</h2>
          <button
            onClick={() => navigate('/flocks/new')}
            className="text-primary-600 dark:text-primary-400 text-sm"
          >
            + {t('addBatch')}
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
          {flocks.length > 0 ? (
            flocks.map(flock => (
              <div
                key={flock.id}
                onClick={() => navigate(`/flocks/${flock.id}`)}
                className="p-3 border-b border-gray-200 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded"
              >
                <div className="font-medium">{flock.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {flock.breed} • {flock.daysOld} {t('day')}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              {t('noBatches')}
            </p>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="px-4 space-y-6">
        <ChartSection title={t('feedConsumed')} data={feedChart} options={options} />
        <ChartSection title={t('temperature')} data={tempChart} options={options} />
        <ChartSection title={t('mortalityRate')} data={mortalityChart} options={options} />
      </div>
    </div>
  );
}

function KpiCard({ title, value, color }) {
  return (
    <div className={`${color} rounded-lg p-4 text-center`}>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}

function ChartSection({ title, data, options }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="h-48">
        <Line data={data} options={options} />
      </div>
    </div>
  );
                          }
