# Historique du dépôt AAM Frontend — dossier préparatoire pour un papier de recherche

## Fiche d'identification

- **Dépôt analysé :** `PPP-Attention-Adaptive-Manager/AAM-frontend`
- **Période couverte par les commits :** du 30 mai 2026 à 20:49 (+01:00) au 2 juin 2026 à 21:09 (+01:00)
- **Date de l'analyse :** 19 septembre 2026
- **Périmètre :** les 16 commits uniques accessibles depuis toutes les références Git locales et distantes présentes dans le clone
- **État de travail au début de l'analyse :** propre, branche locale `main`, commit `1277de6`
- **État le plus avancé du code :** branche distante `origin/fusion`, commit `215cb22`
- **Autre pointe non fusionnée :** branche distante `origin/hotfixes`, commit `8191712`, qui ajoute uniquement `ARCHITECTURE.md` après l'ancêtre commun `c3cc1f3`
- **Nature du document :** analyse rétrospective du dépôt. Ce fichier lui-même ne fait pas partie de l'historique étudié.

## Résumé exécutif

Le dépôt documente un développement très concentré, réalisé en environ **72 h 20 min**. Il passe d'un prototype d'interface React/Electron à un frontend modulaire pour un gestionnaire adaptatif de l'attention, nommé AAM. L'évolution observée suit quatre étapes : création du prototype et choix technologiques, structuration de l'interface, ajout des parcours utilisateur avec données simulées, puis connexion progressive à un backend local pour les profils, les sessions, les statistiques, les actions et les prédictions en direct.

Le résultat logiciel le plus avancé est visible dans `origin/fusion` et non dans `main`. Il comprend notamment :

- une application de bureau Electron avec renderer React/Vite ;
- une navigation déclarative sans bibliothèque de routage ;
- un onboarding et un modèle de profil ;
- un lanceur de sessions avec objectif, durée et permissions de collecte ;
- un polling de l'état des sessions ;
- des écrans alimentés par `/session/latest`, `/session/stats` et `/actions/*` ;
- une réception de prédictions en direct par Server-Sent Events (SSE) ;
- des vues de synthèse pour les features, graphes et sorties du modèle.

Cependant, le dépôt **ne contient pas de preuve expérimentale** permettant de conclure que le système améliore l'attention, la productivité ou la charge cognitive. Il ne contient ni tests automatisés, ni protocole utilisateur, ni dataset, ni mesures de performance, ni résultats statistiques, ni release étiquetée. Les « résultats » défendables dans un article sont donc, à ce stade, des résultats d'implémentation et d'intégration statique, pas des résultats scientifiques sur l'efficacité du système.

## Méthode et règles d'interprétation

L'analyse repose sur les objets Git disponibles dans le clone : graphe des commits, auteurs, dates, messages, statistiques `numstat`, différences entre commits, contenu des fichiers à chaque révision, branches et tags.

Trois niveaux de preuve sont utilisés :

1. **Observé** : présent directement dans le code ou dans l'historique Git.
2. **Déclaré** : annoncé dans un message de commit ou un document, sans preuve d'exécution suffisante dans ce dépôt.
3. **Inféré** : interprétation vraisemblable de la décision technique ; elle doit être confirmée par les auteurs avant publication.

Les statistiques d'ajouts et suppressions portent sur les lignes textuelles. L'image binaire `src/assets/hero.png` n'est pas comptabilisée dans ces lignes. Les nombres cumulés mesurent l'activité de modification et non la taille finale du logiciel.

## Vue quantitative

| Indicateur | Valeur observée |
|---|---:|
| Commits uniques, toutes branches | 16 |
| Contributeurs identifiés par Git | 3 |
| Commits d'elyes aissa | 8 |
| Commits de mohannedbt | 7 |
| Commits de Medmas07 | 1 |
| Ajouts textuels cumulés | 12 265 |
| Suppressions textuelles cumulées | 913 |
| Activité textuelle cumulée | 13 178 lignes |
| Fichiers à la pointe de `main` | 48 |
| Fichiers à la pointe de `fusion` | 53 |
| Fichiers à la pointe de `hotfixes` | 54 |
| Tags / versions Git | 0 |
| Commits de fusion Git | 0 |
| Tests automatisés repérés | 0 |
| Workflow CI repéré | 0 |

La forte proportion d'ajouts par rapport aux suppressions est cohérente avec un dépôt en phase de création. Le nombre de commits seul ne doit pas servir à mesurer la contribution intellectuelle ou la qualité : plusieurs commits contiennent de gros fichiers de documentation ou un lockfile généré.

## Topologie des branches

```text
5acd961 ... 1277de6  main, feat/LoginUI
                   \
                    33d94b8 -- 4cce90f -- de1c38d  feat/RecordLink
                                                \
                                                 1a32682 -- 45cd028 -- c3cc1f3
                                                                           |\
                                                                           | 8191712  hotfixes
                                                                           |
                                                                           215cb22  fusion
```

Tous les commits sont linéaires jusqu'à `c3cc1f3`. Ensuite, deux commits indépendants partent du même ancêtre : `8191712` ajoute la documentation d'architecture, tandis que `215cb22` poursuit le code fonctionnel. Aucun commit ne réunit ces deux pointes. Par conséquent, aucune branche ne contient simultanément la version fonctionnelle la plus avancée et `ARCHITECTURE.md`.

## Chronologie détaillée, commit par commit

### 1. `5acd961` — 30 mai 2026 — initial commit

**Auteur :** elyes aissa — **volume :** 3 805 ajouts textuels, aucune suppression, 17 fichiers dont un binaire.

- **Observé :** création du socle React 19, Vite 8 et Electron 42 ; ajout d'ESLint, de la fenêtre Electron, de l'entrée React, des styles, des icônes et d'un premier écran statique.
- **Décision inférée :** faire d'AAM une application de bureau web-native, avec React pour l'interface et Electron pour l'accès au système.
- **Résultat :** prototype visuel exécutable en développement, centré sur des préférences et le contrôle de l'attention.
- **Limite :** le README est encore celui du template Vite et l'interface est monolithique. Aucun backend ni protocole de mesure n'apparaît.

### 2. `bfa696f` — 30 mai 2026 — updated README

**Auteur :** elyes aissa — **volume :** 154 ajouts, 9 suppressions.

- **Observé :** remplacement du README générique par une description d'une application Windows de gestion des préférences et autorisations.
- **Décision déclarée :** persister les réglages localement et préparer une connexion backend.
- **Résultat :** première formulation du produit, de ses fonctionnalités et de son mode d'installation.
- **Limite :** le README annonce `electron-store`, mais cette dépendance n'est pas présente dans `package.json`. L'annonce est donc une intention documentaire, pas une réalisation démontrée.

### 3. `9b49862` — 31 mai 2026 — layout

**Auteur :** elyes aissa — **volume :** 492 ajouts, 300 suppressions.

- **Observé :** décomposition de `App.jsx` en `NavBar`, `Sidebar` et `MainContent` ; création de `navConfig.js` ; refonte importante des styles.
- **Décision inférée :** remplacer l'écran monolithique par un shell modulaire et piloter la navigation depuis une configuration centrale.
- **Résultat :** quatre domaines fonctionnels sont posés : statistiques, actions, réglages et aide.
- **Intérêt scientifique :** ce commit matérialise la séparation entre l'infrastructure d'interaction et les futurs modules d'adaptation.

### 4. `04c1299` — 31 mai 2026 — updated README & added copilot instructions

**Auteur :** elyes aissa — **volume :** 277 ajouts, 107 suppressions.

- **Observé :** documentation de l'architecture de navigation, de l'IPC Electron et des règles de style ; ajout d'instructions de contribution assistée.
- **Décision déclarée :** `navConfig.js` devient la source unique de vérité pour le routage ; aucune bibliothèque comme React Router ne doit être introduite.
- **Résultat :** les conventions architecturales sont explicitées très tôt.
- **Limite :** le README documente certaines commandes (`start`, `dist` ou `electron` selon les versions) qui ne correspondent pas toujours aux scripts réellement disponibles.

### 5. `9e6c295` — 31 mai 2026 — core settings: highly negotiable

**Auteur :** elyes aissa — **volume :** 552 ajouts, 13 suppressions.

- **Observé :** création des pages `General` et `Advanced`, de leurs styles et de leur branchement dans la navigation.
- **Décision inférée :** construire rapidement un premier modèle de réglages, explicitement considéré comme révisable par le message « highly negotiable ».
- **Résultat :** l'architecture passe du simple shell à des écrans fonctionnels de configuration.
- **Limite :** les choix de paramètres ne sont pas reliés à une justification expérimentale dans ce dépôt.

### 6. `c3d7bd4` — 31 mai 2026 — interface, mock data, onboarding and dialogue

**Auteur :** mohannedbt — **volume :** 3 578 ajouts, 170 suppressions, 33 fichiers modifiés.

- **Observé :** ajout de l'onboarding, d'un dialogue d'information, des vues statistiques, actions, aide et apparence ; ajout d'un stockage de profil JSON par IPC Electron avec fallback `localStorage` ; fermeture de la fenêtre à 960 × 720 et désactivation du redimensionnement.
- **Décision déclarée :** utiliser des données simulées pour compléter rapidement l'expérience de bout en bout avant disponibilité complète du backend.
- **Décision de sécurité observée :** conserver `nodeIntegration: false` et `contextIsolation: true`, avec une API minimale exposée par `preload.js`.
- **Résultat :** premier démonstrateur riche couvrant la majorité des écrans et le premier démarrage utilisateur.
- **Limite :** de nombreux chiffres et constats affichés sont fictifs. Ils ne peuvent pas être cités comme résultats utilisateur.

### 7. `2a7293d` — 1er juin 2026 — Record tool interface

**Auteur :** mohannedbt — **volume :** 324 ajouts, 4 suppressions.

- **Observé :** ajout de `SessionLauncher`, de son parcours en plusieurs étapes, de la durée, du but et des permissions ; intégration dans le shell et la barre de navigation.
- **Décision déclarée :** terminer l'interface d'enregistrement avant son branchement complet au backend.
- **Résultat :** l'utilisateur peut configurer visuellement une session de collecte.
- **Limite :** le message confirme que le lien backend reste à faire.

### 8. `1277de6` — 1er juin 2026 — config vite

**Auteur :** mohannedbt — **volume :** 3 ajouts.

- **Observé :** ajout de `resolve.dedupe` pour `react` et `react-dom` dans Vite.
- **Décision inférée :** éviter plusieurs instances de React et les erreurs de hooks associées.
- **Résultat :** c'est la pointe actuelle de `main` et de `feat/LoginUI`.
- **Limite organisationnelle :** tout le travail backend ultérieur demeure absent de `main`.

### 9. `33d94b8` — 1er juin 2026 — profile, goal and session integration

**Auteur :** mohannedbt — **volume :** 484 ajouts, 127 suppressions.

- **Observé :** ajout de wrappers HTTP pour `/profile/*` et `/session/*` sur `http://127.0.0.1:8000` ; intégration du but de session ; démarrage, arrêt et polling du statut ; utilisation du profil backend dans l'onboarding et l'application.
- **Décision inférée :** déplacer la source de vérité du profil et des sessions vers un service backend local.
- **Résultat :** première intégration frontend-backend substantielle.
- **Limites :** URL codée en dur ; coexistence du stockage Electron/local et du profil backend ; import d'`axios` sans déclaration correspondante dans `package.json` ; logique initiale susceptible d'appeler deux fois `/session/start`.

### 10. `4cce90f` — 1er juin 2026 — tweak bugs

**Auteur :** mohannedbt — **volume :** 1 ajout, 1 suppression.

- **Observé :** correction de l'import de `createDefaultProfile` pour pointer vers `src/lib/profileStore.js` au lieu d'un module inexistant.
- **Résultat :** suppression d'une erreur d'import bloquante probable.
- **Remarque :** le message de commit est peu descriptif ; le diff est nécessaire pour connaître la correction réelle.

### 11. `de1c38d` — 2 juin 2026 — session/onboarding configured, still mock data

**Auteur :** mohannedbt — **volume :** 592 ajouts, 1 suppression.

- **Observé :** ajout de `Goals.md` (591 lignes) et correction du script Electron avec un test PowerShell après `wait-on`.
- **Déclaré dans `Goals.md` :** le backend sait démarrer/arrêter des sessions, exécuter le recorder, produire des features, graphes et sorties ; la priorité devient la suppression des mocks et la connexion des vues aux API.
- **Résultat :** formalisation d'une feuille de route d'intégration en dix chantiers.
- **Écart important :** malgré le message du commit, aucun code de profil, d'onboarding ou de session n'est modifié ici. La majeure partie du commit est documentaire.

### 12. `1a32682` — 2 juin 2026 — first hotfixing

**Auteur :** elyes aissa — **volume :** 245 ajouts, 10 suppressions.

- **Observé :** ajout de `/session/latest`, création de la page `LatestSession`, ajout du suivi des applications aux permissions et branchement de cette nouvelle page dans la navigation.
- **Décision inférée :** exposer d'abord une synthèse de la dernière session terminée, afin de rendre visibles les productions du pipeline backend.
- **Résultat :** première vue post-session alimentée par une API.

### 13. `45cd028` — 2 juin 2026 — second hotfixing

**Auteur :** elyes aissa — **volume :** 291 ajouts, 87 suppressions.

- **Observé :** ajout de `/session/stats` et remplacement des mocks de `StatsOverview` par des métriques backend : nombre et durée des sessions, événements, couverture des modalités, buts et chronologie.
- **Décision observée :** introduire des états de chargement et d'erreur au lieu de masquer une indisponibilité backend par des chiffres simulés.
- **Résultat :** le tableau de bord principal devient piloté par des données réelles attendues du backend.
- **Limite :** `StatsPerformance` et `StatsHistory` restent explicitement statiques et simulés.

### 14. `c3cc1f3` — 2 juin 2026 — third hotfixing (actions)

**Auteur :** elyes aissa — **volume :** 176 ajouts, 65 suppressions.

- **Observé :** création de `/actions/quick`, `/actions/stats`, `/actions/scheduled` et `/actions/logs` ; remplacement des tableaux simulés des trois pages Actions ; ajout des états de chargement et d'erreur.
- **Décision inférée :** appliquer à toutes les vues Actions la même migration mock-vers-API que pour les statistiques.
- **Résultat :** la section Actions devient dépendante des réponses du backend plutôt que de constantes locales.
- **État architectural :** ce commit est le dernier ancêtre commun aux pointes `fusion` et `hotfixes`.

### 15. `8191712` — 2 juin 2026 — Architecture.md added

**Auteur :** Medmas07 — **volume :** 759 ajouts.

- **Observé :** ajout d'une documentation détaillée avec diagrammes des flux de navigation, profils, sessions, statistiques, actions et Electron.
- **Résultat :** cartographie technique utile pour la reproductibilité et l'onboarding des développeurs.
- **Apport analytique :** le document relève lui-même plusieurs risques : deux systèmes de profil, `axios` non déclaré, double démarrage de session, mocks résiduels et URL backend en dur.
- **Limite de gouvernance :** ce document est uniquement sur `origin/hotfixes` et n'est pas fusionné dans la pointe fonctionnelle `origin/fusion`.

### 16. `215cb22` — 2 juin 2026 — the front frontend work

**Auteur :** mohannedbt — **volume :** 532 ajouts, 19 suppressions.

- **Observé :** correction du double appel à `startSession` ; ajout de `concurrently` ; ajout de `/session/live/predictions/latest` et d'un flux SSE `/session/live/predictions/stream` ; enrichissement majeur de `LatestSession` avec état du flux, scores en direct, features, résumé du graphe et sorties du modèle.
- **Décision inférée :** séparer la commande de démarrage, exécutée dans `SessionLauncher`, de la synchronisation d'état dans `App`, puis fournir une boucle de retour quasi temps réel pour les prédictions.
- **Résultat :** version fonctionnelle la plus avancée du frontend, sur `origin/fusion`.
- **Limites :** aucune trace de test du SSE ou de validation avec le backend ; le mode personnalisé du lanceur est neutralisé par `isCustom = false` ; les vues Performance et History restent mockées.

## Évolution par phases

### Phase A — cadrage et prototype visuel (`5acd961` à `bfa696f`)

Le projet commence comme un prototype d'application de réglages. La contribution principale de cette phase est le choix de la plateforme et une première vision produit. Le périmètre « gestion adaptative de l'attention » reste encore implicite et n'est pas associé à des variables scientifiques mesurables.

### Phase B — architecture d'interface (`9b49862` à `9e6c295`)

Le code est modularisé autour d'une navigation déclarative. Ce choix réduit le coût d'ajout de nouvelles pages et rend les domaines fonctionnels explicites. Les réglages forment le premier contenu réel, mais ils sont encore exploratoires.

### Phase C — démonstrateur complet sur mocks (`c3d7bd4` à `2a7293d`)

L'équipe privilégie un prototype vertical : onboarding, profil, statistiques, actions, aide et lancement de session deviennent visibles avant l'intégration complète du backend. Cette stratégie accélère l'évaluation de l'expérience, mais crée un risque majeur pour un papier : une capture d'écran ou une métrique de cette phase peut représenter des données fictives.

### Phase D — connexion au backend (`33d94b8` à `c3cc1f3`)

Les profils et sessions sont d'abord connectés, puis les statistiques et actions. Le projet passe d'une preuve d'interface à une preuve d'intégration. Les erreurs et chargements commencent à être rendus explicitement. Le document `Goals.md` joue le rôle de backlog technique.

### Phase E — visualisation temps réel et documentation (`8191712`, `215cb22`)

Deux efforts parallèles apparaissent : d'un côté la documentation de l'architecture, de l'autre les prédictions live et la correction du démarrage de session. L'absence de fusion finale laisse le dépôt dans un état fragmenté.

## Décisions architecturales majeures

| Décision | Niveau de preuve | Motivation plausible | Conséquence observée |
|---|---|---|---|
| Application desktop Electron + React/Vite | Observé | Combiner UI web et accès natif | Séparation main process / renderer et packaging desktop potentiel |
| Navigation sans React Router | Déclaré et observé | Réduire les dépendances et centraliser les pages | `NAV_CONFIG` pilote NavBar, Sidebar et rendu principal |
| IPC sécurisé par preload | Observé | Préserver l'isolation du renderer | Accès profil limité via `contextBridge` |
| Développement mock-first | Déclaré et observé | Construire l'expérience avant le backend | Démonstrateur rapide, mais dette de migration et risque de confusion des données |
| Backend local à `127.0.0.1:8000` | Observé | Co-localiser collecte et interface | Intégration simple, mais faible portabilité sans configuration |
| Polling session toutes les 2 secondes | Observé | Synchroniser une source de vérité backend | État de session plus robuste, au prix de requêtes périodiques |
| SSE pour les prédictions live | Observé | Pousser des mises à jour unidirectionnelles | Retour quasi temps réel sans WebSocket |
| Profil backend après stockage local | Observé ; intention inférée | Centraliser les données avec le pipeline | Deux chemins de persistance coexistent et peuvent diverger |
| Fenêtre fixe 960 × 720 | Observé | Contrôler la composition visuelle | Reproductibilité de la mise en page, mais accessibilité et adaptabilité réduites |

## Résultats effectivement soutenus par le dépôt

### Résultats d'ingénierie soutenus

Le dépôt permet d'affirmer, avec la réserve qu'il s'agit d'une analyse statique :

- qu'un frontend desktop React/Electron a été conçu pour AAM ;
- qu'un parcours complet de configuration de session et d'onboarding a été implémenté ;
- que l'architecture sépare navigation, pages, composants et wrappers API ;
- que des contrats frontend existent pour les profils, sessions, statistiques et actions ;
- que les écrans principaux ont progressivement remplacé leurs mocks par des appels backend ;
- qu'un canal SSE est prévu et consommé pour afficher des prédictions live ;
- que la dernière session peut agréger résumé, features, graphes et sortie de modèle dans une même vue.

### Résultats non soutenus

Le dépôt seul ne permet pas d'affirmer :

- que le backend répond correctement à tous les endpoints ;
- que les données affichées correspondent à des sessions réelles ;
- que les features ou prédictions sont exactes ;
- que le système détecte correctement attention, fatigue ou charge cognitive ;
- que les recommandations améliorent la concentration ou la productivité ;
- que l'interface est utilisable, accessible ou acceptée par ses utilisateurs ;
- que le système tient des contraintes de latence, mémoire, CPU ou fiabilité ;
- que le build de la pointe `fusion` est reproductible sans correction.

Toute formulation scientifique doit maintenir cette distinction entre « composant implémenté », « composant intégré », « composant testé » et « effet validé ».

## État fonctionnel comparé des branches

| Capacité | `main` `1277de6` | `hotfixes` `8191712` | `fusion` `215cb22` |
|---|---:|---:|---:|
| Shell et navigation | Oui | Oui | Oui |
| Onboarding et profil local Electron | Oui | Oui | Oui |
| Lanceur de session visuel | Oui | Oui | Oui |
| API profil/session | Non | Oui | Oui |
| Latest Session | Non | Oui | Oui, enrichi |
| Statistiques globales backend | Non | Oui | Oui |
| Actions backend | Non | Oui | Oui |
| Prédictions live SSE | Non | Non | Oui |
| `Goals.md` | Non | Oui | Oui |
| `ARCHITECTURE.md` | Non | Oui | Non |

« Oui » signifie ici que du code correspondant est présent, pas que son bon fonctionnement a été validé expérimentalement.

## Dette technique, incohérences et menaces à la validité

### État Git et reproductibilité

- `main` n'est pas la branche la plus avancée.
- `fusion` et `hotfixes` ne sont pas réunies.
- aucun tag ne fixe une version expérimentale ; la version npm reste `0.0.0` ;
- aucun commit de release ni changelog n'identifie une configuration utilisée lors d'une expérience ;
- le développement visible est extrêmement court, ce qui limite l'observation de maintenance à long terme.

### Dépendances et lancement

- `src/api/profile.js` importe `axios`, mais `axios` n'est pas déclaré dans le `package.json` de la pointe `fusion` ;
- le README courant de `main` mentionne `npm run start`, `npm run electron` et `npm run dist`, alors que ces scripts ne sont pas tous présents sur cette branche ;
- `fusion` ajoute `concurrently` et un script `electron`, mais pas `start` ni `dist` ;
- `process.env.NODE_ENV` est forcé à `development` dans `electron/main.js`, ce qui compromet la branche de chargement production tant que ce point n'est pas revu.

### Données et intégration

- les URLs du backend sont répétées et codées en dur ;
- le profil existe dans deux systèmes : backend HTTP et stockage Electron/local ;
- `getSessionStatus()` et `stopSession()` ne vérifient pas systématiquement `res.ok` ;
- l'interface suppose des schémas de réponse précis, mais aucun schéma versionné ou test de contrat n'est présent ;
- `StatsPerformance` et `StatsHistory` utilisent toujours des constantes fictives ;
- certaines pages d'aide peuvent décrire des fonctions non branchées.

### Validation logicielle

- aucun test unitaire, d'intégration ou end-to-end n'est présent ;
- aucun workflow CI/CD n'est présent ;
- aucun rapport de lint, build ou couverture n'est archivé ;
- aucune mesure de latence du polling ou du SSE n'est fournie ;
- aucun journal d'erreurs d'une exécution avec le backend n'est versionné.

### Validité scientifique

- les concepts d'attention, fatigue et charge cognitive ne sont pas définis opérationnellement dans ce dépôt ;
- les scores affichés ne sont associés à aucune vérité terrain ;
- aucun participant, consentement, critère d'inclusion ou protocole éthique n'est décrit ;
- aucun groupe contrôle, baseline ou plan statistique n'est fourni ;
- l'interface a évolué en même temps que l'intégration des données, ce qui peut confondre les effets de l'algorithme et ceux de l'UX ;
- l'historique Git indique qui a commité, pas nécessairement qui a conçu, testé ou rédigé chaque idée.

## Pistes directement exploitables pour un papier de recherche

### Questions de recherche possibles

1. **RQ1 — Faisabilité :** une architecture desktop locale peut-elle collecter des signaux multimodaux et restituer en temps réel un état cognitif dans une interface unifiée ?
2. **RQ2 — Qualité prédictive :** dans quelle mesure les sorties du modèle estiment-elles attention, fatigue et charge cognitive par rapport à une vérité terrain ?
3. **RQ3 — Utilité :** les interventions adaptatives réduisent-elles les interruptions ou augmentent-elles le temps de travail focalisé ?
4. **RQ4 — Acceptabilité :** quels réglages de collecte et d'intervention les utilisateurs considèrent-ils comme utiles, compréhensibles et respectueux de la vie privée ?
5. **RQ5 — Système :** quelles latence, fiabilité et consommation de ressources présente la boucle recorder → features → modèle → SSE → interface ?

### Artéfact et contribution technique à présenter

La contribution technique peut être décrite comme une boucle en cinq couches :

```text
configuration utilisateur
        ↓
session et permissions de collecte
        ↓
backend de collecte / features / graphe / modèle
        ↓
API HTTP + flux SSE
        ↓
visualisation post-session et retour live
```

Le dépôt frontend apporte surtout la première, la deuxième et la cinquième couche, ainsi que les contrats d'accès aux couches centrales. Le backend doit être analysé séparément avant de revendiquer la boucle complète.

### Évaluation minimale recommandée

| Axe | Mesures suggérées | Preuve attendue |
|---|---|---|
| Correction logicielle | taux de succès des endpoints, tests de contrat, erreurs par session | suite automatisée et logs anonymisés |
| Temps réel | latence médiane et P95 du signal à l'affichage, pertes/reconnexions SSE | timestamps synchronisés et traces |
| Modèle | précision/F1/AUROC ou MAE selon la cible, calibration | dataset séparé, labels et protocole |
| Effet utilisateur | temps focalisé, interruptions, accomplissement du but | étude contrôlée ou plan intra-sujets |
| UX | SUS, taux d'abandon onboarding, erreurs de configuration | questionnaire et télémétrie consentie |
| Ressources | CPU, RAM, batterie, volume de données | benchmark par durée et machine |
| Vie privée | données collectées, rétention, contrôle utilisateur | threat model, consentement et audit |

### Baselines utiles

- session sans intervention adaptative ;
- notifications désactivées manuellement ;
- règles fixes sans modèle ;
- prédiction batch post-session contre prédiction live ;
- personnalisation par profil contre paramètres identiques pour tous.

### Variables à contrôler

- profession et type de tâche ;
- heure de la journée et durée de session ;
- matériel et système d'exploitation ;
- niveau initial de fatigue ;
- familiarité avec l'application ;
- permissions/modalités activées ;
- version exacte du frontend, du backend et du modèle.

## Proposition de structure du papier

1. **Introduction** — coût des interruptions et besoin d'une assistance adaptative.
2. **Travaux connexes** — attention computing, détection multimodale, interventions numériques et enjeux de confidentialité.
3. **Questions de recherche et hypothèses** — séparer faisabilité, qualité du modèle, effet utilisateur et acceptabilité.
4. **Conception du système** — Electron/React, navigation déclarative, session, profil, backend, HTTP et SSE.
5. **Évolution de l'artéfact** — stratégie mock-first, migration vers données réelles et décisions décrites dans ce document.
6. **Méthodologie expérimentale** — participants, tâches, conditions, labels, mesures, analyses statistiques et éthique.
7. **Résultats** — résultats logiciels mesurés puis résultats utilisateur/modèle, sans employer les mocks comme données.
8. **Discussion** — compromis personnalisation/confidentialité, généralisabilité et effets du temps réel.
9. **Menaces à la validité** — historique court, branches non fusionnées, dépendance au backend et absence actuelle de tests.
10. **Conclusion et travaux futurs** — unification des profils, suppression des mocks, reproductibilité et étude longitudinale.

## Actions prioritaires avant expérimentation ou publication

1. Fusionner de manière contrôlée `origin/fusion` et `origin/hotfixes`, puis placer le résultat sur une branche de référence.
2. Corriger la déclaration d'`axios`, les scripts npm et le comportement production d'Electron.
3. Paramétrer l'URL backend et versionner les schémas de réponse.
4. Supprimer ou signaler visuellement tous les mocks restants.
5. Ajouter tests unitaires, tests de contrat API, test end-to-end Electron et CI.
6. Créer un tag pour chaque version utilisée dans une expérience.
7. Archiver configuration, seed, modèle, backend, matériel et protocole avec chaque résultat.
8. Définir les construits cognitifs, la vérité terrain et le plan statistique avant la collecte.
9. Ajouter consentement, minimisation des données, rétention, export et suppression.
10. Produire une table de traçabilité reliant chaque affirmation du papier à un commit, une expérience ou un artefact.

## Matrice de traçabilité initiale

| Affirmation potentielle | Source actuelle | Statut pour publication |
|---|---|---|
| « AAM possède une interface desktop modulaire » | `9b49862`, `c3d7bd4` | Soutenue par le code |
| « AAM configure des sessions multimodales » | `2a7293d`, `1a32682` | Soutenue au niveau interface |
| « AAM communique avec un backend local » | `33d94b8` à `c3cc1f3` | Soutenue au niveau des clients API |
| « AAM affiche des prédictions en direct » | `215cb22` | Implémentée côté frontend, exécution à démontrer |
| « AAM améliore l'attention » | aucune donnée dans ce dépôt | Non soutenue |
| « Les prédictions sont exactes » | aucune évaluation dans ce dépôt | Non soutenue |
| « Le système est utilisable » | aucun test utilisateur | Non soutenue |
| « Le système est reproductible » | documentation partielle, pas de tag/tests | Insuffisant actuellement |

## Annexe A — registre synthétique des commits

| Date | Commit | Auteur | Sujet | Ajouts | Suppressions |
|---|---|---|---|---:|---:|
| 2026-05-30 20:49 | `5acd961` | elyes aissa | initial commit | 3 805 | 0 |
| 2026-05-30 21:03 | `bfa696f` | elyes aissa | updated README | 154 | 9 |
| 2026-05-31 06:18 | `9b49862` | elyes aissa | layout | 492 | 300 |
| 2026-05-31 06:45 | `04c1299` | elyes aissa | updated README & added copilot instructions | 277 | 107 |
| 2026-05-31 11:32 | `9e6c295` | elyes aissa | core settings: highly negotiable | 552 | 13 |
| 2026-05-31 22:32 | `c3d7bd4` | mohannedbt | interface, mock data, onboarding and dialogue | 3 578 | 170 |
| 2026-06-01 17:00 | `2a7293d` | mohannedbt | Record tool interface | 324 | 4 |
| 2026-06-01 17:04 | `1277de6` | mohannedbt | config vite | 3 | 0 |
| 2026-06-01 21:14 | `33d94b8` | mohannedbt | profile, goal, start/stop sessions | 484 | 127 |
| 2026-06-01 21:26 | `4cce90f` | mohannedbt | tweak bugs | 1 | 1 |
| 2026-06-02 14:16 | `de1c38d` | mohannedbt | configured session/onboarding, still mocks | 592 | 1 |
| 2026-06-02 14:54 | `1a32682` | elyes aissa | first hotfixing | 245 | 10 |
| 2026-06-02 15:50 | `45cd028` | elyes aissa | second hotfixing | 291 | 87 |
| 2026-06-02 16:23 | `c3cc1f3` | elyes aissa | third hotfixing (actions) | 176 | 65 |
| 2026-06-02 19:28 | `8191712` | Medmas07 | Architecture.md added | 759 | 0 |
| 2026-06-02 21:09 | `215cb22` | mohannedbt | the front frontend work | 532 | 19 |

## Annexe B — commandes de reproduction de l'analyse

```bash
git rev-list --count --all
git log --all --graph --decorate --oneline --date-order
git log --all --reverse --date=iso-strict --stat --summary
git log --all --reverse --format="..." --numstat
git shortlog -sne --all
git for-each-ref refs/heads refs/remotes
git tag --list
git diff <commit-parent>..<commit> -- <fichiers>
git show <commit>:<chemin>
git ls-tree -r --name-only <commit>
```

Pour reproduire une expérience future, ces commandes doivent être complétées par le hash exact du backend, la version du modèle, les dépendances verrouillées, le système d'exploitation et le protocole d'évaluation.

## Conclusion

L'histoire de ce dépôt montre la construction rapide d'un démonstrateur AAM, puis sa transformation partielle en frontend connecté. Le choix mock-first a permis d'établir tôt le parcours utilisateur ; les hotfixes ont ensuite remplacé une partie des données fictives par des API, et la branche `fusion` a introduit un retour prédictif live. Le dépôt constitue donc une base crédible pour décrire la **conception et l'évolution d'un artefact logiciel**.

Il ne constitue pas encore une preuve de l'efficacité scientifique de cet artefact. Le prochain jalon déterminant n'est pas l'ajout d'un nouvel écran, mais la création d'une version fusionnée, testée, taguée et associée à un protocole expérimental reproductible.
