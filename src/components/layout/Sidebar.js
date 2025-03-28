import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Database, 
  Users, 
  Settings, 
  BarChart2, 
  HardDrive,
  Menu, 
  ChevronLeft
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: Home, name: 'Dashboard' },
    { path: '/admin/databases', icon: Database, name: 'Bases de données' },
    { path: '/admin/users', icon: Users, name: 'Utilisateurs' },
    { path: '/admin/monitoring', icon: BarChart2, name: 'Surveillances' },
    { path: '/admin/backups', icon: HardDrive, name: 'Sauvegardes' },
    { path: '/admin/settings', icon: Settings, name: 'Paramètres' },
  ];

  return (
    <div className={`flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} bg-blue-800 transition-all duration-300`}>
      {/* Header avec le bouton collapse */}
      <div className="flex items-center justify-between h-16 bg-blue-900 px-4">
        {!isCollapsed && (
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-600" />
            <span className="text-white text-2xl font-bold ml-2">UnityDB</span>
          </div>
        )}
        <button onClick={toggleSidebar} className="text-white">
          {isCollapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
        </button>
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
                  flex items-center px-4 py-2 mt-2 text-gray-100 rounded-lg transition-all duration-300
                  ${location.pathname === item.path 
                    ? 'bg-blue-700' 
                    : 'hover:bg-blue-700'}
                `}
              >
                <Icon className="w-6 h-6" />
                {!isCollapsed && <span className="mx-4">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
