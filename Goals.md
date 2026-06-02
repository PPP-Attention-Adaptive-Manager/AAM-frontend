# AAM Frontend Integration Status & Next Steps

## Overview

This frontend currently contains the UI structure, navigation system, onboarding flow, session launcher, settings pages, statistics pages, and supporting API wrappers.

The backend is now capable of:

* Starting sessions
* Stopping sessions
* Reporting session status
* Running the Cognitive System recorder
* Running feature engineering after session completion
* Producing graph data
* Producing session outputs

The frontend's next phase is to remove all mock data and become fully driven by backend APIs.

---

# Current Frontend Structure

```
src/
├── api/
├── components/
├── config/
├── lib/
├── pages/
└── assets/
```

---

# Completed Work

## 1. Application Shell

Implemented:

* Navigation bar
* Sidebar navigation
* Main content renderer
* Route switching architecture

Files:

```
components/NavBar.jsx
components/Sidebar.jsx
components/MainContent.jsx
config/navConfig.js
```

Current status:

Functional.

---

## 2. First Run Onboarding

Implemented onboarding workflow.

Files:

```
components/FirstRunOnboarding.jsx
components/FirstRunOnboarding.css
```

Purpose:

* Collect user information
* Generate profile data
* Send profile information to backend

Connected with:

```
api/profile.js
lib/profileStore.js
```

Status:

Working.

---

## 3. Session Launcher UI

Implemented session creation workflow.

Files:

```
components/SessionLauncher.jsx
components/SessionLauncher.css
```

Purpose:

* Start recording sessions
* Configure session parameters
* Display session controls

Status:

UI completed.

Backend integration partially completed.

---

## 4. Profile Integration

Implemented profile APIs.

Files:

```
api/profile.js
```

Backend endpoint integration exists.

Status:

Working.

---

## 5. Statistics Pages

Implemented dashboard pages.

Files:

```
pages/stats/
```

Contains:

```
StatsOverview.jsx
StatsHistory.jsx
StatsPerformance.jsx
```

Purpose:

* Session statistics
* Performance visualizations
* Historical information

Current issue:

Most displayed data is still mocked or placeholder-based.

---

# Current Problem

The frontend was originally developed before backend completion.

As a result:

* Several components use hardcoded values
* Several charts use fake data
* Session metrics are mocked
* Cognitive predictions are mocked
* Graph visualizations are disconnected

The frontend must now transition to real backend data.

---

# Backend APIs Available

Current backend routes:

```
/session/*
/profile/*
/graphviewer/*
/health
```

Additional routes are planned:

```
/session/latest
/session/latest/features
/session/latest/predictions
/session/latest/graph
```

Frontend should be prepared to consume them.

---

# Frontend Tasks Remaining

---

# 1. Complete Session API Integration

Files:

```
api/session.js
components/SessionLauncher.jsx
```

Required endpoints:

```
POST /session/start
POST /session/stop
GET /session/status
```

Required behavior:

Start Session

Frontend
→ Backend
→ Recorder Starts

Stop Session

Frontend
→ Backend
→ Recorder Stops
→ Feature Pipeline Runs

Status indicators should update using backend status responses.

---

# 2. Remove Mock Session Status Data

Current issue:

Session state is partially simulated.

Replace with:

```
GET /session/status
```

Use backend values for:

* running
* paused
* stopped
* remaining time
* session duration

No frontend-generated session state should remain.

---

# 3. Create Latest Session Section

A new dashboard section should be added.

Suggested page:

```
Latest Session
```

Purpose:

Display the most recent completed session.

Backend endpoint:

```
GET /session/latest
```

Display:

* Session ID
* Start time
* End time
* Duration
* Session goal
* Session outcome

---

# 4. Connect Graph Viewer

Backend already produces graph outputs.

Current graph displays should stop using dummy data.

Create API integration:

```
GET /session/latest/graph
```

or

```
GET /graphviewer/latest
```

Expected flow:

Backend Graph
→ API
→ Frontend Graph Component

Graph should visualize:

* User activity transitions
* Application usage relationships
* Context switching behavior

---

# 5. Create Feature Visualization Section

New section required:

```
Latest Session Features
```

Backend endpoint:

```
GET /session/latest/features
```

Display feature categories:

### Keyboard

* typing speed
* burst frequency
* idle gaps

### Mouse

* click rate
* movement speed
* travel distance

### Notifications

* notification frequency
* interruption density

### System

* cpu statistics
* memory statistics

### Context

* application switching
* browser activity

Purpose:

Expose real engineered features to users.

---

# 6. Remove All Statistics Mock Data

Files:

```
StatsOverview.jsx
StatsHistory.jsx
StatsPerformance.jsx
```

Current issue:

Many charts use static arrays.

Examples:

```
[10, 15, 12, 18]
[40, 50, 60]
etc.
```

These must be removed.

Replace with backend responses.

Required source:

```
GET /session/latest
GET /session/latest/features
GET /session/latest/predictions
```

---

# 7. Connect Fusion Model Predictions

Backend work is still pending.

Once available:

Endpoint:

```
GET /session/latest/predictions
```

Expected response:

```json
{
  "attention": 0.82,
  "fatigue": 0.35,
  "cognitive_load": 0.61
}
```

Frontend should display:

* Cognitive Load
* Attention
* Fatigue
* Additional model outputs

This will replace all current dummy prediction cards.

---

# 8. Add Recommendation Section

Future integration with LinUCB.

Expected backend endpoint:

```
GET /session/latest/recommendations
```

Display:

* Suggested interventions
* Suggested breaks
* Focus recommendations
* Goal-specific actions

Data source:

Goal Encoder V1/V2
→ LinUCB
→ Recommendation Output

---

# 9. Connect Session Goal Flow

Current goal input must eventually be connected.

Flow:

Frontend Goal
→ Session Creation
→ Backend
→ Goal Encoder
→ LinUCB

The goal selected by the user should be stored and sent when starting sessions.

This is required for personalized recommendations.

---

# 10. Add Loading/Error States

Most pages currently assume successful responses.

Add:

Loading states

```
Loading latest session...
Loading graph...
Loading predictions...
```

Error states

```
Unable to load session.
Unable to load graph.
Unable to load predictions.
```

This becomes important once all pages use real APIs.

---

# Files Most Likely Requiring Modification

## API Layer

```
api/session.js
api/profile.js
```

Potential additions:

```
api/features.js
api/graph.js
api/predictions.js
```

---

## Components

```
SessionLauncher.jsx
MainContent.jsx
Sidebar.jsx
```

---

## Statistics Pages

```
StatsOverview.jsx
StatsHistory.jsx
StatsPerformance.jsx
```

These pages will undergo the largest changes because most current values are placeholders.

---

# Recommended Implementation Order

1. Finish session API integration
2. Remove session mock state
3. Create Latest Session page
4. Connect graph viewer
5. Create feature viewer
6. Remove statistics mock data
7. Integrate prediction endpoints
8. Add recommendation section
9. Connect goal flow
10. End-to-end testing

---

# Important Notes

The backend recorder integration is complete enough to generate usable session data.

Frontend development should now focus on becoming entirely backend-driven.

Current priority is NOT UI redesign.

Current priority is:

1. Eliminate all mock data
2. Connect graph outputs
3. Display latest session information
4. Display engineered features
5. Display fusion model predictions
6. Prepare for LinUCB recommendations

Once these are complete, the frontend and backend will be fully synchronized and ready for end-to-end inference and recommendation workflows.
