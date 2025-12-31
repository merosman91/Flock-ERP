import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      // Login
      "login.title": "تسجيل الدخول",
      "login.pin": "أدخل رمز الدخول",
      "login.submit": "دخول",
      
      // Dashboard
      "dashboard.title": "لوحة التحكم",
      "dashboard.avgTemp": "متوسط الحرارة",
      "dashboard.humidity": "الرطوبة",
      "dashboard.feed": "استهلاك العلف",
      "dashboard.water": "استهلاك المياه",
      "dashboard.mortality": "معدل النفوق",
      "dashboard.weight": "الوزن المتوسط",
      "dashboard.alerts": "تنبيهات",
      "dashboard.batches": "الدفعات الجارية"
    }
  },
  en: {
    translation: {
      "login.title": "Login",
      "login.pin": "Enter PIN",
      "login.submit": "Login",
      
      "dashboard.title": "Dashboard",
      "dashboard.avgTemp": "Avg. Temperature",
      "dashboard.humidity": "Humidity",
      "dashboard.feed": "Feed Consumption",
      "dashboard.water": "Water Consumption",
      "dashboard.mortality": "Mortality Rate",
      "dashboard.weight": "Avg. Weight",
      "dashboard.alerts": "Alerts",
      "dashboard.batches": "Active Batches"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
