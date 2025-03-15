import React, { useState, useEffect, useMemo } from 'react';
import { Database, Users, Activity, HardDrive, Clock, AlertTriangle, CheckCircle, Server, FileText, GitCommit, Filter, RefreshCw, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  // États pour les fonctionnalités dynamiques
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTimeRange, setActiveTimeRange] = useState('7j');
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [refreshTime, setRefreshTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // Données simulées pour le graphique avec des valeurs différentes selon la période
  const performanceDataMap = useMemo(() => ({
    '7j': [
      { name: 'Lun', MySQL: 85, MongoDB: 90, Oracle: 78 },
      { name: 'Mar', MySQL: 88, MongoDB: 85, Oracle: 82 },
      { name: 'Mer', MySQL: 92, MongoDB: 88, Oracle: 85 },
      { name: 'Jeu', MySQL: 90, MongoDB: 92, Oracle: 81 },
      { name: 'Ven', MySQL: 95, MongoDB: 89, Oracle: 88 },
      { name: 'Sam', MySQL: 97, MongoDB: 91, Oracle: 90 },
      { name: 'Dim', MySQL: 94, MongoDB: 93, Oracle: 87 }
    ],
    '30j': [
      { name: 'S1', MySQL: 82, MongoDB: 88, Oracle: 75 },
      { name: 'S2', MySQL: 86, MongoDB: 90, Oracle: 79 },
      { name: 'S3', MySQL: 91, MongoDB: 87, Oracle: 83 },
      { name: 'S4', MySQL: 93, MongoDB: 93, Oracle: 85 }
    ],
    'trim': [
      { name: 'Jan', MySQL: 80, MongoDB: 85, Oracle: 70 },
      { name: 'Fév', MySQL: 85, MongoDB: 87, Oracle: 75 },
      { name: 'Mar', MySQL: 92, MongoDB: 90, Oracle: 85 },
      { name: 'Avr', MySQL: 90, MongoDB: 93, Oracle: 83 },
      { name: 'Mai', MySQL: 94, MongoDB: 91, Oracle: 88 },
      { name: 'Juin', MySQL: 97, MongoDB: 94, Oracle: 91 }
    ]
  }), []);
  
  const [performanceData, setPerformanceData] = useState(performanceDataMap['7j']);

  // Données simulées pour les logs système
  const systemLogsData = [
    { id: 1, type: 'error', message: 'Échec de connexion Oracle: timeout après 30s', time: 'Il y a 2min', db: 'Oracle', details: 'Erreur code #5021', timestamp: new Date(new Date().getTime() - 2 * 60000) },
    { id: 2, type: 'success', message: 'Sauvegarde MySQL complète (4.5GB)', time: 'Il y a 5min', db: 'MySQL', details: 'Temps d\'exécution: 4m28s', timestamp: new Date(new Date().getTime() - 5 * 60000) },
    { id: 3, type: 'success', message: 'Nouvel utilisateur créé: dev_team3', time: 'Il y a 15min', db: 'MongoDB', details: 'Modifié par: admin', timestamp: new Date(new Date().getTime() - 15 * 60000) },
    { id: 4, type: 'warning', message: 'Utilisation CPU élevée sur MongoDB', time: 'Il y a 22min', db: 'MongoDB', details: 'Pic à 86%', timestamp: new Date(new Date().getTime() - 22 * 60000) },
    { id: 5, type: 'error', message: 'Échec de mise à jour index MySQL', time: 'Il y a 45min', db: 'MySQL', details: 'Erreur code #1022', timestamp: new Date(new Date().getTime() - 45 * 60000) },
    { id: 6, type: 'success', message: 'Optimisation Oracle terminée', time: 'Il y a 50min', db: 'Oracle', details: '15% de performance gagnée', timestamp: new Date(new Date().getTime() - 50 * 60000) },
    { id: 7, type: 'info', message: 'Maintenance planifiée MongoDB', time: 'Il y a 1h', db: 'MongoDB', details: 'Prévu: demain 02h00', timestamp: new Date(new Date().getTime() - 60 * 60000) },
    { id: 8, type: 'warning', message: 'Espace disque MySQL < 20%', time: 'Il y a 1h20', db: 'MySQL', details: 'Action requise', timestamp: new Date(new Date().getTime() - 80 * 60000) },
  ];

  const [systemLogs, setSystemLogs] = useState(systemLogsData);
  
  // Filtrer les logs en fonction du filtre actif et de la recherche
  const filteredLogs = systemLogs
    .filter(log => activeFilter === 'all' || log.type === activeFilter)
    .filter(log => 
      searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.db.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // État pour les statuts des serveurs
  const [serverStatus, setServerStatus] = useState([
    { id: 1, name: 'MySQL Server', address: '192.168.1.101:3306', status: 'online', icon: Server, color: 'text-blue-600' },
    { id: 2, name: 'MongoDB Server', address: '192.168.1.102:27017', status: 'online', icon: Server, color: 'text-green-600' },
    { id: 3, name: 'Oracle Server', address: '192.168.1.103:1521', status: 'slow', icon: Server, color: 'text-yellow-600' },
    { id: 4, name: 'Backup Server', address: '192.168.1.104:22', status: 'online', icon: Server, color: 'text-purple-600' }
  ]);

  // Données simulées pour les insights
  const [insights] = useState([
    { title: 'Performance Oracle', value: '-12%', description: 'vs semaine dernière', trend: 'down', action: 'Vérifier requêtes SQL' },
    { title: 'Croissance MySQL', value: '+8%', description: 'Taux d\'insertion', trend: 'up', action: 'Optimiser indexation' },
    { title: 'Temps de réponse', value: '28ms', description: 'Moyenne journalière', trend: 'stable', action: 'Maintenir' },
    { title: 'Utilisation RAM', value: '68%', description: 'Pic quotidien', trend: 'up', action: 'Surveiller tendance' },
  ]);

  // Initialisation des alertes
  useEffect(() => {
    setAlerts([
      { id: 1, severity: 'high', title: 'Oracle: Latence élevée', description: 'Temps de réponse 200ms depuis 30min', type: 'error' },
      { id: 2, severity: 'medium', title: 'MySQL: Espace disque', description: '85% d\'utilisation, seuil à 90%', type: 'warning' }
    ]);
  }, []);

  // Simuler le chargement des données lors du changement de période
  useEffect(() => {
    if (activeTimeRange) {
      setLoading(true);
      // Simuler un délai réseau
      setTimeout(() => {
        setPerformanceData(performanceDataMap[activeTimeRange]);
        setLoading(false);
      }, 800);
    }
  }, [activeTimeRange, performanceDataMap]);

  // Fonction pour rafraîchir les données
  const refreshData = () => {
    setLoading(true);
    
    // Simuler la mise à jour avec un délai
    setTimeout(() => {
      // Mettre à jour le temps de la dernière actualisation
      setRefreshTime(new Date());
      
      // Simuler des changements aléatoires dans les statuts des serveurs
      setServerStatus(prevStatus => {
        const newStatus = [...prevStatus];
        const randomIndex = Math.floor(Math.random() * newStatus.length);
        const possibleStatus = ['online', 'slow', 'offline'];
        const newStatusValue = possibleStatus[Math.floor(Math.random() * possibleStatus.length)];
        
        newStatus[randomIndex] = {...newStatus[randomIndex], status: newStatusValue};
        return newStatus;
      });
      
      // Ajouter un nouveau log aléatoire
      const logTypes = ['error', 'warning', 'success', 'info'];
      const dbs = ['MySQL', 'MongoDB', 'Oracle'];
      const randomType = logTypes[Math.floor(Math.random() * logTypes.length)];
      const randomDB = dbs[Math.floor(Math.random() * dbs.length)];
      
      const newLog = {
        id: systemLogs.length + 1,
        type: randomType,
        message: `${randomType === 'error' ? 'Erreur' : randomType === 'warning' ? 'Alerte' : 'Action'} sur ${randomDB}`,
        time: 'À l\'instant',
        db: randomDB,
        details: `Généré à ${new Date().toLocaleTimeString()}`,
        timestamp: new Date()
      };
      
      setSystemLogs(prev => [newLog, ...prev.slice(0, 7)]);
      
      setLoading(false);
    }, 1000);
  };

  // Fonction pour résoudre une alerte
  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  // Fonction pour afficher les détails d'un log
  const toggleLogDetails = (logId) => {
    if (showDetails === logId) {
      setShowDetails(null);
    } else {
      setShowDetails(logId);
    }
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Header avec actions */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord des bases de données</h1>
          <p className="text-gray-600">Surveillance et gestion en temps réel</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <button 
            onClick={refreshData} 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <RefreshCw className="h-5 w-5 text-blue-600 animate-spin mr-3" />
            <span>Chargement des données...</span>
          </div>
        </div>
      )}

      {/* Statistiques Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Bases de données</h3>
              <p className="text-2xl font-bold text-gray-800">3</p>
              <span className="text-green-500 text-xs font-medium">+1 ce mois</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Utilisateurs</h3>
              <p className="text-2xl font-bold text-gray-800">12</p>
              <span className="text-green-500 text-xs font-medium">+3 cette semaine</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3">
              <Activity className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Performance</h3>
              <p className="text-2xl font-bold text-gray-800">98%</p>
              <span className="text-green-500 text-xs font-medium">+2% vs. dernier mois</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3">
              <HardDrive className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Sauvegardes</h3>
              <p className="text-2xl font-bold text-gray-800">24/24</p>
              <span className="text-blue-500 text-xs font-medium">100% réussies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Insights & Analyses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-gray-700 font-medium mb-2">{insight.title}</h3>
              <div className="flex items-center">
                <p className={`text-2xl font-bold ${
                  insight.trend === 'up' ? 'text-green-600' : 
                  insight.trend === 'down' ? 'text-red-600' : 
                  'text-blue-600'
                }`}>{insight.value}</p>
                {insight.trend === 'up' && <span className="ml-2 text-green-600">↑</span>}
                {insight.trend === 'down' && <span className="ml-2 text-red-600">↓</span>}
                {insight.trend === 'stable' && <span className="ml-2 text-blue-600">→</span>}
              </div>
              <p className="text-gray-500 text-sm mt-1">{insight.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 font-medium">Action recommandée:</p>
                <p className="text-sm text-blue-600 mt-1">{insight.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tableau de bord principal avec plusieurs panneaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Graphique de performance */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Performance des bases de données</h2>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 ${activeTimeRange === '7j' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'} rounded-lg text-sm font-medium`}
                onClick={() => setActiveTimeRange('7j')}
              >
                7 jours
              </button>
              <button 
                className={`px-3 py-1 ${activeTimeRange === '30j' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'} rounded-lg text-sm font-medium`}
                onClick={() => setActiveTimeRange('30j')}
              >
                30 jours
              </button>
              <button 
                className={`px-3 py-1 ${activeTimeRange === 'trim' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'} rounded-lg text-sm font-medium`}
                onClick={() => setActiveTimeRange('trim')}
              >
                Trimestre
              </button>
            </div>
          </div>
          
          {/* Line chart with Recharts */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="MySQL" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="MongoDB" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Oracle" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activité Récente avec statut serveur */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Statut Serveurs</h2>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                serverStatus.some(server => server.status === 'offline') ? 'bg-red-100 text-red-800' :
                serverStatus.some(server => server.status === 'slow') ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {serverStatus.some(server => server.status === 'offline') ? 'Problèmes détectés' :
                 serverStatus.some(server => server.status === 'slow') ? 'Performances réduites' :
                 'Tous opérationnels'}
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {serverStatus.map(server => (
                <div key={server.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <server.icon className={`h-5 w-5 ${server.color} mr-3`} />
                    <div>
                      <p className="text-gray-800 font-medium">{server.name}</p>
                      <p className="text-gray-500 text-xs">{server.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-2 ${
                      server.status === 'online' ? 'bg-green-500' :
                      server.status === 'slow' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-gray-600">
                      {server.status === 'online' ? 'En ligne' :
                       server.status === 'slow' ? 'Ralenti' :
                       'Hors ligne'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Dernière vérification:</span>
              <span className="text-gray-800 font-medium">{refreshTime.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logs système avec filtres */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-0">Logs Système</h2>
          <div className="flex items-center space-x-2 flex-wrap">
            <Filter className="h-4 w-4 text-gray-500 mr-1" />
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                activeFilter === 'all' ? 'bg-gray-200 text-gray-800' : 'text-gray-500'
              }`}
            >
              Tous
            </button>
            <button 
              onClick={() => setActiveFilter('error')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                activeFilter === 'error' ? 'bg-red-100 text-red-800' : 'text-gray-500'
              }`}
            >
              Erreurs
            </button>
            <button 
              onClick={() => setActiveFilter('warning')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                activeFilter === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-500'
              }`}
            >
              Alertes
            </button>
            <button 
              onClick={() => setActiveFilter('success')}
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                activeFilter === 'success' ? 'bg-green-100 text-green-800' : 'text-gray-500'
              }`}
            >
              Succès
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base de données</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr className={`hover:bg-gray-50 ${showDetails === log.id ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.type === 'error' && <span className="flex items-center"><AlertTriangle className="h-4 w-4 text-red-500 mr-1" /> <span className="text-red-600 text-sm font-medium">Erreur</span></span>}
                        {log.type === 'warning' && <span className="flex items-center"><AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" /> <span className="text-yellow-600 text-sm font-medium">Alerte</span></span>}
                        {log.type === 'success' && <span className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-1" /> <span className="text-green-600 text-sm font-medium">Succès</span></span>}
                        {log.type === 'info' && <span className="flex items-center"><FileText className="h-4 w-4 text-blue-500 mr-1" /> <span className="text-blue-600 text-sm font-medium">Info</span></span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{log.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          log.db === 'MySQL' ? 'bg-blue-100 text-blue-800' :
                          log.db === 'MongoDB' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.db}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{log.details}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          {log.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => toggleLogDetails(log.id)} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <span className="flex items-center">
                            {showDetails === log.id ? 'Masquer' : 'Détails'} <GitCommit className="h-3 w-3 ml-1" />
                          </span>
                        </button>
                      </td>
                    </tr>
                    {/* Panneau de détails extensible */}
                    {showDetails === log.id && (
                      <tr>
<td colSpan="6" className="px-6 py-4 bg-blue-50">
                          <div className="text-sm text-gray-700">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Informations détaillées</h4>
                                <p><span className="font-medium">Timestamp:</span> {log.timestamp.toLocaleString()}</p>
                                <p><span className="font-medium">ID:</span> {log.id}</p>
                                <p><span className="font-medium">Base de données:</span> {log.db}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Actions</h4>
                                <div className="space-y-2">
                                  <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                                    Examiner
                                  </button>
                                  <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 ml-2">
                                    Archiver
                                  </button>
                                  {log.type === 'error' && (
                                    <button className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200 ml-2">
                                      Résoudre
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    Aucun log ne correspond à vos critères de recherche
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Affichage de {filteredLogs.length} logs sur {systemLogs.length} au total
          </div>
          <button className="text-blue-600 text-sm hover:text-blue-800">Voir tous les logs →</button>
        </div>
      </div>

      {/* Alertes actuelles */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Alertes Actives</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-6 flex items-start justify-between">
                <div className="flex items-start">
                  {alert.type === 'error' && <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />}
                  {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />}
                  <div>
                    <h3 className="text-gray-800 font-medium">{alert.title}</h3>
                    <p className="text-gray-600 mt-1">{alert.description}</p>
                    <div className="mt-2 flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                        alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity === 'high' ? 'Haute priorité' :
                         alert.severity === 'medium' ? 'Priorité moyenne' :
                         'Faible priorité'}
                      </span>
                      <span className="text-gray-500 text-xs ml-3">
                        <Clock className="inline h-3 w-3 mr-1" />
                        Détectée il y a 30min
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm">
                    Examiner
                  </button>
                  <button 
                    onClick={() => resolveAlert(alert.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Résoudre
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer avec informations système */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-gray-500">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="mr-4">Version: 1.0</span>
            <span>Dernière actualisation: {refreshTime.toLocaleString()}</span>
          </div>
          <div className="flex space-x-4">
            <button className="text-blue-600 hover:text-blue-800">Documentation</button>
            <button className="text-blue-600 hover:text-blue-800">Support</button>
            <button className="text-blue-600 hover:text-blue-800">Paramètres avancés</button>
          </div>
        </div>
      </div>
    </div>
  );
}