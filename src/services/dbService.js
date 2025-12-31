import { openDB } from 'idb';

const DB_NAME = 'DawajnyDB';
const VERSION = 2; // ⬅️ رفع الإصدار لتفعيل التحديث

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

      // ✅ جداول جديدة للمخزون
      if (!db.objectStoreNames.contains('inventory')) {
        const invStore = db.createObjectStore('inventory', { keyPath: 'id', autoIncrement: true });
        invStore.createIndex('name', 'name', { unique: false });
        invStore.createIndex('type', 'type', { unique: false });
      }

      // ✅ جداول جديدة للمالية المتقدمة
      if (!db.objectStoreNames.contains('budgets')) {
        db.createObjectStore('budgets', { keyPath: 'id', autoIncrement: true });
      }

      if (oldVersion < 2) {
        // تحديث الجداول القديمة إذا لزم
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
    item.quantity = newQuantity;
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

// === الدوال القديمة (غير مُعدّلة) ===
export const addFlock = async (flock) => {
  const db = await initDB();
  return db.add('flocks', flock);
};

export const getFlocks = async () => {
  const db = await initDB();
  return db.getAll('flocks');
};

// ... (أضف باقي الدوال حسب الحاجة)
