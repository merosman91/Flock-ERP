import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

export default function Notifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'environment', level: 'warning', message: t('highTempAlert'), time: '2025-04-03 14:30' },
    { id: 2, type: 'feed', level: 'info', message: t('lowFeedAlert'), time: '2025-04-03 10:15' },
    { id: 3, type: 'health', level: 'urgent', message: t('vaccinationDue'), time: '2025-04-02 08:00' },
    { id: 4, type: 'mortality', level: 'warning', message: t('highMortalityAlert'), time: '2025-04-01 16:45' }
  ]);
  const [filters, setFilters] = useState({
    environment: true,
    feed: true,
    health: true,
    mortality: true
  });

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleFilter = (type) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const filtered = notifications.filter(n => filters[n.type]);

  const getBadgeColor = (type) => {
    switch (type) {
      case 'environment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
      case 'feed': return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200';
      case 'health': return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200';
      case 'mortality': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getLevelIcon = (level) => {
    if (level === 'urgent') return '❗';
    if (level === 'warning') return '⚠️';
    return 'ℹ️';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center rounded-lg mb-4">
        <h1 className="text-xl font-bold">{t('notifications')}</h1>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(filters).map(([type, enabled]) => (
          <button
            key={type}
            onClick={() => toggleFilter(type)}
            className={`px-3 py-1 rounded-full text-xs ${
              enabled 
                ? getBadgeColor(type) 
                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {t(type)}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(notif => (
            <div key={notif.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <div className="flex justify-between">
                <span className={`px-2 py-1 rounded text-xs ${getBadgeSize(notif.level)}`}>
                  {getLevelIcon(notif.level)} {t(notif.level)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{notif.time}</span>
              </div>
              <div className="mt-2">{notif.message}</div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {t('noNotifications')}
          </p>
        )}
      </div>
    </div>
  );
}

function getBadgeSize(level) {
  if (level === 'urgent') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
  if (level === 'warning') return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200';
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
}
