import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, MoreHorizontal, Edit, Trash2, Shield, Database, X, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import API from '../../api';

export default function UsersManagement() {
  // États de la page principale
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Tous');
  const [selectedStatus, setSelectedStatus] = useState('Tous');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;


  
  // Exemple de données utilisateurs
  const [users, setUsers] = useState([
    // {
    //   id: 1,
    //   name: "Diarra",
    //   email: "diarra@example.com",
    //   role: "DBA",
    //   databases: ["Oracle", "MySQL"],
    //   status: "Actif",
    //   lastActive: "Aujourd'hui",
    //   password: "••••••••"
    // }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // État pour le formulaire d'utilisateur
  const initialFormState = {
    name: "",
    email: "",
    role: "Utilisateur",
    databases: [],
    status: "Actif",
    password: "",
    confirmPassword: ""
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Options disponibles
  const roleOptions = ['Administrateur', 'DBA', 'Utilisateur'];
  const statusOptions = ['Actif', 'Inactif'];
  const [databaseOptions, setDatabaseOptions] = useState(['MySQL', 'Oracle', 'MongoDB']);

  // Configurer l'en-tête d'autorisation pour toutes les requêtes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Rediriger vers la page de connexion si le token n'est pas présent
      window.location = "/login";
    }
  }, []);

  //Charger les utilisateur et les bases au demarrage
  useEffect(()=>{
    fetchUsers();
    fetchDatabases();
  },[]);

  // Fonction pour récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/api/users');
      
      // Transformation des données de l'API au format frontend
      const formattedUsers = response.data.map(user => ({
        id: user.id,
        name: user.full_name || user.email.split('@')[0],
        email: user.email,
        role: user.is_superuser ? 'Administrateur' : user.is_dba ? 'DBA' : 'Utilisateur',
        databases: user.managed_databases?.map(db => db.name) || [],
        status: user.is_active ? 'Actif' : 'Inactif',
        lastActive: user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Jamais',
        password: "••••••••"
      }));
      
      setUsers(formattedUsers);
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      
      if (err.response && err.response.status === 401) {
        // Token expiré ou invalide
        localStorage.removeItem('token');
        window.location = "/login";
      } else {
        setError('Impossible de charger les utilisateurs');
        // Garder les données de test en cas d'échec
        setUsers([{
          id: 1,
          name: "Diarra",
          email: "diarra@example.com",
          role: "DBA",
          databases: ["Oracle", "MySQL"],
          status: "Actif",
          lastActive: "Aujourd'hui",
          password: "••••••••"
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les bases de données depuis l'API
  const fetchDatabases = async () => {
    try {
      const response = await API.get('/api/users/databases');
      if (response.data && response.data.length > 0) {
        const dbNames = response.data.map(db => db.name);
        setDatabaseOptions(dbNames);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des bases de données:', err);
      // On garde les options par défaut en cas d'erreur
    }
  };

  // Fonction modifiée pour créer/mettre à jour un utilisateur via l'API
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    
    try {
      // Préparation des données pour l'API selon le format attendu par votre backend
      const userData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        is_active: formData.status === 'Actif',
        is_superuser: formData.role === 'Administrateur',
        is_dba: formData.role === 'DBA',
      };
      
      if (currentUser) {
        // Mise à jour d'un utilisateur existant
        await API.put(`/api/users/${currentUser.id}`, userData);
        
        // Synchroniser les bases de données pour cet utilisateur
        await syncUserDatabases(currentUser.id, formData.databases);
        
        showNotification(`L'utilisateur ${formData.name} a été mis à jour.`);
      } else {
        // Ajout d'un nouvel utilisateur
        const response = await API.post('/api/users', userData);
        const newUserId = response.data.id;
        
        // Synchroniser les bases de données pour ce nouvel utilisateur
        await syncUserDatabases(newUserId, formData.databases);
        
        showNotification(`L'utilisateur ${formData.name} a été créé.`);
      }
      
      setShowUserFormModal(false);
      setFormData(initialFormState);
      
      // Rafraîchir la liste des utilisateurs pour avoir les données à jour
      fetchUsers();
      
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      showNotification(`Erreur: ${err.response?.data?.detail || "Une erreur est survenue"}`, "error");
    } finally {
      setLoading(false);
    }
  };


  // Fonction pour synchroniser les bases de données d'un utilisateur
  const syncUserDatabases = async (userId, databases) => {
    try {

      //1.Récupérer la liste des bases de données disponibles
      const dbResponse = await API.get('/api/users/databases');
      const allDatabases = dbResponse.data.map(db => db.name);

      //2.Filtrer pour obtenir les IDs des bases de données sélectionnées
      const selectedDatabasesIDs = allDatabases
       .filter(db => databases.includes(db.name))
       .map(db => db.id);

       //3.Appeler un endpoint dedie pour mettre a jour les associations
       await API.post(`/api/users/${userId}/update-databases`, {
        database_ids: selectedDatabasesIDs,
        // Vous pourriez ajouter d'autres informations nécessaires pour UserDatabaseMapping ici
        default_database_username: userId.toString(), // exemple
        default_database_roles: JSON.stringify(["read", "write"]) // exemple
      });
    
      
      // Pour chaque base de données sélectionnée
      for (const dbName of databases) {
        // Trouver l'ID de la base de données
        const dbResponse = await API.get('/api/users/databases');
        const database = dbResponse.data.find(db => db.name === dbName);
        
        if (database) {
          // Créer le mapping utilisateur-base de données
          await API.post('/api/users/sync-with-database', {
            user_id: userId,
            database_id: database.id,
            can_read: true,
            can_write: true
          });
        }
      }
    } catch (err) {
      console.error('Erreur lors de la synchronisation des bases de données:', err);
      
    }
  };

  // Fonction modifiée pour supprimer un utilisateur via l'API
  const handleDeleteUser = async () => {
    try {
      await API.delete(`/api/users/${userToDelete.id}`);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setShowDeleteModal(false);
      showNotification(`L'utilisateur ${userToDelete.name} a été supprimé.`);
      setUserToDelete(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      showNotification(`Erreur: ${err.response?.data?.detail || "Une erreur est survenue"}`, "error");
    }
  };

  // Fonction améliorée pour afficher des notifications avec type
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };


  // Fonction pour filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'Tous' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'Tous' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Fonctions pour la gestion des actions
  const openAddUserForm = () => {
    setCurrentUser(null);
    setFormData(initialFormState);
    setFormErrors({});
    setShowUserFormModal(true);
  };

  const openEditUserForm = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      databases: [...user.databases],
      status: user.status,
      password: "",
      confirmPassword: ""
    });
    setFormErrors({});
    setShowUserFormModal(true);
  };

  const openDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Function removed to avoid duplicate declaration

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Suppression de l'erreur lorsque le champ est modifié
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const handleDatabaseChange = (db) => {
    if (formData.databases.includes(db)) {
      setFormData({
        ...formData,
        databases: formData.databases.filter(d => d !== db)
      });
    } else {
      setFormData({
        ...formData,
        databases: [...formData.databases, db]
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Le nom est requis";
    }
    
    if (!formData.email.trim()) {
      errors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }
    
    if (!currentUser && !formData.password) {
      errors.password = "Le mot de passe est requis";
    }
    
    if (formData.password && formData.password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    if (formData.databases.length === 0) {
      errors.databases = "Sélectionnez au moins une base de données";
    }
    
    return errors;
  };


  // Obtenir la couleur appropriée pour le badge de statut
  const getStatusColor = (status) => {
    switch(status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'Inactif': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // Obtenir l'icône appropriée pour le rôle
  const getRoleIcon = (role) => {
    switch(role) {
      case 'Administrateur': return <Shield className="h-4 w-4 mr-1" />;
      case 'DBA': return <Database className="h-4 w-4 mr-1" />;
      default: return <Users className="h-4 w-4 mr-1" />;
    }
  };
  

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6 max-w-full mx-auto">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 ${notification.type === "error" ? "bg-red-100 border-red-500 text-red-700" : "bg-green-100 border-green-500 text-green-700"} border-l-4 p-4 rounded shadow-md transition-opacity duration-300 z-50`}>
            <div className="flex items-center">
              {notification.type === "error" ? <AlertCircle className="h-5 w-5 mr-2" /> : <Check className="h-5 w-5 mr-2" />}
              <p>{notification.message}</p> {/* Ici on accède à la propriété message */}
          </div>
        </div>
    )}
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <button 
            onClick={openAddUserForm}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Nouvel Utilisateur
          </button>
        </div>
        
        {/* Filtres et recherche */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500 mr-2">Filtres:</span>
              </div>
              
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="Tous">Tous les rôles</option>
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="Tous">Tous les statuts</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bases de données
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière activité
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{user.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${user.role === 'Administrateur' ? 'bg-purple-100 text-purple-800' : user.role === 'DBA' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {getRoleIcon(user.role)}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {user.databases.map(db => (
                            <span key={db} className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                              {db}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end items-center space-x-2">
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100 text-blue-600" 
                            title="Modifier"
                            onClick={() => openEditUserForm(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100 text-red-600" 
                            title="Supprimer"
                            onClick={() => openDeleteConfirmation(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="relative">
                            <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500" title="Plus d'options">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{currentUsers.length}</span> sur <span className="font-medium">{filteredUsers.length}</span> utilisateurs
              </div>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Précédent
                </button>
                <button 
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Formulaire Utilisateur */}
      {showUserFormModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {currentUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
              </h3>
              <button
                onClick={() => setShowUserFormModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitForm} className="p-4">
              <div className="space-y-4">
                {/* Nom */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.name ? 'border-red-300' : ''}`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.email ? 'border-red-300' : ''}`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>
                
                {/* Rôle */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Rôle
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                {/* Bases de données */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bases de données
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {databaseOptions.map(db => (
                      <div key={db} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`db-${db}`}
                          checked={formData.databases.includes(db)}
                          onChange={() => handleDatabaseChange(db)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`db-${db}`} className="ml-2 block text-sm text-gray-700">
                          {db}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formErrors.databases && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.databases}</p>
                  )}
                </div>
                
                {/* Statut */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Statut
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {currentUser ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.password ? 'border-red-300' : ''}`}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>
                
                {/* Confirmation du mot de passe */}
                {(formData.password || !currentUser) && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.confirmPassword ? 'border-red-300' : ''}`}
                    />
                    {formErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUserFormModal(false)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {currentUser ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmation de Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-4 flex items-start">
              <div className="flex-shrink-0 text-red-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-medium">{userToDelete?.name}</span> ? Cette action est irréversible.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleDeleteUser}
              >
                Supprimer
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}