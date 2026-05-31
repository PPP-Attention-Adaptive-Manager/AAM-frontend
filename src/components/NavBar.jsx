function NavBar({ items, activeNav, onNavChange }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-mark">▣</span>
        <span className="brand-name">APPNAME</span>
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
      <div className="navbar-end">
        <span className="status-dot" />
        <span className="status-text">ONLINE</span>
      </div>
    </nav>
  );
}

export default NavBar;
