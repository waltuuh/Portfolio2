# Portfolio Académique - BUT3 Informatique

Portfolio de compétences pour la soutenance du semestre 6 - Parcours C : Intégration - Applications et systèmes d'information.

## 📋 Description

Site web portfolio présentant les compétences acquises durant le BUT Informatique, avec focus sur trois compétences principales :
- **Gérer** les données (scraping, nettoyage, structuration)
- **Conduire** un projet (méthodologie Agile, GitHub)
- **Collaborer** en équipe (livrables collectifs, communication)

## 🛠️ Technologies

- **Frontend** : HTML5, Tailwind CSS, Vanilla JavaScript
- **Animations** : CSS Keyframes, Intersection Observer API
- **Architecture** : Modules ES6, séparation des responsabilités

## 📁 Structure du Projet

```
Portfolio2/
├── index.html                    # Page principale
├── src/
│   ├── css/
│   │   └── main.css             # Styles personnalisés
│   ├── js/
│   │   ├── main.js              # Point d'entrée
│   │   ├── navigation.js        # Gestion navigation/menu
│   │   ├── modal.js             # Modals de compétences
│   │   ├── animations.js        # Animations au scroll
│   │   └── tailwind-config.js   # Configuration Tailwind
│   ├── data/
│   │   └── competences.json     # Données des compétences
│   └── assets/
│       └── images/              # Images et médias
├── README.md                     # Documentation
└── .gitignore                    # Fichiers à ignorer
```

## 🚀 Installation et Utilisation

### Méthode 1 : Ouvrir directement (Recommandé)

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/Portfolio2.git
cd Portfolio2
```

2. Ouvrir `index.html` dans votre navigateur :
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

### Méthode 2 : Serveur local

Pour éviter les problèmes CORS avec les modules ES6, utilisez un serveur local :

```bash
# Python 3
python -m http.server 8000

# Node.js (avec npx)
npx http-server

# PHP
php -S localhost:8000
```

Puis accédez à `http://localhost:8000`

## ✨ Fonctionnalités

- **Responsive Design** : Compatible desktop, tablette et mobile
- **Navigation fluide** : Smooth scroll, menu mobile
- **Modals interactifs** : Détails des compétences avec onglets (Traces, Preuves, Analyse)
- **Animations** : Apparition au scroll, effets hover
- **Mode présentation** : Plein écran pour soutenance
- **Accessibilité** : Respect des préférences de mouvement réduit

## 📝 Personnalisation

### Modifier les compétences

Éditez le fichier `src/data/competences.json` pour mettre à jour les compétences, traces et preuves.

### Modifier les styles

- **Couleurs** : `src/js/tailwind-config.js` (palette navy/mint)
- **Styles custom** : `src/css/main.css`

### Ajouter des sections

Ajoutez des sections dans `index.html` et créez les fonctions correspondantes dans les modules JS.

## 🎨 Palette de Couleurs

- **Navy** : `#5f6ff4` (principal)
- **Mint** : `#14b981` (accent)
- **Purple** : `#8b5cf6` (collaboration)

## 🐛 Dépannage

### Les modules ES6 ne se chargent pas

**Problème** : `CORS policy: Cross origin requests are only supported for protocol schemes`

**Solution** : Utilisez un serveur local (voir section Installation)

### Les animations ne fonctionnent pas

Vérifiez que votre navigateur supporte :
- Intersection Observer API
- CSS Grid & Flexbox
- ES6 Modules

## 📄 Licence

© 2024 Salemkour Rayane - Tous droits réservés

## 📧 Contact

- **Email** : votre.email@example.com
- **LinkedIn** : [Votre profil](https://linkedin.com)
- **GitHub** : [Votre profil](https://github.com)

---

**Note** : Ce portfolio a été développé dans le cadre du BUT3 Informatique - Semestre 6.
