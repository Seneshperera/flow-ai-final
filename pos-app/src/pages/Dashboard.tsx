import { useState, useEffect } from 'react';
import { select } from '../lib/db';
import { syncService } from '../services/syncService';
import { DollarSign, ShoppingBag, TrendingUp, Users, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [stats, setStats] = useState({
    todaySales: 0,
    totalOrders: 0,
    activeCustomers: 0,
    growth: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const sales = await select<any[]>('SELECT total, created_at FROM sales');
      const customers = await select<any[]>('SELECT id FROM customers');
      
      const today = new Date().toISOString().split('T')[0];
      const todaySales = (sales as any[])
        .filter(s => s.created_at && s.created_at.startsWith(today))
        .reduce((acc, s) => acc + s.total, 0);

      setStats({
        todaySales,
        totalOrders: sales.length,
        activeCustomers: customers.length,
        growth: 12.5 // Mock growth
      });

      // Group sales by date for chart
      const grouped = (sales as any[]).reduce((acc: any, s) => {
        const date = s.created_at ? s.created_at.split(' ')[0] : 'Unknown';
        acc[date] = (acc[date] || 0) + s.total;
        return acc;
      }, {});

      const formattedData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
      setChartData(formattedData.slice(-7)); // Last 7 days
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-gray-950 min-h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Business Overview</h1>
          <p className="text-gray-500">Real-time performance metrics from your local SQLite.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={async () => {
              setIsSyncing(true);
              const result = await syncService.syncSales();
              setIsSyncing(false);
              if (result.success) alert(`Synced ${result.count} sales to cloud!`);
              else alert('Sync failed. Is the FastAPI server running?');
            }}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync to Cloud'}
          </button>
          <div className="text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl flex items-center">
            Live Sync Ready
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<DollarSign/>} label="Today's Sales" value={`$${stats.todaySales.toFixed(2)}`} trend="+15%" color="blue" />
        <StatCard icon={<ShoppingBag/>} label="Total Orders" value={stats.totalOrders.toString()} trend="+5%" color="purple" />
        <StatCard icon={<Users/>} label="Customers" value={stats.activeCustomers.toString()} trend="+2%" color="green" />
        <StatCard icon={<TrendingUp/>} label="Growth" value={`${stats.growth}%`} trend="+0.5%" color="orange" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Sales Revenue (Last 7 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Transaction Volume</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={4} dot={{r: 6, fill: '#8b5cf6'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }: any) {
  const colors: any = {
    blue: 'bg-blue-500 shadow-blue-500/20',
    purple: 'bg-purple-500 shadow-purple-500/20',
    green: 'bg-green-500 shadow-green-500/20',
    orange: 'bg-orange-500 shadow-orange-500/20',
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-black">{value}</div>
        <div className="text-xs font-bold text-green-500">{trend} <span className="text-gray-400 font-normal">this month</span></div>
      </div>
    </div>
  );
}
