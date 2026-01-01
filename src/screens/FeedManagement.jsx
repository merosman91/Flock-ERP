import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getFlocks } from '../services/dbService';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

export default function FeedManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [flock, setFlock] = useState(null);
  const [feedLogs, setFeedLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'علف نمو'
  });

  useEffect(() => {
    const loadFlock = async () => {
      const flocks = await getFlocks();
      const found = flocks.find(f => f.id === parseInt(id));
      if (found) {
        setFlock(found);
        setFeedLogs([
          { id: 1, date: '2025-04-01', amount: '120', type: 'علف نمو' },
          { id: 2, date: '2025-04-02', amount: '135', type: 'علف نمو' },
          { id: 3, date: '2025-04-03', amount: '150', type: 'علف تسمين' }
        ]);
      }
    };
    loadFlock();
  }, [id]);

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLog.amount) return;
    
    const log = {
      id: Date.now(),
      ...newLog
    };
    setFeedLogs(prev => [log, ...prev]);
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      type: 'علف نمو'
    });
    alert(t('feedRecordSaved'));
  };

  const totalFeed = feedLogs.reduce((sum, log) => sum + parseFloat(log.amount || 0), 0).toFixed(1);

  if (!flock) {
    return <div className="p-4">{t('loading')}...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center rounded-lg mb-4">
        <button onClick={() => navigate(`/flocks/${id}`)} className="text-primary-600 dark:text-primary-400">
          ← {t('back')}
        </button>
        <h1 className="text-xl font-bold">{t('feedManagement')}</h1>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('totalFeedConsumed')}</div>
          <div className="text-2xl font-bold text-primary-700 dark:text-primary-400">{totalFeed} kg</div>
        </div>
      </div>

      {/* Add Log Form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-3">{t('addFeedRecord')}</h2>
        <form onSubmit={handleAddLog} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">{t('date')}</label>
            <input
              type="date"
              value={newLog.date}
              onChange={(e) => setNewLog(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('amountKg')}</label>
            <input
              type="number"
              step="0.1"
              value={newLog.amount}
              onChange={(e) => setNewLog(prev => ({ ...prev, amount: e.target.value }))}
              placeholder={t('enterAmount')}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('feedType')}</label>
            <select
              value={newLog.type}
              onChange={(e) => setNewLog(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="علف فرخ">{t('feedType')} - فرخ</option>
              <option value="علف نمو">{t('feedType')} - نمو</option>
              <option value="علف تسمين">{t('feedType')} - تسمين</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 rounded"
          >
            {t('addRecord')}
          </button>
        </form>
      </div>

      {/* Feed Logs */}
      <div>
        <h2 className="font-bold mb-2">{t('recentRecords')}</h2>
        <div className="space-y-2">
          {feedLogs.length > 0 ? (
            feedLogs.map(log => (
              <div key={log.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                <div className="font-medium">{log.date}</div>
                <div>{log.amount} kg • {log.type}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              {t('noFeedRecords')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
