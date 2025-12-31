import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-emerald-800 text-white">
      <div className="text-center">
        <div className="text-4xl font-bold mb-4">دواجني</div>
        <div className="text-lg">تطبيق إدارة حظائر الدواجن اللاحم</div>
        <div className="mt-8 text-sm">جاري التحميل...</div>
      </div>
    </div>
  );
}
