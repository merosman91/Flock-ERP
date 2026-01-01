import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getFlocks } from '../services/dbService';
import { vaccines } from '../utils/data';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

export default function HealthRecords() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [flock, setFlock] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'vaccine',
    name: '',
    dose: '',
    notes: ''
  });
  const [showDescription, setShowDescription] = useState(null);

  useEffect(() => {
    const loadFlock = async () => {
      const flocks = await getFlocks();
      const found = flocks.find(f => f.id === parseInt(id));
      if (found) {
        setFlock(found);
        setHealthRecords([
          { id: 1, date: '2025-03-28', type: 'vaccine', name: 'ND_Lasota', dose: '1 جرعة', notes: 'تم التطعيم عبر الشرب' },
          { id: 2, date: '2025-04-01', type: 'treatment', name: 'أنتي باكتيريا', dose: '5 مل/لتر', notes: 'لعلاج الإسهال' }
        ]);
      }
    };
    loadFlock();
  }, [id]);

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!newRecord.name) return;
    
    const record = {
      id: Date.now(),
      ...newRecord
    };
    setHealthRecords(prev => [record, ...prev]);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      type: 'vaccine',
      name: '',
      dose: '',
      notes: ''
    });
    alert(t('healthRecordSaved'));
  };

  const getDescription = (name) => {
    if (newRecord.type === 'vaccine') {
      return i18n.language === 'ar' ? vaccines.ar[name] : vaccines.en[name];
    }
    return t('treatmentDescription');
  };

  const toggleDescription = (name) => {
    setShowDescription(showDescription === name ? null : name);
  };

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
        <h1 className="text-xl font-bold">{t('healthRecordsTitle')}</h1>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Add Record Form */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-3">{t('addHealthRecord')}</h2>
        <form onSubmit={handleAddRecord} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">{t('date')}</label>
            <input
              type="date"
              value={newRecord.date}
              onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('recordType')}</label>
            <select
              value={newRecord.type}
              onChange={(e) => setNewRecord(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="vaccine">{t('vaccine')}</option>
              <option value="treatment">{t('treatment')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">
              {newRecord.type === 'vaccine' ? t('vaccineName') : t('treatmentName')}
            </label>
            <input
              type="text"
              value={newRecord.name}
              onChange={(e) => setNewRecord(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('enterName')}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            {newRecord.name && (
              <button
                type="button"
                onClick={() => toggleDescription(newRecord.name)}
                className="text-xs text-primary-600 dark:text-primary-400 mt-1"
              >
                {showDescription === newRecord.name ? t('hideInfo') : t('showInfo')}
              </button>
            )}
            {showDescription === newRecord.name && (
              <div className="mt-2 p-2 bg-primary-50 dark:bg-primary-900/20 rounded text-sm">
                {getDescription(newRecord.name) || t('noDescription')}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">{t('dose')}</label>
            <input
              type="text"
              value={newRecord.dose}
              onChange={(e) => setNewRecord(prev => ({ ...prev, dose: e.target.value }))}
              placeholder={t('enterDose')}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('notes')}</label>
            <textarea
              value={newRecord.notes}
              onChange={(e) => setNewRecord(prev => ({ ...prev, notes: e.target.value }))}
              rows="2"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-rose-600 text-white py-2 rounded"
          >
            {t('addRecord')}
          </button>
        </form>
      </div>

      {/* Health Records List */}
      <div>
        <h2 className="font-bold mb-2">{t('recentRecords')}</h2>
        <div className="space-y-3">
          {healthRecords.length > 0 ? (
            healthRecords.map(record => (
              <div key={record.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
                <div className="flex justify-between">
                  <span className={`px-2 py-1 rounded text-xs ${
                    record.type === 'vaccine' 
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200' 
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-200'
                  }`}>
                    {record.type === 'vaccine' ? t('vaccine') : t('treatment')}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{record.date}</span>
                </div>
                <div className="font-medium mt-1">{record.name}</div>
                <div className="text-sm">{t('dose')}: {record.dose}</div>
                {record.notes && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{record.notes}</div>}
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              {t('noHealthRecords')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
                }
