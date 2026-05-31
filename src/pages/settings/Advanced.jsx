import { useEffect, useState } from "react";
import "./Advanced.css";

const STORAGE_KEY = "settings.advanced";

const VIEWING_PERMISSIONS = [
  {
    id: "listenNotifications",
    label: "Allow listening on notifications",
    description:
      "Placeholder: scope of notification listening and why it matters for contextual awareness.",
  },
  {
    id: "viewBrowserTabs",
    label: "Allow viewing open browser tabs",
    description:
      "Placeholder: scope of browser tab visibility and why it helps provide safe assistance.",
  },
  {
    id: "viewApplications",
    label: "Allow viewing open applications",
    description:
      "Placeholder: scope of open application visibility and why it is important for context.",
  },
  {
    id: "mouseTracking",
    label: "Allow mouse tracking",
    description:
      "Placeholder: scope of mouse movement tracking and why it supports intent recognition.",
  },
  {
    id: "keyboardTracking",
    label: "Allow keyboard tracking",
    description:
      "Placeholder: scope of keyboard tracking and why it is important for adaptive assistance.",
  },
];

const ACTION_PERMISSIONS = [
  {
    id: "delayNotifications",
    label: "Allow delaying notifications",
    description:
      "Placeholder: scope of notification delay actions and why it can reduce interruptions.",
  },
  {
    id: "closeTabs",
    label: "Allow closing tabs",
    description:
      "Placeholder: scope of browser tab closing actions and why it helps maintain focus.",
  },
  {
    id: "closeApps",
    label: "Allow closing apps",
    description:
      "Placeholder: scope of application closing actions and why it prevents unwanted distractions.",
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

export function AdvancedSettings() {
  const [permissions, setPermissions] = useState(DEFAULT_STATE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPermissions((current) => ({ ...current, ...parsed }));
      }
    } catch (error) {
      console.warn("Could not load advanced settings", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions));
    } catch (error) {
      console.warn("Could not save advanced settings", error);
    }
  }, [permissions]);

  const togglePermission = (id) => {
    setPermissions((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <section className="settings-advanced-panel">
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
    </section>
  );
}
