// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 15000, // Augmenter le timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour les erreurs de réseau
API.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse API reçue:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Erreur API:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.error('🕐 Timeout - Le serveur met trop de temps à répondre');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Erreur réseau - Vérifiez que le backend est démarré sur http://localhost:8000');
    } else if (!error.response) {
      console.error('📡 Pas de réponse du serveur - Le backend est-il démarré ?');
    }
    
    return Promise.reject(error);
  }
);

// Intercepteur pour ajouter le token
API.interceptors.request.use(
  (config) => {
    console.log(`📤 Requête API: ${config.method?.toUpperCase()} ${config.url}`);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;