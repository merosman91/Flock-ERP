import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ar from '../locales/ar/translation';
import en from '../locales/en/translation';

const savedLang = localStorage.getItem('i18nextLng') || 'ar';

i18n
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false // not needed for react
    },
    resources: {
      ar: {
        translation: ar
      },
      en: {
        translation: en
      }
    }
  });

// عند تغيير اللغة، احفظها وغيّر اتجاه الصفحة
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
