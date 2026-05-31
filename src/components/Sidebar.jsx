function Sidebar({ subtopics, activeSub, onSubChange, navLabel }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-section-label">{navLabel}</span>
      </div>
      <ul className="sidebar-list">
        {subtopics.map((sub) => (
          <li key={sub.id}>
            <button
              className={`sidebar-btn ${activeSub === sub.id ? "active" : ""}`}
              onClick={() => onSubChange(sub.id)}
            >
              <span className="sidebar-indicator" />
              {sub.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
