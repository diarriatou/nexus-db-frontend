// Configuration des endpoints API
export const API_ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: '/api/users/token',
    LOGOUT: '/api/users/logout',
    REFRESH: '/api/users/refresh',
  },

  // Utilisateurs
  USERS: {
    BASE: '/api/users',
    LIST: '/api/users',
    CREATE: '/api/users',
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
    ME: '/api/users/me',
    SYNC_DATABASE: '/api/users/sync-with-database',
    UPDATE_DATABASES: (id) => `/api/users/${id}/update-databases`,
  },

  // Rôles
  ROLES: {
    BASE: '/api/users/roles',
    LIST: '/api/users/roles',
    CREATE: '/api/users/roles',
  },

  // Bases de données
  DATABASES: {
    BASE: '/api/users/databases',
    LIST: '/api/users/databases',
    CREATE: '/api/users/databases',
    UPDATE: (id) => `/api/users/databases/${id}`,
    DELETE: (id) => `/api/users/databases/${id}`,
    TEST_CONNECTION: (id) => `/api/monitoring/connections/${id}/test`,
  },

  // Monitoring
  MONITORING: {
    CONNECTIONS: '/api/monitoring/connections',
    METRICS: (id) => `/api/monitoring/metrics/${id}`,
    COLLECT_METRICS: (id) => `/api/monitoring/metrics/collect/${id}`,
    ALERTS: '/api/monitoring/alerts',
    RESOLVE_ALERT: (id) => `/api/monitoring/alerts/${id}/resolve`,
    SUMMARY: (id) => `/api/monitoring/summary/${id}`,
    ALERT_RULES: '/api/monitoring/alerts/rules',
  },

  // Sauvegardes
  BACKUPS: {
    BASE: '/api/sauvegarde/backups',
    LIST: '/api/sauvegarde/backups',
    CREATE: '/api/sauvegarde/backups',
    RESTORE: (id) => `/api/sauvegarde/backups/${id}/restore`,
    SCHEDULES: '/api/sauvegarde/schedules',
    CREATE_SCHEDULE: '/api/sauvegarde/schedules',
  },
};

// Configuration des types de bases de données supportées
export const DATABASE_TYPES = {
  MYSQL: 'mysql',
  ORACLE: 'oracle',
  MONGODB: 'mongodb',
  POSTGRESQL: 'postgresql',
  SQLSERVER: 'sqlserver',
};

// Configuration des ports par défaut
export const DEFAULT_PORTS = {
  [DATABASE_TYPES.MYSQL]: 3306,
  [DATABASE_TYPES.ORACLE]: 1521,
  [DATABASE_TYPES.MONGODB]: 27017,
  [DATABASE_TYPES.POSTGRESQL]: 5432,
  [DATABASE_TYPES.SQLSERVER]: 1433,
};

// Configuration des statuts
export const STATUS_TYPES = {
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
};

// Configuration des rôles
export const USER_ROLES = {
  ADMIN: 'Administrateur',
  DBA: 'DBA',
  USER: 'Utilisateur',
};

// Configuration des types de sauvegarde
export const BACKUP_TYPES = {
  FULL: 'full',
  INCREMENTAL: 'incremental',
  DIFFERENTIAL: 'differential',
};

// Configuration des fréquences de sauvegarde
export const BACKUP_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
};

// Configuration des sévérités d'alerte
export const ALERT_SEVERITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

// Configuration des métriques
export const METRIC_NAMES = {
  CPU_USAGE: 'cpu_usage',
  MEMORY_USAGE: 'memory_usage',
  DISK_USAGE: 'disk_usage',
  CONNECTIONS_COUNT: 'connections_count',
  QUERY_LATENCY: 'query_latency',
  ACTIVE_TRANSACTIONS: 'active_transactions',
};

// Configuration des opérateurs de comparaison
export const COMPARISON_OPERATORS = {
  GREATER_THAN: '>',
  LESS_THAN: '<',
  GREATER_EQUAL: '>=',
  LESS_EQUAL: '<=',
  EQUAL: '==',
};

// Configuration des timeouts
export const TIMEOUTS = {
  API_REQUEST: 15000,
  CONNECTION_TEST: 10000,
  BACKUP_OPERATION: 300000, // 5 minutes
};

// Configuration des limites
export const LIMITS = {
  MAX_USERS_PER_PAGE: 10,
  MAX_DATABASES_PER_PAGE: 20,
  MAX_BACKUPS_PER_PAGE: 50,
  MAX_ALERTS_PER_PAGE: 100,
  MAX_METRICS_PER_REQUEST: 1000,
};

// Configuration des formats de date
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  FILENAME: 'YYYY-MM-DD_HH-mm-ss',
};

// Configuration des messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  AUTHENTICATION_ERROR: 'Erreur d\'authentification',
  AUTHORIZATION_ERROR: 'Vous n\'avez pas les permissions nécessaires',
  VALIDATION_ERROR: 'Données invalides',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur interne du serveur',
  TIMEOUT_ERROR: 'Délai d\'attente dépassé',
};

// Configuration des messages de succès
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'Utilisateur créé avec succès',
  USER_UPDATED: 'Utilisateur mis à jour avec succès',
  USER_DELETED: 'Utilisateur supprimé avec succès',
  DATABASE_CREATED: 'Base de données créée avec succès',
  DATABASE_UPDATED: 'Base de données mise à jour avec succès',
  DATABASE_DELETED: 'Base de données supprimée avec succès',
  BACKUP_CREATED: 'Sauvegarde créée avec succès',
  BACKUP_RESTORED: 'Sauvegarde restaurée avec succès',
  ALERT_RESOLVED: 'Alerte résolue avec succès',
}; 