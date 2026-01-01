import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // الشاشات التي **لا** يجب أن يظهر فيها شريط التنقل السفلي
  const excludedPaths = [
    '/',
    '/login',
    '/splash',
    '/flocks/new',
    // استبعاد جميع مسارات التفاصيل (التي تحتوي على ID رقمي)
  ];

  // استبعاد المسارات التي تبدأ بـ /flocks/ وتليها رقم (مثل /flocks/123)
  const isDetailPath = /^\/flocks\/\d+/.test(currentPath);
  const isEditPath = currentPath.startsWith('/flocks/') && currentPath.endsWith('/edit'); // إذا أضفت مسارات تعديل لاحقًا

  const showBottomNav = !(
    excludedPaths.includes(currentPath) ||
    isDetailPath ||
    isEditPath
  );

  return (
    <div className={`min-h-screen ${showBottomNav ? 'pb-20' : ''}`}>
      {children}
      {showBottomNav && <BottomNav />}
    </div>
  );
      }
