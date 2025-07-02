import React, { useState, useEffect } from 'react';
import { HardDrive, Calendar, Settings, AlertTriangle, Clock, RefreshCw, Search, ChevronDown, CheckCircle, XCircle, Trash, Edit, X } from 'lucide-react';
import API from '../../api';

export default function BackupsManagement() {
  // États pour les onglets et les filtres
  const [activeTab, setActiveTab] = useState('scheduled');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les modales
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showManualBackupModal, setShowManualBackupModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  
  // État pour confirmation de suppression
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState(null);
  
  // États pour les données
  const [scheduledBackups, setScheduledBackups] = useState([]);
  const [manualBackups, setManualBackups] = useState([]);
  const [restoreHistory, setRestoreHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // États pour les formulaires
  const [newScheduledBackup, setNewScheduledBackup] = useState({
    name: '',
    frequency: 'daily',
    time: '00:00',
    days: [],
    retention: '30'
  });
  
  const [newManualBackup, setNewManualBackup] = useState({
    name: '',
    note: ''
  });
  
  const [restoreOptions, setRestoreOptions] = useState({
    targetEnvironment: 'production',
    restoreMethod: 'replace',
    notifyUsers: true
  });
  
  // Charger les données au démarrage
  useEffect(() => {
    fetchBackupData();
  }, []);

  // Fonction pour charger toutes les données de sauvegarde
  const fetchBackupData = async () => {
    setLoading(true);
    try {
      // Charger les plannings de sauvegarde
      const schedulesResponse = await API.get('/api/backups/schedules');
      setScheduledBackups(schedulesResponse.data.map(schedule => ({
        id: schedule.id,
        name: schedule.name,
        frequency: `${schedule.frequency} - ${schedule.backup_type}`,
        lastBackup: schedule.last_backup ? new Date(schedule.last_backup).toLocaleString('fr-FR') : 'Jamais',
        status: schedule.is_active ? 'success' : 'paused',
        size: schedule.last_size || '0 GB',
        retention: `${schedule.retention_days} jours`,
        database_id: schedule.database_id
      })));

      // Charger les sauvegardes manuelles
      const backupsResponse = await API.get('/api/backups/backups');
      setManualBackups(backupsResponse.data.map(backup => ({
        id: backup.id,
        name: backup.database_name || `Base ${backup.database_id}`,
        date: new Date(backup.started_at).toLocaleString('fr-FR'),
        user: backup.created_by || 'Système',
        status: backup.status,
        size: backup.size || '0 GB',
        note: backup.note || ''
      })));

      // Charger l'historique de restauration
      const restoreResponse = await API.get('/api/backups/restores');
      setRestoreHistory(restoreResponse.data.map(restore => ({
        id: restore.id,
        date: new Date(restore.restored_at).toLocaleString('fr-FR'),
        name: restore.database_name || `Base ${restore.database_id}`,
        backupDate: new Date(restore.backup_date).toLocaleDateString('fr-FR'),
        user: restore.restored_by || 'Système',
        status: restore.status,
        duration: restore.duration || 'N/A'
      })));

    } catch (err) {
      console.error('Erreur lors du chargement des données de sauvegarde:', err);
      setError('Impossible de charger les données de sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer un nouveau planning de sauvegarde
  const createBackupSchedule = async () => {
    try {
      await API.post('/api/backups/schedules', newScheduledBackup);
      await fetchBackupData();
      setShowScheduleModal(false);
      setNewScheduledBackup({
        name: '',
        frequency: 'daily',
        time: '00:00',
        days: [],
        retention: '30'
      });
    } catch (err) {
      console.error('Erreur lors de la création du planning:', err);
      setError('Erreur lors de la création du planning de sauvegarde');
    }
  };

  // Fonction pour lancer une sauvegarde manuelle
  const createManualBackup = async () => {
    try {
      await API.post('/api/backups/backups', newManualBackup);
      await fetchBackupData();
      setShowManualBackupModal(false);
      setNewManualBackup({
        name: '',
        note: ''
      });
    } catch (err) {
      console.error('Erreur lors de la création de la sauvegarde:', err);
      setError('Erreur lors de la création de la sauvegarde');
    }
  };

  // Fonction pour restaurer une sauvegarde
  const restoreBackup = async () => {
    try {
      await API.post(`/api/backups/backups/${selectedBackup.id}/restore`, restoreOptions);
      await fetchBackupData();
      setShowRestoreModal(false);
      setSelectedBackup(null);
      setRestoreOptions({
        targetEnvironment: 'production',
        restoreMethod: 'replace',
        notifyUsers: true
      });
    } catch (err) {
      console.error('Erreur lors de la restauration:', err);
      setError('Erreur lors de la restauration');
    }
  };
  
  // Fonctions de gestion des formulaires
  const handleScheduleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      let updatedDays = [...newScheduledBackup.days];
      if (checked) {
        updatedDays.push(value);
      } else {
        updatedDays = updatedDays.filter(day => day !== value);
      }
      setNewScheduledBackup({...newScheduledBackup, days: updatedDays});
    } else {
      setNewScheduledBackup({...newScheduledBackup, [name]: value});
    }
  };
  
  const handleManualBackupFormChange = (e) => {
    const { name, value } = e.target;
    setNewManualBackup({...newManualBackup, [name]: value});
  };
  
  const handleRestoreFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRestoreOptions({
      ...restoreOptions,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Fonctions d'action
  const submitScheduleForm = (e) => {
    e.preventDefault();
    createBackupSchedule();
  };
  
  const submitManualBackupForm = (e) => {
    e.preventDefault();
    createManualBackup();
  };
  
  const submitRestoreForm = (e) => {
    e.preventDefault();
    restoreBackup();
  };
  
  const handleDeleteBackup = (backup, type) => {
    setBackupToDelete({ backup, type });
    setShowDeleteConfirm(true);
  };
  
  const confirmDeleteBackup = () => {
    if (!backupToDelete) return;
    
    if (backupToDelete.type === 'scheduled') {
      setScheduledBackups(scheduledBackups.filter(b => b.id !== backupToDelete.backup.id));
    } else if (backupToDelete.type === 'manual') {
      setManualBackups(manualBackups.filter(b => b.id !== backupToDelete.backup.id));
    }
    
    setShowDeleteConfirm(false);
    setBackupToDelete(null);
  };
  
  const handleRestore = (backup) => {
    setSelectedBackup(backup);
    setShowRestoreModal(true);
  };
  
  // Logique de filtrage
  const getFilteredBackups = (backups) => {
    if (!backups) return [];
    
    // D'abord filtrer par terme de recherche
    let filtered = backups.filter(backup => 
      backup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (backup.note && backup.note.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Ensuite filtrer par statut
    if (activeFilter === 'success') {
      filtered = filtered.filter(backup => backup.status === 'success');
    } else if (activeFilter === 'issues') {
      filtered = filtered.filter(backup => backup.status === 'warning' || backup.status === 'error');
    }
    
    return filtered;
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'success':
        return (
          <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <CheckCircle className="h-3 w-3 mr-1" />
            Succès
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Attention
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            <XCircle className="h-3 w-3 mr-1" />
            Échec
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </span>
        );
      default:
        return (
          <span className="flex items-center px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            <Clock className="h-3 w-3 mr-1" />
            En cours
          </span>
        );
    }
  };
  
  // Fonction pour rendre les modales
  const renderScheduleModal = () => {
    if (!showScheduleModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Planifier une sauvegarde</h2>
            <button onClick={() => setShowScheduleModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={submitScheduleForm}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Base de données</label>
              <select 
                name="name" 
                value={newScheduledBackup.name} 
                onChange={handleScheduleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              >
                <option value="">Sélectionner une base de données</option>
                <option value="Oracle Production">Oracle Production</option>
                <option value="MySQL Applications">MySQL Applications</option>
                <option value="MongoDB Clients">MongoDB Clients</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence</label>
              <select 
                name="frequency" 
                value={newScheduledBackup.frequency} 
                onChange={handleScheduleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="daily">Quotidien</option>
                <option value="weekly">Hebdomadaire</option>
                <option value="monthly">Mensuel</option>
              </select>
            </div>
            
            {newScheduledBackup.frequency === 'weekly' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Jours</label>
                <div className="flex flex-wrap">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                    <label key={day} className="mr-4 mb-2 flex items-center">
                      <input 
                        type="checkbox" 
                        name="days" 
                        value={day} 
                        checked={newScheduledBackup.days.includes(day)}
                        onChange={handleScheduleFormChange}
                        className="mr-1"
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
              <input 
                type="time" 
                name="time" 
                value={newScheduledBackup.time} 
                onChange={handleScheduleFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rétention (jours)</label>
              <input 
                type="number" 
                name="retention" 
                value={newScheduledBackup.retention} 
                onChange={handleScheduleFormChange}
                min="1"
                max="365"
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg mr-2 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Planifier
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  const renderManualBackupModal = () => {
    if (!showManualBackupModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Sauvegarde Manuelle</h2>
            <button onClick={() => setShowManualBackupModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={submitManualBackupForm}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Base de données</label>
              <select 
                name="name" 
                value={newManualBackup.name} 
                onChange={handleManualBackupFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              >
                <option value="">Sélectionner une base de données</option>
                <option value="Oracle Production">Oracle Production</option>
                <option value="MySQL Applications">MySQL Applications</option>
                <option value="MongoDB Clients">MongoDB Clients</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Note (optionnel)</label>
              <textarea 
                name="note" 
                value={newManualBackup.note} 
                onChange={handleManualBackupFormChange}
                className="w-full border border-gray-300 rounded-lg p-2 h-24"
                placeholder="Raison de la sauvegarde manuelle..."
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowManualBackupModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg mr-2 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Lancer la sauvegarde
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  const renderRestoreModal = () => {
    if (!showRestoreModal || !selectedBackup) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Restaurer la sauvegarde</h2>
            <button onClick={() => setShowRestoreModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="font-medium">{selectedBackup.name}</p>
            <p className="text-sm text-gray-500">Date: {selectedBackup.lastBackup || selectedBackup.date}</p>
            <p className="text-sm text-gray-500">Taille: {selectedBackup.size}</p>
          </div>
          
          <form onSubmit={submitRestoreForm}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Environnement cible</label>
              <select 
                name="targetEnvironment" 
                value={restoreOptions.targetEnvironment} 
                onChange={handleRestoreFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="production">Production</option>
                <option value="staging">Pré-production</option>
                <option value="development">Développement</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de restauration</label>
              <select 
                name="restoreMethod" 
                value={restoreOptions.restoreMethod} 
                onChange={handleRestoreFormChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="replace">Remplacer la base existante</option>
                <option value="duplicate">Créer une copie</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="notifyUsers" 
                  checked={restoreOptions.notifyUsers} 
                  onChange={handleRestoreFormChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Notifier les utilisateurs</span>
              </label>
            </div>
            
            <div className="p-3 mb-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800 text-sm">
              <AlertTriangle className="h-4 w-4 inline-block mr-1" />
              Attention: La restauration peut entraîner une interruption de service. Assurez-vous d'avoir les autorisations nécessaires.
            </div>
            
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg mr-2 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirmer la restauration
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  const renderDeleteConfirmModal = () => {
    if (!showDeleteConfirm || !backupToDelete) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Confirmer la suppression</h2>
            <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="mb-6">
            Êtes-vous sûr de vouloir supprimer définitivement la sauvegarde <strong>{backupToDelete.backup.name}</strong> du {backupToDelete.backup.lastBackup || backupToDelete.backup.date} ?
          </p>
          
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg mr-2 text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="button"
              onClick={confirmDeleteBackup}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6 max-w-full mx-auto">
        {/* Header avec statistiques */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gestion des Sauvegardes</h1>
            <div className="flex space-x-4">
              <button 
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => setShowScheduleModal(true)}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Planifier
              </button>
              <button 
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowManualBackupModal(true)}
              >
                <HardDrive className="h-5 w-5 mr-2" />
                Backup Manuel
              </button>
              <button 
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowSettingsModal(true)}
              >
                <Settings className="h-5 w-5 mr-2" />
                Paramètres
              </button>
            </div>
          </div>
          
          {/* Indicateur de chargement */}
          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Chargement des données de sauvegarde...</span>
            </div>
          )}

          {/* Affichage d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
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
          
          {/* Dashboard stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <HardDrive className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Espace utilisé</p>
                <p className="text-xl font-bold">14.8 GB</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sauvegardes réussies</p>
                <p className="text-xl font-bold">128 / 135</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Prochaine sauvegarde</p>
                <p className="text-xl font-bold">00:00</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex items-center">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <RefreshCw className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Restaurations</p>
                <p className="text-xl font-bold">7 ce mois</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        {!loading && !error && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'scheduled' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('scheduled')}
              >
                Sauvegardes Planifiées
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'manual' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('manual')}
              >
                Sauvegardes Manuelles
              </button>
              <button
                className={`px-6 py-4 text-sm font-medium ${activeTab === 'restore' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('restore')}
              >
                Historique des restaurations
              </button>
            </nav>
          </div>
          
          {/* Search and filter */}
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between">
            <div className="relative w-64 mb-2 sm:mb-0">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <span>Filtrer: {activeFilter === 'all' ? 'Tous' : activeFilter === 'success' ? 'Succès' : 'Problèmes'}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setActiveFilter('all');
                        setIsFilterOpen(false);
                      }}
                    >
                      Tous
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setActiveFilter('success');
                        setIsFilterOpen(false);
                      }}
                    >
                      Succès uniquement
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setActiveFilter('issues');
                        setIsFilterOpen(false);
                      }}
                    >
                      Problèmes uniquement
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Table content */}
          <div className="p-4">
            {activeTab === 'scheduled' && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base de données</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fréquence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière sauvegarde</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rétention</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredBackups(scheduledBackups).map((backup) => (
                      <tr key={backup.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{backup.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.frequency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.lastBackup}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(backup.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.retention}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleRestore(backup)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Restaurer"
                            >
                              <RefreshCw className="h-5 w-5" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900" title="Éditer">
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteBackup(backup, 'scheduled')}
                              className="text-red-600 hover:text-red-900" 
                              title="Supprimer"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {getFilteredBackups(scheduledBackups).length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          Aucune sauvegarde planifiée trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'manual' && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base de données</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getFilteredBackups(manualBackups).map((backup) => (
                      <tr key={backup.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{backup.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(backup.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {backup.note}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleRestore(backup)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Restaurer"
                            >
                              <RefreshCw className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteBackup(backup, 'manual')}
                              className="text-red-600 hover:text-red-900" 
                              title="Supprimer"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {getFilteredBackups(manualBackups).length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          Aucune sauvegarde manuelle trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'restore' && (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base de données</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sauvegarde restaurée</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {restoreHistory.map((restore) => (
                      <tr key={restore.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {restore.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{restore.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {restore.backupDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {restore.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(restore.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {restore.duration}
                        </td>
                      </tr>
                    ))}
                    {restoreHistory.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          Aucune restauration trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
      
      {/* Modals */}
      {renderScheduleModal()}
      {renderManualBackupModal()}
      {renderRestoreModal()}
      {renderDeleteConfirmModal()}
      
      {/* Settings Modal - simple placeholder implementation */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Paramètres</h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Notifications</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Email en cas d'échec</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Rapport hebdomadaire</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Alertes espace disque</span>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Stockage</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">Chemin de stockage par défaut</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg p-2" defaultValue="/backups" />
                </div>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Compression automatique</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Sécurité</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Chiffrement des sauvegardes</span>
                </label>
                <div>
                  <label className="block text-sm mb-1">Rotation des clés</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2">
                    <option>Mensuelle</option>
                    <option>Trimestrielle</option>
                    <option>Annuelle</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg mr-2 text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}