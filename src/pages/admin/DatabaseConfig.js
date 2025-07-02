import React, { useState, useEffect } from 'react';
import { Plus, Settings, AlertCircle, Check, Database, X, Save, Search, RefreshCw } from 'lucide-react';
import API from '../../api';

export default function DatabaseConfig() {
  // État initial des bases de données
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // État pour gérer les tests de connexion
  const [testing, setTesting] = useState(null);
  
  // État pour gérer le mode d'édition
  const [editMode, setEditMode] = useState(null);
  
  // États pour les modales
  const [showNewForm, setShowNewForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // État pour le filtre
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 3306,
    database_name: '',
    username: '',
    password: '',
    db_type: 'mysql',
    description: ''
  });

  // Charger les bases de données au démarrage
  useEffect(() => {
    fetchDatabases();
  }, []);

  // Fonction pour récupérer les bases de données depuis l'API
  const fetchDatabases = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/users/databases');
      const formattedDatabases = response.data.map(db => ({
        id: db.id,
        name: db.name,
        host: db.host,
        port: db.port,
        database: db.database_name,
        username: db.username,
        password: '••••••••',
        status: db.is_active ? 'connected' : 'disconnected',
        lastChecked: new Date(db.updated_at).toLocaleString('fr-FR'),
        type: db.db_type,
        favorite: false,
        description: db.description
      }));
      setDatabases(formattedDatabases);
    } catch (err) {
      console.error('Erreur lors de la récupération des bases de données:', err);
      setError('Impossible de charger les bases de données');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour pré-remplir le port selon le type de base de données
  useEffect(() => {
    if (!editMode && (!formData.port || [3306, 1521, 5432, 27017, 1433].includes(formData.port))) {
      const portDefaults = {
        mysql: 3306,
        postgresql: 5432,
        oracle: 1521,
        mongodb: 27017,
        sqlserver: 1433
      };
      
      if (portDefaults[formData.db_type]) {
        setFormData(prev => ({ ...prev, port: portDefaults[formData.db_type] }));
      }
    }
  }, [editMode, formData.db_type, formData.port]);

  // Tester une connexion
  const testConnection = async (id) => {
    setTesting(id);
    try {
      // Appel API pour tester la connexion
      await API.post(`/api/monitoring/connections/${id}/test`);
      
      // Mettre à jour le statut
      setDatabases(databases.map(db => {
        if (db.id === id) {
          return {
            ...db,
            status: 'connected',
            lastChecked: new Date().toLocaleString('fr-FR')
          };
        }
        return db;
      }));
    } catch (err) {
      console.error('Erreur lors du test de connexion:', err);
      setDatabases(databases.map(db => {
        if (db.id === id) {
          return {
            ...db,
            status: 'disconnected',
            lastChecked: new Date().toLocaleString('fr-FR')
          };
        }
        return db;
      }));
    } finally {
      setTesting(null);
    }
  };

  // Activer le mode d'édition pour une connexion
  const toggleEditMode = (id) => {
    if (editMode === id) {
      setEditMode(null);
    } else {
      const db = databases.find(db => db.id === id);
      setFormData({
        name: db.name,
        host: db.host,
        port: db.port,
        database_name: db.database,
        username: db.username,
        password: '',
        db_type: db.type || 'mysql',
        description: db.description || ''
      });
      setEditMode(id);
    }
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  // Sauvegarder les modifications d'une connexion existante
  const saveChanges = async (id) => {
    try {
      const updateData = {
        name: formData.name,
        host: formData.host,
        port: parseInt(formData.port),
        database_name: formData.database_name,
        username: formData.username,
        db_type: formData.db_type,
        description: formData.description
      };

      // Inclure le mot de passe seulement s'il a été modifié
      if (formData.password) {
        updateData.password = formData.password;
      }

      await API.put(`/api/users/databases/${id}`, updateData);
      
      // Rafraîchir la liste
      await fetchDatabases();
      setEditMode(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      setError('Erreur lors de la mise à jour de la base de données');
    }
  };

  // Ajouter une nouvelle connexion
  const addNewConnection = async () => {
    try {
      const newDatabase = {
        name: formData.name,
        host: formData.host,
        port: parseInt(formData.port),
        database_name: formData.database_name,
        username: formData.username,
        password: formData.password,
        db_type: formData.db_type,
        description: formData.description
      };

      await API.post('/api/users/databases', newDatabase);
      
      // Rafraîchir la liste
      await fetchDatabases();
      setShowNewForm(false);
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        host: '',
        port: 3306,
        database_name: '',
        username: '',
        password: '',
        db_type: 'mysql',
        description: ''
      });
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError('Erreur lors de l\'ajout de la base de données');
    }
  };

  // Supprimer une connexion
  const deleteConnection = async (id) => {
    try {
      await API.delete(`/api/users/databases/${id}`);
      await fetchDatabases();
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de la base de données');
    }
  };

  // Basculer l'état favori d'une connexion
  const toggleFavorite = (id) => {
    setDatabases(databases.map(db => {
      if (db.id === id) {
        return { ...db, favorite: !db.favorite };
      }
      return db;
    }));
  };

  // Filtrer les bases de données
  const filteredDatabases = databases.filter(db => {
    const matchesSearch = db.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         db.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         db.database.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || db.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Trier les bases de données (favoris en premier, puis par nom)
  const sortedDatabases = [...filteredDatabases].sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return a.name.localeCompare(b.name);
  });

  // Afficher le badge de statut
  const getStatusBadge = (status) => {
    if (status === 'connected') {
      return <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm"><Check className="h-3 w-3 mr-1" /> Connecté</span>;
    }
    return <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm"><AlertCircle className="h-3 w-3 mr-1" /> Déconnecté</span>;
  };

  // Obtenir l'icône du type de base de données
  const getDatabaseTypeIcon = (type) => {
    // Ici on pourrait ajouter des icônes spécifiques pour chaque type
    return <Database className="h-5 w-5 text-blue-500 mr-2" />;
  };

  // Formulaire commun (pour la création et l'édition)
  const renderForm = (isEditing = false) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Production, Développement, etc."
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            id="type"
            name="db_type"
            value={formData.db_type}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mysql">MySQL</option>
            <option value="oracle">Oracle</option>

            <option value="mongodb">MongoDB</option>
          
          </select>
        </div>
        
        <div>
          <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-1">Host</label>
          <input
            type="text"
            id="host"
            name="host"
            value={formData.host}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="localhost ou adresse IP"
          />
        </div>
        
        <div>
          <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-1">Port</label>
          <input
            type="text"
            id="port"
            name="port"
            value={formData.port}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="3306, 5432, etc."
          />
        </div>
        
        <div>
          <label htmlFor="database" className="block text-sm font-medium text-gray-700 mb-1">Base de données</label>
          <input
            type="text"
            id="database"
            name="database_name"
            value={formData.database_name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom de la base"
          />
        </div>
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Utilisateur"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="favorite"
              checked={formData.favorite}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Marquer comme favori</span>
          </label>
        </div>
      </div>
    );
  };
  
  // Modal pour confirmation de suppression
  const DeleteConfirmationModal = ({ id, name, onCancel, onConfirm }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
          <p className="mb-6">Êtes-vous sûr de vouloir supprimer la connexion <strong>{name}</strong> ? Cette action est irréversible.</p>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Annuler
            </button>
            <button 
              onClick={() => onConfirm(id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header avec titre et filtres */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Configuration des Bases de Données</h1>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="connected">Connectés</option>
              <option value="disconnected">Déconnectés</option>
            </select>
            
            <button 
              onClick={() => {
                setShowNewForm(true);
                setFormData({
                  name: '',
                  host: '',
                  port: 3306,
                  database_name: '',
                  username: '',
                  password: '',
                  db_type: 'mysql',
                  description: ''
                });
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle Connexion
            </button>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Total des connexions</h3>
              <p className="text-2xl font-semibold">{databases.length}</p>
            </div>
            <Database className="h-8 w-8 text-blue-500" />
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Connexions actives</h3>
              <p className="text-2xl font-semibold">{databases.filter(db => db.status === 'connected').length}</p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500">Connexions inactives</h3>
              <p className="text-2xl font-semibold">{databases.filter(db => db.status === 'disconnected').length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Indicateur de chargement */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Chargement des bases de données...</span>
        </div>
      )}

      {/* Affichage d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal seulement si pas de chargement */}
      {!loading && (
        <>
          {/* Formulaire de nouvelle connexion (popup) */}
          {showNewForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow max-w-3xl w-full p-6 max-h-screen overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Nouvelle Connexion</h2>
                  <button 
                    onClick={() => setShowNewForm(false)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {renderForm()}
                
                <div className="flex justify-end space-x-2 mt-4">
                  <button 
                    onClick={() => setShowNewForm(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={addNewConnection}
                    disabled={!formData.name || !formData.host}
                    className={`px-4 py-2 rounded-md ${
                      !formData.name || !formData.host 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Modal de confirmation de suppression */}
          {showDeleteConfirm && (
            <DeleteConfirmationModal 
              id={showDeleteConfirm}
              name={databases.find(db => db.id === showDeleteConfirm)?.name}
              onCancel={() => setShowDeleteConfirm(null)}
              onConfirm={deleteConnection}
            />
          )}

          {/* Grille des connexions de base de données */}
          {sortedDatabases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedDatabases.map((db) => (
                <div key={db.id} className={`bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border-l-4 ${
                  db.favorite ? 'border-yellow-400' : 'border-transparent'
                }`}>
                  {/* Mode d'édition */}
                  {editMode === db.id ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Modifier la connexion</h2>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => saveChanges(db.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                            title="Sauvegarder"
                          >
                            <Save className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => toggleEditMode(db.id)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                            title="Annuler"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      {renderForm(true)}
                      
                      <div className="mt-4 flex justify-between">
                        <button 
                          onClick={() => setShowDeleteConfirm(db.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        >
                          Supprimer
                        </button>
                        <button 
                          onClick={() => testConnection(db.id)}
                          disabled={testing === db.id}
                          className={`px-4 py-2 rounded transition-colors flex items-center
                            ${testing === db.id 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${testing === db.id ? 'animate-spin' : ''}`} />
                          {testing === db.id ? 'Test en cours...' : 'Tester'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Mode affichage */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getDatabaseTypeIcon(db.type)}
                          <div>
                            <h3 className="font-semibold text-gray-900">{db.name}</h3>
                            <p className="text-sm text-gray-500">{db.host}:{db.port}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getStatusBadge(db.status)}
                          <button 
                            onClick={() => toggleFavorite(db.id)}
                            className={`p-1 rounded-full transition-colors ${
                              db.favorite 
                                ? 'text-yellow-500 hover:text-yellow-600' 
                                : 'text-gray-400 hover:text-yellow-500'
                            }`}
                          >
                            <svg className="h-4 w-4" fill={db.favorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Base de données:</span>
                          <span className="font-medium">{db.database}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Utilisateur:</span>
                          <span className="font-medium">{db.username}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Dernière vérification:</span>
                          <span className="font-medium">{db.lastChecked}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => toggleEditMode(db.id)}
                          className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Modifier
                        </button>
                        <button 
                          onClick={() => testConnection(db.id)}
                          disabled={testing === db.id}
                          className={`flex items-center px-3 py-1 text-sm rounded transition-colors
                            ${testing === db.id 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                              : 'text-green-600 hover:bg-green-100'}`}
                        >
                          <RefreshCw className={`h-4 w-4 mr-1 ${testing === db.id ? 'animate-spin' : ''}`} />
                          {testing === db.id ? 'Test...' : 'Tester'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune base de données configurée</h3>
              <p className="text-gray-500 mb-4">Commencez par ajouter votre première connexion de base de données.</p>
              <button 
                onClick={() => setShowNewForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Ajouter une connexion
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}