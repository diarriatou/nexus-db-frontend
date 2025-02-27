import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Administration
        </h2>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-1 rounded-full hover:bg-gray-100">
            <Bell className="w-6 h-6 text-gray-600" />
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Admin</span>
            <User className="w-8 h-8 text-gray-600" />
            <button className="p-1 rounded-full hover:bg-gray-100">
              <LogOut className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}