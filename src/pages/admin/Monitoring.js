import React, { useState, useEffect } from 'react';
import { BarChart2, Activity, AlertTriangle, Server, Database, Clock, RefreshCw, Filter, ChevronDown, Download } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../../api';

export default function Monitoring() {
  // État pour les données de performance
  const [performanceData, setPerformanceData] = useState([
    { time: '00:00', oracle: 65, mysql: 68, mongodb: 72, cpu: 42, memory: 2.1, disk: 58 },
    { time: '04:00', oracle: 70, mysql: 72, mongodb: 75, cpu: 45, memory: 2.3, disk: 60 },
    { time: '08:00', oracle: 75, mysql: 80, mongodb: 78, cpu: 58, memory: 2.8, disk: 65 },
    { time: '12:00', oracle: 85, mysql: 85, mongodb: 82, cpu: 72, memory: 3.2, disk: 70 },
    { time: '16:00', oracle: 82, mysql: 88, mongodb: 85, cpu: 65, memory: 2.9, disk: 68 },
    { time: '20:00', oracle: 78, mysql: 82, mongodb: 80, cpu: 52, memory: 2.6, disk: 62 },
  ]);

  // État pour les métriques en temps réel
  const [metrics, setMetrics] = useState({
    cpu: 45,
    memory: 2.4,
    alerts: 2,
    uptime: '21 jours',
    connections: 156,
    responseTime: 42
  });

  // État pour la période sélectionnée
  const [timeRange, setTimeRange] = useState('24h');
  
  // État pour le type de graphique
  const [chartType, setChartType] = useState('line');
  
  // État pour les bases de données sélectionnées
  const [selectedDatabases, setSelectedDatabases] = useState(['oracle', 'mysql', 'mongodb']);
  
  // État pour les alertes
  const [alerts, setAlerts] = useState([
    { id: 1, db: 'MySQL', type: 'Latence', message: 'Temps de réponse élevé', timestamp: '11/03/2025 14:32', severity: 'warning' },
    { id: 2, db: 'Oracle', type: 'Espace', message: 'Espace disque faible', timestamp: '11/03/2025 10:15', severity: 'critical' }
  ]);
  
  // État pour les chargements
  const [loading, setLoading] = useState(false);
  
  // État pour le menu déroulant des filtres
  const [showFilters, setShowFilters] = useState(false);

  // Nouveaux états pour les données du backend
  const [databases, setDatabases] = useState([]);
  const [, setDatabaseSummaries] = useState([]);


  // Fonction pour charger les données du tableau de bord
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Récupérer toutes les connexions de base de données
      const connectionsResponse = await API.get('/monitoring/connections');
      const connections = connectionsResponse.data;
      
      // Récupérer le résumé pour chaque base de données
      const summaries = await Promise.all(
        connections.map(conn => API.get(`/monitoring/summary/${conn.id}`))
      );
      
      // Récupérer les alertes actives
      const alertsResponse = await API.get('/monitoring/alerts?resolved=false&limit=10');
      
      // Mise à jour des états
      setDatabases(connections);
      setDatabaseSummaries(summaries.map(res => res.data));
      setAlerts(alertsResponse.data);
      
      // Mise à jour des métriques globales
      updateGlobalMetrics(summaries.map(res => res.data));
      
      // Charger les métriques historiques pour le graphique
      if (connections.length > 0) {
        await loadHistoricalMetrics(connections.map(conn => conn.id), timeRange);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour mettre à jour les métriques globales
  const updateGlobalMetrics = (summaries) => {
    // Calculer les moyennes et agréger les données
    const totalAlerts = summaries.reduce((sum, s) => sum + s.active_alerts, 0);
    const avgCpu = summaries.reduce((sum, s) => sum + (s.latest_metrics?.cpu_usage || 0), 0) / summaries.length;
    const avgMemory = summaries.reduce((sum, s) => sum + (s.latest_metrics?.memory_usage || 0), 0) / summaries.length;
    const totalConnections = summaries.reduce((sum, s) => sum + (s.latest_metrics?.connections_count || 0), 0);
    
    setMetrics({
      cpu: Math.round(avgCpu),
      memory: avgMemory.toFixed(1),
      alerts: totalAlerts,
      uptime: '21 jours', // À remplacer par des données réelles si disponibles
      connections: totalConnections,
      responseTime: 42 // À remplacer par des données réelles
    });
  };
  
  // Fonction pour charger les métriques historiques
  const loadHistoricalMetrics = async (databaseIds, timeRange) => {
    const startTime = getStartTimeFromRange(timeRange);
    
    try {
      const metricsPromises = databaseIds.map(dbId => 
        API.get(`/monitoring/metrics/${dbId}?start_time=${startTime.toISOString()}`)
      );
      
      const metricsResponses = await Promise.all(metricsPromises);
      
      // Transformer les données pour le graphique
      const formattedData = formatMetricsForChart(metricsResponses.map(res => res.data), databaseIds);
      setPerformanceData(formattedData);
    } catch (error) {
      console.error('Erreur lors du chargement des métriques :', error);
    }
  };
  
  // Fonction pour obtenir la date de début en fonction de la plage de temps
  const getStartTimeFromRange = (range) => {
    const now = new Date();
    switch(range) {
      case '6h': return new Date(now - 6 * 60 * 60 * 1000);
      case '24h': return new Date(now - 24 * 60 * 60 * 1000);
      case '7j': return new Date(now - 7 * 24 * 60 * 60 * 1000);
      case '30j': return new Date(now - 30 * 24 * 60 * 60 * 1000);
      default: return new Date(now - 24 * 60 * 60 * 1000);
    }
  };
  
  // Fonction pour formater les données de métriques
  const formatMetricsForChart = (metricsArrays, databaseIds) => {
    const dbNames = databases.reduce((acc, db) => {
      acc[db.id] = db.db_type.toLowerCase(); // Utiliser le type de BD (mysql, oracle, mongodb)
      return acc;
    }, {});
    
    // Créer une map des timestamps aux données
    const timeMap = {};
    
    // Pour chaque base de données
    metricsArrays.forEach((metrics, index) => {
      const dbId = databaseIds[index];
      const dbType = dbNames[dbId]; // oracle, mysql, mongodb
      
      // Pour chaque point de métrique
      metrics.forEach(metric => {
        const time = new Date(metric.timestamp).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
        
        if (!timeMap[time]) {
          timeMap[time] = { time };
        }
        
        // Ajouter les données CPU de cette BD
        timeMap[time][dbType] = metric.cpu_usage;
      });
    });
    
    // Convertir la map en tableau pour le graphique
    return Object.values(timeMap).sort((a, b) => {
      return new Date('1970/01/01 ' + a.time) - new Date('1970/01/01 ' + b.time);
    });
  };
  
  // Fonction pour déclencher une collecte manuelle
  const triggerManualCollection = async () => {
    setLoading(true);
    try {
      // Collecter les métriques pour toutes les BDs
      await Promise.all(databases.map(db => 
        API.post(`/monitoring/metrics/collect/${db.id}`)
      ));
      await loadDashboardData(); // Recharger les données après la collecte
    } catch (error) {
      console.error(`Erreur lors de la collecte des métriques:`, error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour résoudre une alerte
  const resolveAlert = async (alertId) => {
    try {
      await API.put(`/monitoring/alerts/${alertId}/resolve`);
      // Mettre à jour la liste des alertes
      const alertsResponse = await API.get('/monitoring/alerts?resolved=false&limit=10');
      setAlerts(alertsResponse.data);
    } catch (error) {
      console.error(`Erreur lors de la résolution de l'alerte ${alertId}:`, error);
    }
  };
  
  // Remplacer votre fonction refreshData existante
  const refreshData = () => {
    triggerManualCollection();
  };
  
  // Modifier votre fonction changeTimeRange pour utiliser l'API
  const changeTimeRange = (range) => {
    setTimeRange(range);
    setLoading(true);
    
    if (databases.length > 0) {
      loadHistoricalMetrics(databases.map(db => db.id), range)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };
  
  // Utiliser useEffect pour charger les données au démarrage
  useEffect(() => {
    loadDashboardData();
    
    // Mettre en place un intervalle pour rafraîchir les données
    const interval = setInterval(() => {
      loadDashboardData();
    }, 60000); // Rafraîchir toutes les minutes
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);
  // Simulation de mise à jour des données
  useEffect(() => {
    const interval = setInterval(() => {
      // Mise à jour des métriques en temps réel
      setMetrics(prev => ({
        ...prev,
        cpu: Math.floor(35 + Math.random() * 20),
        memory: (2 + Math.random() * 1.5).toFixed(1),
        connections: Math.floor(140 + Math.random() * 30)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Fonction pour changer la période
  // const changeTimeRange = (range) => {
  //   setTimeRange(range);
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 800);
  // };

  // Fonction pour exporter les données
  const exportData = () => {
    alert('Données exportées en CSV');
  };

  // Fonction pour obtenir la couleur en fonction de la valeur CPU
  const getCpuColorClass = (value) => {
    if (value < 50) return 'text-green-500';
    if (value < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Rendu des alertes avec icône de sévérité
  const renderAlertIcon = (severity) => {
    if (severity === 'critical') {
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  // Rendu du graphique en fonction du type sélectionné
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.7} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend />
              {selectedDatabases.includes('oracle') && 
                <Line type="monotone" dataKey="oracle" stroke="#2563eb" strokeWidth={2} name="Oracle" />}
              {selectedDatabases.includes('mysql') && 
                <Line type="monotone" dataKey="mysql" stroke="#16a34a" strokeWidth={2} name="MySQL" />}
              {selectedDatabases.includes('mongodb') && 
                <Line type="monotone" dataKey="mongodb" stroke="#ca8a04" strokeWidth={2} name="MongoDB" />}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.7} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend />
              {selectedDatabases.includes('oracle') && 
                <Area type="monotone" dataKey="oracle" fill="#2563eb" fillOpacity={0.3} stroke="#2563eb" strokeWidth={2} name="Oracle" />}
              {selectedDatabases.includes('mysql') && 
                <Area type="monotone" dataKey="mysql" fill="#16a34a" fillOpacity={0.3} stroke="#16a34a" strokeWidth={2} name="MySQL" />}
              {selectedDatabases.includes('mongodb') && 
                <Area type="monotone" dataKey="mongodb" fill="#ca8a04" fillOpacity={0.3} stroke="#ca8a04" strokeWidth={2} name="MongoDB" />}
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.7} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value}%`, '']}
              />
              <Legend />
              {selectedDatabases.includes('oracle') && 
                <Bar dataKey="oracle" fill="#2563eb" name="Oracle" />}
              {selectedDatabases.includes('mysql') && 
                <Bar dataKey="mysql" fill="#16a34a" name="MySQL" />}
              {selectedDatabases.includes('mongodb') && 
                <Bar dataKey="mongodb" fill="#ca8a04" name="MongoDB" />}
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  // Fonction pour gérer les sélections de DB
  const toggleDatabase = (db) => {
    if (selectedDatabases.includes(db)) {
      if (selectedDatabases.length > 1) { // Garder au moins une DB sélectionnée
        setSelectedDatabases(selectedDatabases.filter(d => d !== db));
      }
    } else {
      setSelectedDatabases([...selectedDatabases, db]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Monitoring des Performances</h1>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={refreshData}
            className={`flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors ${loading ? 'opacity-70 cursor-wait' : ''}`}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          
          <button 
            onClick={exportData}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Métriques temps réel - Première ligne */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Activity className={`h-6 w-6 ${getCpuColorClass(metrics.cpu)}`} />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">CPU Usage</p>
              <div className="flex items-baseline">
                <p className={`text-2xl font-bold ${getCpuColorClass(metrics.cpu)}`}>{metrics.cpu}%</p>
                <div className="ml-2 h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${metrics.cpu < 50 ? 'bg-green-500' : metrics.cpu < 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${metrics.cpu}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart2 className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Mémoire</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-green-500">{metrics.memory} GB</p>
                <p className="text-xs text-gray-500 ml-2">/ 8 GB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Alertes</p>
              <p className="text-2xl font-bold text-red-500">{metrics.alerts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métriques temps réel - Deuxième ligne */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Uptime</p>
              <p className="text-2xl font-bold text-purple-500">{metrics.uptime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Database className="h-6 w-6 text-indigo-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Connexions DB</p>
              <p className="text-2xl font-bold text-indigo-500">{metrics.connections}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Server className="h-6 w-6 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Temps de réponse</p>
              <p className="text-2xl font-bold text-orange-500">{metrics.responseTime} ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique de performance */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-lg font-semibold mb-2 md:mb-0">Performance des Bases de Données</h2>
          
          <div className="flex flex-wrap gap-2">
            {/* Sélection de période */}
            <div className="flex rounded-md shadow-sm">
              <button 
                onClick={() => changeTimeRange('6h')}
                className={`px-3 py-1 text-sm border border-r-0 rounded-l-md ${timeRange === '6h' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                6h
              </button>
              <button 
                onClick={() => changeTimeRange('24h')}
                className={`px-3 py-1 text-sm border border-r-0 ${timeRange === '24h' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                24h
              </button>
              <button 
                onClick={() => changeTimeRange('7j')}
                className={`px-3 py-1 text-sm border border-r-0 ${timeRange === '7j' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                7j
              </button>
              <button 
                onClick={() => changeTimeRange('30j')}
                className={`px-3 py-1 text-sm border rounded-r-md ${timeRange === '30j' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                30j
              </button>
            </div>
            
            {/* Type de graphique */}
            <div className="flex rounded-md shadow-sm">
              <button 
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-sm border border-r-0 rounded-l-md ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                Ligne
              </button>
              <button 
                onClick={() => setChartType('area')}
                className={`px-3 py-1 text-sm border border-r-0 ${chartType === 'area' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                Aire
              </button>
              <button 
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-sm border rounded-r-md ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
              >
                Barre
              </button>
            </div>
            
            {/* Filtres */}
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-1 text-sm bg-white border rounded-md shadow-sm"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filtres
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                  <div className="p-2">
                    <div className="font-medium text-gray-700 mb-2">Bases de données</div>
                    <div className="space-y-1">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedDatabases.includes('oracle')} 
                          onChange={() => toggleDatabase('oracle')}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Oracle</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedDatabases.includes('mysql')} 
                          onChange={() => toggleDatabase('mysql')}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">MySQL</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedDatabases.includes('mongodb')} 
                          onChange={() => toggleDatabase('mongodb')}
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">MongoDB</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Graphique */}
        <div className={`${loading ? 'opacity-50' : ''}`}>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            renderChart()
          )}
        </div>
      </div>

      {/* Alertes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Alertes Récentes</h2>
        </div>
        <div className="divide-y">
          {alerts.length > 0 ? (
            alerts.map(alert => (
              <div key={alert.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start">
                  {renderAlertIcon(alert.severity)}
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <span className="font-medium">{alert.type} - {alert.db}</span>
                      <span className="text-sm text-gray-500">{alert.timestamp}</span>
                      <span className="text-sm text-gray-500">
                      {new Date(alert.timestamp).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-gray-700">{alert.message}</p>
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="mt-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Résoudre
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucune alerte récente
            </div>
          )}
        </div>
      </div>
    </div>
  );
}