import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import appIcon from '../assets/icons/app-icon.svg';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [version] = useState('1.2.1');

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
        <img 
          src={appIcon} 
          alt="دواجني"
          className="w-20 h-20"
        />
      </div>

      {/* العنوان */}
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent mb-3 animate-fade-in">
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
        <div className="mt-1">جميع الحقوق محفوظة @ 2026</div>
      </div>
    </div>
  );
          }
