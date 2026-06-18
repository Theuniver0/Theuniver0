<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# MEGA PROMPT pour une application de gestion complète installable sur pc et sur téléphone, possible de synchronisé

Je vais vous fournir un **MEGA PROMPT complet** pour créer une application de gestion installable sur PC et téléphone avec synchronisation :

***

## 📋 MEGA PROMPT : Application de Gestion Complète Cross-Platform avec Synchronisation

```
ROLE :
Tu es un développeur full-stack expert spécialisé dans les applications cross-platform. 
Tu vas créer une application de gestion d'entreprise complète, installable sur PC (Windows/Mac) 
et téléphone (Android/iOS), avec synchronisation automatique des données en temps réel.

---

### 1. ARCHITECTURE TECHNIQUE REQUISE

**Framework Cross-Platform :**
- Utilise React Native avec Expo pour le mobile (Android + iOS)
- Utilise Electron pour l'application PC (Windows + Mac + Linux)
- Base de code unique pour la logique métier

**Backend & Synchronisation :**
- Supabase (PostgreSQL) comme backend principal
- Authentification via Supabase Auth (email, Google, OAuth)
- Synchronisation automatique via Realtime Subscriptions
- Mode hors-ligne avec IndexedDB (mobile) et SQLite (PC)
- Sync intelligent : données synchronisées quand connexion disponible

**Stack Technique :**
- Frontend : React 18 + TypeScript + TailwindCSS
- UI Components : shadcn/ui ou React Native Paper
- State Management : React Query (TanStack Query)
- Navigation : React Navigation v6
- Build PC : Electron + vue-electron
- Build Mobile : Expo EAS Build

---

### 2. MODULES DE GESTION À INTÉGRER

**Module 1 : Gestion Clients**
- CRUD complet clients (nom, email, téléphone, adresse, société)
- Historique des interactions et commandes
- Recherche et filtres avancés
- Export CSV/PDF

**Module 2 : Gestion Produits/Stocks**
- Catalogue produits (nom, description, prix, catégorie, SKU)
- Gestion des stocks (quantité, seuil alerte, entrée/sortie)
- Historique des mouvements de stock
- Alertes stock faible

**Module 3 : Gestion Ventes**
- Création de commandes/paniers
- Facturation automatique
- Historique des ventes
- Tableau des revenus (journalier, mensuel, annuel)
- Statistiques de vente par produit/client

**Module 4 : Gestion Achats**
- Suivi des commandes fournisseurs
- Gestion des réceptions
- Historique des achats
- Calcul des coûts

**Module 5 : Employés/RH**
- Fiches employées (nom, poste, contact, date entrée)
- Gestion des horaires et présences
- Calcul des salaires basiques
- Notes de service

**Module 6 : Comptabilité Basique**
- Suivi des dépenses et revenus
- Catégorisation (achat, vente, frais, etc.)
- Tableau de bord financier
- Rapport P&L simplifié
- Export pour expert-comptable

**Module 7 : Agenda/Calendrier**
- Événements et rendez-vous
- Rappels et notifications
- Synchronisation avec Google Calendar (optionnel)
- Vue jour/semaine/mois

**Module 8 : Tableau de Bord Global**
- Métriques clés (clients totaux, produits, ventes mois, revenu)
- Graphiques interactifs ( vendas par mois, top produits, top clients)
- Alertes importantes (stock faible, revenus en baisse)

---

### 3. FONCTIONNALITÉS TECHNIQUES OBLIGATOIRES

**Authentification :**
- Login/Signup avec email + mot de passe
- Mot de passe oublié (reset par email)
- Session persistante
- Protection des routes

**Synchronisation :**
- Auto-sync en temps réel via Supabase Realtime
- Mode hors-ligne : données stockées localement
- Sync différé quand connexion retourne
- Indicateur de statut sync (en ligne/hors-ligne)
- Gestion des conflits de données (last-write-wins)

**Hors-ligne :**
- IndexedDB sur mobile (via idb ou dexie)
- SQLite sur PC (via sql.js ou better-sqlite3)
- CRUD complet en hors-ligne
- Queue de sync pour opérations en attente

**Notifications :**
- Notifications locales (rappels agenda, alertes stock)
- Notifications push (Supabase + FCM pour Android, APNs pour iOS)
- Bannières de notification dans l'app

**Export/Import :**
- Export CSV pour tous les modules
- Export PDF pour factures/rapports
- Import CSV pour masse de données (clients, produits)

**Sécurité :**
- Hash mot de passe via Supabase
- JWT pour authentification API
- Chiffrement données locales (optionnel)
- RBAC basique (admin/utilisateur)

**Performance :**
- Lazy loading des modules
- Pagination des listes (50 items par page)
- Virtualisation des longues listes (react-window)
- Optimisation rendus React

**UI/UX :**
- Design responsive (mobile, tablette, desktop)
- Thème sombre/clair
- Icônes native-like (React Native Paper ou Ionicons)
- Animations fluides (60 FPS)
- Accessibility (WCAG 2.1 basique)

---

### 4. STRUCTURE DE BASE DE DONNÉES (Supabase PostgreSQL)

```sql
-- Table clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telephone VARCHAR(20),
  adresse TEXT,
  société VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table produits
CREATE TABLE produits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(150) NOT NULL,
  description TEXT,
  prix DECIMAL(10,2) NOT NULL,
  catégorie VARCHAR(50),
  sku VARCHAR(50),
  quantité_stock INTEGER DEFAULT 0,
  seuil_alerte INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table ventes
CREATE TABLE ventes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  datevente TIMESTAMP DEFAULT NOW(),
  total DECIMAL(10,2) NOT NULL,
  statut VARCHAR(20) DEFAULT 'en_attente', -- en_attente, payée, annulée
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table vente_items (détails vente)
CREATE TABLE vente_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vente_id UUID REFERENCES ventes(id),
  produit_id UUID REFERENCES produits(id),
  quantité INTEGER NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL
);

-- Table employés
CREATE TABLE employés (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(100) NOT NULL,
  poste VARCHAR(50),
  email VARCHAR(100),
  telephone VARCHAR(20),
  date_entrée TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table dépenses
CREATE TABLE dépenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catégorie VARCHAR(50) NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  date TIMESTAMP DEFAULT NOW(),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table événements (agenda)
CREATE TABLE événements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(150) NOT NULL,
  description TEXT,
  date_start TIMESTAMP NOT NULL,
  date_end TIMESTAMP,
  lieu VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_produits_catégorie ON produits(catégorie);
CREATE INDEX idx_ventes_date ON ventes(datevente);
CREATE INDEX idx_dépenses_date ON dépenses(date);
```


---

### 5. LIVRABLES ATTENDUS

**Code Source :**

- Projet complet organisé par fichiers et dossiers
- Structure :

```
/src
  /components       # Composants UI réutilisables
  /pages           # Pages principales (Clients, Produits, Ventes, etc.)
  /hooks           # Hooks React personnalisés
  /services        # Services API (Supabase, sync)
  /store           # State management (React Query)
  /utils           # Fonctions utilitaires
  /types           # Types TypeScript
  /assets          # Images, icônes
/electron          # Code Electron pour PC
/expo              # Config Expo pour mobile
/docs              # Documentation
```


**Fichiers de Configuration :**

- `package.json` avec tous les scripts
- `tsconfig.json` pour TypeScript
- `expo.config.ts` pour Expo
- `electron/main.js` pour Electron
- `.env.example` pour variables d'environnement

**Documentation :**

- README.md avec :
    - Installation étape par étape
    - Configuration Supabase
    - Scripts de build (PC et mobile)
    - Utilisation de l'app
- Documentation API (Supabase)
- Guide de déploiement (EAS Build pour mobile, Electron installer pour PC)

**Builds :**

- Script pour build PC : `npm run build:pc` → génère `.exe` et `.dmg`
- Script pour build mobile : `eas build --platform android` et `--platform ios`
- Documentation pour signature numérique (optionnel)

---

### 6. CONTRAINTES ET BONNES PRATIQUES

**Code Quality :**

- TypeScript strict (no `any` sauf cas exception)
- ESLint + Prettier configurés
- Commentaires sur logic complexe
- Tests unitaires sur fonctions critiques (Jest + React Testing Library)

**Performance :**

- Pas de re-rendus inutiles (memoization avec `React.memo`, `useMemo`)
- Pagination obligatoire sur listes > 20 items
- Lazy loading des images

**Sécurité :**

- Mot de passe min 8 caractères, 1 lettre + 1 chiffre
- JWT expiration 24h
- Rate limiting sur authentification (Supabase config)

**UX :**

- Messages d'erreur clairs en français
- Loading indicators sur toutes les actions async
- Confirmations sur suppressions
- Toast notifications pour succès

---

### 7. ÉTAPES DE DÉVELOPPEMENT

1. **Setup Initial** : Expo + Electron + Supabase + TypeScript + Tailwind
2. **Auth** : Login, Signup, Reset password, Session persistante
3. **Base de Données** : Création tables Supabase + migrations
4. **Module Clients** : CRUD + recherche + export
5. **Module Produits** : CRUD + stock + alertes
6. **Module Ventes** : CRUD commandes + factures + stats
7. **Module Achats** : CRUD + réceptions
8. **Module RH** : CRUD employés + horaires
9. **Module Compta** : CRUD dépenses + revenus + tableau bord
10. **Module Agenda** : CRUD événements + notifications
11. **Synchronisation** : Realtime + hors-ligne + sync différé
12. **UI/UX** : Thème sombre/clair + responsive + animations
13. **Export** : CSV + PDF
14. **Tests** : Tests unitaires + tests UI
15. **Build** : Scripts PC + mobile + documentation déploiement

---

### 8. OUTILS ET LIBRAIRIES RECOMMANDÉS

**Nécessaires :**

- `expo` + `react-native` (mobile)
- `electron` + `vue-electron` (PC)
- `@supabase/supabase-js` (backend)
- `@tanstack/react-query` (state + sync)
- `tailwindcss` + `nativewind` (styling)
- `react-navigation` (navigation)
- `idb` ou `dexie` (IndexedDB mobile)
- `better-sqlite3` (SQLite PC)
- `react-chartjs-2` + `chart.js` (graphiques)
- `jspdf` + `jspdf-autotable` (PDF export)
- `papaparse` (CSV export/import)

**Optionnels :**

- `react-hook-form` (formulaires)
- `zod` (validation)
- `jest` + `react-testing-library` (tests)
- `eslint` + `prettier` (code quality)

---

### 9. FORMAT DE RÉPONSE EXPECTED

Fournis :

1. **Arborescence complète** du projet
2. **Code source complet** de chaque fichier important
3. **Fichiers de config** (package.json, tsconfig, expo.config, electron)
4. **Migrations SQL** pour Supabase
5. **README.md** avec installation + utilisation + build
6. **Guide Supabase** (création projet, tables, auth, realtime)

Si besoin de précisions sur un module, demande-moi avant de continuer.

Commence par la structure du projet et le setup initial, puis développe chaque module progressivement.

```

***

## 🚀 Comment utiliser ce prompt

1. **Copie-le entier** dans un AI (ChatGPT-4, Claude 3, Gemini Advanced)
2. L'IA génère le code complet de l'application
3. **Configure Supabase** :
   - Crée un projet sur [supabase.com](https://supabase.com)
   - Exécute les migrations SQL
   - Active l'authentification email
4. **Build PC** : `npm run build:pc` → obtiens `.exe` (Windows) et `.dmg` (Mac)
5. **Build Mobile** : `eas build` → obtiens `.apk` (Android) et `.ipa` (iOS)
6. **Installe** sur PC et téléphone, connecte-toi avec le même compte → **synchronisation automatique**

***

## 💡 Applications existantes similaires (si tu veux juste utiliser une solution)

| Application | PC | Mobile | Synchronisation | Prix |
|-------------|-----|--------|-----------------|------|
| **MaxiCompte** [^1] | ✅ Windows/Mac | ✅ Android/iOS | ✅ Cloud | Gratuit (Basic) |
| **MyTodolist** [^2] | ✅ | ✅ Android | ✅ Temps réel | Gratuit |
| **Comptes & Budget** [^3] | ✅ Windows | ✅ iOS/Android | ✅ Auto/Manuel | Payant |
| **Axonaut** [^4] | ✅ | ✅ | ✅ Cloud | Payant (PME) |

Veux-tu que je :
1. **Adapte ce prompt** pour un module spécifique (ex: juste gestion clients + stocks) ?
2. **Génère le code de départ** (setup initial + 1 module) ?
3. **Te recommande des solutions no-code** (ex: Glide, AppSheet) pour créer plus rapide ?
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.maxicompte.com
[^2]: https://play.google.com/store/apps/details?id=com.mytodolist.taskmanager&hl=fr
[^3]: https://apps.apple.com/fr/app/comptes-et-budget/id1152896788
[^4]: https://www.ringover.fr/blog/logiciel-pme
[^5]: https://www.planet-sansfil.com/wi-fi/my-phone-explorer-2-53/
[^6]: https://www.clubic.com/telecharger/synchronisation-fichiers/
[^7]: https://www.youtube.com/watch?v=IRiDodkjvOU
[^8]: https://www.clubic.com/stockage-en-ligne/guide-404070-meilleur-utilitaire-synchronisation-de-fichiers.html
[^9]: https://www.youtube.com/watch?v=xQO9DoPu0xY
[^10]: https://www.youtube.com/watch?v=QiWLm__OH0k
[^11]: https://www.youtube.com/watch?v=GNzHD73Q2Yo
[^12]: https://www.platane.io/blog/de-lapplication-web-au-logiciel-de-bureau-transformer-votre-crm-react-en-application-electron-autonome
[^13]: https://www.nukoe.com/blog/fr-developper-une-app-cross-platform-qui-semble-native-guide-pratique-pour-2026-mo2i38xw
[^14]: https://megaerp.pcscloud.net/FAQ_WEB/FR/1062-gestion_mobile_connexion_synchronisation_serveur_hfsql-read.awp?AWPID9F1BCBE8=05A724810B396CD2524405C3B49D26A6B503FB67
[^15]: https://docsbot.ai/prompts/programming/gestion-prestataire-expo
[^16]: https://mobiapps.fr/blog/point-sur-le-developpement-dapplications-mobiles-en-cross-platform
[^17]: https://docsbot.ai/prompts/programming/application-gestion-entreprise
[^18]: https://edana.ch/2026/03/25/creer-une-application-mobile-avec-replit-expo-react-native-guide-du-vibe-coding-au-vrai-produit/
[^19]: https://platform.uno/articles/best-cross-platform-frameworks-2026/
[^20]: https://www.youtube.com/watch?v=ieC2KND0Qow```

