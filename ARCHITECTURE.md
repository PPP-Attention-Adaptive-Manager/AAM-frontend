# Architecture du projet AAM Frontend

Ce document décrit l'architecture actuelle du projet `AAM-frontend` après lecture des fichiers de configuration, du shell React, des composants, des pages, de la couche API, du store de profil et de l'intégration Electron.

Le projet est une application desktop Electron avec une interface React/Vite. Le frontend dialogue principalement avec un backend local expose sur `http://127.0.0.1:8000`, et Electron sert de conteneur desktop avec un pont IPC limite pour la persistance locale du profil.

## Vue Globale

```mermaid
flowchart TB
  User["Utilisateur"]
  Electron["Electron main process<br/>electron/main.js"]
  Preload["Preload bridge<br/>electron/preload.js"]
  Renderer["Renderer React/Vite<br/>src/main.jsx + src/App.jsx"]
  Nav["Navigation config<br/>src/config/navConfig.js"]
  Components["Composants shell<br/>NavBar, Sidebar, MainContent"]
  Pages["Pages domaine<br/>Stats, Actions, Settings, Help"]
  Api["Couche API frontend<br/>src/api/*.js"]
  Backend["Backend local<br/>127.0.0.1:8000"]
  ProfileFile["profile.json<br/>Electron userData"]
  BrowserStore["Fallback localStorage<br/>src/lib/profileStore.js"]

  User --> Renderer
  Electron --> Renderer
  Electron --> Preload
  Preload --> Renderer
  Renderer --> Nav
  Renderer --> Components
  Components --> Pages
  Pages --> Api
  Renderer --> Api
  Api --> Backend
  Renderer -. "profil via window.electronAPI si utilise" .-> Preload
  Preload --> Electron
  Electron --> ProfileFile
  Renderer -. "fallback web" .-> BrowserStore
```

### Responsabilites principales

| Zone | Fichiers | Role |
|---|---|---|
| Conteneur desktop | `electron/main.js`, `electron/preload.js` | Cree la fenetre Electron, charge Vite ou `dist/index.html`, expose `window.electronAPI.profile`. |
| Entree React | `src/main.jsx`, `src/App.jsx` | Monte React, initialise profil/session, gere navigation, onboarding et launcher de session. |
| Navigation | `src/config/navConfig.js` | Source unique pour les sections et sous-pages. Il n'y a pas de routeur externe. |
| Shell UI | `src/components/NavBar.jsx`, `Sidebar.jsx`, `MainContent.jsx` | Affiche la barre haute, la navigation secondaire et la page active. |
| Pages | `src/pages/**` | Vues metier: statistiques, actions, reglages, aide. |
| API frontend | `src/api/profile.js`, `session.js`, `actions.js` | Appels HTTP vers le backend local. |
| Profil local | `src/lib/profileStore.js`, `electron/main.js` | Normalisation du profil et persistance locale possible via Electron ou `localStorage`. |
| Styles | `src/App.css`, `src/index.css`, CSS par composant/page | Tokens globaux, layout desktop, styles des modules. |

## Carte Mentale

```mermaid
mindmap
  root((AAM Frontend))
    Desktop
      Electron main
        BrowserWindow 960x720
        dev: Vite localhost:5173
        prod: dist/index.html
      Preload
        contextBridge
        electronAPI.profile.get
        electronAPI.profile.save
    React Shell
      App.jsx
        Profile init
        Session sync
        Theme sync
        Onboarding gate
        Navigation state
      Components
        NavBar
        Sidebar
        MainContent
        SessionLauncher
        FirstRunOnboarding
        InfoPopup
    Navigation
      Stats
        Overview
        Latest Session
        Performance
        History
      Actions
        Quick Actions
        Scheduled
        Logs
      Settings
        General
        Appearance
        Advanced
      Help
        Documentation
        Shortcuts
        About
    API
      Profile
        profile exists
        profile save
        profile get
      Session
        start
        stop
        status
        latest
        stats
      Actions
        quick
        stats
        scheduled
        logs
    Data
      profile.json
      backend sessions
      backend actions
      mock or placeholder UI
```

## Structure Du Projet

```mermaid
flowchart LR
  Root["AAM-frontend"]
  Root --> ElectronDir["electron/"]
  Root --> Src["src/"]
  Root --> Public["public/"]
  Root --> ConfigFiles["package.json<br/>vite.config.js<br/>eslint.config.js"]
  Root --> Docs["README.md<br/>Goals.md"]

  ElectronDir --> MainJs["main.js"]
  ElectronDir --> PreloadJs["preload.js"]

  Src --> ApiDir["api/"]
  Src --> ComponentsDir["components/"]
  Src --> ConfigDir["config/"]
  Src --> LibDir["lib/"]
  Src --> PagesDir["pages/"]
  Src --> AssetsDir["assets/"]
  Src --> EntryFiles["main.jsx<br/>App.jsx<br/>App.css<br/>index.css"]

  PagesDir --> StatsDir["stats/"]
  PagesDir --> ActionsDir["actions/"]
  PagesDir --> SettingsDir["settings/"]
  PagesDir --> HelpDir["help/"]
```

## Pipeline De Demarrage

```mermaid
sequenceDiagram
  autonumber
  participant User as Utilisateur
  participant Npm as npm scripts
  participant Vite as Vite dev server
  participant Electron as Electron main
  participant React as React renderer
  participant Backend as Backend 127.0.0.1:8000

  User->>Npm: npm run dev
  Npm->>Vite: demarre localhost:5173
  User->>Npm: npm run electron
  Npm->>Electron: attend Vite puis lance Electron
  Electron->>React: charge http://localhost:5173
  React->>Backend: GET /profile/exists
  React->>Backend: GET /session/status
  React-->>User: affiche onboarding ou app principale
```

### Scripts disponibles

| Script | Effet |
|---|---|
| `npm run dev` | Lance le serveur Vite sur le port `5173`. |
| `npm run build` | Build le renderer dans `dist/`. |
| `npm run preview` | Sert le build Vite localement. |
| `npm run lint` | Lance ESLint. |
| `npm run electron` | Attend `localhost:5173`, puis lance Electron. |
| `npm run electron:dev` | Lance Vite et Electron ensemble avec `wait-on`. |
| `npm run electron:build` | Build Vite puis lance Electron. |

## Architecture React

`App.jsx` est le centre de coordination. Il gere:

- l'etat de navigation: `activeNav` et `activeSub`;
- le chargement du profil;
- la decision d'afficher l'onboarding ou l'application;
- la synchronisation periodique du statut de session;
- le demarrage et l'arret d'une session;
- l'application du theme dans `document.documentElement`.

```mermaid
flowchart TD
  Main["src/main.jsx"]
  App["App.jsx"]
  ProfileInit["useEffect: init profile"]
  SessionSync["useEffect: session status polling<br/>toutes les 2 secondes"]
  ThemeSync["useEffect: data-theme"]
  OnboardingGate{"profile.firstTime<br/>est false ?"}
  Onboarding["FirstRunOnboarding"]
  Shell["Application shell"]
  NavBar["NavBar"]
  Sidebar["Sidebar"]
  MainContent["MainContent"]
  Page["Page active<br/>depuis NAV_CONFIG"]
  Launcher{"showLauncher ?"}
  SessionLauncher["SessionLauncher"]

  Main --> App
  App --> ProfileInit
  App --> SessionSync
  App --> ThemeSync
  App --> OnboardingGate
  OnboardingGate -- Non --> Onboarding
  OnboardingGate -- Oui --> Shell
  Shell --> NavBar
  Shell --> Sidebar
  Shell --> MainContent
  MainContent --> Page
  Shell --> Launcher
  Launcher -- Oui --> SessionLauncher
```

## Pipeline Navigation Et Rendu

La navigation n'utilise pas `react-router`. La configuration `NAV_CONFIG` contient les sections, les sous-sections et les composants a rendre.

```mermaid
flowchart LR
  ClickTop["Clic NavBar<br/>section"]
  HandleNav["handleNavChange(navId)"]
  ActiveNav["setActiveNav(navId)"]
  FirstSub["setActiveSub(premiere sous-page)"]

  ClickSide["Clic Sidebar<br/>sous-section"]
  HandleSub["handleSubChange(subId)"]
  ActiveSub["setActiveSub(subId)"]

  Config["NAV_CONFIG"]
  CurrentNav["currentNav"]
  CurrentSub["currentSub"]
  MainContent["MainContent"]
  PageComponent["const Page = sub.component"]
  Render["Rendu de la page active"]

  ClickTop --> HandleNav --> ActiveNav --> CurrentNav
  HandleNav --> FirstSub --> CurrentSub
  ClickSide --> HandleSub --> ActiveSub --> CurrentSub
  Config --> CurrentNav
  Config --> CurrentSub
  CurrentNav --> MainContent
  CurrentSub --> MainContent
  MainContent --> PageComponent --> Render
```

### Table des routes internes

| Section | Sous-pages | Composants |
|---|---|---|
| `stats` | `overview`, `latest`, `performance`, `history` | `StatsOverview`, `LatestSession`, `StatsPerformance`, `StatsHistory` |
| `actions` | `quick`, `scheduled`, `logs` | `QuickActions`, `ScheduledActions`, `ActionLogs` |
| `settings` | `general`, `appearance`, `advanced` | `GeneralSettings`, `AppearanceSettings`, `AdvancedSettings` |
| `help` | `docs`, `shortcuts`, `about` | `Documentation`, `Shortcuts`, `About` |

Pour ajouter une page, il faut creer le composant, l'importer dans `navConfig.js`, puis l'ajouter dans le tableau `subtopics`.

## Pipeline Profil Et Onboarding

Il existe deux chemins de profil dans le code:

- le chemin actuellement utilise par `App.jsx` et `FirstRunOnboarding.jsx`: appels HTTP vers le backend via `src/api/profile.js`;
- le chemin Electron/local fallback dans `src/lib/profileStore.js`, capable d'utiliser `window.electronAPI.profile` ou `localStorage`.

```mermaid
sequenceDiagram
  autonumber
  participant App as App.jsx
  participant ProfileApi as src/api/profile.js
  participant Backend as Backend /profile
  participant Onboarding as FirstRunOnboarding
  participant Settings as Settings pages

  App->>ProfileApi: getProfileExists()
  ProfileApi->>Backend: GET /profile/exists
  Backend-->>ProfileApi: { exists }

  alt profil absent
    App->>ProfileApi: saveProfile(defaultProfile)
    ProfileApi->>Backend: POST /profile/save
    App-->>Onboarding: affiche onboarding
  else profil present
    App->>ProfileApi: getProfile()
    ProfileApi->>Backend: GET /profile
    App-->>App: setProfile(loaded)
  end

  Onboarding->>ProfileApi: saveProfile(profile firstTime=false)
  ProfileApi->>Backend: POST /profile/save
  Onboarding-->>App: onComplete(profile)

  Settings->>App: onProfileChange(nextProfile)
  App->>ProfileApi: saveProfile(nextProfile)
  ProfileApi->>Backend: POST /profile/save
  App-->>Settings: profile mis a jour
```

### Modele de profil

```mermaid
classDiagram
  class Profile {
    boolean firstTime
    string name
    Onboarding onboarding
    Appearance appearance
    Settings settings
    Advanced advanced
  }

  class Onboarding {
    string profession
    string[] work_activities
    string[] distractions
    string focus_style
    string override_protocol
  }

  class Appearance {
    string theme
    string density
    string accent
  }

  class Settings {
    boolean launchAtStartup
    string mode
  }

  class Advanced {
    boolean listenNotifications
    boolean viewBrowserTabs
    boolean viewApplications
    boolean mouseTracking
    boolean keyboardTracking
    boolean delayNotifications
    boolean closeTabs
    boolean closeApps
  }

  Profile --> Onboarding
  Profile --> Appearance
  Profile --> Settings
  Profile --> Advanced
```

### Etat onboarding

```mermaid
stateDiagram-v2
  [*] --> LoadingProfile
  LoadingProfile --> FirstRun: profil absent ou firstTime != false
  LoadingProfile --> MainApp: firstTime == false

  FirstRun --> Booting
  Booting --> PoweringOn: sequence terminee
  PoweringOn --> ActiveQuestions
  ActiveQuestions --> ActiveQuestions: reponse question suivante
  ActiveQuestions --> SaveProfile: derniere reponse
  SaveProfile --> MainApp: firstTime=false

  MainApp --> FirstRun: logout ou reset onboarding
```

## Pipeline Session

La session est pilotee depuis `NavBar` et `SessionLauncher`, puis confirmee par le backend via polling.

```mermaid
sequenceDiagram
  autonumber
  participant User as Utilisateur
  participant NavBar as NavBar
  participant App as App.jsx
  participant Launcher as SessionLauncher
  participant Api as src/api/session.js
  participant Backend as Backend /session

  User->>NavBar: Start Session
  NavBar->>App: onStartSession()
  App->>Launcher: showLauncher=true
  User->>Launcher: saisit goal, permissions, duree
  Launcher->>Api: startSession(payload)
  Api->>Backend: POST /session/start
  Backend-->>Api: status/config
  Launcher->>App: onStart(result)
  App->>Api: startSession(result)
  Api->>Backend: POST /session/start
  Backend-->>Api: status/config ou already_running

  alt backend confirme une session active
    App->>Api: getSessionStatus()
    Api->>Backend: GET /session/status
    Backend-->>App: active + config
    App-->>NavBar: RUNNING
  else already_running
    App-->>NavBar: statut conserve jusqu'au prochain polling
  end

  loop toutes les 2 secondes
    App->>Api: getSessionStatus()
    Api->>Backend: GET /session/status
    Backend-->>App: active + config
  end

  User->>NavBar: Stop Session
  NavBar->>App: onStopSession()
  App->>Api: stopSession()
  Api->>Backend: POST /session/stop
  App->>Api: getSessionStatus()
  App-->>NavBar: IDLE
```

### Payload envoye au demarrage

```mermaid
flowchart TD
  Form["SessionLauncher form"]
  Goal["goal"]
  Duration["duration_minutes"]
  Permissions["permissions"]
  Payload["Payload POST /session/start"]

  Permissions --> Keyboard["keyboard_tracking_enabled"]
  Permissions --> Mouse["mouse_tracking_enabled"]
  Permissions --> Notifications["notification_tracking_enabled"]
  Permissions --> Apps["app_tracking_enabled"]

  Form --> Goal
  Form --> Duration
  Form --> Permissions
  Goal --> Payload
  Duration --> Payload
  Keyboard --> Payload
  Mouse --> Payload
  Notifications --> Payload
  Apps --> Payload
  Payload --> Mode["mode: experimental"]
```

## Pipelines De Donnees Des Pages

```mermaid
flowchart TB
  Pages["Pages React"]
  SessionApi["src/api/session.js"]
  ActionsApi["src/api/actions.js"]
  ProfileApi["src/api/profile.js"]
  Backend["Backend local"]

  StatsOverview["StatsOverview"]
  LatestSession["LatestSession"]
  StatsPerformance["StatsPerformance"]
  StatsHistory["StatsHistory"]
  QuickActions["QuickActions"]
  Scheduled["ScheduledActions"]
  Logs["ActionLogs"]
  Settings["Settings pages"]

  Pages --> StatsOverview
  Pages --> LatestSession
  Pages --> StatsPerformance
  Pages --> StatsHistory
  Pages --> QuickActions
  Pages --> Scheduled
  Pages --> Logs
  Pages --> Settings

  StatsOverview -->|"GET /session/stats"| SessionApi
  LatestSession -->|"GET /session/latest"| SessionApi
  QuickActions -->|"GET /actions/quick<br/>GET /actions/stats"| ActionsApi
  Scheduled -->|"GET /actions/scheduled"| ActionsApi
  Logs -->|"GET /actions/logs"| ActionsApi
  Settings -->|"POST /profile/save"| ProfileApi

  SessionApi --> Backend
  ActionsApi --> Backend
  ProfileApi --> Backend

  StatsPerformance -. "donnees statiques actuelles" .-> StatsPerformance
  StatsHistory -. "donnees statiques actuelles" .-> StatsHistory
```

### Endpoints consommes actuellement

| Module | Endpoint | Methode | Utilisation |
|---|---:|---:|---|
| `api/profile.js` | `/profile/exists` | `GET` | Savoir si un profil existe. |
| `api/profile.js` | `/profile` | `GET` | Charger le profil. |
| `api/profile.js` | `/profile/save` | `POST` | Sauvegarder profil, onboarding, reglages. |
| `api/session.js` | `/session/start` | `POST` | Demarrer une session. |
| `api/session.js` | `/session/stop` | `POST` | Arreter une session. |
| `api/session.js` | `/session/status` | `GET` | Synchroniser le statut de session. |
| `api/session.js` | `/session/latest` | `GET` | Afficher la derniere session terminee. |
| `api/session.js` | `/session/stats` | `GET` | Alimenter le tableau de bord global. |
| `api/actions.js` | `/actions/quick` | `GET` | Lister les actions rapides. |
| `api/actions.js` | `/actions/stats` | `GET` | Recuperer les metriques d'actions. |
| `api/actions.js` | `/actions/scheduled` | `GET` | Recuperer la timeline d'automatisation. |
| `api/actions.js` | `/actions/logs` | `GET` | Recuperer les logs d'actions. |

## Pipeline Stats

```mermaid
flowchart LR
  Profile["Profil utilisateur"]
  StatsOverview["StatsOverview"]
  StatsApi["getSessionStats()"]
  BackendStats["GET /session/stats"]
  Metrics["Cartes: sessions, duree, events"]
  Coverage["Barres: modality_coverage"]
  Goals["Top goals: goal_distribution"]
  Timeline["Timeline: sessions_by_date"]

  Profile -->|"briefing personnalise"| StatsOverview
  StatsOverview --> StatsApi --> BackendStats
  BackendStats --> Metrics
  BackendStats --> Coverage
  BackendStats --> Goals
  BackendStats --> Timeline
```

```mermaid
flowchart LR
  LatestPage["LatestSession"]
  LatestApi["getLatestSession()"]
  LatestEndpoint["GET /session/latest"]
  Summary["resume session<br/>id, goal, start, end, duration"]
  Features["features.features<br/>par modalite"]
  Graph["graph<br/>windows, nodes, edges"]
  Model["model_output<br/>attention, fatigue, cognitive_load"]

  LatestPage --> LatestApi --> LatestEndpoint
  LatestEndpoint --> Summary
  LatestEndpoint --> Features
  LatestEndpoint --> Graph
  LatestEndpoint --> Model
```

`StatsPerformance` et `StatsHistory` utilisent encore des tableaux statiques. `Goals.md` indique que ces vues doivent etre remplacees progressivement par des reponses backend, notamment autour des features, graphes et predictions.

## Pipeline Actions

```mermaid
sequenceDiagram
  autonumber
  participant Page as QuickActions
  participant Api as api/actions.js
  participant Backend as Backend /actions

  Page->>Api: Promise.all(getQuickActions(), getActionStats())
  Api->>Backend: GET /actions/quick
  Api->>Backend: GET /actions/stats
  Backend-->>Page: actions + stats
  Page-->>Page: cartes metriques, liste d'actions, sparkline
```

```mermaid
flowchart TD
  Actions["Actions section"]
  Quick["QuickActions<br/>actions rapides + stats"]
  Scheduled["ScheduledActions<br/>timeline backend"]
  Logs["ActionLogs<br/>feed backend"]
  Api["src/api/actions.js"]

  Actions --> Quick
  Actions --> Scheduled
  Actions --> Logs
  Quick -->|"quick + stats"| Api
  Scheduled -->|"scheduled"| Api
  Logs -->|"logs"| Api
```

## Pipeline Settings

```mermaid
flowchart TD
  Profile["profile state dans App.jsx"]
  General["GeneralSettings"]
  Appearance["AppearanceSettings"]
  Advanced["AdvancedSettings"]
  OnProfileChange["onProfileChange(nextProfile)"]
  Save["saveProfileAPI(payload)"]
  Backend["POST /profile/save"]
  ThemeEffect["App.jsx useEffect<br/>set data-theme"]
  Html["document.documentElement"]

  Profile --> General
  Profile --> Appearance
  Profile --> Advanced
  General --> OnProfileChange
  Appearance --> OnProfileChange
  Advanced --> OnProfileChange
  OnProfileChange --> Save --> Backend
  OnProfileChange --> Profile
  Profile --> ThemeEffect --> Html
```

Les reglages generaux modifient `name`, `profession`, `focus_style`, `launchAtStartup` et `mode`.
Les reglages d'apparence modifient `appearance.theme`, `appearance.density` et `appearance.accent`.
Les reglages avances modifient `advanced` et peuvent remettre `firstTime` a `true` pour relancer l'onboarding.

## Integration Electron

```mermaid
flowchart LR
  Main["electron/main.js"]
  BrowserWindow["BrowserWindow"]
  Preload["electron/preload.js"]
  ContextBridge["contextBridge.exposeInMainWorld"]
  Renderer["React renderer"]
  IpcGet["ipcMain.handle profile:get"]
  IpcSave["ipcMain.handle profile:save"]
  ProfileJson["profile.json dans app.getPath('userData')"]

  Main --> BrowserWindow
  BrowserWindow --> Preload
  Preload --> ContextBridge
  ContextBridge --> Renderer
  Renderer -->|"window.electronAPI.profile.get()"| IpcGet
  Renderer -->|"window.electronAPI.profile.save(profile)"| IpcSave
  IpcGet --> ProfileJson
  IpcSave --> ProfileJson
```

Point important: le shell React actuel (`App.jsx`) utilise `src/api/profile.js`, donc le backend `/profile/*`, plutot que `src/lib/profileStore.js`. Le pont Electron reste disponible pour un mode offline/local ou pour une future reunification du stockage.

## Etat Actuel Des Donnees

```mermaid
flowchart TD
  Real["Donnees backend reelles ou attendues"]
  Mock["Donnees mockees / statiques"]
  Hybrid["Hybride"]

  Real --> ProfileApi["Profile API<br/>/profile/*"]
  Real --> SessionStatus["Session status<br/>/session/status"]
  Real --> Latest["Latest session<br/>/session/latest"]
  Real --> SessionStats["Session stats<br/>/session/stats"]
  Real --> ActionsApi["Actions API<br/>/actions/*"]

  Mock --> Performance["StatsPerformance"]
  Mock --> History["StatsHistory"]

  Hybrid --> Help["Help docs mentionnent encore mock data"]
  Hybrid --> ElectronProfile["Electron profile bridge present<br/>mais non central dans App.jsx"]
```

## Pipeline Cible Indique Par Goals.md

`Goals.md` decrit la prochaine etape: supprimer les donnees mockees et connecter davantage de sorties backend.

```mermaid
flowchart LR
  Recorder["Backend recorder"]
  Session["Session complete"]
  Features["Feature engineering"]
  Graph["Graph generation"]
  Prediction["Fusion model predictions"]
  Recommendations["LinUCB recommendations"]
  FrontendApi["Frontend API layer"]
  Dashboard["Stats / Latest Session / Actions"]

  Recorder --> Session
  Session --> Features
  Features --> Graph
  Features --> Prediction
  Prediction --> Recommendations
  Graph --> FrontendApi
  Prediction --> FrontendApi
  Recommendations --> FrontendApi
  FrontendApi --> Dashboard
```

Endpoints cibles cites ou suggeres:

| Endpoint cible | But |
|---|---|
| `/session/latest/features` | Afficher les features clavier, souris, notifications, systeme, contexte. |
| `/session/latest/predictions` | Afficher attention, fatigue, cognitive load et autres sorties modele. |
| `/session/latest/graph` ou `/graphviewer/latest` | Visualiser les transitions, noeuds et relations d'activite. |
| `/session/latest/recommendations` | Afficher recommandations, pauses, interventions et actions personnalisees. |

## Dependances Et Build

```mermaid
flowchart LR
  React["react + react-dom"]
  Vite["vite + @vitejs/plugin-react"]
  Electron["electron"]
  WaitOn["wait-on"]
  Icons["lucide-react"]
  ESLint["eslint + plugins"]
  App["AAM frontend"]

  React --> App
  Vite --> App
  Electron --> App
  WaitOn --> App
  Icons --> App
  ESLint --> App
```

Remarques:

- `src/api/profile.js` importe `axios`.
- `package-lock.json` contient `axios`, mais `package.json` ne le liste pas dans `dependencies`.
- `src/api/session.js` et `src/api/actions.js` utilisent `fetch`.
- `src/index.css` contient encore des tokens generiques de template Vite, tandis que le layout reel est surtout dans `src/App.css` et les CSS de pages/composants.

## Risques Et Points D'Attention

| Sujet | Observation | Impact possible |
|---|---|---|
| Deux systemes de profil | Backend `/profile/*` et `profileStore` Electron/local coexistent. | Risque de divergence si les deux sont utilises en meme temps. |
| `axios` non declare dans `package.json` | Import present dans `src/api/profile.js`, lockfile present. | Installation propre peut echouer si `node_modules` est regenere uniquement depuis `package.json`. |
| SessionLauncher appelle aussi `startSession` | `SessionLauncher` appelle `startSession(payload)`, puis `App.handleSessionStart` rappelle `startSession(config)` car `onStart` recoit le resultat et non le payload attendu. | Risque de double appel `/session/start` ou de payload incorrect au second appel. |
| Donnees mockees restantes | `StatsPerformance`, `StatsHistory` et certains textes d'aide restent statiques. | Les dashboards peuvent donner une impression de donnees reelles alors que certaines vues ne le sont pas. |
| Backend hardcode | Les URLs API sont codees en dur sur `http://127.0.0.1:8000`. | Changement d'environnement plus difficile sans variable de configuration. |
| Raccourcis non branches | `Help/Shortcuts.jsx` liste des raccourcis, mais aucune logique globale ne les implemente. | Documentation utilisateur potentiellement trompeuse. |

## Lecture Rapide Pour Developpeur

```mermaid
flowchart TD
  ChangePage["Ajouter une page"]
  ChangePage --> CreateComponent["Creer composant dans src/pages/..."]
  CreateComponent --> ImportNav["Importer dans navConfig.js"]
  ImportNav --> AddSubtopic["Ajouter subtopic avec component"]
  AddSubtopic --> DonePage["NavBar, Sidebar et MainContent la rendent automatiquement"]

  AddApi["Ajouter un flux backend"]
  AddApi --> ApiWrapper["Creer/etendre wrapper dans src/api"]
  ApiWrapper --> PageEffect["Appeler depuis useEffect de la page"]
  PageEffect --> LoadingError["Ajouter loading et error state"]
  LoadingError --> RenderData["Rendre cartes, listes ou graphes"]

  ChangeProfile["Modifier le profil"]
  ChangeProfile --> SettingsPage["Passer par Settings page"]
  SettingsPage --> OnProfileChange["onProfileChange(nextProfile)"]
  OnProfileChange --> SaveBackend["POST /profile/save"]
  SaveBackend --> AppState["setProfile(payload)"]
```

## Resume

AAM Frontend est un shell desktop React/Electron centre sur quatre domaines: statistiques, actions, reglages et aide. La navigation est entierement declarative via `NAV_CONFIG`. `App.jsx` est l'orchestrateur principal: il charge le profil, decide l'onboarding, synchronise le statut de session, applique le theme et rend la page active.

Le backend local est deja branche pour les profils, sessions, statistiques et actions. La prochaine evolution architecturale consiste a supprimer les donnees mockees restantes, unifier le stockage de profil, parametrer l'URL backend, puis connecter les pipelines de features, graphes, predictions et recommandations decrits dans `Goals.md`.
