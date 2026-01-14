<div align="center">

# OpenClassrooms - Eco-Bliss-Bath
</div>

<p align="center">
    <img src="https://img.shields.io/badge/MariaDB-v11.7.2-blue">
    <img src="https://img.shields.io/badge/Symfony-v6.2-blue">
    <img src="https://img.shields.io/badge/Angular-v13.3.0-blue">
    <img src="https://img.shields.io/badge/docker--build-passing-brightgreen">
  <br><br><br>
</p>

# Prérequis
Pour démarrer cet applicatif web vous devez avoir les outils suivants:
- Docker
- NodeJs

# Installation et démarrage
Clonez le projet pour le récupérer
``` 
git clone https://github.com/OpenClassrooms-Student-Center/Eco-Bliss-Bath-V2.git
cd Eco-Bliss-Bath-V2
```
Pour démarrer l'API avec sa base de données.
```
docker compose up -d
```
# Pour démarrer le frontend de l'applicatif
Rendez-vous dans le dossier frontend
```
cd ./frontend
```
Installez les dépendances du projet
```
npm i
ou
npm install (si vous préférez)
```
---

## 🧪 Tests automatisés – Cypress

Des tests automatisés ont été mis en place avec **Cypress** afin de vérifier la fiabilité de l’API (authentification, produits, avis).  
Ils permettent de détecter rapidement des régressions avant chaque livraison.

---

### ✔️ Installation des dépendances (racine du projet)

```bash
npm install
```

Assurez-vous que l’API est bien lancée (`docker compose up`) avant d’exécuter les tests.

### 🌐 Accès API & Documentation
API disponible :
http://localhost:8081

Swagger :
http://localhost:8081/api/doc

---

### ▶️ Lancer les tests en mode interface (visuel)

```bash
npx cypress open
```

Puis choisissez les tests dans :

```
cypress/e2e
```

---

### ▶️ Lancer tous les tests en mode headless (console)

```bash
npx cypress run
```

---

### 📄 Générer un rapport simple

```bash
npx cypress run > cypress-report.txt
```

Le fichier sera généré à la racine du projet.

Les médias générés par Cypress :

```
cypress/screenshots
cypress/videos
```

> ℹ️ Les tests actuels couvrent l’API, des smoke tests UI, des tests XSS et deux scénarios fonctionnels critiques.  

---

## 🧪 Détail des tests automatisés

Les tests Cypress couvrent plusieurs niveaux de validation de l’application.

### ✅ Tests API
Les tests API vérifient le bon fonctionnement des endpoints critiques :
- Authentification (`/register`, `/login`, `/me`)
- Produits (`/products`, `/products/random`, `/products/{id}`)
- Avis clients (`/reviews` en GET et POST)

Objectifs :
- Vérifier les statuts HTTP
- Contrôler la structure des réponses JSON
- Détecter rapidement toute régression côté backend

---

### ✅ Smoke tests UI
Des smoke tests front ont été mis en place afin de vérifier la stabilité globale de l’application :
- Chargement de la page d’accueil
- Accès au catalogue produits
- Accès à la page de connexion
- Accès au panier (ou redirection vers la page de connexion si l’utilisateur n’est pas authentifié)

Objectif :
- Identifier rapidement une régression bloquante sur les parcours principaux.

---

### 🔐 Tests de sécurité – XSS
Un test de sécurité a été implémenté afin de vérifier qu’un script injecté dans un commentaire n’est pas exécuté côté navigateur.

⚠️ Limite connue :
- Le formulaire d’ajout de commentaire est uniquement accessible aux utilisateurs connectés.
- En l’absence de session valide, le test dépend de prérequis fonctionnels non satisfaits.

---

### ⚙️ Tests fonctionnels
Deux scénarios fonctionnels critiques ont été sélectionnés et automatisés :
- Connexion utilisateur
- Accès au panier / commandes après connexion

Statut :
- Les scénarios sont écrits et versionnés
- Certains tests peuvent échouer en raison de contraintes applicatives ou de données de test
- Ces comportements sont documentés dans le bilan de campagne de tests