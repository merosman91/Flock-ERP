import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getFlocks } from '../services/dbService';

export default function WaterManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [flock, setFlock] = useState(null);
  const [waterLogs, setWaterLogs] = useState([]);
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    unit: 'liter'
  });

  useEffect(() => {
    const loadFlock = async () => {
      const flocks = await getFlocks();
      const found = flocks.find(f => f.id === parseInt(id));
      if (found) {
        setFlock(found);
        // Mock water logs
        setWaterLogs([
          { id: 1, date: '2025-04-01', amount: '240', unit: 'liter' },
          { id: 2, date: '2025-04-02', amount: '270', unit: 'liter' },
          { id: 3, date: '2025-04-03', amount: '300', unit: 'liter' }
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
    setWaterLogs(prev => [log, ...prev]);
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      unit: 'liter'
    });
    alert(t('waterRecordSaved'));
  };

  const totalWater = waterLogs.reduce((sum, log) => sum + parseFloat(log.amount || 0), 0).toFixed(1);

  if (!flock) {
    return <div className="p-4">{t('loading')}...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate(`/flocks/${id}`)} className="text-emerald-600 dark:text-emerald-400">
          ← {t('back')}
        </button>
        <h1 className="text-xl font-bold">{t('waterManagement')}</h1>
        <div className="w-8"></div>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">{t('totalWaterConsumed')}</div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {totalWater} {t('liter')}
          </div>
        </div>
      </div>

      {/* Add Log Form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-3">{t('addWaterRecord')}</h2>
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
            <label className="block text-sm mb-1">{t('amount')}</label>
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
            <label className="block text-sm mb-1">{t('unit')}</label>
            <select
              value={newLog.unit}
              onChange={(e) => setNewLog(prev => ({ ...prev, unit: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="liter">{t('liter')}</option>
              <option value="gallon">{t('gallon')}</option>
              <option value="barrel">{t('barrel')}</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {t('addRecord')}
          </button>
        </form>
      </div>

      {/* Water Logs */}
      <div>
        <h2 className="font-bold mb-2">{t('recentRecords')}</h2>
        <div className="space-y-2">
          {waterLogs.length > 0 ? (
            waterLogs.map(log => (
              <div key={log.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                <div className="font-medium">{log.date}</div>
                <div>{log.amount} {log.unit === 'liter' ? t('liter') : log.unit}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              {t('noWaterRecords')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
