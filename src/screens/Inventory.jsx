import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addInventoryItem, getInventory, updateInventoryQuantity } from '../services/dbService';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

export default function Inventory() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'feed',
    quantity: '',
    unit: 'kg',
    unitPrice: '',
    minThreshold: '10',
    notes: ''
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
    if (!newItem.name || !newItem.quantity) return;
    
    const item = {
      id: editingId || Date.now(),
      ...newItem,
      lastUpdated: new Date().toISOString()
    };
    
    if (editingId) {
      await updateInventoryQuantity(editingId, parseFloat(newItem.quantity));
    } else {
      await addInventoryItem(item);
    }
    
    setNewItem({
      name: '',
      type: 'feed',
      quantity: '',
      unit: 'kg',
      unitPrice: '',
      minThreshold: '10',
      notes: ''
    });
    setEditingId(null);
    loadInventory();
  };

  const startEdit = (item) => {
    setNewItem({
      name: item.name,
      type: item.type,
      quantity: item.quantity.toString(),
      unit: item.unit,
      unitPrice: item.unitPrice?.toString() || '',
      minThreshold: item.minThreshold?.toString() || '10',
      notes: item.notes || ''
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
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center rounded-xl mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
          {t('inventoryManagement')}
        </h1>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* تنبيهات المخزون المنخفض */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 mb-6 rounded-xl">
          <div className="flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <p className="font-bold text-amber-800 dark:text-amber-200">{t('lowStockAlert')}</p>
              <ul className="list-disc list-inside mt-2 text-sm text-amber-700 dark:text-amber-300">
                {lowStockItems.map(item => (
                  <li key={item.id}>{item.name}: {item.quantity} {item.unit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* نموذج إضافة/تعديل */}
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow mb-8 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-5 text-gray-800 dark:text-white">
          {editingId ? t('editItem') : t('addItem')}
        </h2>
        <form onSubmit={handleAddOrUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('itemName')}</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('type')}</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                {inventoryTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('unit')}</label>
              <select
                value={newItem.unit}
                onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="kg">كيلوجرام (kg)</option>
                <option value="ton">طن</option>
                <option value="liter">لتر</option>
                <option value="gallon">جالون</option>
                
                {newItem.type === 'feed' && (
                  <>
                    <option value="sack">جوال</option>
                    <option value="bag">كيس</option>
                  </>
                )}
                {newItem.type === 'medicine' && (
                  <option value="bottle">قارورة</option>
                )}
                {newItem.type === 'equipment' && (
                  <option value="unit">وحدة</option>
                )}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('quantity')}</label>
              <input
                type="number"
                step="0.1"
                value={newItem.quantity}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="أدخل الكمية"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('unitPrice')}</label>
              <input
                type="number"
                step="0.01"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('minThreshold')}</label>
              <input
                type="number"
                value={newItem.minThreshold}
                onChange={(e) => setNewItem(prev => ({ ...prev, minThreshold: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
                placeholder="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{t('notes')}</label>
              <textarea
                value={newItem.notes || ''}
                onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                rows="2"
                className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
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
                    unitPrice: '',
                    minThreshold: '10',
                    notes: ''
                  });
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg font-medium"
              >
                {t('cancel')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* قائمة المخزون */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{t('currentStock')}</h2>
        <div className="space-y-3">
          {items.length > 0 ? (
            items.map(item => (
              <div key={item.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg text-gray-800 dark:text-white">{item.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {item.quantity} {item.unit} • {t(item.type)}
                    {item.unitPrice && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('unitPrice')}: {item.unitPrice} ج.س
                      </div>
                    )}
                  </div>
                  {item.notes && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.notes}</div>
                  )}
                </div>
                <button
                  onClick={() => startEdit(item)}
                  className="bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 p-2 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                >
                  ✏️
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noInventoryItems')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
        }
