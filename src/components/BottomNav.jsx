import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function BottomNav() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/flocks') return location.pathname === '/flocks';
    return location.pathname === path;
  };

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: t('dashboard') },
    { path: '/flocks', icon: '🐣', label: t('batches') },
    { path: '/inventory', icon: '📦', label: t('inventory') },
    { path: '/finance', icon: '💰', label: t('finance') },
    { path: '/reports', icon: '📊', label: t('reports') },
    { path: '/settings', icon: '⚙️', label: t('settings') }
  ];

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center flex-1 py-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-1 leading-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
