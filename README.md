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

> ℹ️ Les tests actuels couvrent principalement l’API.  
> Des scénarios UI critiques pourront être ajoutés progressivement.