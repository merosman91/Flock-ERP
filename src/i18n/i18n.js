import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLang = localStorage.getItem('i18nextLng') || 'ar';

i18n
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: 'ar',
    interpolation: { escapeValue: false },
    resources: {
      ar: {
        translation: {
          // الترجمات الأساسية
          "dashboard": "لوحة التحكم",
          "batches": "الدفعات",
          "inventory": "المخزون",
          "finance": "المالية",
          "reports": "التقارير",
          "settings": "الإعدادات",
          "notifications": "التنبيهات",
          "arabic": "العربية",
          "english": "الإنجليزية",
          "language": "اللغة"
        }
      },
      en: {
        translation: {
          "dashboard": "Dashboard",
          "batches": "Batches",
          "inventory": "Inventory",
          "finance": "Finance",
          "reports": "Reports",
          "settings": "Settings",
          "notifications": "Notifications",
          "arabic": "Arabic",
          "english": "English",
          "language": "Language"
        }
      }
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  // إعادة تحميل اتجاه الصفحة
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
