import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Finance() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('expenses');
  const [expenses, setExpenses] = useState([
    { id: 1, type: 'feed', date: '2025-04-01', amount: '15,000', notes: 'شراء علف' }
  ]);
  const [sales, setSales] = useState([
    { id: 1, type: 'batch_sale', date: '2025-04-03', amount: '45,000', notes: 'بيع دفعة أبريل' }
  ]);
  const [newExpense, setNewExpense] = useState({
    type: 'feed',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    notes: ''
  });
  const [newSale, setNewSale] = useState({
    type: 'batch_sale',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    notes: ''
  });

  const expenseTypes = [
    { value: 'feed', label: t('feed') },
    { value: 'vaccine', label: t('vaccines') },
    { value: 'salary', label: t('salaries') },
    { value: 'equipment', label: t('equipment') },
    { value: 'other', label: t('other') }
  ];

  const saleTypes = [
    { value: 'batch_sale', label: t('batchSale') },
    { value: 'manure', label: t('manureSale') },
    { value: 'other', label: t('other') }
  ];

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.amount) return;
    const expense = { id: Date.now(), ...newExpense };
    setExpenses(prev => [expense, ...prev]);
    setNewExpense({
      type: 'feed',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      notes: ''
    });
    alert(t('expenseAdded'));
  };

  const handleAddSale = (e) => {
    e.preventDefault();
    if (!newSale.amount) return;
    const sale = { id: Date.now(), ...newSale };
    setSales(prev => [sale, ...prev]);
    setNewSale({
      type: 'batch_sale',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      notes: ''
    });
    alert(t('saleAdded'));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount.replace(/,/g, '')), 0);
  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount.replace(/,/g, '')), 0);
  const profit = totalSales - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-xl font-bold mb-4">{t('finance')}</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <SummaryCard label={t('totalExpenses')} value={`${totalExpenses.toLocaleString()} ج.س`} color="text-red-600 dark:text-red-400" />
        <SummaryCard label={t('totalSales')} value={`${totalSales.toLocaleString()} ج.س`} color="text-green-600 dark:text-green-400" />
        <SummaryCard label={t('profit')} value={`${profit.toLocaleString()} ج.س`} color={profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"} />
      </div>

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'expenses' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('expenses')}
        >
          {t('expenses')}
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'sales' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('sales')}
        >
          {t('sales')}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'expenses' ? (
        <ExpenseForm
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          expenseTypes={expenseTypes}
          handleSubmit={handleAddExpense}
          expenses={expenses}
        />
      ) : (
        <SaleForm
          newSale={newSale}
          setNewSale={setNewSale}
          saleTypes={saleTypes}
          handleSubmit={handleAddSale}
          sales={sales}
        />
      )}
    </div>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded text-center shadow">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className={`font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}

function ExpenseForm({ newExpense, setNewExpense, expenseTypes, handleSubmit, expenses }) {
  const { t } = useTranslation();
  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-3">{t('addExpense')}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">{t('expenseType')}</label>
            <select
              value={newExpense.type}
              onChange={(e) => setNewExpense(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              {expenseTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">{t('date')}</label>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('amount')}</label>
            <input
              type="text"
              value={newExpense.amount}
              onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="15000"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('notes')}</label>
            <textarea
              value={newExpense.notes}
              onChange={(e) => setNewExpense(prev => ({ ...prev, notes: e.target.value }))}
              rows="2"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded">
            {t('addExpense')}
          </button>
        </div>
      </form>

      <div>
        <h2 className="font-bold mb-2">{t('recentExpenses')}</h2>
        <div className="space-y-2">
          {expenses.map(exp => (
            <div key={exp.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
              <div className="font-medium">{exp.date}</div>
              <div>{exp.amount} ج.س • {exp.type}</div>
              {exp.notes && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exp.notes}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SaleForm({ newSale, setNewSale, saleTypes, handleSubmit, sales }) {
  const { t } = useTranslation();
  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-4">
        <h2 className="font-bold mb-3">{t('addSale')}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">{t('saleType')}</label>
            <select
              value={newSale.type}
              onChange={(e) => setNewSale(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              {saleTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">{t('date')}</label>
            <input
              type="date"
              value={newSale.date}
              onChange={(e) => setNewSale(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('amount')}</label>
            <input
              type="text"
              value={newSale.amount}
              onChange={(e) => setNewSale(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="45000"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('notes')}</label>
            <textarea
              value={newSale.notes}
              onChange={(e) => setNewSale(prev => ({ ...prev, notes: e.target.value }))}
              rows="2"
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            {t('addSale')}
          </button>
        </div>
      </form>

      <div>
        <h2 className="font-bold mb-2">{t('recentSales')}</h2>
        <div className="space-y-2">
          {sales.map(sale => (
            <div key={sale.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
              <div className="font-medium">{sale.date}</div>
              <div>{sale.amount} ج.س • {sale.type}</div>
              {sale.notes && <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sale.notes}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
