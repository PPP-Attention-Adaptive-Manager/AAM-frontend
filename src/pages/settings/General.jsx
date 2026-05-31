import { useState } from 'react'
import './General.css'

const MODE_OPTIONS = [
  { id: 'passive', label: 'Passive' },
  { id: 'gentle', label: 'Gentle' },
  { id: 'assistive', label: 'Assistive' },
  { id: 'recovery', label: 'Recovery' },
]

const MODE_DESCRIPTIONS = {
  passive: 'Minimal intervention with only essential updates.',
  gentle: 'Balanced guidance with subtle prompts and light awareness.',
  assistive: 'More active suggestions and workflow support.',
  recovery: 'Focus-first mode with stronger interruption control.',
}

function buildDraft(profile) {
  return {
    name: profile?.name || '',
    profession: profile?.onboarding?.profession || '',
    focus_style: profile?.onboarding?.focus_style || '',
    launchAtStartup: Boolean(profile?.settings?.launchAtStartup),
    mode: profile?.settings?.mode || 'passive',
  }
}

export function GeneralSettings({ profile, onProfileChange }) {
  const [draft, setDraft] = useState(() => buildDraft(profile))

  const handleSaveProfile = async () => {
    if (!onProfileChange) {
      return
    }

    await onProfileChange({
      ...profile,
      name: draft.name.trim(),
      onboarding: {
        ...(profile?.onboarding || {}),
        profession: draft.profession,
        focus_style: draft.focus_style,
      },
      settings: {
        ...(profile?.settings || {}),
        launchAtStartup: draft.launchAtStartup,
        mode: draft.mode,
      },
    })
  }

  return (
    <section className="settings-panel settings-scroll">
      <div className="setting-card profile-card">
        <div className="setting-title-row">
          <div>
            <h2 className="setting-title">Profile</h2>
            <p className="setting-note">
              Edit the identity and planning data stored in your profile file.
            </p>
          </div>
          <span className="settings-badge">Profile sync</span>
        </div>

        <div className="profile-form-grid">
          <label className="field-stack">
            <span className="field-label">Display name</span>
            <input
              className="settings-input"
              type="text"
              value={draft.name}
              onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder="Your name"
            />
          </label>

          <label className="field-stack">
            <span className="field-label">Profession</span>
            <input
              className="settings-input"
              type="text"
              value={draft.profession}
              onChange={(event) => setDraft((current) => ({ ...current, profession: event.target.value }))}
              placeholder="What do you do?"
            />
          </label>

          <label className="field-stack settings-wide">
            <span className="field-label">Focus style</span>
            <input
              className="settings-input"
              type="text"
              value={draft.focus_style}
              onChange={(event) => setDraft((current) => ({ ...current, focus_style: event.target.value }))}
              placeholder="How you like to work"
            />
          </label>
        </div>

        <div className="profile-meta-row">
          <div>
            <span className="field-label">Current profile</span>
            <p className="profile-meta-text">
              {profile?.name || 'Unnamed'} · {profile?.onboarding?.profession || 'No profession saved'}
            </p>
          </div>
          <button className="settings-action" type="button" onClick={handleSaveProfile}>
            Save profile
          </button>
        </div>
      </div>

      <div className="setting-card">
        <div className="setting-title-row">
          <div>
            <h2 className="setting-title">Startup</h2>
            <p className="setting-note">
              Choose whether the app should launch automatically when your PC starts.
            </p>
          </div>
          <label className={`setting-switch ${draft.launchAtStartup ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={draft.launchAtStartup}
              onChange={() =>
                setDraft((current) => ({ ...current, launchAtStartup: !current.launchAtStartup }))
              }
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
              Select one of the available modes. The current choice will be written to your profile.
            </p>
          </div>
        </div>

        <div className="mode-grid">
          {MODE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className={`mode-option ${draft.mode === option.id ? 'active' : ''}`}
            >
              <input
                type="radio"
                name="operatingMode"
                value={option.id}
                checked={draft.mode === option.id}
                onChange={() => setDraft((current) => ({ ...current, mode: option.id }))}
              />
              <span className="mode-option-label">{option.label}</span>
              <span className="mode-option-sub">{MODE_DESCRIPTIONS[option.id]}</span>
            </label>
          ))}
        </div>

        <div className="mode-description">
          <strong>{MODE_OPTIONS.find((item) => item.id === draft.mode)?.label} mode</strong>
          <p>{MODE_DESCRIPTIONS[draft.mode]}</p>
        </div>
      </div>

      <div className="settings-footer-row">
        <button className="settings-action secondary" type="button" onClick={handleSaveProfile}>
          Save general settings
        </button>
      </div>
    </section>
  )
}
