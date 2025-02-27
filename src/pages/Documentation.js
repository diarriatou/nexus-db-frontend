import React from 'react';
import { Book, Database, HardDrive, BarChart2 } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête Documentation */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation UnityDBPro</h1>
          <p className="text-xl text-gray-600">Guide complet d'utilisation de la plateforme</p>
        </div>

        {/* Sections de Documentation */}
        <div className="grid grid-cols-1 gap-8">
          {/* Démarrage Rapide */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Book className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Démarrage Rapide</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-600">Pour commencer à utiliser UnityDBPro :</p>
              <ol className="list-decimal pl-5 mt-4 space-y-2">
                <li>Connectez-vous avec vos identifiants</li>
                <li>Configurez vos premières connexions aux bases de données</li>
                <li>Commencez à gérer vos bases depuis le dashboard</li>
              </ol>
            </div>
          </div>

          {/* Gestion des Bases de Données */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Bases de Données</h2>
            </div>
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold mt-4">Connexion aux Bases</h3>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Oracle : Configuration du tnsnames et des paramètres de connexion</li>
                <li>MySQL : Configuration du host, port et credentials</li>
                <li>MongoDB : Configuration des URI de connexion</li>
              </ul>
            </div>
          </div>

          {/* Monitoring */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <BarChart2 className="h-6 w-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Monitoring</h2>
            </div>
            <div className="prose max-w-none">
              <p>Le système de monitoring permet de :</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Suivre les performances en temps réel</li>
                <li>Configurer des alertes personnalisées</li>
                <li>Générer des rapports de performance</li>
              </ul>
            </div>
          </div>

          {/* Sauvegardes */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <HardDrive className="h-6 w-6 text-yellow-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Sauvegardes</h2>
            </div>
            <div className="prose max-w-none">
              <p>Gestion automatisée des sauvegardes :</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Configuration des planifications</li>
                <li>Gestion des rétentions</li>
                <li>Procédures de restauration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}