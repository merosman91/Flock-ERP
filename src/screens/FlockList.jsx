import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getFlocks, deleteFlock } from '../services/dbService';

export default function FlockList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [flocks, setFlocks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    loadFlocks();
  }, []);

  const loadFlocks = async () => {
    const data = await getFlocks();
    // Mock: add daysOld and status
    const enriched = data.map(f => ({
      ...f,
      daysOld: Math.floor((Date.now() - new Date(f.startDate).getTime()) / (1000 * 60 * 60 * 24)),
      status: f.daysOld > 42 ? 'completed' : 'active'
    }));
    setFlocks(enriched);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('confirmDelete'))) {
      await deleteFlock(id);
      loadFlocks();
    }
  };

  const filtered = flocks.filter(flock => {
    const matchesSearch = flock.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || flock.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{t('flockList.title')}</h1>
        <button
          onClick={() => navigate('/flocks/new')}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
        >
          + {t('addBatch')}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="all">{t('all')}</option>
          <option value="active">{t('active')}</option>
          <option value="completed">{t('completed')}</option>
        </select>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(flock => (
            <div
              key={flock.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <div className="font-bold">{flock.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {flock.breed} • {flock.daysOld} {t('days')} • {flock.status === 'active' ? t('active') : t('completed')}
                </div>
              </div>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <button
                  onClick={() => navigate(`/flocks/${flock.id}`)}
                  className="text-blue-600 dark:text-blue-400"
                >
                  {t('view')}
                </button>
                <button
                  onClick={() => handleDelete(flock.id)}
                  className="text-red-600 dark:text-red-400"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            {t('noBatchesFound')}
          </p>
        )}
      </div>
    </div>
  );
}
