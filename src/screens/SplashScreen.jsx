import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import chickenIcon from '../assets/icons/chicken.svg';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // محاكاة التحميل
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate('/login');
          return 100;
        }
        return prev + 2;
      });
    }, 120); // 6000ms / 50 = 120ms

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 px-4">
      {/* أيقونة احترافية */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-8 border border-primary-200 dark:border-gray-700">
        <img 
          src={chickenIcon} 
          alt="دواجني" 
          className="w-24 h-24 text-primary-600 dark:text-primary-400"
        />
      </div>

      {/* اسم التطبيق */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">دواجني</h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 text-center max-w-md">
        نظام ذكي لإدارة حظائر الدواجن اللاحم
      </p>

      {/* شريط التقدم */}
      <div className="w-full max-w-xs mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
          <span>جاري التحميل...</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* معلومات الإصدار */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
        <div>تصميم :ميرغني أبوالقاسم عثمان </div>
        <div className="mt-1">الإصدار 1.0.0</div>
      </div>
    </div>
  );
        }
