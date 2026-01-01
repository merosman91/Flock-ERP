import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function BottomNav() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // تحديد الشاشة الحالية
  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/flocks') return location.pathname.startsWith('/flocks');
    return location.pathname === path;
  };

  // عناصر التنقل
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
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${
        i18n.language === 'ar' ? 'rtl' : 'ltr'
      }`}
      style={{ direction: i18n.language === 'ar' ? 'rtl' : 'ltr' }}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-full py-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
