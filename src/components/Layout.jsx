import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
  const location = useLocation();
  const path = location.pathname;

  // عرض شريط التنقل فقط في الشاشات الرئيسية
  const showBottomNav = [
    '/dashboard',
    '/flocks',
    '/inventory',
    '/finance',
    '/reports',
    '/settings'
  ].includes(path);

  return (
    <div className={`min-h-screen ${showBottomNav ? 'pb-20' : ''}`}>
      {children}
      {showBottomNav && <BottomNav />}
    </div>
  );
    }
