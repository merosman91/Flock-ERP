import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
      aria-label={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
