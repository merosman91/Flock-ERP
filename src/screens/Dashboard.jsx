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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFlocks = async () => {
      setIsLoading(true);
      try {
        const data = await getFlocks();
        setFlocks(data);
      } catch (error) {
        console.error('Failed to load flocks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFlocks();
  }, []);

  // بيانات وهمية للرسوم البيانية
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
      tension: 0.4,
      fill: true
    }]
  };

  const tempChart = {
    labels: days.map(d => `${t('day')} ${d}`),
    datasets: [{
      label: t('temperature'),
       tempData,
      borderColor: '#dc2626',
      backgroundColor: 'rgba(220, 38, 38, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const mortalityChart = {
    labels: days.map(d => `${t('day')} ${d}`),
    datasets: [{
      label: t('mortalityRate'),
       mortalityData,
      borderColor: '#7c2d12',
      backgroundColor: 'rgba(124, 45, 18, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: { 
        rtl: i18n.language === 'ar',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    scales: {
      x: { 
        grid: { display: false },
        ticks: { color: '#6b7280' }
      },
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: '#6b7280' }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            {t('dashboard')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {t('overview')}
          </p>
        </div>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <div className="p-4">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KpiCard 
            title={t('temperature')} 
            value="28°C" 
            icon="🌡️"
            color="from-red-500 to-red-600"
          />
          <KpiCard 
            title={t('humidity')} 
            value="65%" 
            icon="💧"
            color="from-blue-500 to-blue-600"
          />
          <KpiCard 
            title={t('feedConsumed')} 
            value="190 kg" 
            icon="🍽️"
            color="from-primary-500 to-primary-600"
          />
          <KpiCard 
            title={t('mortalityRate')} 
            value="1.1%" 
            icon="⚠️"
            color="from-amber-500 to-amber-600"
          />
        </div>

        {/* Active Batches */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-6 border border-gray-100 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('batches')}</h2>
            <button
              onClick={() => navigate('/flocks/new')}
              className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 rtl:space-x-reverse"
            >
              <span>+</span>
              <span>{t('addBatch')}</span>
            </button>
          </div>
          
          <div className="p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : flocks.length > 0 ? (
              <div className="space-y-3">
                {flocks.map(flock => {
                  const daysOld = Math.floor((Date.now() - new Date(flock.startDate).getTime()) / (1000 * 60 * 60 * 24));
                  const status = daysOld > 42 ? 'completed' : 'active';
                  
                  return (
                    <div
                      key={flock.id}
                      onClick={() => navigate(`/flocks/${flock.id}`)}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-gray-800 dark:text-white text-lg">{flock.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {flock.breed} • {daysOld} {t('day')}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {status === 'active' ? t('active') : t('completed')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-2">🐣</div>
                <p className="text-gray-500 dark:text-gray-400">{t('noBatches')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <ChartSection title={t('feedConsumed')} data={feedChart} options={options} />
          <ChartSection title={t('temperature')} data={tempChart} options={options} />
          <ChartSection title={t('mortalityRate')} data={mortalityChart} options={options} />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-5 text-white shadow-lg`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm opacity-90 mb-1">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function ChartSection({ title, data, options }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{title}</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
                }
