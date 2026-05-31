import { useEffect, useState } from "react";
import "./General.css";

const STORAGE_KEY = "settings.general";

const MODE_OPTIONS = [
  { id: "passive", label: "Passive" },
  { id: "gentle", label: "Gentle" },
  { id: "assistive", label: "Assistive" },
  { id: "recovery", label: "Recovery" },
];

const MODE_DESCRIPTIONS = {
  passive: "Description coming soon for passive mode.",
  gentle: "Description coming soon for gentle mode.",
  assistive: "Description coming soon for assistive mode.",
  recovery: "Description coming soon for recovery mode.",
};

export function GeneralSettings() {
  const [launchAtStartup, setLaunchAtStartup] = useState(false);
  const [mode, setMode] = useState("passive");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.launchAtStartup === "boolean") {
          setLaunchAtStartup(parsed.launchAtStartup);
        }
        if (parsed.mode && MODE_DESCRIPTIONS[parsed.mode]) {
          setMode(parsed.mode);
        }
      }
    } catch (error) {
      console.warn("Could not load general settings", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ launchAtStartup, mode })
      );
    } catch (error) {
      console.warn("Could not save general settings", error);
    }
  }, [launchAtStartup, mode]);

  const handleToggleStartup = () => {
    setLaunchAtStartup((current) => !current);
  };

  return (
    <section className="settings-panel">
      <div className="setting-card">
        <div className="setting-title-row">
          <div>
            <h2 className="setting-title">Startup</h2>
            <p className="setting-note">
              Choose whether the app should launch automatically when your PC starts.
            </p>
          </div>
          <label className={`setting-switch ${launchAtStartup ? "checked" : ""}`}>
            <input
              type="checkbox"
              checked={launchAtStartup}
              onChange={handleToggleStartup}
            />
            <span className="setting-switch-thumb" />
          </label>
        </div>
      </div>

      <div className="setting-card">
        <div className="setting-title-row">
          <div>
            <h2 className="setting-title">Operating Mode</h2>
            <p className="setting-note">
              Select one of the available modes. A detailed description will be added later.
            </p>
          </div>
        </div>

        <div className="mode-grid">
          {MODE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`mode-option ${mode === option.id ? "active" : ""}`}
            >
              <input
                type="radio"
                name="operatingMode"
                value={option.id}
                checked={mode === option.id}
                onChange={() => setMode(option.id)}
              />
              <span className="mode-option-label">{option.label}</span>
              <span className="mode-option-sub">Description placeholder</span>
            </label>
          ))}
        </div>

        <div className="mode-description">
          <strong>{MODE_OPTIONS.find((item) => item.id === mode)?.label} mode</strong>
          <p>{MODE_DESCRIPTIONS[mode]}</p>
        </div>
      </div>
    </section>
  );
}
