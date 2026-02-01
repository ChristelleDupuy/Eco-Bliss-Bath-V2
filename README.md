<div align="center">

# Eco Bliss Bath – Tests automatisés Cypress

Eco Bliss Bath est un site e-commerce spécialisé dans la vente de produits de bain éco-responsables.
L’application permet aux utilisateurs de consulter un catalogue de produits, de créer un compte, de se connecter, d’ajouter des produits à un panier et de publier des avis.

Une première campagne de tests manuels a été réalisée afin d’identifier les fonctionnalités critiques et les principaux risques métier.
À la suite de cette campagne, une stratégie d’automatisation a été définie afin de sécuriser les parcours essentiels et de détecter rapidement les régressions.

Ce projet a pour objectif de mettre en place une première base de tests automatisés avec Cypress, en se concentrant sur :

- Les fonctionnalités critiques pour le business (connexion, panier)
- Les endpoints API principaux (authentification, produits, avis, panier)
- Des smoke tests UI pour vérifier la disponibilité globale de l’application
- Un test de sécurité ciblé (XSS sur les avis)

L’automatisation vise à améliorer la fiabilité de l’application, réduire le risque de régressions et faciliter la validation avant mise en production.
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

## Tests automatisés – Cypress

Des tests automatisés ont été mis en place avec Cypress afin de vérifier la fiabilité, la stabilité et la sécurité de l’application Eco Bliss Bath.
Ils permettent de détecter rapidement des régressions avant chaque livraison.

---

### Installation des dépendances (racine du projet)

Depuis la racine du projet :

    npm install

Assurez-vous que :
- l’API est bien lancée (docker compose up -d)
- le frontend est bien lancé (npm start)

---

### Lancer les tests en mode interface (visuel)

    npx cypress open

Puis sélectionnez les tests dans :
cypress/e2e

---

### Lancer tous les tests en mode headless (console)

    npx cypress run

---

### Générer un rapport simple

    npx cypress run > cypress-report.txt

Les médias générés par Cypress sont disponibles ici :
- cypress/screenshots
- cypress/videos

---

Les tests sont organisés par type afin de faciliter la maintenance et la compréhension.

## Détail des tests automatisés

### Tests API
- Authentification (/register, /login, /me)
- Produits (/products, /products/random, /products/{id})
- Avis clients (/reviews GET / POST)
- Création d’un avis sans authentification (403 attendu)

Objectifs :
- Vérifier les statuts HTTP
- Contrôler la structure des réponses JSON
- Détecter rapidement toute régression côté backend

---

### Smoke tests UI
- Chargement de la page d’accueil
- Accès au catalogue produits
- Accès à la page de connexion
- Accès au panier ou redirection vers la page de connexion

Objectif :
- Identifier rapidement une régression bloquante

---

### Tests de sécurité – XSS
- Injection de script dans un commentaire
- Vérification que le script n’est pas exécuté côté navigateur

Limite connue :
- Test dépendant d’un utilisateur authentifié

---

### Tests fonctionnels
Scénarios automatisés :
- Connexion utilisateur
- Accès au panier après connexion
- Ajout d’un produit en stock
- Tentative d’ajout d’un produit hors stock

---

## Résultats de la dernière exécution

- Specs exécutées : 15
- Tests (it) exécutés : 21
- Tests passés : 17
- Tests échoués : 3
- Tests ignorés : 0

Les échecs correspondent à des anomalies réelles détectées dans l’application et font l’objet d’un rapport dans le bilan de campagne.

Remarque :
- “Specs exécutées” = nombre de fichiers .cy.js
- “Tests exécutés” = total des blocs it() dans tous les fichiers

Les tests en échec concernent des scénarios fonctionnels dépendants :
- de l’authentification
- des règles métier
- des données disponibles

Aucune correction applicative n’a été effectuée, conformément aux consignes.

---

Ce projet s’inscrit dans le cadre d’une mission QA visant à :
- définir une stratégie de tests pertinente
- automatiser les scénarios critiques
- produire un bilan de campagne permettant de décider d’un GO / NO GO pour la mise en production