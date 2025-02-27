import React from 'react';
import { BarChart2, Activity, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function Monitoring() {
  // Données exemple pour le graphique
  const performanceData = [
    { time: '00:00', oracle: 65, mysql: 68, mongodb: 72 },
    { time: '04:00', oracle: 70, mysql: 72, mongodb: 75 },
    { time: '08:00', oracle: 75, mysql: 80, mongodb: 78 },
    { time: '12:00', oracle: 85, mysql: 85, mongodb: 82 },
    { time: '16:00', oracle: 82, mysql: 88, mongodb: 85 },
    { time: '20:00', oracle: 78, mysql: 82, mongodb: 80 },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitoring des Performances</h1>

      {/* Métriques temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-gray-500">CPU Usage</p>
              <p className="text-2xl font-bold">45%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart2 className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-gray-500">Mémoire</p>
              <p className="text-2xl font-bold">2.4 GB</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-gray-500">Alertes</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique de performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Performance des Bases</h2>
        <LineChart width={800} height={300} data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="oracle" stroke="#2563eb" name="Oracle" />
          <Line type="monotone" dataKey="mysql" stroke="#16a34a" name="MySQL" />
          <Line type="monotone" dataKey="mongodb" stroke="#ca8a04" name="MongoDB" />
        </LineChart>
      </div>
    </div>
  );
}