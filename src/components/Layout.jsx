// src/components/Layout.jsx
import BottomNav from './BottomNav';

export default function Layout({ children }) {
  // استبعد شريط التنقل من شاشات معينة
  const excludedPaths = ['/', '/login', '/flocks/new', '/flocks/', '/splash'];
  const showBottomNav = !excludedPaths.some(path => 
    window.location.pathname === path || 
    window.location.pathname.startsWith(path) && path.endsWith('/')
  );

  return (
    <div className="pb-20">
      {children}
      {showBottomNav && <BottomNav />}
    </div>
  );
}
