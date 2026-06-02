import { useMemo, useState } from "react";
import "./SessionLauncher.css";
import { startSession } from "../api/session";

const DEFAULT_PERMISSIONS = {
  keyboard: true,
  mouse: true,
  notifications: true,
  applications: true,
};

export default function SessionLauncher({ onStart, onCancel }) {
  const [step, setStep] = useState(0);

  const [goal, setGoal] = useState("");
  const [mode, setMode] = useState("default"); // default | custom
  const [duration, setDuration] = useState(60);

  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

  const isCustom = mode === "custom";

  const toggle = (key) => {
    setPermissions((p) => ({
      ...p,
      [key]: !p[key],
    }));
  };

  const canContinue = useMemo(() => {
    if (step === 0) return goal.trim().length > 0;
    if (step === 1) return true;
    if (step === 2 && isCustom) return true;
    if (step === 3) return duration > 0;
    return true;
  }, [step, goal, duration, isCustom]);

  const handleStart = async () => {
   const payload = {
      mode: "experimental",
      duration_minutes: Number(duration),
      goal,

      keyboard_tracking_enabled: permissions.keyboard,
      mouse_tracking_enabled: permissions.mouse,
      notification_tracking_enabled: permissions.notifications,
      app_tracking_enabled: permissions.applications,
    };
    try {
      console.log("[SessionLauncher] Starting session...");
      console.log("[SessionLauncher] Payload:", payload);

      const result = await startSession(payload);

      console.log("[SessionLauncher] Session started:", result);

      onStart?.(result);
    } catch (err) {
      console.error("[SessionLauncher] Failed to start session:", err);
      alert("Failed to start session");
    }
  };

  return (
    <div className="sl-backdrop">
      <div className="sl-dialog">
        {/* HEADER */}
        <div className="sl-header">
          <h1 className="sl-title">Session Setup</h1>
          <p className="sl-subtitle">
            Step {step + 1} / {isCustom ? 4 : 3}
          </p>
        </div>

        {/* BODY */}
        <div className="sl-body">
          {/* STEP 1 - GOAL */}
          {step === 0 && (
            <div className="sl-field">
              <label className="sl-label">
                What is your goal?
              </label>

              <input
                className="sl-input"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Deep work, coding session, research..."
              />
            </div>
          )}

        
          {/* STEP 2 - PERMISSIONS */}
          {step === 1 && (
            <div className="sl-field">
              <label className="sl-label">
                Permissions
              </label>

              <div className="sl-grid">
                <label className="sl-toggle">
                  <input
                    type="checkbox"
                    checked={permissions.keyboard}
                    onChange={() => toggle("keyboard")}
                  />
                  <span>Keyboard Tracking</span>
                </label>

                <label className="sl-toggle">
                  <input
                    type="checkbox"
                    checked={permissions.mouse}
                    onChange={() => toggle("mouse")}
                  />
                  <span>Mouse Tracking</span>
                </label>

                <label className="sl-toggle">
                  <input
                    type="checkbox"
                    checked={permissions.notifications}
                    onChange={() => toggle("notifications")}
                  />
                  <span>Notification Tracking</span>
                </label>

                <label className="sl-toggle">
                  <input
                    type="checkbox"
                    checked={permissions.applications}
                    onChange={() => toggle("applications")}
                  />
                  <span>Application Tracking</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4 - DURATION */}
          {step === (isCustom ? 3 : 2) && (
            <div className="sl-field">
              <label className="sl-label">
                Session duration (minutes)
              </label>

              <input
                type="number"
                className="sl-input"
                value={duration}
                min={1}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="sl-footer">
          <button
            className="sl-btn"
            onClick={onCancel}
          >
            Cancel
          </button>

          {step > 0 && (
            <button
              className="sl-btn"
              onClick={() => setStep(step - 1)}
            >
              Back
            </button>
          )}

          {step < (isCustom ? 3 : 2) ? (
            <button
              className="sl-btn primary"
              disabled={!canContinue}
              onClick={() => setStep(step + 1)}
            >
              Next
            </button>
          ) : (
            <button
              className="sl-btn primary"
              onClick={handleStart}
            >
              Start Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}