import { openDB } from 'idb';

const DB_NAME = 'DawajnyDB';
const VERSION = 2; // ⬅️ إصدار محدّث ليدعم الجداول الجديدة

const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db, oldVersion) {
      // الجداول الأساسية
      const baseStores = ['flocks', 'feed', 'health', 'expenses', 'sales', 'notifications'];
      baseStores.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      });

      // ✅ جدول المخزون
      if (!db.objectStoreNames.contains('inventory')) {
        const invStore = db.createObjectStore('inventory', { keyPath: 'id', autoIncrement: true });
        invStore.createIndex('name', 'name', { unique: false });
        invStore.createIndex('type', 'type', { unique: false });
      }

      // ✅ جدول الميزانية
      if (!db.objectStoreNames.contains('budgets')) {
        db.createObjectStore('budgets', { keyPath: 'id', autoIncrement: true });
      }
    }
  });
};

// === المخزون ===
export const addInventoryItem = async (item) => {
  const db = await initDB();
  return db.add('inventory', item);
};

export const getInventory = async () => {
  const db = await initDB();
  return db.getAll('inventory');
};

export const updateInventoryQuantity = async (id, newQuantity) => {
  const db = await initDB();
  const tx = db.transaction('inventory', 'readwrite');
  const store = tx.objectStore('inventory');
  const item = await store.get(id);
  if (item) {
    item.quantity = parseFloat(newQuantity);
    item.lastUpdated = new Date().toISOString();
    await store.put(item);
  }
  await tx.done;
};

// === المالية المتقدمة ===
export const addBudget = async (budget) => {
  const db = await initDB();
  return db.add('budgets', budget);
};

export const getBudgets = async () => {
  const db = await initDB();
  return db.getAll('budgets');
};

// === الدوال الأساسية (للوظائف الأخرى) ===
export const addFlock = async (flock) => {
  const db = await initDB();
  return db.add('flocks', flock);
};

export const getFlocks = async () => {
  const db = await initDB();
  return db.getAll('flocks');
};

export const deleteFlock = async (id) => {
  const db = await initDB();
  return db.delete('flocks', id);
};

// دوال الإضافة للمصروفات والمبيعات (للاستخدام في المالية)
export const addExpense = async (expense) => {
  const db = await initDB();
  return db.add('expenses', expense);
};

export const getExpenses = async () => {
  const db = await initDB();
  return db.getAll('expenses');
};

export const addSale = async (sale) => {
  const db = await initDB();
  return db.add('sales', sale);
};

export const getSales = async () => {
  const db = await initDB();
  return db.getAll('sales');
};
