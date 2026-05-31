import '../stats/stats.css'
import './actions.css'

const LOG_ITEMS = [
  { level: 'Info', text: 'Focus session auto-saved successfully.' },
  { level: 'Warn', text: 'Two low-priority tabs were left open.' },
  { level: 'Info', text: 'Action queue refreshed from profile settings.' },
]

export function ActionLogs() {
  return (
    <section className="actions-page">
      <div className="stats-panel">
        <div className="stats-panel-header">
          <div>
            <p className="stats-kicker">Action logs</p>
            <h3>Mock activity feed</h3>
          </div>
        </div>

        <div className="action-log-list">
          {LOG_ITEMS.map((item) => (
            <article key={item.text} className="action-log-row">
              <span className={`action-log-level ${item.level.toLowerCase()}`}>{item.level}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
