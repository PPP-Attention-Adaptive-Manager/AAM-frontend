import { useState } from 'react'
import './Advanced.css'

const VIEWING_PERMISSIONS = [
  {
    id: "listenNotifications",
    label: "Allow listening on notifications",
    description:
    'Scope of notification listening and why it matters for contextual awareness.',
  },
  {
    id: "viewBrowserTabs",
    label: "Allow viewing open browser tabs",
    description: 'Scope of browser tab visibility and why it helps provide safe assistance.',
  },
  {
    id: "viewApplications",
    label: "Allow viewing open applications",
    description: 'Scope of open application visibility and why it is important for context.',
  },
  {
    id: "mouseTracking",
    label: "Allow mouse tracking",
    description: 'Scope of mouse movement tracking and why it supports intent recognition.',
  },
  {
    id: "keyboardTracking",
    label: "Allow keyboard tracking",
    description: 'Scope of keyboard tracking and why it is important for adaptive assistance.',
  },
];

const ACTION_PERMISSIONS = [
  {
    id: "delayNotifications",
    label: "Allow delaying notifications",
    description: 'Scope of notification delay actions and why it can reduce interruptions.',
  },
  {
    id: "closeTabs",
    label: "Allow closing tabs",
    description: 'Scope of browser tab closing actions and why it helps maintain focus.',
  },
  {
    id: "closeApps",
    label: "Allow closing apps",
    description: 'Scope of application closing actions and why it prevents unwanted distractions.',
  },
];

const DEFAULT_STATE = {
  listenNotifications: false,
  viewBrowserTabs: false,
  viewApplications: false,
  mouseTracking: false,
  keyboardTracking: false,
  delayNotifications: false,
  closeTabs: false,
  closeApps: false,
};

export function AdvancedSettings({ profile, onProfileChange }) {
  const [permissions, setPermissions] = useState(() => ({
    ...DEFAULT_STATE,
    ...(profile?.advanced || {}),
  }))

  const togglePermission = (id) => {
    setPermissions((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const handleSavePermissions = async () => {
    if (!onProfileChange) {
      return
    }

    await onProfileChange({
      ...profile,
      advanced: permissions,
    })
  }

  const handleResetOnboarding = async () => {
    if (!onProfileChange) {
      return
    }

    await onProfileChange({
      ...profile,
      firstTime: true,
    })
  }

  return (
    <section className="settings-advanced-panel settings-scroll">
      <div className="auth-section profile-summary-panel">
        <div className="auth-section-header">
          <div>
            <h2>Profile access</h2>
            <p>
              This profile lives in profile.json. You can inspect the current identity here and reset onboarding if needed.
            </p>
          </div>
        </div>

        <div className="profile-summary-grid">
          <div className="profile-summary-item">
            <span>Name</span>
            <strong>{profile?.name || 'Unnamed'}</strong>
          </div>
          <div className="profile-summary-item">
            <span>Profession</span>
            <strong>{profile?.onboarding?.profession || 'Not set'}</strong>
          </div>
          <div className="profile-summary-item">
            <span>Focus style</span>
            <strong>{profile?.onboarding?.focus_style || 'Not set'}</strong>
          </div>
          <div className="profile-summary-item">
            <span>First time</span>
            <strong>{profile?.firstTime ? 'Yes' : 'No'}</strong>
          </div>
        </div>

        <div className="profile-actions-row">
          <button className="settings-action secondary" type="button" onClick={handleResetOnboarding}>
            Reset onboarding
          </button>
          <button className="settings-action" type="button" onClick={handleSavePermissions}>
            Save advanced settings
          </button>
        </div>
      </div>

      <div className="auth-section">
        <div className="auth-section-header">
          <div>
            <h2>Monitoring permissions</h2>
            <p>
              Control which viewing permissions are allowed. These settings define what the
              app may observe to provide better context.
            </p>
          </div>
        </div>

        <div className="auth-grid">
          {VIEWING_PERMISSIONS.map((item) => (
            <div key={item.id} className="permission-card">
              <div className="permission-row">
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                </div>
                <label className={`permission-switch ${permissions[item.id] ? "checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={permissions[item.id]}
                    onChange={() => togglePermission(item.id)}
                  />
                  <span className="permission-thumb" />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-section">
        <div className="auth-section-header">
          <div>
            <h2>Action permissions</h2>
            <p>
              Choose which action permissions are allowed. These control what the app may do on your behalf.
            </p>
          </div>
        </div>

        <div className="auth-grid">
          {ACTION_PERMISSIONS.map((item) => (
            <div key={item.id} className="permission-card">
              <div className="permission-row">
                <div>
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>
                </div>
                <label className={`permission-switch ${permissions[item.id] ? "checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={permissions[item.id]}
                    onChange={() => togglePermission(item.id)}
                  />
                  <span className="permission-thumb" />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="profile-actions-row">
        <button className="settings-action secondary" type="button" onClick={handleSavePermissions}>
          Sync permissions
        </button>
      </div>
    </section>
  )
}
