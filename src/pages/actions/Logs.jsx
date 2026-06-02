import { useEffect, useState } from 'react'
import { getActionLogs } from '../../api/actions'
import '../stats/stats.css'
import './actions.css'

export function ActionLogs() {
  const [logItems, setLogItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const logs = await getActionLogs()
        setLogItems(logs)
      } catch (err) {
        console.error(err)
        setError(err?.message || 'Unable to load action logs')
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [])

  return (
    <section className="actions-page">
      <div className="stats-panel">
        <div className="stats-panel-header">
          <div>
            <p className="stats-kicker">Action logs</p>
            <h3>Backend activity feed</h3>
          </div>
        </div>

        {error && (
          <div className="stats-panel stats-panel-error">
            <p>{error}</p>
          </div>
        )}

        <div className="action-log-list">
          {loading ? (
            <p>Loading action logs…</p>
          ) : (
            logItems.map((item) => (
              <article key={`${item.timestamp}-${item.text}`} className="action-log-row">
                <span className={`action-log-level ${item.level.toLowerCase()}`}>{item.level}</span>
                <div>
                  <p>{item.text}</p>
                  <span className="action-log-time">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
