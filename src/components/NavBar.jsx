 function NavBar({ items, activeNav, onNavChange, userName, onLogout, onStartSession }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-mark">▣</span>
        <span className="brand-name">AAM</span>
      </div>
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
  <button className="nav-start-session-btn" onClick={onStartSession}>
    Start Session
  </button>
      <div className="navbar-end">
        {userName ? <span className="status-user">{userName}</span> : null}
        <span className="status-dot" />
        <span className="status-text">ONLINE</span>
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
