import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { addFlock, getFlocks } from '../services/dbService';
import { breeds } from '../utils/data';

export default function FlockForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    startDate: '',
    count: '',
    pricePerBird: '',
    initialWeight: '',
    notes: ''
  });

  useEffect(() => {
    if (isEdit) {
      // In real app: fetch by ID
      // For demo: load first flock
      const load = async () => {
        const flocks = await getFlocks();
        if (flocks.length > 0) {
          setFormData(flocks[0]);
        }
      };
      load();
    }
  }, [isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addFlock(formData);
    navigate('/flocks');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-xl font-bold mb-4">
        {isEdit ? t('editBatch') : t('addBatch')}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-4">
        <InputField
          label={t('batchName')}
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <SelectField
          label={t('breed')}
          name="breed"
          value={formData.breed}
          onChange={handleChange}
          options={Object.keys(breeds.ar).map(key => ({
            value: key,
            label: i18n.language === 'ar' ? breeds.ar[key] : key
          }))}
          required
        />
        <InputField
          label={t('startDate')}
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <InputField
          label={t('birdCount')}
          name="count"
          type="number"
          value={formData.count}
          onChange={handleChange}
          required
        />
        <InputField
          label={t('pricePerBird')}
          name="pricePerBird"
          type="number"
          step="0.01"
          value={formData.pricePerBird}
          onChange={handleChange}
          required
        />
        <InputField
          label={t('initialWeight')}
          name="initialWeight"
          type="number"
          step="0.01"
          value={formData.initialWeight}
          onChange={handleChange}
        />
        <TextareaField
          label={t('notes')}
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-gray-600 dark:text-gray-300"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2 rounded"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      >
        <option value="">{label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="3"
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
}
