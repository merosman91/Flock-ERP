import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import i18n from '../i18n/i18n';

export default function Settings() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState(localStorage.getItem('i18nextLng')?.split('-')[0] || 'ar');
  const [weightUnit, setWeightUnit] = useState(localStorage.getItem('weightUnit') || 'kg');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'SDG');

  const weightUnits = [
    { value: 'kg', label: t('kilogram') },
    { value: 'ton', label: t('ton') },
    { value: 'qintar', label: t('qintar') },
    { value: 'carat', label: t('carat') }
  ];

  const currencies = [
    { value: 'SDG', label: 'جنيه سوداني (ج.س)' },
    { value: 'USD', label: 'دولار أمريكي ($)' },
    { value: 'SAR', label: 'ريال سعودي (ر.س)' }
  ];

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
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
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dawajny_backup.json';
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
          // Theme handled separately
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
      <h1 className="text-xl font-bold mb-6">{t('settings')}</h1>

      {/* General */}
      <Section title={t('general')}>
        <SettingRow label={t('language')}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="ar">{t('arabic')}</option>
            <option value="en">{t('english')}</option>
          </select>
        </SettingRow>

        <SettingRow label={t('theme')}>
          <button
            onClick={toggleTheme}
            className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded text-center"
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
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
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
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            {currencies.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </SettingRow>
      </Section>

      {/* Backup */}
      <Section title={t('backup')}>
        <div className="space-y-3">
          <button
            onClick={exportData}
            className="w-full bg-emerald-600 text-white py-2 rounded"
          >
            📤 {t('exportData')}
          </button>
          <label className="w-full bg-amber-600 text-white py-2 rounded text-center cursor-pointer">
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
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
      <h2 className="font-bold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div className="flex justify-between items-center mb-3 last:mb-0">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <div className="w-1/2">{children}</div>
    </div>
  );
}
