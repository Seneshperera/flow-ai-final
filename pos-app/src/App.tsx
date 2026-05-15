import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import POS from './pages/POS';
import Inventory from './pages/Inventory';
import Dashboard from './pages/Dashboard';

// Placeholder Pages
const Automations = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Automations</h1><p className="text-gray-500">Trigger-based workflows.</p></div>;
const Customers = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Customers & Dues</h1><p className="text-gray-500">Customer profiles and due tracking.</p></div>;
const Settings = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Settings</h1><p className="text-gray-500">App configuration and hardware setup.</p></div>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/pos" replace /> },
      { path: "pos", element: <POS /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "inventory", element: <Inventory /> },
      { path: "automations", element: <Automations /> },
      { path: "customers", element: <Customers /> },
      { path: "settings", element: <Settings /> },
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
