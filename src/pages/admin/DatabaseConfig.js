import React from 'react';
import { Plus, Settings } from 'lucide-react';

export default function DatabaseConfig() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuration des Bases de Données</h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-5 w-5 mr-2" />
          Nouvelle Connexion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Oracle Config */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Oracle</h2>
            <Settings className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Host:</span>
              <span>localhost</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Port:</span>
              <span>1521</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span>ORCL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600">Connected</span>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
              Tester la connexion
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">MySQL</h2>
            <Settings className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Host:</span>
              <span>localhost</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Port:</span>
              <span>1521</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span>MySQL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600">Connected</span>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
              Tester la connexion
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">MongoDB</h2>
            <Settings className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Host:</span>
              <span>localhost</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Port:</span>
              <span>1521</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span>MongoDB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="text-green-600">Connected</span>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
              Tester la connexion
            </button>
          </div>
        </div>

        {/* Répéter pour MySQL et MongoDB */}
      </div>
    </div>
  );
}