const API_URL = "http://127.0.0.1:8000";

export async function startSession(payload) {
  const res = await fetch(`${API_URL}/session/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  console.log("[session api] response:", data);

  if (!res.ok) {
    throw new Error(data?.message || "Session failed");
  }

  return data;
}

export async function getSessionStatus() {
  const res = await fetch(`${API_URL}/session/status`);
  return res.json();
}

export async function getLatestSession() {
  const res = await fetch(`${API_URL}/session/latest`);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "Failed to load latest session");
  }

  return res.json();
}

export async function getSessionStats() {
  const res = await fetch(`${API_URL}/session/stats`);
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || "Failed to load session stats");
  }

  return res.json();
}

export async function stopSession() {
  const res = await fetch(`${API_URL}/session/stop`, {
    method: "POST",
  });

  return res.json();
}