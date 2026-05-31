function MainContent({ nav, sub }) {
  const Page = sub.component;

  return (
    <main className="main-content">
      <div className="content-header">
        <div className="breadcrumb">
          <span className="breadcrumb-nav">{nav.label}</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-sub">{sub.label}</span>
        </div>
        <div className="content-title-row">
          <h1 className="content-title">{sub.label}</h1>
          <span className="content-tag">{nav.id.toUpperCase()}</span>
        </div>
      </div>

      <div className="content-body">
        {Page ? (
          <Page />
        ) : (
          <div className="placeholder-card">
            <div className="placeholder-icon">{nav.icon}</div>
            <p className="placeholder-route">
              <code>{nav.id} / {sub.id}</code>
            </p>
            <p className="placeholder-hint">
              This is the placeholder for <strong>{nav.label} → {sub.label}</strong>.
              Replace this component with real content when ready.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default MainContent;
