import React from 'react';
import { BookOpen, Code, Database, Shield } from 'lucide-react';

export default function Documentation() {
  const sections = [
    {
      title: "Guide d'utilisation",
      icon: BookOpen,
      description: "Apprenez à utiliser la plateforme UnityDB",
      items: [
        "Configuration des bases de données",
        "Gestion des utilisateurs",
        "Monitoring en temps réel",
        "Sauvegardes automatiques"
      ]
    },
    {
      title: "API Documentation",
      icon: Code,
      description: "Documentation technique des API",
      items: [
        "Endpoints d'authentification",
        "Gestion des utilisateurs",
        "Monitoring des bases de données",
        "Système de sauvegardes"
      ]
    },
    {
      title: "Architecture",
      icon: Database,
      description: "Architecture technique du système",
      items: [
        "Frontend React",
        "Backend FastAPI",
        "Bases de données hétérogènes",
        "Système de monitoring"
      ]
    },
    {
      title: "Sécurité",
      icon: Shield,
      description: "Mesures de sécurité implémentées",
      items: [
        "Authentification JWT",
        "Gestion des rôles",
        "Chiffrement des données",
        "Audit des accès"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation UnityDB
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Guide complet pour utiliser et comprendre la plateforme de gestion de bases de données hétérogènes
          </p>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <section.icon className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
              </div>
              
              <p className="text-gray-600 mb-4">
                {section.description}
              </p>
              
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Guide de démarrage rapide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Connexion</h3>
              <p className="text-gray-600 text-sm">
                Connectez-vous avec vos identifiants administrateur
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Configuration</h3>
              <p className="text-gray-600 text-sm">
                Ajoutez vos bases de données dans la section Configuration
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Surveillez vos bases de données en temps réel
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Besoin d'aide ? Contactez l'équipe de support technique
          </p>
          <p className="text-blue-600 font-medium mt-2">
            support@unitydb.com
          </p>
        </div>
      </div>
    </div>
  );
} 