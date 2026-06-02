import { useEffect, useMemo, useState } from 'react'
import { getSessionStats } from '../../api/session'
import { InfoPopup } from '../../components/InfoPopup'
import '../../components/InfoPopup.css'
import './stats.css'

function buildFacts(profile) {
  const onboarding = profile?.onboarding || {}
  const facts = []
  const name = profile?.name || 'Operator'

  if (onboarding.profession) {
    facts.push(`You usually work as ${onboarding.profession.toLowerCase()}.`)
  }

  if (Array.isArray(onboarding.work_activities) && onboarding.work_activities.length > 0) {
    facts.push(`Your focus stack is built around ${onboarding.work_activities[0].toLowerCase()}.`)
  }

  if (Array.isArray(onboarding.distractions) && onboarding.distractions.length > 0) {
    facts.push(`Your biggest interference vector is ${onboarding.distractions[0].toLowerCase()}.`)
  }

  if (onboarding.focus_style) {
    facts.push(`You tend to focus with ${onboarding.focus_style.toLowerCase()}.`)
  }

  if (facts.length === 0) {
    facts.push(`I only know you as ${name}, so your dashboard is still in generic mode.`)
  }

  return facts.slice(0, 3)
}

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function StatsOverview({ profile }) {
  const [revealed, setRevealed] = useState(false)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const facts = useMemo(() => buildFacts(profile), [profile])
  const profileName = profile?.name || 'Operator'

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), 1200)
    return () => window.clearTimeout(timer)
  }, [profile])

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getSessionStats()
        setStats(data)
      } catch (err) {
        console.error('[stats overview error]', err)
        setError(err?.message || 'Failed to load session stats')
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const globalMetrics = useMemo(() => {
    if (!stats) return []
    return [
      { label: 'Total Sessions', value: stats.total_sessions, delta: null },
      { label: 'Total Duration', value: formatDuration(stats.total_duration_seconds), delta: null },
      { label: 'Average Session', value: formatDuration(stats.average_duration_seconds), delta: null },
      { label: 'Total Events', value: stats.total_events.toLocaleString(), delta: null },
    ]
  }, [stats])

  const modalityBars = useMemo(() => {
    if (!stats || !stats.modality_coverage) return []
    const max = Math.max(...Object.values(stats.modality_coverage), 1)
    return Object.entries(stats.modality_coverage).map(([name, count]) => ({
      label: name,
      value: count,
      percentage: Math.round((count / max) * 100),
    }))
  }, [stats])

  const goalBars = useMemo(() => {
    if (!stats || !stats.goal_distribution) return []
    const max = Math.max(...Object.values(stats.goal_distribution), 1)
    return Object.entries(stats.goal_distribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([goal, count]) => ({
        label: goal.length > 20 ? goal.substring(0, 17) + '...' : goal,
        fullLabel: goal,
        value: count,
        percentage: Math.round((count / max) * 100),
      }))
  }, [stats])

  const sessionTimeline = useMemo(() => {
    if (!stats || !stats.sessions_by_date) return []
    const entries = Object.entries(stats.sessions_by_date)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .slice(-14)
    const max = Math.max(...entries.map(([, count]) => count), 1)
    return entries.map(([date, count]) => ({
      date: date.split('-').slice(1).join('-'),
      count,
      percentage: Math.round((count / max) * 100),
    }))
  }, [stats])

  return (
    <section className="stats-page stats-overview">
      <InfoPopup
        storageKey="stats.ai-popup-seen"
        title="Astra signal"
        message={`I caught a pattern, ${profileName}. Your focus spikes when the interface stays quiet, so I'm surfacing this only once.`}
      />

      <div className="stats-briefing-card">
        <div className="stats-briefing-header">
          <div>
            <p className="stats-kicker">Astra // Global Analytics</p>
            <h2>Session insights & activity overview</h2>
          </div>
          <span className="stats-pill">{loading ? 'Loading...' : 'Live'}</span>
        </div>

        <div className="stats-fact-list">
          {facts.map((fact, index) => (
            <article key={fact} className="stats-fact-card" style={{ animationDelay: `${index * 140}ms` }}>
              <span className="stats-fact-index">0{index + 1}</span>
              <p>{fact}</p>
            </article>
          ))}
        </div>

        <div className="stats-loadbar">
          <span className={`stats-loadbar-fill ${revealed && !loading ? 'ready' : ''}`} />
        </div>
        <p className="stats-loadtext">{loading ? 'Fetching session data...' : 'Session data loaded'}</p>
      </div>

      {error && (
        <div className="stats-panel stats-panel-error">
          <p>{error}</p>
        </div>
      )}

      <div className={`stats-dashboard ${revealed ? 'revealed' : ''}`}>
        {stats && (
          <>
            {/* Global Metrics */}
            <div className="stats-grid metrics-grid">
              {globalMetrics.map((metric) => (
                <article key={metric.label} className="stats-metric-card">
                  <span className="stats-metric-label">{metric.label}</span>
                  <strong className="stats-metric-value">{metric.value}</strong>
                  {metric.delta && <span className="stats-metric-delta">{metric.delta}</span>}
                </article>
              ))}
            </div>

            {/* Modality Coverage */}
            {modalityBars.length > 0 && (
              <div className="stats-panel">
                <div className="stats-panel-header">
                  <div>
                    <p className="stats-kicker">Data Modalities</p>
                    <h3>Tracking coverage across sessions</h3>
                  </div>
                  <span className="stats-panel-note">{stats.total_sessions} sessions</span>
                </div>

                <div className="stats-bars">
                  {modalityBars.map((item) => (
                    <div key={item.label} className="stats-bar-row">
                      <div className="stats-bar-labels">
                        <span>{item.label}</span>
                        <span>{item.value} sessions</span>
                      </div>
                      <div className="stats-bar-track">
                        <span
                          className="stats-bar-fill"
                          style={{ width: `${item.percentage}%`, backgroundColor: '#5c73d8' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Goal Distribution */}
            {goalBars.length > 0 && (
              <div className="stats-panel">
                <div className="stats-panel-header">
                  <div>
                    <p className="stats-kicker">Activity Goals</p>
                    <h3>Top session objectives</h3>
                  </div>
                </div>

                <div className="stats-bars">
                  {goalBars.map((item) => (
                    <div key={item.fullLabel} className="stats-bar-row" title={item.fullLabel}>
                      <div className="stats-bar-labels">
                        <span>{item.label}</span>
                        <span>{item.value} times</span>
                      </div>
                      <div className="stats-bar-track">
                        <span
                          className="stats-bar-fill"
                          style={{ width: `${item.percentage}%`, backgroundColor: '#d99a2b' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Timeline */}
            {sessionTimeline.length > 0 && (
              <div className="stats-panel">
                <div className="stats-panel-header">
                  <div>
                    <p className="stats-kicker">Activity Timeline</p>
                    <h3>Sessions per day (last 2 weeks)</h3>
                  </div>
                </div>

                <div className="stats-timeline-chart">
                  {sessionTimeline.map((item) => (
                    <div
                      key={item.date}
                      className="stats-timeline-bar"
                      title={`${item.date}: ${item.count} sessions`}
                    >
                      <div className="stats-timeline-bar-inner" style={{ height: `${item.percentage}%` }} />
                      <span className="stats-timeline-label">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Distribution */}
            <div className="stats-panel">
              <div className="stats-panel-header">
                <div>
                  <p className="stats-kicker">Data Volume</p>
                  <h3>Event statistics</h3>
                </div>
              </div>

              <div className="stats-bars">
                <div className="stats-bar-row">
                  <div className="stats-bar-labels">
                    <span>Total tracked events</span>
                    <span>{stats.total_events.toLocaleString()}</span>
                  </div>
                  <div className="stats-bar-track">
                    <span className="stats-bar-fill" style={{ width: '100%', backgroundColor: '#2f9e83' }} />
                  </div>
                </div>

                {stats.total_sessions > 0 && (
                  <div className="stats-bar-row">
                    <div className="stats-bar-labels">
                      <span>Average events per session</span>
                      <span>
                        {Math.round(stats.total_events / stats.total_sessions).toLocaleString()}
                      </span>
                    </div>
                    <div className="stats-bar-track">
                      <span
                        className="stats-bar-fill"
                        style={{
                          width: `${Math.min(100, (stats.total_events / stats.total_sessions / 1000) * 100)}%`,
                          backgroundColor: '#5c73d8',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {!stats && !loading && !error && (
          <div className="stats-panel">
            <p>No session data available yet. Start a session to begin tracking.</p>
          </div>
        )}
      </div>
    </section>
  )
}
