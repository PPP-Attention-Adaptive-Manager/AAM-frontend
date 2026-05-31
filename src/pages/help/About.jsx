import './Help.css'

export function About() {
  return (
    <section className="help-page">
      <div className="help-panel">
        <div className="help-panel-topline">
          <div>
            <p className="help-kicker">About AAM</p>
            <h3>Desktop assistant shell</h3>
          </div>
          <span className="help-pill">Version UI</span>
        </div>

        <div className="help-grid two-up">
          <div className="help-card">
            <div className="help-card-header">
              <h4>What it does</h4>
            </div>
            <p>
              AAM is a desktop app that learns your profile during onboarding, stores it locally, and uses it to drive stats, actions, and settings.
            </p>
          </div>
          <div className="help-card">
            <div className="help-card-header">
              <h4>How data is stored</h4>
            </div>
            <p>
              Your profile is saved through Electron into profile.json, so the app can reopen with the same settings and personality on the next launch.
            </p>
          </div>
        </div>

        <div className="help-card">
          <div className="help-card-header">
            <h4>Support note</h4>
          </div>
          <p>
            This Help area is the documentation UI for the current app. It gives you a quick way to understand the interface without leaving AAM.
          </p>
        </div>
      </div>
    </section>
  )
}
