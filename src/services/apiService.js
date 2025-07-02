import API from '../api';

// Service pour les utilisateurs
export const userService = {
  // Authentification
  login: async (email, password) => {
    const response = await API.post('/api/users/token', { email, password });
    return response.data;
  },

  // Récupérer tous les utilisateurs
  getUsers: async () => {
    const response = await API.get('/api/users');
    return response.data;
  },

  // Créer un utilisateur
  createUser: async (userData) => {
    const response = await API.post('/api/users', userData);
    return response.data;
  },

  // Mettre à jour un utilisateur
  updateUser: async (userId, userData) => {
    const response = await API.put(`/api/users/${userId}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur
  deleteUser: async (userId) => {
    const response = await API.delete(`/api/users/${userId}`);
    return response.data;
  },

  // Synchroniser un utilisateur avec une base de données
  syncUserWithDatabase: async (mappingData) => {
    const response = await API.post('/api/users/sync-with-database', mappingData);
    return response.data;
  }
};

// Service pour les bases de données
export const databaseService = {
  // Récupérer toutes les bases de données
  getDatabases: async () => {
    const response = await API.get('/api/users/databases');
    return response.data;
  },

  // Créer une nouvelle base de données
  createDatabase: async (databaseData) => {
    const response = await API.post('/api/users/databases', databaseData);
    return response.data;
  },

  // Mettre à jour une base de données
  updateDatabase: async (databaseId, databaseData) => {
    const response = await API.put(`/api/users/databases/${databaseId}`, databaseData);
    return response.data;
  },

  // Supprimer une base de données
  deleteDatabase: async (databaseId) => {
    const response = await API.delete(`/api/users/databases/${databaseId}`);
    return response.data;
  },

  // Tester la connexion à une base de données
  testConnection: async (databaseId) => {
    const response = await API.post(`/api/monitoring/connections/${databaseId}/test`);
    return response.data;
  }
};

// Service pour le monitoring
export const monitoringService = {
  // Récupérer les métriques d'une base de données
  getMetrics: async (databaseId, startTime = null, endTime = null) => {
    let url = `/api/monitoring/metrics/${databaseId}`;
    const params = new URLSearchParams();
    if (startTime) params.append('start_time', startTime.toISOString());
    if (endTime) params.append('end_time', endTime.toISOString());
    if (params.toString()) url += `?${params.toString()}`;
    
    const response = await API.get(url);
    return response.data;
  },

  // Collecter les métriques manuellement
  collectMetrics: async (databaseId) => {
    const response = await API.post(`/api/monitoring/metrics/collect/${databaseId}`);
    return response.data;
  },

  // Récupérer les alertes
  getAlerts: async (resolved = null, databaseId = null, severity = null) => {
    const params = new URLSearchParams();
    if (resolved !== null) params.append('resolved', resolved);
    if (databaseId) params.append('db_id', databaseId);
    if (severity) params.append('severity', severity);
    
    const url = `/api/monitoring/alerts${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await API.get(url);
    return response.data;
  },

  // Résoudre une alerte
  resolveAlert: async (alertId) => {
    const response = await API.put(`/api/monitoring/alerts/${alertId}/resolve`);
    return response.data;
  },

  // Récupérer le résumé de monitoring
  getSummary: async (databaseId) => {
    const response = await API.get(`/api/monitoring/summary/${databaseId}`);
    return response.data;
  },

  // Récupérer les connexions de base de données
  getConnections: async () => {
    const response = await API.get('/api/monitoring/connections');
    return response.data;
  }
};

// Service pour les sauvegardes
export const backupService = {
  // Récupérer toutes les sauvegardes
  getBackups: async (databaseId = null, status = null) => {
    const params = new URLSearchParams();
    if (databaseId) params.append('database_id', databaseId);
    if (status) params.append('status', status);
    
    const url = `/api/sauvegarde/backups${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await API.get(url);
    return response.data;
  },

  // Créer une nouvelle sauvegarde
  createBackup: async (backupData) => {
    const response = await API.post('/api/sauvegarde/backups', backupData);
    return response.data;
  },

  // Restaurer une sauvegarde
  restoreBackup: async (backupId, restoreData) => {
    const response = await API.post(`/api/sauvegarde/backups/${backupId}/restore`, restoreData);
    return response.data;
  },

  // Récupérer les plannings de sauvegarde
  getSchedules: async (databaseId = null) => {
    const params = new URLSearchParams();
    if (databaseId) params.append('database_id', databaseId);
    
    const url = `/api/sauvegarde/schedules${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await API.get(url);
    return response.data;
  },

  // Créer un planning de sauvegarde
  createSchedule: async (scheduleData) => {
    const response = await API.post('/api/sauvegarde/schedules', scheduleData);
    return response.data;
  }
};

// Service pour les rôles
export const roleService = {
  // Récupérer tous les rôles
  getRoles: async () => {
    const response = await API.get('/api/users/roles');
    return response.data;
  },

  // Créer un nouveau rôle
  createRole: async (roleData) => {
    const response = await API.post('/api/users/roles', roleData);
    return response.data;
  }
}; 