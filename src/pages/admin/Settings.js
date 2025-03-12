import React, { useState } from 'react';
import { 
  Shield, Moon, Globe, Bell, Lock, Activity, History, LogOut, Sun, 
  Mail, Key, RefreshCw, AlertTriangle, Settings,
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('security');
  const [darkMode, setDarkMode] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [passwordPolicy] = useState({
    minLength: 10,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecial: true,
    expiryDays: 90
  });
  const [notificationSettings, setNotificationSettings] = useState({
    securityAlerts: true,
    loginAttempts: true,
    systemUpdates: true,
    emailNotifications: true
  });
  const [language, setLanguage] = useState('Français');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleTwoFA = () => {
    setTwoFAEnabled(!twoFAEnabled);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panneau d'Administration</h1>
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      <div className="container mx-auto flex flex-col md:flex-row gap-6 p-6">
        {/* Sidebar Navigation */}
        <div className={`w-full md:w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4`}>
          <h2 className="text-lg font-semibold mb-4">Menu Principal</h2>
          <nav className="space-y-2">
            <button
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                activeTab === 'security' 
                  ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white' 
                  : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={18} /> Sécurité & Authentification
            </button>
            
            <button
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                activeTab === 'general' 
                  ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white' 
                  : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('general')}
            >
              <Settings size={18} /> Paramètres Généraux
            </button>
          </nav>
          
          <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-amber-500" />
              <h3 className="font-medium">Statut du système</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Tous les services actifs</span>
            </div>
            <div className="mt-2 text-xs">
              Dernière vérification: il y a 5 minutes
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sécurité & Authentification */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Sécurité & Authentification</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'}`}>
                  Tout est sécurisé
                </span>
              </div>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 space-y-4`}>
                {/* 2FA Configuration */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Key size={20} className="text-blue-500" />
                      <h3 className="text-lg font-semibold">Configuration 2FA</h3>
                    </div>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      L'authentification à deux facteurs protège contre les accès non autorisés
                    </p>
                    {twoFAEnabled && (
                      <div className="mt-3 flex flex-col gap-2">
                        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <div className="font-medium mb-1">Méthodes activées:</div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
                            <span>Application d'authentification</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
                            <span>SMS</span>
                          </div>
                        </div>
                        <div className="text-sm">Dernière authentification: il y a 2 jours</div>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={toggleTwoFA}
                    className={`px-4 py-2 ${twoFAEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg transition-colors`}
                  >
                    {twoFAEnabled ? 'Désactiver 2FA' : 'Activer 2FA'}
                  </button>
                </div>
                
                <div className={`h-px w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                
                {/* Active Session Management */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Activity size={20} className="text-orange-500" />
                      <h3 className="text-lg font-semibold">Gestion des sessions actives</h3>
                    </div>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      5 sessions actives • Dernière connexion: il y a 2 heures
                    </p>
                    
                    <div className="mt-3 space-y-2">
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Chrome / Windows</span>
                          <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Actuelle</span>
                        </div>
                        <div className="text-xs">IP: 192.168.1.105 • Connecté depuis: 2h</div>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Safari / macOS</span>
                          <button className="text-xs text-red-500">Déconnecter</button>
                        </div>
                        <div className="text-xs">IP: 87.23.45.128 • Connecté depuis: 1j</div>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Mobile App / iOS</span>
                          <button className="text-xs text-red-500">Déconnecter</button>
                        </div>
                        <div className="text-xs">IP: 91.178.55.23 • Connecté depuis: 3j</div>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    <div className="flex items-center gap-2">
                      <LogOut size={16} />
                      <span>Déconnecter tout</span>
                    </div>
                  </button>
                </div>
                
                <div className={`h-px w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                
                {/* Login History */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <History size={20} className="text-purple-500" />
                      <h3 className="text-lg font-semibold">Historique des connexions</h3>
                    </div>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      3 tentatives de connexion échouées détectées cette semaine
                    </p>
                    
                    <div className="mt-3 space-y-2">
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 border-green-700' : 'bg-gray-100 border-green-500'} border-l-4`}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Connexion réussie</span>
                          <span className="text-xs">11/03 - 09:45</span>
                        </div>
                        <div className="text-xs">IP: 192.168.1.105 • Chrome / Windows</div>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 border-red-700' : 'bg-gray-100 border-red-500'} border-l-4`}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Échec de connexion</span>
                          <span className="text-xs">10/03 - 18:22</span>
                        </div>
                        <div className="text-xs">IP: 45.89.123.77 • Firefox / Linux</div>
                        <div className="text-xs mt-1">Raison: Mot de passe incorrect</div>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 border-green-700' : 'bg-gray-100 border-green-500'} border-l-4`}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Connexion réussie</span>
                          <span className="text-xs">09/03 - 14:15</span>
                        </div>
                        <div className="text-xs">IP: 87.23.45.128 • Safari / macOS</div>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Historique complet
                  </button>
                </div>

                <div className={`h-px w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                
                {/* Password Policy */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Lock size={20} className="text-indigo-500" />
                      <h3 className="text-lg font-semibold">Politique de mot de passe</h3>
                    </div>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Paramètres de sécurité pour les mots de passe
                    </p>
                    
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="text-sm font-medium mb-1">Exigences actuelles:</div>
                        <ul className="text-xs space-y-1">
                          <li className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
                            <span>Minimum {passwordPolicy.minLength} caractères</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
                            <span>Au moins une majuscule</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
                            <span>Au moins un chiffre</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-green-400' : 'bg-green-500'}`}></div>
                            <span>Au moins un caractère spécial</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="text-sm font-medium mb-1">Paramètres d'expiration:</div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs">Expiration tous les:</span>
                          <span className="font-medium">{passwordPolicy.expiryDays} jours</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Historique des mots de passe:</span>
                          <span className="font-medium">5 derniers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Modifier
                  </button>
                </div>
                
                <div className={`h-px w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                
                {/* Security Audit */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <RefreshCw size={20} className="text-emerald-500" />
                      <h3 className="text-lg font-semibold">Audit de sécurité</h3>
                    </div>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Dernière vérification complète: il y a 7 jours
                    </p>
                    
                    <div className="mt-3 p-3 rounded-lg bg-green-100 border border-green-200 text-green-800">
                      <div className="flex items-center gap-2">
                        <Shield size={16} />
                        <span className="font-medium">Aucun problème de sécurité critique détecté</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                    Lancer un audit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paramètres Généraux */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Paramètres Généraux</h2>

              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 space-y-4`}>
                            
                {/* Language Setting */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Globe size={20} className="text-green-500" />
                      <h3 className="text-lg font-semibold">Langue</h3>
                    </div>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Actuellement: {language}
                    </p>
                    
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-lg">
                      {['Français', 'English', 'Español', 'Deutsch'].map((lang) => (
                        <div 
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${
                            language === lang 
                              ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 border border-blue-300' 
                              : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {lang}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={`h-px w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                
                {/* Notifications */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bell size={20} className="text-red-500" />
                      <h3 className="text-lg font-semibold">Notifications</h3>
                    </div>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Configurez comment et quand recevoir des alertes
                    </p>
                    
                    <div className="mt-3 space-y-3 max-w-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield size={16} className="text-red-500" />
                          <span>Alertes de sécurité</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="securityToggle" 
                            checked={notificationSettings.securityAlerts}
                            onChange={() => setNotificationSettings({...notificationSettings, securityAlerts: !notificationSettings.securityAlerts})}
                            className="sr-only"
                          />
                          <label 
                            htmlFor="securityToggle" 
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.securityAlerts ? 'bg-blue-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}
                          >
                            <span 
                              className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                                notificationSettings.securityAlerts ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <LogOut size={16} className="text-orange-500" />
                          <span>Tentatives de connexion</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="loginToggle" 
                            checked={notificationSettings.loginAttempts}
                            onChange={() => setNotificationSettings({...notificationSettings, loginAttempts: !notificationSettings.loginAttempts})}
                            className="sr-only"
                          />
                          <label 
                            htmlFor="loginToggle" 
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.loginAttempts ? 'bg-blue-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}
                          >
                            <span 
                              className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                                notificationSettings.loginAttempts ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RefreshCw size={16} className="text-blue-500" />
                          <span>Mises à jour système</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="updatesToggle" 
                            checked={notificationSettings.systemUpdates}
                            onChange={() => setNotificationSettings({...notificationSettings, systemUpdates: !notificationSettings.systemUpdates})}
                            className="sr-only"
                          />
                          <label 
                            htmlFor="updatesToggle" 
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.systemUpdates ? 'bg-blue-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}
                          >
                            <span 
                              className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                                notificationSettings.systemUpdates ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-green-500" />
                          <span>Notifications par e-mail</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                          <input 
                            type="checkbox" 
                            id="emailToggle" 
                            checked={notificationSettings.emailNotifications}
                            onChange={() => setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications})}
                            className="sr-only"
                          />
                          <label 
                            htmlFor="emailToggle" 
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                              notificationSettings.emailNotifications ? 'bg-blue-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}
                              >
                                <span 
                                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                                    notificationSettings.emailNotifications ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                ></span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Sauvegarder
                      </button>
                    </div>                    
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }