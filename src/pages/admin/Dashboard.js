import React from 'react';
import { Database, Users, Activity, HardDrive } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Database className="h-12 w-12 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Bases de données</h3>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-12 w-12 text-green-500" />
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Utilisateurs</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-12 w-12 text-yellow-500" />
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Performance</h3>
              <p className="text-2xl font-bold">98%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <HardDrive className="h-12 w-12 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Sauvegardes</h3>
              <p className="text-2xl font-bold">24/24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Activité Récente</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-gray-600">Sauvegarde MySQL réussie</span>
            <span className="ml-auto text-sm text-gray-500">Il y a 5min</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-gray-600">Nouvel utilisateur MongoDB ajouté</span>
            <span className="ml-auto text-sm text-gray-500">Il y a 15min</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            <span className="text-gray-600">Alerte performance Oracle</span>
            <span className="ml-auto text-sm text-gray-500">Il y a 30min</span>
          </div>
        </div>
      </div>
    </div>
  );
}
