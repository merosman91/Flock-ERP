import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addInventoryItem, getInventory, updateInventoryQuantity } from '../services/dbService';

export default function Inventory() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'feed',
    quantity: '',
    unit: 'kg',
    minThreshold: '10', // ⬅️ تنبيه عند الوصول لهذا الحد
    lastUpdated: new Date().toISOString()
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    const data = await getInventory();
    setItems(data);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateInventoryQuantity(editingId, parseFloat(newItem.quantity));
      setEditingId(null);
    } else {
      await addInventoryItem(newItem);
    }
    setNewItem({
      name: '',
      type: 'feed',
      quantity: '',
      unit: 'kg',
      minThreshold: '10',
      lastUpdated: new Date().toISOString()
    });
    loadInventory();
  };

  const startEdit = (item) => {
    setNewItem({
      name: item.name,
      type: item.type,
      quantity: item.quantity.toString(),
      unit: item.unit,
      minThreshold: item.minThreshold?.toString() || '10'
    });
    setEditingId(item.id);
  };

  const lowStockItems = items.filter(item => 
    parseFloat(item.quantity) <= parseFloat(item.minThreshold)
  );

  const inventoryTypes = [
    { value: 'feed', label: t('feed') },
    { value: 'vaccine', label: t('vaccines') },
    { value: 'medicine', label: t('medicine') },
    { value: 'equipment', label: t('equipment') }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-xl font-bold mb-4">{t('inventoryManagement')}</h1>

      {/* تنبيهات المخزون المنخفض */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-100 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 mb-4 rounded">
          <div className="flex items-start">
            <span className="text-2xl mr-2">⚠️</span>
            <div>
              <p className="font-bold">{t('lowStockAlert')}</p>
              <ul className="list-disc list-inside mt-1">
                {lowStockItems.map(item => (
                  <li key={item.id}>{item.name}: {item.quantity} {item.unit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* نموذج إضافة/تعديل */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
        <h2 className="font-bold mb-3">
          {editingId ? t('editItem') : t('addItem')}
        </h2>
        <form onSubmit={handleAddOrUpdate} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">{t('itemName')}</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text:sm mb-1">{t('type')}</label>
            <select
              value={newItem.type}
              onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              {inventoryTypes.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm mb-1">{t('quantity')}</label>
              <input
                type="number"
                step="0.1"
                value={newItem.quantity}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">{t('unit')}</label>
              <input
                type="text"
                value={newItem.unit}
                onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="kg, liter, pcs..."
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">{t('minThreshold')}</label>
            <input
              type="number"
              value={newItem.minThreshold}
              onChange={(e) => setNewItem(prev => ({ ...prev, minThreshold: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="10"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded"
          >
            {editingId ? t('update') : t('add')}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewItem({
                  name: '',
                  type: 'feed',
                  quantity: '',
                  unit: 'kg',
                  minThreshold: '10'
                });
              }}
              className="w-full mt-2 text-gray-600 dark:text-gray-300"
            >
              {t('cancel')}
            </button>
          )}
        </form>
      </div>

      {/* قائمة المخزون */}
      <div>
        <h2 className="font-bold mb-2">{t('currentStock')}</h2>
        <div className="space-y-2">
          {items.length > 0 ? (
            items.map(item => (
              <div key={item.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {item.quantity} {item.unit} • {t(item.type)}
                  </div>
                </div>
                <button
                  onClick={() => startEdit(item)}
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  ✏️
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              {t('noInventoryItems')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
