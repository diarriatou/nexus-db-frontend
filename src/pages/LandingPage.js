import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Shield, BarChart2, ArrowRight, Terminal, Server } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">UnityDB</span>
            </div>
            <div className="flex items-center space-x-4">
            <button 
  onClick={() => navigate('/documentation')} 
  className="text-gray-600 hover:text-gray-900"
>
  Documentation
</button>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Connexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-8 md:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Gérez vos bases de données</span>
              <span className="block text-blue-600">en toute simplicité</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Une plateforme unique pour administrer, monitorer et Sauvegarder vos bases de données Oracle, MySQL et MongoDB.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
              >
                Commencer maintenant <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Oracle */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-20 w-20 rounded-md bg-blue-500 text-white mx-auto">
                <Server className="h-10 w-10" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 text-center">Oracle</h3>
              <p className="mt-2 text-gray-600 text-center">
                Gestion optimisée des bases Oracle avec monitoring avancé et backup automatisé.
              </p>
            </div>

            {/* MySQL */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-20 w-20 rounded-md bg-green-500 text-white mx-auto">
                <Terminal className="h-10 w-10" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 text-center">MySQL</h3>
              <p className="mt-2 text-gray-600 text-center">
                Administration simplifiée de vos bases MySQL avec des outils intuitifs.
              </p>
            </div>

            {/* MongoDB */}
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center h-20 w-20 rounded-md bg-yellow-500 text-white mx-auto">
                <Database className="h-10 w-10" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 text-center">MongoDB</h3>
              <p className="mt-2 text-gray-600 text-center">
                Gestion efficace de vos bases MongoDB avec analyses en temps réel.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Nos Services
          </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="flex justify-center">
              <Database className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              Administration Unifiée
            </h3>
            <p className="mt-2 text-gray-600">
              Interface unique pour gérer toutes vos bases de données.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center">
              <BarChart2 className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              Monitoring Temps Réel
            </h3>
            <p className="mt-2 text-gray-600">
              Surveillance continue des performances et alertes instantanées.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              Sauvegarde et Restauration
            </h3>
            <p className="mt-2 text-gray-600">
              Sauvegarde automatisée et restauration rapide pour garantir la sécurité et l'intégrité de vos données.
            </p>
          </div>
            </div>
          </div>
        </div>

        {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">© 2024 UnityDB. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}