const API_URL = "http://127.0.0.1:8000";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "API request failed");
  }
  return res.json();
}

export async function getQuickActions() {
  return fetchJson(`${API_URL}/actions/quick`);
}

export async function getActionStats() {
  return fetchJson(`${API_URL}/actions/stats`);
}

export async function getScheduledActions() {
  return fetchJson(`${API_URL}/actions/scheduled`);
}

export async function getActionLogs() {
  return fetchJson(`${API_URL}/actions/logs`);
}
