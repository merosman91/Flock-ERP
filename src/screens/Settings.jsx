import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import { useTheme } from '../hooks/useTheme';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

export default function Settings() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState(i18n.language);
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'SDG');
  const [version] = useState('1.2.1');

  const currencies = [
    { value: 'SDG', label: 'جنيه سوداني (ج.س)' },
    { value: 'USD', label: 'دولار أمريكي ($)' },
    { value: 'SAR', label: 'ريال سعودي (ر.س)' },
    { value: 'EGP', label: 'جنيه مصري (ج.م)' }
  ];

  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  const handleCurrencyChange = (e) => {
    const val = e.target.value;
    setCurrency(val);
    localStorage.setItem('currency', val);
  };

  const exportData = () => {
    const data = {
      settings: { language, currency, theme },
      version,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dawajny_backup_v${version}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert(t('dataExported'));
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.settings) {
          setLanguage(data.settings.language);
          setCurrency(data.settings.currency);
          localStorage.setItem('currency', data.settings.currency);
          alert(t('dataImported'));
        }
      } catch (err) {
        alert(t('importFailed'));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center rounded-xl mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
          {t('settings')}
        </h1>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* General */}
      <Section title={t('general')}>
        <SettingRow label={t('language')}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white w-full focus:ring-2 focus:ring-primary-500"
          >
            <option value="ar">{t('arabic')}</option>
            <option value="en">{t('english')}</option>
          </select>
        </SettingRow>

        <SettingRow label={t('theme')}>
          <button
            onClick={toggleTheme}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {theme === 'dark' ? t('darkMode') : t('lightMode')}
          </button>
        </SettingRow>
      </Section>

      {/* Currency */}
      <Section title={t('currency')}>
        <SettingRow label={t('primaryCurrency')}>
          <select
            value={currency}
            onChange={handleCurrencyChange}
            className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white w-full focus:ring-2 focus:ring-primary-500"
          >
            {currencies.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </SettingRow>
      </Section>

      {/* Backup */}
      <Section title={t('backup')}>
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={exportData}
            className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3.5 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {t('exportData')}
          </button>
          
          <label className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3.5 rounded-xl font-medium shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            <span>{t('importData')}</span>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>
      </Section>

      {/* App Info */}
      <Section title="معلومات التطبيق">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-800 dark:text-blue-200">دواجني</span>
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
              الإصدار {version}
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-3">
            نظام ذكي لإدارة حظائر الدواجن اللاحم باستخدام مفهوم ERP
          </p>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mb-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{title}</h2>
      {children}
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div className="flex flex-col mb-4 last:mb-0">
      <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">{label}</label>
      <div>{children}</div>
    </div>
  );
      }
