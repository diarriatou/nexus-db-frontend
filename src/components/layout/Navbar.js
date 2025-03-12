import React, { useState } from 'react';
import { Bell, User, LogOut, ChevronDown, Settings, UserPlus, Shield, Menu } from 'lucide-react';

export default function Navbar() {
  // États pour gérer les dropdowns
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Simulons quelques notifications
  const notifications = [
    { id: 1, text: "Nouvel utilisateur inscrit", time: "Il y a 5 min" },
    { id: 2, text: "Mise à jour système disponible", time: "Il y a 30 min" },
    { id: 3, text: "Nouvelle demande d'accès", time: "Il y a 2 heures" }
  ];

  // Fermer les menus quand on clique ailleurs
  const closeMenus = () => {
    setNotificationsOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="bg-white shadow relative z-10 w-full">
      <div className="w-full">
        <div className="flex justify-between items-center py-4 px-2">
          {/* Logo et titre */}
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">
              Administration
            </h2>
            
            {/* Menu mobile */}
            <button 
              className="sm:hidden ml-4 p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Actions - version desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              {/* Dropdown notifications */}
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-2 px-4 bg-gray-50 border-b flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-800">Tout marquer comme lu</button>
                  </div>
                  <div className="py-1 max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900">{notif.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm text-gray-500">Aucune notification</p>
                    )}
                  </div>
                  <div className="py-2 px-4 bg-gray-50 border-t">
                    <a href="#" className="text-xs text-blue-600 hover:text-blue-800">Voir toutes les notifications</a>
                  </div>
                </div>
              )}
            </div>

            {/* Profil */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">Admin</span>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                    <User className="w-5 h-5" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </button>
              
              {/* Dropdown profil */}
              {profileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <a href="#" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="w-4 h-4 mr-2" /> Mon profil
                    </a>
                    <a href="#" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="w-4 h-4 mr-2" /> Paramètres
                    </a>
                    <a href="#" className="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <UserPlus className="w-4 h-4 mr-2" /> Gestion utilisateurs
                    </a>
                    <hr className="my-1" />
                    <a href="#" className="flex px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      <LogOut className="w-4 h-4 mr-2" /> Déconnexion
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-3 border-t border-gray-200">
            <div className="space-y-1">
              <button className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-gray-500" />
                  <span>Notifications</span>
                </div>
                {notifications.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              
              <a href="#" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                <span>Profil</span>
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100">
                <Settings className="w-5 h-5 mr-2 text-gray-500" />
                <span>Paramètres</span>
              </a>
              
              <a href="#" className="flex items-center px-3 py-2 text-base font-medium text-red-600 rounded-md hover:bg-gray-100">
                <LogOut className="w-5 h-5 mr-2" />
                <span>Déconnexion</span>
              </a>
            </div>
          </div>
        )}
      </div>
      
      {/* Click outside handler */}
      {(notificationsOpen || profileOpen) && (
        <div className="fixed inset-0 z-0" onClick={closeMenus}></div>
      )}
    </header>
  );
}