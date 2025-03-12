import React, { useState, useEffect } from 'react';
import { Plus, Settings, AlertCircle, Check, Database, X, Save, Search, RefreshCw } from 'lucide-react';

export default function DatabaseConfig() {
  // État initial des bases de données
  const [databases, setDatabases] = useState([
    { 
      id: 1, 
      name: 'Oracle', 
      host: 'localhost', 
      port: '1521', 
      database: 'ORCL', 
      username: 'admin',
      password: '••••••••',
      status: 'connected',
      lastChecked: '11/03/2025 10:30',
      type: 'oracle',
      favorite: true
    },
    { 
      id: 2, 
      name: 'MySQL', 
      host: 'localhost', 
      port: '3306', 
      database: 'mysql_prod', 
      username: 'root',
      password: '••••••',
      status: 'connected',
      lastChecked: '11/03/2025 10:15',
      type: 'mysql',
      favorite: false
    },
    { 
      id: 3, 
      name: 'MongoDB', 
      host: 'localhost', 
      port: '27017', 
      database: 'mongo_dev', 
      username: 'mongouser',
      password: '•••••••••',
      status: 'disconnected',
      lastChecked: '10/03/2025 15:45',
      type: 'mongodb',
      favorite: false
    }
  ]);

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
    port: '',
    database: '',
    username: '',
    password: '',
    type: 'mysql',
    favorite: false
  });

  // Fonction pour pré-remplir le port selon le type de base de données
  useEffect(() => {
    // Si le formulaire est en mode d'ajout et le champ de port est vide ou a une valeur par défaut
    if (!editMode && (!formData.port || ['3306', '1521', '5432', '27017', '1433'].includes(formData.port))) {
      const portDefaults = {
        mysql: '3306',
        postgresql: '5432',
        oracle: '1521',
        mongodb: '27017',
        sqlserver: '1433'
      };
      
      if (portDefaults[formData.type]) {
        setFormData({ ...formData, port: portDefaults[formData.type] });
      }
    }
  }, [formData.type]);

  // Tester une connexion
  const testConnection = (id) => {
    setTesting(id);
    // Simuler un test de connexion
    setTimeout(() => {
      setDatabases(databases.map(db => {
        if (db.id === id) {
          const result = Math.random() > 0.2 ? 'connected' : 'disconnected';
          return {
            ...db,
            status: result,
            lastChecked: new Date().toLocaleString('fr-FR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          };
        }
        return db;
      }));
      setTesting(null);
    }, 1500);
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
        database: db.database,
        username: db.username,
        password: db.password,
        type: db.type || 'mysql',
        favorite: db.favorite || false
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
  const saveChanges = (id) => {
    setDatabases(databases.map(db => {
      if (db.id === id) {
        return {
          ...db,
          name: formData.name,
          host: formData.host,
          port: formData.port,
          database: formData.database,
          username: formData.username,
          password: formData.password,
          type: formData.type,
          favorite: formData.favorite,
          status: 'disconnected',
          lastChecked: 'Jamais (modifié)'
        };
      }
      return db;
    }));
    setEditMode(null);
  };

  // Ajouter une nouvelle connexion
  const addNewConnection = () => {
    const newId = Math.max(...databases.map(db => db.id), 0) + 1;
    const newConnection = {
      id: newId,
      name: formData.name,
      host: formData.host,
      port: formData.port,
      database: formData.database,
      username: formData.username,
      password: formData.password,
      type: formData.type,
      favorite: formData.favorite,
      status: 'disconnected',
      lastChecked: 'Jamais'
    };
    
    setDatabases([...databases, newConnection]);
    setShowNewForm(false);
    // Réinitialiser le formulaire
    setFormData({
      name: '',
      host: '',
      port: '',
      database: '',
      username: '',
      password: '',
      type: 'mysql',
      favorite: false
    });
  };

  // Supprimer une connexion
  const deleteConnection = (id) => {
    setDatabases(databases.filter(db => db.id !== id));
    setShowDeleteConfirm(null);
    if (editMode === id) {
      setEditMode(null);
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
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="oracle">Oracle</option>
            <option value="sqlserver">SQL Server</option>
            <option value="mongodb">MongoDB</option>
            <option value="other">Autre</option>
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
            name="database"
            value={formData.database}
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
                  port: '',
                  database: '',
                  username: '',
                  password: '',
                  type: 'mysql',
                  favorite: false
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
                    <div className="flex items-center">
                      {getDatabaseTypeIcon(db.type)}
                      <h2 className="text-lg font-semibold">{db.name}</h2>
                      {db.favorite && (
                        <span className="ml-2 text-yellow-500">★</span>
                      )}
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => toggleEditMode(db.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                        title="Modifier"
                      >
                        <Settings className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Host:</span>
                      <span className="font-medium">{db.host}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Port:</span>
                      <span className="font-medium">{db.port}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Database:</span>
                      <span className="font-medium">{db.database}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Utilisateur:</span>
                      <span className="font-medium">{db.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(db.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dernière vérification:</span>
                      <span className="text-sm">{db.lastChecked}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button 
                      onClick={() => toggleFavorite(db.id)}
                      className={`flex-1 px-2 py-2 rounded transition-colors flex items-center justify-center ${
                        db.favorite 
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={db.favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      {db.favorite ? "★ Favori" : "☆ Favori"}
                    </button>
                    <button 
                      onClick={() => testConnection(db.id)} 
                      disabled={testing === db.id}
                      className={`flex-1 px-2 py-2 rounded transition-colors flex items-center justify-center
                        ${testing === db.id 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                      {testing === db.id ? (
                        <>
                          <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                          Test...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Tester
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Aucune connexion trouvée</h2>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== 'all'
              ? "Aucune connexion ne correspond à vos critères de recherche."
              : "Ajoutez votre première connexion à une base de données."
            }
          </p>
          <button 
            onClick={() => {
              setShowNewForm(true);
              setSearchTerm('');
              setFilterStatus('all');
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Connexion
          </button>
        </div>
      )}
    </div>
  );
}