import './stats.css'

const HISTORY_ROWS = [
  { time: '08:15', event: 'Booted into deep work mode', impact: 'High' },
  { time: '10:40', event: 'Notification storm intercepted', impact: 'Medium' },
  { time: '13:05', event: 'Creative session sustained', impact: 'High' },
  { time: '16:20', event: 'Break recovered focus state', impact: 'Low' },
]

const HIGHLIGHTS = [
  'Most productive sessions start without an inbox open.',
  'You recover well after short breaks and controlled pauses.',
  'Creative work tends to pull your attention harder than admin tasks.',
]

export function StatsHistory() {
  return (
    <section className="stats-page stats-history">
      <div className="stats-page-header">
        <p className="stats-kicker">Historical mock data</p>
        <h2>Recent session log</h2>
      </div>

      <div className="stats-panel history-panel">
        <div className="history-timeline">
          {HISTORY_ROWS.map((row) => (
            <article key={`${row.time}-${row.event}`} className="history-row">
              <span className="history-time">{row.time}</span>
              <div className="history-event">
                <strong>{row.event}</strong>
                <span>{row.impact} impact</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="stats-panel highlights-panel">
        <div className="stats-panel-header">
          <div>
            <p className="stats-kicker">Assistant notes</p>
            <h3>Facts from your profile</h3>
          </div>
        </div>

        <ul className="history-highlights">
          {HIGHLIGHTS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
