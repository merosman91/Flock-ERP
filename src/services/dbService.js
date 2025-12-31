import { openDB } from 'idb';

const DB_NAME = 'DawajnyDB';
const VERSION = 1;

const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      const stores = ['flocks', 'feed', 'health', 'expenses', 'notifications'];
      stores.forEach(storeName => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        }
      });
    }
  });
};

// Flocks
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

// Add other services as needed (feed, health, etc.)
