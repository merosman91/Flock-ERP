import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addExpense, getExpenses, addSale, getSales, addBudget, getBudgets } from '../services/dbService';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

export default function Finance() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [expenses, setExpenses] = useState([]);
  const [sales, setSales] = useState([]);
  const [budgets, setBudgets] = useState([]);
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
  const [newBudget, setNewBudget] = useState({
    name: '',
    amount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const exp = await getExpenses();
    const sal = await getSales();
    const bud = await getBudgets();
    setExpenses(exp);
    setSales(sal);
    setBudgets(bud);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.amount) return;
    await addExpense(newExpense);
    setNewExpense({
      type: 'feed',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      notes: ''
    });
    loadData();
    alert(t('expenseAdded'));
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    if (!newSale.amount) return;
    await addSale(newSale);
    setNewSale({
      type: 'batch_sale',
      date: new Date().toISOString().split('T')[0],
      amount: '',
      notes: ''
    });
    loadData();
    alert(t('saleAdded'));
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!newBudget.name || !newBudget.amount) return;
    await addBudget(newBudget);
    setNewBudget({
      name: '',
      amount: '',
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0]
    });
    loadData();
    alert(t('budgetAdded'));
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
  const profit = totalSales - totalExpenses;
  const profitMargin = totalSales > 0 ? ((profit / totalSales) * 100).toFixed(1) : 0;

  const fixedCosts = expenses
    .filter(e => ['salary', 'equipment'].includes(e.type))
    .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
  const variableCosts = totalExpenses - fixedCosts;

  const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
  const budgetUtilization = totalBudget > 0 ? ((totalExpenses / totalBudget) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center rounded-lg mb-4">
        <h1 className="text-xl font-bold">{t('advancedFinance')}</h1>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      {/* Financial Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-2">
            <SummaryCard label={t('totalSales')} value={`${totalSales.toLocaleString()} ج.س`} color="text-green-600 dark:text-green-400" />
            <SummaryCard label={t('totalExpenses')} value={`${totalExpenses.toLocaleString()} ج.س`} color="text-red-600 dark:text-red-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SummaryCard label={t('profit')} value={`${profit.toLocaleString()} ج.س`} color={profit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"} />
            <SummaryCard label={t('profitMargin')} value={`${profitMargin}%`} color="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SummaryCard label={t('fixedCosts')} value={`${fixedCosts.toLocaleString()} ج.س`} color="text-amber-600 dark:text-amber-400" />
            <SummaryCard label={t('variableCosts')} value={`${variableCosts.toLocaleString()} ج.س`} color="text-purple-600 dark:text-purple-400" />
          </div>
          {budgets.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
              <div className="flex justify-between text-sm">
                <span>{t('budgetUtilization')}</span>
                <span className="font-bold">{budgetUtilization}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex mb-4 overflow-x-auto whitespace-nowrap">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'overview' 
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          {t('overview')}
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'expenses' 
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('expenses')}
        >
          {t('expenses')}
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'sales' 
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('sales')}
        >
          {t('sales')}
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'budget' 
              ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
          onClick={() => setActiveTab('budget')}
        >
          {t('budget')}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'budget' ? (
        <BudgetSection 
          budgets={budgets} 
          newBudget={newBudget}
          setNewBudget={setNewBudget}
          handleAddBudget={handleAddBudget}
        />
      ) : activeTab === 'expenses' ? (
        <ExpenseForm 
          newExpense={newExpense}
          setNewExpense={setNewExpense}
          handleSubmit={handleAddExpense}
          expenses={expenses}
        />
      ) : activeTab === 'sales' ? (
        <SaleForm 
          newSale={newSale}
          setNewSale={setNewSale}
          handleSubmit={handleAddSale}
          sales={sales}
        />
      ) : null}
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

function BudgetSection({ budgets, newBudget, setNewBudget, handleAddBudget }) {
  const { t } = useTranslation();
  const [adding, setAdding] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold">{t('budgetManagement')}</h2>
        <button 
          onClick={() => setAdding(!adding)}
          className="text-primary-600 dark:text-primary-400 text-sm"
        >
          {adding ? t('cancel') : `+ ${t('addBudget')}`}
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAddBudget} className="bg-white dark:bg-gray-800 p-3 rounded shadow mb-4">
          <input
            type="text"
            placeholder={t('budgetName')}
            value={newBudget.name}
            onChange={(e) => setNewBudget(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="number"
            placeholder={t('amount')}
            value={newBudget.amount}
            onChange={(e) => setNewBudget(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <select
            value={newBudget.period}
            onChange={(e) => setNewBudget(prev => ({ ...prev, period: e.target.value }))}
            className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="weekly">{t('weekly')}</option>
            <option value="monthly">{t('monthly')}</option>
            <option value="perBatch">{t('perBatch')}</option>
          </select>
          <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded text-sm">
            {t('addBudget')}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {budgets.map(b => (
          <div key={b.id} className="bg-white dark:bg-gray-800 p-3 rounded shadow">
            <div className="font-medium">{b.name}</div>
            <div className="text-sm">{b.amount} ج.س • {t(b.period)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpenseForm({ newExpense, setNewExpense, handleSubmit, expenses }) {
  const { t } = useTranslation();
  const expenseTypes = [
    { value: 'feed', label: t('feed') },
    { value: 'vaccine', label: t('vaccines') },
    { value: 'salary', label: t('salaries') },
    { value: 'equipment', label: t('equipment') },
    { value: 'other', label: t('other') }
  ];

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
              type="number"
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

function SaleForm({ newSale, setNewSale, handleSubmit, sales }) {
  const { t } = useTranslation();
  const saleTypes = [
    { value: 'batch_sale', label: t('batchSale') },
    { value: 'manure', label: t('manureSale') },
    { value: 'other', label: t('other') }
  ];

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
              type="number"
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
