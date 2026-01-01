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
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-6">
        {/* أيقونة احترافية */}
        <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <span className="text-4xl">🐔</span>
        </div>
      </div>
      <div className="text-center max-w-md px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">دواجني</h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          نظام ذكي لإدارة حظائر الدواجن اللاحم
        </p>
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          جاري التحميل...
        </div>
      </div>
    </div>
  );
    }
