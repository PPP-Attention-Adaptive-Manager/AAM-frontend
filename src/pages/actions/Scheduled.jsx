import { useEffect, useState } from 'react'
import { getScheduledActions } from '../../api/actions'
import '../stats/stats.css'
import './actions.css'

export function ScheduledActions() {
  const [scheduledItems, setScheduledItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const items = await getScheduledActions()
        setScheduledItems(items)
      } catch (err) {
        console.error(err)
        setError(err?.message || 'Unable to load scheduled actions')
      } finally {
        setLoading(false)
      }
    }
    loadSchedule()
  }, [])

  return (
    <section className="actions-page">
      <div className="stats-panel">
        <div className="stats-panel-header">
          <div>
            <p className="stats-kicker">Scheduled actions</p>
            <h3>Backend-driven automation timeline</h3>
          </div>
          <span className="stats-panel-note">{scheduledItems.length} entries</span>
        </div>

        {error && (
          <div className="stats-panel stats-panel-error">
            <p>{error}</p>
          </div>
        )}

        <div className="actions-timeline">
          {loading ? (
            <p>Loading scheduled actions…</p>
          ) : (
            scheduledItems.map((item) => (
              <article key={`${item.time}-${item.title}`} className="action-card timeline-card">
                <div className="action-card-topline">
                  <strong>{item.title}</strong>
                  <span>{item.time}</span>
                </div>
                <p>{item.detail}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
