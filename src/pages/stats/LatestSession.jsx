import { useEffect, useMemo, useState } from "react";
import {
  createLivePredictionsSource,
  getLatestLivePrediction,
  getLatestSession,
} from "../../api/session";
import "./stats.css";

const SCORE_LABELS = [
  ["mental_demand", "Mental demand"],
  ["temporal_demand", "Temporal demand"],
  ["effort", "Effort"],
  ["frustration", "Frustration"],
  ["arousal", "Arousal"],
];

function prettyDate(timestamp) {
  if (!timestamp) {
    return "—";
  }
  const normalizedTimestamp =
    typeof timestamp === "number" && timestamp < 1000000000000 ? timestamp * 1000 : timestamp;
  const date = new Date(normalizedTimestamp);
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

function formatScore(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }
  return value.toFixed(2);
}

function scoreWidth(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, value * 100));
}

function topProbabilities(probabilities) {
  if (!probabilities || typeof probabilities !== "object") {
    return [];
  }

  return Object.entries(probabilities)
    .filter(([, value]) => typeof value === "number" && !Number.isNaN(value))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, value]) => ({ label, value }));
}

export function LatestSession({ profile }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [livePrediction, setLivePrediction] = useState(null);
  const [liveStatus, setLiveStatus] = useState({
    state: "connecting",
    message: "Connecting to Fusion stream...",
  });
  const [liveConnected, setLiveConnected] = useState(false);
  const [liveError, setLiveError] = useState(null);

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
    const timer = window.setTimeout(loadLatest, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let alive = true;
    const source = createLivePredictionsSource();

    const loadInitialPrediction = async () => {
      try {
        const latest = await getLatestLivePrediction();
        if (alive && latest) {
          setLivePrediction(latest);
        }
      } catch (err) {
        if (alive) {
          setLiveError(err?.message || "Waiting for the first live prediction.");
        }
      }
    };

    source.addEventListener("open", () => {
      if (!alive) return;
      setLiveConnected(true);
      setLiveError(null);
      setLiveStatus({
        state: "connected",
        message: "Fusion stream connected.",
      });
    });

    source.addEventListener("status", (event) => {
      if (!alive) return;
      try {
        const payload = JSON.parse(event.data);
        setLiveStatus({
          state: payload?.state || payload?.status || "waiting",
          message: payload?.message || "Waiting for live Fusion predictions...",
          payload,
        });
      } catch (err) {
        console.warn("[live prediction status parse error]", err);
      }
    });

    source.addEventListener("prediction", (event) => {
      if (!alive) return;
      try {
        const prediction = JSON.parse(event.data);
        setLivePrediction(prediction);
        setLiveConnected(true);
        setLiveError(null);
        setLiveStatus({
          state: "prediction",
          message: "Live Fusion prediction received.",
        });
      } catch (err) {
        console.warn("[live prediction parse error]", err);
        setLiveError("Received a live prediction that could not be parsed.");
      }
    });

    source.onerror = () => {
      if (!alive) return;
      setLiveConnected(false);
      setLiveError("Live prediction stream disconnected.");
      setLiveStatus((current) => ({
        ...current,
        state: "disconnected",
        message: "Fusion stream disconnected.",
      }));
    };

    loadInitialPrediction();

    return () => {
      alive = false;
      source.close();
    };
  }, []);

  const latestGraph = session?.graph;
  const liveScores = livePrediction?.scores || {};
  const liveScoreRows = SCORE_LABELS.map(([key, label]) => ({
    key,
    label,
    value: liveScores[key],
  }));
  const stateProbabilities = topProbabilities(
    liveScores.global_state_probabilities || liveScores.state_probabilities,
  );
  const featureRows = useMemo(
    () => {
      const latestFeatures = session?.features?.features || {};
      return Object.entries(latestFeatures).map(([modality, records]) => ({
        modality,
        count: Array.isArray(records) ? records.length : 0,
      }));
    },
    [session?.features?.features],
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

          <div className="stats-panel live-fusion-panel">
            <div className="stats-panel-header">
              <div>
                <p className="stats-kicker">Live Fusion</p>
                <h3>Prediction stream</h3>
              </div>
              <span className={`stats-panel-note live-status-note ${liveConnected ? "connected" : ""}`}>
                {liveConnected ? "Connected" : liveStatus.state}
              </span>
            </div>

            <p className="stats-briefing-text live-status-message">
              {liveError || liveStatus.message}
            </p>

            <div className="stats-grid metrics-grid live-fusion-meta">
              <article className="stats-metric-card">
                <span className="stats-metric-label">Session</span>
                <strong className="stats-metric-value">{livePrediction?.session_id || "—"}</strong>
              </article>
              <article className="stats-metric-card">
                <span className="stats-metric-label">Window</span>
                <strong className="stats-metric-value">{livePrediction?.window_count ?? "—"}</strong>
              </article>
              <article className="stats-metric-card">
                <span className="stats-metric-label">Label</span>
                <strong className="stats-metric-value">{livePrediction?.window_label || "—"}</strong>
              </article>
              <article className="stats-metric-card">
                <span className="stats-metric-label">Latest timestamp</span>
                <strong className="stats-metric-value">
                  {prettyDate(livePrediction?.latest_window?.timestamp)}
                </strong>
              </article>
            </div>

            <div className="stats-dual-grid live-fusion-grid">
              <div className="live-fusion-block">
                <div className="stats-bars">
                  {liveScoreRows.map((item) => (
                    <div key={item.key} className="stats-bar-row">
                      <div className="stats-bar-labels">
                        <span>{item.label}</span>
                        <span>{formatScore(item.value)}</span>
                      </div>
                      <div className="stats-bar-track">
                        <span
                          className="stats-bar-fill live-score-fill"
                          style={{ width: `${scoreWidth(item.value)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="live-fusion-block">
                <div className="stats-bars">
                  {stateProbabilities.length === 0 ? (
                    <p>No state probabilities available yet.</p>
                  ) : (
                    stateProbabilities.map((item) => (
                      <div key={item.label} className="stats-bar-row">
                        <div className="stats-bar-labels">
                          <span>{item.label}</span>
                          <span>{Math.round(item.value * 100)}%</span>
                        </div>
                        <div className="stats-bar-track">
                          <span
                            className="stats-bar-fill live-state-fill"
                            style={{ width: `${scoreWidth(item.value)}%` }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="stats-grid metrics-grid live-fusion-meta">
              <article className="stats-metric-card">
                <span className="stats-metric-label">Uncertainty</span>
                <strong className="stats-metric-value">{formatScore(liveScores.uncertainty)}</strong>
              </article>
              <article className="stats-metric-card">
                <span className="stats-metric-label">Global uncertainty</span>
                <strong className="stats-metric-value">{formatScore(liveScores.global_uncertainty)}</strong>
              </article>
            </div>
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
