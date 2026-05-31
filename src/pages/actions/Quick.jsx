import { useMemo } from 'react'
import { InfoPopup } from '../../components/InfoPopup'
import '../stats/stats.css'
import './actions.css'
import '../../components/InfoPopup.css'

const QUICK_ACTIONS = [
  { label: 'Start Focus Session', status: 'Ready', detail: 'Opens a distraction shield and begins tracking.' },
  { label: 'Silence Notifications', status: 'Suggested', detail: 'Hides interruptions for the next 45 minutes.' },
  { label: 'Close Low Priority Tabs', status: 'Queued', detail: 'Keeps only the pages you actively need.' },
  { label: 'Log Quick Thought', status: 'Available', detail: 'Captures a note without leaving the workspace.' },
]

const ACTION_METRICS = [
  { label: 'Ready actions', value: '12' },
  { label: 'Suggested now', value: '4' },
  { label: 'Blocked distractions', value: '19' },
]

const ACTION_TRENDS = [74, 58, 66, 72, 81, 77, 85]

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
  const facts = useMemo(() => buildBriefing(profile), [profile])

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
            <h2>Default mock actions ready</h2>
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

      <div className="actions-grid metrics-grid">
        {ACTION_METRICS.map((metric) => (
          <article key={metric.label} className="stats-metric-card">
            <span className="stats-metric-label">{metric.label}</span>
            <strong className="stats-metric-value">{metric.value}</strong>
          </article>
        ))}
      </div>

      <div className="stats-dual-grid">
        <div className="stats-panel">
          <div className="stats-panel-header">
            <div>
              <p className="stats-kicker">Action queue</p>
              <h3>Default shortcut set</h3>
            </div>
            <span className="stats-panel-note">Live mock data</span>
          </div>

          <div className="actions-list">
            {QUICK_ACTIONS.map((action) => (
              <article key={action.label} className="action-card">
                <div className="action-card-topline">
                  <strong>{action.label}</strong>
                  <span>{action.status}</span>
                </div>
                <p>{action.detail}</p>
              </article>
            ))}
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
            {ACTION_TRENDS.map((value, index) => (
              <span key={`${value}-${index}`} className="sparkline-point" style={{ height: `${value}%` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
