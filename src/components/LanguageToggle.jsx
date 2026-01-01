import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-sm font-medium min-w-[60px] flex items-center justify-center"
      aria-label="تبديل اللغة"
    >
      {i18n.language === 'ar' ? 'EN' : 'عربي'}
    </button>
  );
}
