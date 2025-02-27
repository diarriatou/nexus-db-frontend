import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Database, 
  Users, 
  Settings, 
  BarChart2, 
  Shield,
  HardDrive
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: Home, name: 'Dashboard' },
    { path: '/admin/databases', icon: Database, name: 'Bases de données' },
    { path: '/admin/users', icon: Users, name: 'Utilisateurs' },
    { path: '/admin/monitoring', icon: BarChart2, name: 'Monitoring' },
    { path: '/admin/backups', icon: HardDrive, name: 'Sauvegardes' },
    { path: '/admin/security', icon: Shield, name: 'Sécurité' },
    { path: '/admin/settings', icon: Settings, name: 'Paramètres' },
  ];

  return (
    <div className="flex flex-col w-64 bg-blue-800">
      {/* Logo */}
      
      <div className="flex items-center justify-center h-16 bg-blue-900">
        <Database className="h-8 w-8 text-blue-600" />
        <span className="text-white text-2xl font-bold">NEXUS DB</span>
      </div>

      {/* Menu Items */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-2 mt-2 text-gray-100 rounded-lg
                  ${location.pathname === item.path 
                    ? 'bg-blue-700' 
                    : 'hover:bg-blue-700'}
                `}
              >
                <Icon className="w-6 h-6" />
                <span className="mx-4">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}