import React from 'react';
import { HardDrive, Calendar} from 'lucide-react';

export default function BackupsManagement() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Sauvegardes</h1>
        <div className="flex space-x-4">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Calendar className="h-5 w-5 mr-2" />
            Planifier
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <HardDrive className="h-5 w-5 mr-2" />
            Backup Manuel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sauvegardes Planifiées</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left">Base de données</th>
                <th className="text-left">Fréquence</th>
                <th className="text-left">Dernier backup</th>
                <th className="text-left">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Exemple de sauvegarde */}
              <tr>
                <td className="py-3">Oracle Production</td>
                <td>Quotidien - 00:00</td>
                <td>24/11/2024 00:00</td>
                <td>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Succès
                  </span>
                </td>
                <td className="text-right">
                  <button className="text-blue-600 hover:text-blue-900">Restaurer</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}