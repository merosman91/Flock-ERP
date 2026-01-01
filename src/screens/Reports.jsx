import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Reports() {
  const { t, i18n } = useTranslation();
  const [period, setPeriod] = useState('weekly');

  // Mock data
  const mockData = {
    daily: [
      { date: '2025-04-03', mortality: '0.8%', feed: '210 kg', water: '420 L', temp: '28°C' },
      { date: '2025-04-02', mortality: '1.0%', feed: '190 kg', water: '380 L', temp: '29°C' }
    ],
    weekly: [
      { week: i18n.language === 'ar' ? 'الأسبوع 1' : 'Week 1', mortality: '1.2%', avgWeight: '0.45 kg', fcr: '1.45' },
      { week: i18n.language === 'ar' ? 'الأسبوع 2' : 'Week 2', mortality: '0.9%', avgWeight: '1.10 kg', fcr: '1.52' }
    ],
    monthly: [
      { month: 'أبريل 2025', totalMortality: '2.1%', totalFeed: '2,800 kg', profit: '12,500 ج.س' }
    ]
  };

  // ✅ توليد PDF باستخدام استيراد ديناميكي (آمن لـ Vercel)
  const generatePDF = async () => {
    // تحميل المكتبات فقط في المتصفح
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    doc.setFont('Helvetica');
    const title = i18n.language === 'ar' ? 'تقرير دواجني' : 'Dawajny Report';
    doc.text(title, 20, 20);

    const data = period === 'daily' ? mockData.daily : 
                period === 'weekly' ? mockData.weekly : mockData.monthly;

    const columns = period === 'daily' 
      ? [t('date'), t('mortality'), t('feed'), t('water'), t('temperature')]
      : period === 'weekly'
      ? [t('week'), t('mortality'), t('avgWeight'), t('fcr')]
      : [t('month'), t('totalMortality'), t('totalFeed'), t('profit')];

    const rows = data.map(item => 
      period === 'daily' 
        ? [item.date, item.mortality, item.feed, item.water, item.temp]
        : period === 'weekly'
        ? [item.week, item.mortality, item.avgWeight, item.fcr]
        : [item.month, item.totalMortality, item.totalFeed, item.profit]
    );

    // @ts-ignore
    doc.autoTable({
      startY: 30,
      head: [columns],
      body: rows,
      theme: 'grid',
      styles: { font: 'Helvetica', fontSize: 10 },
      headStyles: { fillColor: [5, 150, 105] }
    });

    // ✅ استخدام Blob + URL (بدون file-saver)
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Dawajny_Report_${period}_${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareViaWhatsApp = () => {
    const text = `${t('reportShared')} - ${t('period')}: ${t(period)}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareViaTelegram = () => {
    const text = `${t('reportShared')} - ${t('period')}: ${t(period)}`;
    const url = `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const currentData = period === 'daily' ? mockData.daily : 
                     period === 'weekly' ? mockData.weekly : mockData.monthly;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-xl font-bold mb-4">{t('reportsTitle')}</h1>

      {/* Period Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['daily', 'weekly', 'monthly'].map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded ${
              period === p 
                ? 'bg-emerald-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {t(p)}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={generatePDF}
          className="flex-1 bg-gray-800 text-white py-2 rounded text-center"
        >
          📄 {t('downloadPDF')}
        </button>
        <button
          onClick={shareViaWhatsApp}
          className="flex-1 bg-green-600 text-white py-2 rounded text-center"
        >
          💬 {t('shareWhatsApp')}
        </button>
        <button
          onClick={shareViaTelegram}
          className="flex-1 bg-blue-600 text-white py-2 rounded text-center"
        >
          📱 {t('shareTelegram')}
        </button>
      </div>

      {/* Report Table */}
      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              {period === 'daily' && (
                <>
                  <th className="p-2 border">{t('date')}</th>
                  <th className="p-2 border">{t('mortality')}</th>
                  <th className="p-2 border">{t('feed')}</th>
                  <th className="p-2 border">{t('water')}</th>
                  <th className="p-2 border">{t('temperature')}</th>
                </>
              )}
              {period === 'weekly' && (
                <>
                  <th className="p-2 border">{t('week')}</th>
                  <th className="p-2 border">{t('mortality')}</th>
                  <th className="p-2 border">{t('avgWeight')}</th>
                  <th className="p-2 border">{t('fcr')}</th>
                </>
              )}
              {period === 'monthly' && (
                <>
                  <th className="p-2 border">{t('month')}</th>
                  <th className="p-2 border">{t('totalMortality')}</th>
                  <th className="p-2 border">{t('totalFeed')}</th>
                  <th className="p-2 border">{t('profit')}</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/50">
                {period === 'daily' && (
                  <>
                    <td className="p-2 border">{row.date}</td>
                    <td className="p-2 border">{row.mortality}</td>
                    <td className="p-2 border">{row.feed}</td>
                    <td className="p-2 border">{row.water}</td>
                    <td className="p-2 border">{row.temp}</td>
                  </>
                )}
                {period === 'weekly' && (
                  <>
                    <td className="p-2 border">{row.week}</td>
                    <td className="p-2 border">{row.mortality}</td>
                    <td className="p-2 border">{row.avgWeight}</td>
                    <td className="p-2 border">{row.fcr}</td>
                  </>
                )}
                {period === 'monthly' && (
                  <>
                    <td className="p-2 border">{row.month}</td>
                    <td className="p-2 border">{row.totalMortality}</td>
                    <td className="p-2 border">{row.totalFeed}</td>
                    <td className="p-2 border">{row.profit}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
      }
