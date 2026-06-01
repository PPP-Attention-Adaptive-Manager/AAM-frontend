function NavBar({
  items,
  activeNav,
  onNavChange,
  userName,
  onLogout,
  onStartSession,
  onStopSession,
  sessionActive,
  sessionStatus,
}) {
  return (
    <nav className="navbar">

      {/* BRAND */}
      <div className="navbar-brand">
        <span className="brand-mark">▣</span>
        <span className="brand-name">AAM</span>
      </div>

      {/* NAV ITEMS */}
      <ul className="navbar-links">
        {items.map((item) => (
          <li key={item.id}>
            <button
              className={`nav-btn ${activeNav === item.id ? "active" : ""}`}
              onClick={() => onNavChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* SESSION CONTROLS */}
      <div className="navbar-session">

        {!sessionActive ? (
          <button
            className="nav-session-btn start"
            onClick={onStartSession}
          >
            Start Session
          </button>
        ) : (
          <button
            className="nav-session-btn stop"
            onClick={onStopSession}
          >
            Stop Session
          </button>
        )}

        <div className="session-status">
          <span className={`status-dot ${sessionActive ? "active" : "inactive"}`} />
          <span className="status-text">
            {sessionActive ? (sessionStatus || "RUNNING") : "IDLE"}
          </span>
        </div>

      </div>

      {/* USER AREA */}
      <div className="navbar-end">
        {userName ? <span className="status-user">{userName}</span> : null}

        <span className={`status-dot ${sessionActive ? "active" : ""}`} />
        <span className="status-text">
          {sessionActive ? "SESSION ACTIVE" : "ONLINE"}
        </span>

        {onLogout ? (
          <button className="navbar-logout" type="button" onClick={onLogout}>
            Logout
          </button>
        ) : null}
      </div>

    </nav>
  );
}

export default NavBar;