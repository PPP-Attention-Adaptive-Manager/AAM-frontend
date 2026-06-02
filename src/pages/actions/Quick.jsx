import { useEffect, useMemo, useState } from 'react'
import { InfoPopup } from '../../components/InfoPopup'
import { getQuickActions, getActionStats } from '../../api/actions'
import '../stats/stats.css'
import './actions.css'
import '../../components/InfoPopup.css'

function buildBriefing(profile) {
  const onboarding = profile?.onboarding || {}
  const name = profile?.name || 'Operator'
  const facts = []

  if (onboarding.profession) {
    facts.push(`I know you as ${onboarding.profession.toLowerCase()}.`)
  }

  if (Array.isArray(onboarding.common_goals) && onboarding.common_goals.length > 0) {
    facts.push(`Your sessions often include ${onboarding.common_goals[0].toLowerCase()}.`)
  }

  if (Array.isArray(onboarding.work_activities) && onboarding.work_activities.length > 0) {
    facts.push(`I should optimize around ${onboarding.work_activities[0].toLowerCase()}.`)
  }

  if (facts.length === 0) {
    facts.push(`I only know you as ${name}, so I’m using the default action kit.`)
  }

  return facts.slice(0, 2)
}

export function QuickActions({ profile }) {
  const [quickActions, setQuickActions] = useState([])
  const [actionStats, setActionStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const facts = useMemo(() => buildBriefing(profile), [profile])

  useEffect(() => {
    const loadActions = async () => {
      try {
        setLoading(true)
        const [quick, stats] = await Promise.all([getQuickActions(), getActionStats()])
        setQuickActions(quick)
        setActionStats(stats)
      } catch (err) {
        console.error(err)
        setError(err?.message || 'Unable to load action data')
      } finally {
        setLoading(false)
      }
    }
    loadActions()
  }, [])

  return (
    <section className="actions-page">
      <InfoPopup
        storageKey="actions.ai-popup-seen"
        title="Astra signal"
        message="I’ve loaded a few default action shortcuts. You can close this note anytime and it won’t bother you again this session."
      />

      <div className="actions-briefing-card">
        <div className="stats-briefing-header">
          <div>
            <p className="stats-kicker">Astra // action briefing</p>
            <h2>Action guidance from backend service</h2>
          </div>
          <span className="stats-pill">Quick actions</span>
        </div>

        <div className="actions-fact-list">
          {facts.map((fact) => (
            <article key={fact} className="actions-fact-card">
              <p>{fact}</p>
            </article>
          ))}
        </div>
      </div>

      {error && (
        <div className="stats-panel stats-panel-error">
          <p>{error}</p>
        </div>
      )}

      <div className="actions-grid metrics-grid">
        {actionStats ? (
          [
            { label: 'Ready actions', value: actionStats.ready_actions },
            { label: 'Suggested now', value: actionStats.suggested_now },
            { label: 'Blocked distractions', value: actionStats.blocked_distractions },
          ].map((metric) => (
            <article key={metric.label} className="stats-metric-card">
              <span className="stats-metric-label">{metric.label}</span>
              <strong className="stats-metric-value">{metric.value}</strong>
            </article>
          ))
        ) : (
          <article className="stats-metric-card">
            <span className="stats-metric-label">Loading metrics…</span>
          </article>
        )}
      </div>

      <div className="stats-dual-grid">
        <div className="stats-panel">
          <div className="stats-panel-header">
            <div>
              <p className="stats-kicker">Action queue</p>
              <h3>Backend-driven action set</h3>
            </div>
            <span className="stats-panel-note">Live backend data</span>
          </div>

          <div className="actions-list">
            {loading ? (
              <p>Loading actions…</p>
            ) : (
              quickActions.map((action) => (
                <article key={action.label} className="action-card">
                  <div className="action-card-topline">
                    <strong>{action.label}</strong>
                    <span>{action.status}</span>
                  </div>
                  <p>{action.detail}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="stats-panel">
          <div className="stats-panel-header">
            <div>
              <p className="stats-kicker">Action momentum</p>
              <h3>Usage trend</h3>
            </div>
          </div>

          <div className="sparkline-chart actions-sparkline">
            {actionStats?.trend?.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className="sparkline-point"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
