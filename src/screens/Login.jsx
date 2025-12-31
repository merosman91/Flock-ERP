import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === '1234') {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      alert('رمز غير صحيح! (استخدم 1234 للمعاينة)');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-80 text-center">
        <h1 className="text-2xl font-bold mb-6">{t('login.title')}</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder={t('login.pin')}
            className="w-full p-3 mb-4 border rounded dark:bg-gray-700 dark:text-white"
            maxLength={4}
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700"
          >
            {t('login.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
