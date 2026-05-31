import './stats.css'

const PERFORMANCE_ROWS = [
  { label: 'Focused minutes', value: '286', detail: 'up 18% from last week' },
  { label: 'Interruptions blocked', value: '41', detail: 'mostly from notifications' },
  { label: 'Peak window', value: '09:00 - 11:30', detail: 'best sustained output' },
  { label: 'Recovery sessions', value: '7', detail: 'breaks used intentionally' },
]

const TIMELINE = [
  { label: 'Mon', value: 72 },
  { label: 'Tue', value: 58 },
  { label: 'Wed', value: 84 },
  { label: 'Thu', value: 67 },
  { label: 'Fri', value: 91 },
  { label: 'Sat', value: 48 },
  { label: 'Sun', value: 33 },
]

export function StatsPerformance() {
  return (
    <section className="stats-page stats-performance">
      <div className="stats-page-header">
        <p className="stats-kicker">Mock performance telemetry</p>
        <h2>System output over time</h2>
      </div>

      <div className="stats-grid perf-grid">
        {PERFORMANCE_ROWS.map((row) => (
          <article key={row.label} className="stats-panel metric-strip">
            <span className="stats-metric-label">{row.label}</span>
            <strong className="stats-metric-value">{row.value}</strong>
            <p className="stats-metric-detail">{row.detail}</p>
          </article>
        ))}
      </div>

      <div className="stats-panel">
        <div className="stats-panel-header">
          <div>
            <p className="stats-kicker">Weekly load</p>
            <h3>Energy curve</h3>
          </div>
          <span className="stats-panel-note">Approximate</span>
        </div>

        <div className="timeline-chart">
          {TIMELINE.map((point) => (
            <div key={point.label} className="timeline-column">
              <span className="timeline-bar" style={{ height: `${point.value}%` }} />
              <span className="timeline-label">{point.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
