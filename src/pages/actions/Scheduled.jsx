import '../stats/stats.css'
import './actions.css'

const SCHEDULED_ITEMS = [
  { time: '09:00', title: 'Deep work auto-start', detail: 'Focus mode activates from your morning routine.' },
  { time: '12:30', title: 'Notification pause', detail: 'A quiet window is queued for lunch.' },
  { time: '15:45', title: 'Break reminder', detail: 'Short reset to recover attention.' },
]

export function ScheduledActions() {
  return (
    <section className="actions-page">
      <div className="stats-panel">
        <div className="stats-panel-header">
          <div>
            <p className="stats-kicker">Scheduled actions</p>
            <h3>Mock automation timeline</h3>
          </div>
          <span className="stats-panel-note">3 entries</span>
        </div>

        <div className="actions-timeline">
          {SCHEDULED_ITEMS.map((item) => (
            <article key={item.time} className="action-card timeline-card">
              <div className="action-card-topline">
                <strong>{item.title}</strong>
                <span>{item.time}</span>
              </div>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
