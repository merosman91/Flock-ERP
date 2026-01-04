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
import { getFlocks, getDashboardStats } from '../services/dbService';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [flocks, setFlocks] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setStatsLoading(true);
      try {
        const [flocksData, statsData] = await Promise.all([
          getFlocks(),
          getDashboardStats()
        ]);
        setFlocks(flocksData);
        setDashboardData(statsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
        setStatsLoading(false);
      }
    };
    loadData();
  }, []);

  // إعداد بيانات الرسم البياني من البيانات الفعلية
  const prepareChartData = (data, label, borderColor, backgroundColor) => {
    if (!data || !Array.isArray(data)) return null;
    
    return {
      labels: data.map(item => `${t('day')} ${item.day || item.date}`),
      datasets: [{
        label,
        data: data.map(item => item.value),
        borderColor,
        backgroundColor,
        tension: 0.4,
        fill: true
      }]
    };
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

  // إعداد بيانات الرسوم البيانية من البيانات الفعلية
  const feedChartData = dashboardData?.feedConsumption ? 
    prepareChartData(dashboardData.feedConsumption, t('feedConsumed'), '#0ea5e9', 'rgba(14, 165, 233, 0.1)') : null;
  
  const mortalityChartData = dashboardData?.mortalityRate ? 
    prepareChartData(dashboardData.mortalityRate, t('mortalityRate'), '#7c2d12', 'rgba(124, 45, 18, 0.1)') : null;

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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <KpiCard 
            title={t('temperature')} 
            value={statsLoading ? '...' : `${dashboardData?.currentTemperature || '0'}°C`}
            icon="🌡️"
            color="from-red-500 to-red-600"
            loading={statsLoading}
          />
          <KpiCard 
            title={t('humidity')} 
            value={statsLoading ? '...' : `${dashboardData?.currentHumidity || '0'}%`}
            icon="💧"
            color="from-blue-500 to-blue-600"
            loading={statsLoading}
          />
          <KpiCard 
            title={t('feedConsumed')} 
            value={statsLoading ? '...' : `${dashboardData?.totalFeedConsumed || '0'} kg`}
            icon="🍽️"
            color="from-primary-500 to-primary-600"
            loading={statsLoading}
          />
          <KpiCard 
            title={t('mortalityRate')} 
            value={statsLoading ? '...' : `${dashboardData?.currentMortalityRate || '0'}%`}
            icon="⚠️"
            color="from-amber-500 to-amber-600"
            loading={statsLoading}
          />
          <KpiCard 
            title={t('fcr')} 
            value={statsLoading ? '...' : dashboardData?.currentFCR || '0.00'}
            icon="📊"
            color="from-purple-500 to-purple-600"
            loading={statsLoading}
          />
        </div>

        {/* بطاقة البيئة */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow mb-6 border border-gray-100 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('environment')}</h2>
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <button
                  onClick={() => navigate('/flocks/new')}
                  className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 rtl:space-x-reverse"
                >
                  <span>+</span>
                  <span>{t('addBatch')}</span>
                </button>
                <button 
                  onClick={() => navigate('/environment')}
                  className="text-primary-600 dark:text-primary-400 text-sm font-medium"
                >
                  {t('viewDetails')} →
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <MetricCard 
                label={t('temperature')} 
                value={statsLoading ? '...' : `${dashboardData?.currentTemperature || '0'}°C`}
                icon="🌡️"
                color="text-red-600 dark:text-red-400"
                loading={statsLoading}
              />
              <MetricCard 
                label={t('humidity')} 
                value={statsLoading ? '...' : `${dashboardData?.currentHumidity || '0'}%`}
                icon="💧"
                color="text-blue-600 dark:text-blue-400"
                loading={statsLoading}
              />
              <MetricCard 
                label="CO2" 
                value={statsLoading ? '...' : `${dashboardData?.currentCO2 || '0'} ppm`}
                icon="💨"
                color="text-amber-600 dark:text-amber-400"
                loading={statsLoading}
              />
            </div>
          </div>
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
                <div className="text-4xl mb-4">🐣</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noBatches')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {feedChartData && (
            <ChartSection 
              title={t('feedConsumed')} 
              data={feedChartData} 
              options={options} 
              loading={statsLoading}
            />
          )}
          {mortalityChartData && (
            <ChartSection 
              title={t('mortalityRate')} 
              data={mortalityChartData} 
              options={options} 
              loading={statsLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon, color, loading = false }) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-5 text-white shadow-lg`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm opacity-90 mb-1">{title}</div>
      <div className="text-2xl font-bold">
        {loading ? (
          <div className="h-8 flex items-center">
            <div className="animate-pulse bg-white/30 h-4 w-16 rounded"></div>
          </div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon, color, loading = false }) {
  return (
    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <div className="text-xl mb-1">{icon}</div>
      <div className={`font-bold text-lg ${color}`}>
        {loading ? (
          <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-6 w-16 mx-auto rounded"></div>
        ) : (
          value
        )}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function ChartSection({ title, data, options, loading = false }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{title}</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
        }
