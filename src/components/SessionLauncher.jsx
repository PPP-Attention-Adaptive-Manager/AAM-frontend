import { useMemo, useState } from "react";
import "./SessionLauncher.css";

const DEFAULT_PERMISSIONS = {
  csv: true,
  influx: false,
  dualTask: true,
  keyboard: true,
  mouse: true,
  notifications: false,
  systemMetrics: true,
  overlay: true,
};

export default function SessionLauncher({ onStart, onCancel }) {
  const [step, setStep] = useState(0);

  const [goal, setGoal] = useState("");
  const [mode, setMode] = useState("default"); // default | custom
  const [duration, setDuration] = useState(60);

  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

  const isCustom = mode === "custom";

  const toggle = (key) => {
    setPermissions((p) => ({ ...p, [key]: !p[key] }));
  };

  const canContinue = useMemo(() => {
    if (step === 0) return goal.trim().length > 0;
    if (step === 1) return true;
    if (step === 2 && isCustom) return true;
    if (step === 3) return duration > 0;
    return true;
  }, [step, goal, duration, isCustom]);

  const handleStart = () => {
    onStart?.({
      goal,
      mode,
      session_duration_minutes: Number(duration),

      csv_enabled: isCustom ? permissions.csv : true,
      influx_enabled: isCustom ? permissions.influx : false,
      dual_task_enabled: isCustom ? permissions.dualTask : true,
      keyboard_tracking_enabled: isCustom ? permissions.keyboard : true,
      mouse_tracking_enabled: isCustom ? permissions.mouse : true,
      notification_tracking_enabled: isCustom ? permissions.notifications : false,
      system_metrics_enabled: isCustom ? permissions.systemMetrics : true,
      ui_overlay_enabled: isCustom ? permissions.overlay : true,
    });
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
              <label className="sl-label">What is your goal?</label>
              <input
                className="sl-input"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Deep work, coding session, research..."
              />
            </div>
          )}

          {/* STEP 2 - MODE */}
          {step === 1 && (
            <div className="sl-field">
              <label className="sl-label">Session mode</label>

              <div className="sl-options">
                <button
                  className={`sl-option ${mode === "default" ? "active" : ""}`}
                  onClick={() => setMode("default")}
                >
                  Default mapping
                </button>

                <button
                  className={`sl-option ${mode === "custom" ? "active" : ""}`}
                  onClick={() => setMode("custom")}
                >
                  Custom permissions
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 - PERMISSIONS (ONLY CUSTOM) */}
          {step === 2 && isCustom && (
            <div className="sl-field">
              <label className="sl-label">Permissions</label>

              <div className="sl-grid">
                {Object.entries(permissions).map(([k, v]) => (
                  <label key={k} className="sl-toggle">
                    <input
                      type="checkbox"
                      checked={v}
                      onChange={() => toggle(k)}
                    />
                    <span>{k}</span>
                  </label>
                ))}
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
          <button className="sl-btn" onClick={onCancel}>
            Cancel
          </button>

          {step > 0 && (
            <button className="sl-btn" onClick={() => setStep(step - 1)}>
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
            <button className="sl-btn primary" onClick={handleStart}>
              Start Session
            </button>
          )}
        </div>
      </div>
    </div>
  );
}