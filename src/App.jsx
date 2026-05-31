import { useState } from "react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { NAV_CONFIG } from "./config/navConfig";
import "./App.css";

function App() {
  const firstNav = NAV_CONFIG[0];
  const [activeNav, setActiveNav] = useState(firstNav.id);
  const [activeSub, setActiveSub] = useState(firstNav.subtopics[0].id);

  const handleNavChange = (navId) => {
    const nav = NAV_CONFIG.find((n) => n.id === navId);
    setActiveNav(navId);
    setActiveSub(nav.subtopics[0].id);
  };

  const handleSubChange = (subId) => {
    setActiveSub(subId);
  };

  const currentNav = NAV_CONFIG.find((n) => n.id === activeNav);
  const currentSub = currentNav.subtopics.find((s) => s.id === activeSub);

  return (
    <div className="app-shell">
      <NavBar
        items={NAV_CONFIG}
        activeNav={activeNav}
        onNavChange={handleNavChange}
      />
      <div className="app-body">
        <Sidebar
          subtopics={currentNav.subtopics}
          activeSub={activeSub}
          onSubChange={handleSubChange}
          navLabel={currentNav.label}
        />
        <MainContent nav={currentNav} sub={currentSub} />
      </div>
    </div>
  );
}

export default App;
