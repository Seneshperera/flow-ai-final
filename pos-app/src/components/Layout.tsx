import { useState, useEffect } from 'react';
import { Moon, Sun, ShoppingCart, PackageSearch, Users, Activity, Settings, Zap } from 'lucide-react';
import { Outlet, NavLink } from 'react-router-dom';

export default function Layout() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <ShoppingCart className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            FlowPilot <span className="text-blue-600 dark:text-blue-400">POS</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Cashier: Senesh P.
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar Nav */}
        <aside className="w-20 lg:w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col gap-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 lg:block hidden px-3">
            Sales
          </div>
          <NavButton to="/pos" icon={<ShoppingCart />} label="Point of Sale" />
          <NavButton to="/customers" icon={<Users />} label="Customers & Dues" />
          
          <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-6 mb-2 lg:block hidden px-3">
            Operations
          </div>
          <NavButton to="/dashboard" icon={<Activity />} label="Dashboard" />
          <NavButton to="/inventory" icon={<PackageSearch />} label="Inventory" />
          <NavButton to="/automations" icon={<Zap />} label="Automations" />
          
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
            <NavButton to="/settings" icon={<Settings />} label="Settings" />
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavButton({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `
        w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}
      `}
    >
      {icon}
      <span className="hidden lg:block font-medium">{label}</span>
    </NavLink>
  );
}
