import './Help.css'

const DOC_SECTIONS = [
  {
    title: 'Getting started',
    text: 'Learn the flow of AAM, from first-run onboarding to live profile-driven dashboards.',
    steps: [
      'Complete the onboarding dialogue once to save your profile.',
      'Visit Settings to change your identity, mode, and appearance.',
      'Open Stats or Actions to see mock data powered by your profile.',
    ],
  },
  {
    title: 'Profile system',
    text: 'AAM stores your saved data in profile.json and reuses it across sessions.',
    steps: [
      'General settings update your name, profession, and focus style.',
      'Appearance settings change the active theme and density.',
      'Advanced settings expose profile summaries and onboarding reset.',
    ],
  },
  {
    title: 'Assistant behavior',
    text: 'The assistant gives occasional info popups and profile briefings instead of constant chatter.',
    steps: [
      'Stats shows a one-time profile briefing before the charts load.',
      'Actions shows a one-time note plus default mock action data.',
      'You can close the popup whenever it appears.',
    ],
  },
]

const QUICK_LINKS = [
  { label: 'Stats Overview', detail: 'Profile briefing and dashboard metrics.' },
  { label: 'Quick Actions', detail: 'Default mock actions and usage trends.' },
  { label: 'Appearance', detail: 'Theme and density controls.' },
]

export function Documentation() {
  return (
    <section className="help-page">
      <div className="help-hero">
        <div className="help-hero-topline">
          <div>
            <p className="help-kicker">AAM documentation</p>
            <h2>How the app works</h2>
          </div>
          <span className="help-chip">Live docs UI</span>
        </div>
        <p className="help-lead">
          This hub explains the onboarding, profile system, dashboard flow, and assistant behavior inside AAM.
        </p>
      </div>

      <div className="help-layout">
        <div className="help-nav">
          {QUICK_LINKS.map((item, index) => (
            <button key={item.label} type="button" className={`help-nav-item ${index === 0 ? 'active' : ''}`}>
              <span>Section 0{index + 1}</span>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </button>
          ))}
        </div>

        <div className="help-content">
          {DOC_SECTIONS.map((section) => (
            <article key={section.title} className="help-section">
              <div className="help-section-header">
                <div>
                  <p className="help-kicker">Documentation</p>
                  <h3>{section.title}</h3>
                </div>
                <span className="help-pill">Guide</span>
              </div>
              <p className="help-note">{section.text}</p>
              <div className="help-step-list">
                {section.steps.map((step) => (
                  <div key={step} className="help-step">
                    <strong>{step}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
