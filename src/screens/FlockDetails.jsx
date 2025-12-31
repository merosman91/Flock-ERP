import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getFlocks } from '../services/dbService';
import { breeds } from '../utils/data';

export default function FlockDetails() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [flock, setFlock] = useState(null);
  const [breedDescription, setBreedDescription] = useState('');

  useEffect(() => {
    const loadFlock = async () => {
      const flocks = await getFlocks();
      const found = flocks.find(f => f.id === parseInt(id));
      if (found) {
        const daysOld = Math.floor((Date.now() - new Date(found.startDate).getTime()) / (1000 * 60 * 60 * 24));
        setFlock({ ...found, daysOld });
        // Load breed description
        const desc = i18n.language === 'ar' ? breeds.ar[found.breed] : breeds.en[found.breed];
        setBreedDescription(desc || t('breedNotFound'));
      }
    };
    loadFlock();
  }, [id, i18n.language]);

  if (!flock) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        {t('loading')}...
      </div>
    );
  }

  // Mock KPIs (in real app: calculate from feed/health records)
  const avgWeight = (flock.daysOld * 0.05 + (flock.initialWeight || 0.04)).toFixed(2); // simplified
  const feedConsumed = (flock.daysOld * 0.15 * flock.count).toFixed(1);
  const mortalityRate = (Math.random() * 1.5).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate(-1)} className="text-emerald-600 dark:text-emerald-400">
          ← {t('back')}
        </button>
        <h1 className="text-xl font-bold text-center flex-1">{flock.name}</h1>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* General Info */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <InfoRow label={t('breed')} value={flock.breed} />
          <InfoRow label={t('age')} value={`${flock.daysOld} ${t('days')}`} />
          <InfoRow label={t('birdCount')} value={flock.count.toLocaleString()} />
          <InfoRow label={t('startDate')} value={new Date(flock.startDate).toLocaleDateString('ar-SD')} />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <KpiCard label={t('avgWeight')} value={`${avgWeight} kg`} />
        <KpiCard label={t('feedConsumed')} value={`${feedConsumed} kg`} />
        <KpiCard label={t('mortalityRate')} value={`${mortalityRate}%`} />
      </div>

      {/* Breed Description */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-2">{t('breedInfo')}</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {breedDescription}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <ActionButton
          label={t('healthRecords')}
          icon="🩺"
          onClick={() => navigate(`/flocks/${id}/health`)}
        />
        <ActionButton
          label={t('feed')}
          icon="🍽️"
          onClick={() => navigate(`/flocks/${id}/feed`)}
        />
        <ActionButton
          label={t('environment')}
          icon="🌡️"
          onClick={() => navigate(`/flocks/${id}/environment`)}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <span className="text-gray-500 dark:text-gray-400">{label}:</span>{' '}
      <span className="font-medium">{value}</span>
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 text-center p-3 rounded">
      <div className="text-xs">{label}</div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}

function ActionButton({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center"
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-sm">{label}</div>
    </button>
  );
}
