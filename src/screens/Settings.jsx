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
  const [weightUnit, setWeightUnit] = useState(localStorage.getItem('weightUnit') || 'kg');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'SDG');
  const [version] = useState('1.2.0');

  const weightUnits = [
    { value: 'kg', label: t('kilogram') },
    { value: 'ton', label: t('ton') },
    { value: 'qintar', label: t('qintar') },
    { value: 'carat', label: t('carat') },
    { value: 'sack', label: 'جوال' }
  ];

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

  const handleWeightUnitChange = (e) => {
    const val = e.target.value;
    setWeightUnit(val);
    localStorage.setItem('weightUnit', val);
  };

  const handleCurrencyChange = (e) => {
    const val = e.target.value;
    setCurrency(val);
    localStorage.setItem('currency', val);
  };

  const exportData = () => {
    const data = {
      settings: { language, weightUnit, currency, theme },
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
          setWeightUnit(data.settings.weightUnit);
          setCurrency(data.settings.currency);
          localStorage.setItem('weightUnit', data.settings.weightUnit);
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
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white w-full focus:ring-2 focus:ring-primary-500"
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

      {/* Units */}
      <Section title={t('units')}>
        <SettingRow label={t('weightUnit')}>
          <select
            value={weightUnit}
            onChange={handleWeightUnitChange}
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white w-full focus:ring-2 focus:ring-primary-500"
          >
            {weightUnits.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </SettingRow>
      </Section>

      {/* Currency */}
      <Section title={t('currency')}>
        <SettingRow label={t('primaryCurrency')}>
          <select
            value={currency}
            onChange={handleCurrencyChange}
            className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white w-full focus:ring-2 focus:ring-primary-500"
          >
            {currencies.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </SettingRow>
      </Section>

      {/* Backup */}
      <Section title={t('backup')}>
        <div className="space-y-4">
          <button
            onClick={exportData}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow"
          >
            📤 {t('exportData')}
          </button>
          <label className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-shadow text-center cursor-pointer">
            📥 {t('importData')}
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
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-800 dark:text-blue-200">دواجني</span>
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
              v{version}
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
            نظام إدارة حظائر الدواجن اللاحم
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
