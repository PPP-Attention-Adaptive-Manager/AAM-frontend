import { useEffect, useMemo, useState } from "react";
import { getLatestSession } from "../../api/session";
import "./stats.css";

function prettyDate(timestamp) {
  if (!timestamp) {
    return "—";
  }
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }
  return date.toLocaleString();
}

function durationText(start, end) {
  if (!start || !end) {
    return "—";
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "—";
  }
  const diff = Math.max(0, Math.round((endDate - startDate) / 1000));
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  return `${minutes}m ${seconds}s`;
}

export function LatestSession({ profile }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLatest = async () => {
    setLoading(true);
    setError(null);

    try {
      const latest = await getLatestSession();
      setSession(latest);
    } catch (err) {
      setError(err?.message || "Unable to load latest session.");
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLatest();
  }, []);

  const latestGraph = session?.graph;
  const latestFeatures = session?.features?.features || {};
  const featureRows = useMemo(
    () =>
      Object.entries(latestFeatures).map(([modality, records]) => ({
        modality,
        count: Array.isArray(records) ? records.length : 0,
      })),
    [latestFeatures],
  );

  return (
    <section className="stats-page stats-latest-session">
      <div className="stats-briefing-card">
        <div className="stats-briefing-header">
          <div>
            <p className="stats-kicker">Latest session</p>
            <h2>Review the most recent captured session</h2>
          </div>
          <button className="stats-refresh-button" onClick={loadLatest} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <p className="stats-briefing-text">
          {profile?.name
            ? `Hi ${profile.name}, this view shows the latest session summary directly from the backend.`
            : "This view shows the latest session summary directly from the backend."}
        </p>
      </div>

      {loading && (
        <div className="stats-panel">
          <p>Loading latest session…</p>
        </div>
      )}

      {error && (
        <div className="stats-panel stats-panel-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && !session && (
        <div className="stats-panel">
          <p>No completed sessions are available yet.</p>
        </div>
      )}

      {!loading && !error && session && (
        <>
          <div className="stats-grid metrics-grid">
            <article className="stats-metric-card">
              <span className="stats-metric-label">Session ID</span>
              <strong className="stats-metric-value">{session.session_id}</strong>
            </article>
            <article className="stats-metric-card">
              <span className="stats-metric-label">Goal</span>
              <strong className="stats-metric-value">{session.goal || "No goal set"}</strong>
            </article>
            <article className="stats-metric-card">
              <span className="stats-metric-label">Start</span>
              <strong className="stats-metric-value">{prettyDate(session.start_time)}</strong>
            </article>
            <article className="stats-metric-card">
              <span className="stats-metric-label">End</span>
              <strong className="stats-metric-value">{prettyDate(session.end_time)}</strong>
            </article>
            <article className="stats-metric-card">
              <span className="stats-metric-label">Duration</span>
              <strong className="stats-metric-value">{durationText(session.start_time, session.end_time)}</strong>
            </article>
            <article className="stats-metric-card">
              <span className="stats-metric-label">Graph windows</span>
              <strong className="stats-metric-value">{latestGraph?.window_count ?? 0}</strong>
            </article>
          </div>

          <div className="stats-panel">
            <div className="stats-panel-header">
              <div>
                <p className="stats-kicker">Feature coverage</p>
                <h3>Available feature sets</h3>
              </div>
            </div>

            <div className="stats-bars">
              {featureRows.length === 0 ? (
                <p>No feature CSVs were loaded for the latest session.</p>
              ) : (
                featureRows.map((item) => (
                  <div key={item.modality} className="stats-bar-row">
                    <div className="stats-bar-labels">
                      <span>{item.modality}</span>
                      <span>{item.count} records</span>
                    </div>
                    <div className="stats-bar-track">
                      <span className="stats-bar-fill" style={{ width: `${Math.min(100, item.count)}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="stats-dual-grid">
            <div className="stats-panel">
              <div className="stats-panel-header">
                <div>
                  <p className="stats-kicker">Graph summary</p>
                  <h3>Window and node counts</h3>
                </div>
              </div>
              <div className="stats-grid metrics-grid">
                <article className="stats-metric-card">
                  <span className="stats-metric-label">Windows</span>
                  <strong className="stats-metric-value">{latestGraph?.window_count ?? 0}</strong>
                </article>
                <article className="stats-metric-card">
                  <span className="stats-metric-label">Nodes in first window</span>
                  <strong className="stats-metric-value">{latestGraph?.windows?.[0]?.nodes?.length ?? 0}</strong>
                </article>
                <article className="stats-metric-card">
                  <span className="stats-metric-label">Edges in first window</span>
                  <strong className="stats-metric-value">{latestGraph?.windows?.[0]?.edges?.length ?? 0}</strong>
                </article>
              </div>
            </div>

            <div className="stats-panel">
              <div className="stats-panel-header">
                <div>
                  <p className="stats-kicker">Model output</p>
                  <h3>Prediction summary</h3>
                </div>
              </div>
              <div className="stats-panel-body">
                <p>{session.model_output?.message || "No predictive output available."}</p>
                <div className="stats-grid metrics-grid">
                  <article className="stats-metric-card">
                    <span className="stats-metric-label">Attention score</span>
                    <strong className="stats-metric-value">{session.model_output?.attention_score ?? "—"}</strong>
                  </article>
                  <article className="stats-metric-card">
                    <span className="stats-metric-label">Cognitive load</span>
                    <strong className="stats-metric-value">{session.model_output?.cognitive_load ?? "—"}</strong>
                  </article>
                  <article className="stats-metric-card">
                    <span className="stats-metric-label">Fatigue score</span>
                    <strong className="stats-metric-value">{session.model_output?.fatigue_score ?? "—"}</strong>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
