import './Help.css'

const SHORTCUTS = [
  { keys: 'Ctrl + 1', action: 'Open Stats' },
  { keys: 'Ctrl + 2', action: 'Open Actions' },
  { keys: 'Ctrl + 3', action: 'Open Settings' },
  { keys: 'Ctrl + 4', action: 'Open Help' },
  { keys: 'Ctrl + L', action: 'Logout and return to onboarding' },
]

export function Shortcuts() {
  return (
    <section className="help-page">
      <div className="help-panel">
        <div className="help-panel-topline">
          <div>
            <p className="help-kicker">Keyboard reference</p>
            <h3>Shortcuts</h3>
          </div>
          <span className="help-pill">Fast navigation</span>
        </div>
        <div className="help-grid">
          {SHORTCUTS.map((item) => (
            <div key={item.keys} className="help-doc-link">
              <strong>{item.keys}</strong>
              <span>{item.action}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
