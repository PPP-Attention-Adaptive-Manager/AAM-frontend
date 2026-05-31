import { useState } from 'react'
import './Appearance.css'

const THEME_OPTIONS = [
  {
    id: 'amber',
    label: 'Amber Grid',
    description: 'Original warm command-center palette.',
    palette: { accent: '#f0a500' },
  },
  {
    id: 'ice',
    label: 'Ice Vector',
    description: 'Cool cyan look with sharper contrast.',
    palette: { accent: '#7dd3fc' },
  },
  {
    id: 'emerald',
    label: 'Emerald Run',
    description: 'Bright green tactical display.',
    palette: { accent: '#34d399' },
  },
  {
    id: 'crimson',
    label: 'Crimson Pulse',
    description: 'High-alert red with heavier emphasis.',
    palette: { accent: '#f87171' },
  },
]

const DENSITY_OPTIONS = [
  { id: 'comfortable', label: 'Comfortable' },
  { id: 'compact', label: 'Compact' },
]

function buildDraft(profile) {
  return {
    theme: profile?.appearance?.theme || 'amber',
    density: profile?.appearance?.density || 'comfortable',
    accent: profile?.appearance?.accent || 'amber',
  }
}

export function AppearanceSettings({ profile, onProfileChange }) {
  const [draft, setDraft] = useState(() => buildDraft(profile))

  const handleSave = async () => {
    if (!onProfileChange) {
      return
    }

    await onProfileChange({
      ...profile,
      appearance: draft,
    })
  }

  return (
    <section className="appearance-panel settings-scroll">
      <div className="appearance-hero setting-card">
        <div>
          <p className="setting-eyebrow">Visual settings</p>
          <h2 className="setting-title">Desktop theme</h2>
          <p className="setting-note">
            Change the look of the app. The selected theme is written to your profile and applied instantly.
          </p>
        </div>
        <button className="settings-action" type="button" onClick={handleSave}>
          Save appearance
        </button>
      </div>

      <div className="appearance-grid">
        {THEME_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`appearance-tile ${draft.theme === option.id ? 'active' : ''}`}
            onClick={() => setDraft((current) => ({ ...current, theme: option.id, accent: option.id }))}
          >
            <span className="appearance-swatch" style={{ '--theme-accent': option.palette.accent }} />
            <span className="appearance-label">{option.label}</span>
            <span className="appearance-description">{option.description}</span>
          </button>
        ))}
      </div>

      <div className="setting-card">
        <div className="setting-title-row">
          <div>
            <h2 className="setting-title">Density</h2>
            <p className="setting-note">
              Make the UI feel more open or more compact depending on your desktop window size.
            </p>
          </div>
        </div>

        <div className="density-row">
          {DENSITY_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`density-pill ${draft.density === option.id ? 'active' : ''}`}
              onClick={() => setDraft((current) => ({ ...current, density: option.id }))}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-card appearance-preview">
        <div className="setting-title-row">
          <div>
            <h2 className="setting-title">Preview</h2>
            <p className="setting-note">
              The shell uses the chosen palette immediately, so the app feels different as soon as you save.
            </p>
          </div>
          <button className="settings-action secondary" type="button" onClick={handleSave}>
            Apply changes
          </button>
        </div>

        <div className="preview-mockup">
          <div className="preview-panel">
            <span className="preview-label">Accent</span>
            <strong>{THEME_OPTIONS.find((item) => item.id === draft.theme)?.label}</strong>
          </div>
          <div className="preview-panel">
            <span className="preview-label">Density</span>
            <strong>{draft.density}</strong>
          </div>
          <div className="preview-panel">
            <span className="preview-label">Profile sync</span>
            <strong>Live</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
