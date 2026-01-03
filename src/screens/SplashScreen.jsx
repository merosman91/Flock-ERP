import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [version] = useState('1.2.0');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate('/login');
          return 100;
        }
        return prev + 1.5;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-900 px-4">
      {/* شعار احترافي */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl mb-8 border border-primary-200 dark:border-gray-700">
        <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-primary-600 dark:text-primary-400">
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6a1.875 1.875 0 113.75 0 1.875 1.875 0 01-3.75 0zm3.875 5.95a2.75 2.75 0 00-5.5 0v.125c0 .964.784 1.75 1.75 1.75h2a1.75 1.75 0 001.75-1.75v-.125z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* العنوان */}
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3 animate-fade-in">
        دواجني
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 text-center max-w-md animate-fade-in">
        نظام ذكي لإدارة حظائر الدواجن اللاحم
      </p>

      {/* شريط التقدم */}
      <div className="w-full max-w-xs mb-6 animate-fade-in">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>جاري التحميل...</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* معلومات الإصدار */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 animate-fade-in">
        <div className="font-medium">تصميم:ميرغني أبوالقاسم عثمان </div>
        <div className="mt-1">الإصدار {version}</div>
        <div className="mt-1">جميع الحقوق محفوظة @2026</div>
      </div>
    </div>
  );
} 
