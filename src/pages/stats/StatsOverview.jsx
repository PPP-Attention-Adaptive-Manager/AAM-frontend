import { useEffect, useMemo, useState } from 'react'
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

const MOCK_METRICS = [
  { label: 'Focus Stability', value: '78%', delta: '+12%' },
  { label: 'Noise Resistance', value: '64%', delta: '+5%' },
  { label: 'Recovery Speed', value: '81%', delta: '+9%' },
  { label: 'Deep Work Blocks', value: '4.6h', delta: '+0.8h' },
]

const MOCK_ACTIVITY = [
  { label: 'Deep Work', value: 86 },
  { label: 'Admin', value: 44 },
  { label: 'Creative', value: 72 },
  { label: 'Breaks', value: 31 },
]

export function StatsOverview({ profile }) {
  const [revealed, setRevealed] = useState(false)
  const facts = useMemo(() => buildFacts(profile), [profile])
  const profileName = profile?.name || 'Operator'

  const trendSeries = [46, 52, 49, 61, 68, 65, 74, 81]
  const radarSeries = [
    { label: 'Focus', value: 78 },
    { label: 'Recovery', value: 62 },
    { label: 'Creative', value: 71 },
    { label: 'Consistency', value: 84 },
  ]

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), 1200)
    return () => window.clearTimeout(timer)
  }, [profile])

  return (
    <section className="stats-page stats-overview">
      <InfoPopup
        storageKey="stats.ai-popup-seen"
        title="Astra signal"
        message={`I caught a pattern, ${profileName}. Your focus spikes when the interface stays quiet, so I’m surfacing this only once.`}
      />

      <div className="stats-briefing-card">
        <div className="stats-briefing-header">
          <div>
            <p className="stats-kicker">Astra // profile briefing</p>
            <h2>Before I load your stats, here's what I noticed</h2>
          </div>
          <span className="stats-pill">Live profile read</span>
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
          <span className={`stats-loadbar-fill ${revealed ? 'ready' : ''}`} />
        </div>
        <p className="stats-loadtext">Loading mock statistics...</p>
      </div>

      <div className={`stats-dashboard ${revealed ? 'revealed' : ''}`}>
        <div className="stats-grid metrics-grid">
          {MOCK_METRICS.map((metric) => (
            <article key={metric.label} className="stats-metric-card">
              <span className="stats-metric-label">{metric.label}</span>
              <strong className="stats-metric-value">{metric.value}</strong>
              <span className="stats-metric-delta">{metric.delta}</span>
            </article>
          ))}
        </div>

        <div className="stats-panel">
          <div className="stats-panel-header">
            <div>
              <p className="stats-kicker">Attention activity</p>
              <h3>Mock session distribution</h3>
            </div>
            <span className="stats-panel-note">Last 7 days</span>
          </div>

          <div className="stats-bars">
            {MOCK_ACTIVITY.map((item) => (
              <div key={item.label} className="stats-bar-row">
                <div className="stats-bar-labels">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="stats-bar-track">
                  <span className="stats-bar-fill" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-dual-grid">
          <div className="stats-panel">
            <div className="stats-panel-header">
              <div>
                <p className="stats-kicker">Trend line</p>
                <h3>Focus momentum</h3>
              </div>
              <span className="stats-panel-note">8 sessions</span>
            </div>

            <div className="sparkline-chart">
              {trendSeries.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="sparkline-point"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </div>

          <div className="stats-panel">
            <div className="stats-panel-header">
              <div>
                <p className="stats-kicker">Balance ring</p>
                <h3>Attention distribution</h3>
              </div>
            </div>

            <div className="radar-stack">
              {radarSeries.map((item) => (
                <div key={item.label} className="radar-row">
                  <span>{item.label}</span>
                  <div className="radar-track">
                    <span className="radar-fill" style={{ width: `${item.value}%` }} />
                  </div>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
