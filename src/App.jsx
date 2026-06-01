import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { FirstRunOnboarding } from "./components/FirstRunOnboarding";
import SessionLauncher from "./components/SessionLauncher";
import { NAV_CONFIG } from "./config/navConfig";
import { createDefaultProfile, loadProfile, saveProfile } from "./lib/profileStore";
import "./App.css";

function App() {
  const firstNav = NAV_CONFIG[0];
  const [activeNav, setActiveNav] = useState(firstNav.id);
  const [activeSub, setActiveSub] = useState(firstNav.subtopics[0].id);
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showLauncher, setShowLauncher] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initializeProfile() {
      const loadedProfile = await loadProfile();
      if (isMounted) {
        setProfile(loadedProfile);
        setIsLoadingProfile(false);
      }
    }

    initializeProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavChange = (navId) => {
    const nav = NAV_CONFIG.find((n) => n.id === navId);
    setActiveNav(navId);
    setActiveSub(nav.subtopics[0].id);
  };

  const handleSubChange = (subId) => {
    setActiveSub(subId);
  };

  const handleSessionStart = (config) => {
    setShowLauncher(false);
    window.electronAPI?.startSession(config);
  };

  const currentNav = NAV_CONFIG.find((n) => n.id === activeNav);
  const currentSub = currentNav.subtopics.find((s) => s.id === activeSub);
  const appearance = profile?.appearance || createDefaultProfile().appearance;

  const shellStyle = {
    '--accent': appearance.theme === 'ice' ? '#7dd3fc' : appearance.theme === 'emerald' ? '#34d399' : appearance.theme === 'crimson' ? '#f87171' : '#f0a500',
    '--accent-dim': appearance.theme === 'ice' ? 'rgba(125, 211, 252, 0.12)' : appearance.theme === 'emerald' ? 'rgba(52, 211, 153, 0.12)' : appearance.theme === 'crimson' ? 'rgba(248, 113, 113, 0.12)' : 'rgba(240, 165, 0, 0.12)',
    '--accent-glow': appearance.theme === 'ice' ? 'rgba(125, 211, 252, 0.24)' : appearance.theme === 'emerald' ? 'rgba(52, 211, 153, 0.24)' : appearance.theme === 'crimson' ? 'rgba(248, 113, 113, 0.24)' : 'rgba(240, 165, 0, 0.25)',
    '--border-active': appearance.theme === 'ice' ? '#7dd3fc' : appearance.theme === 'emerald' ? '#34d399' : appearance.theme === 'crimson' ? '#f87171' : '#f0a500',
    '--bg-base': appearance.theme === 'ice' ? '#0f1418' : appearance.theme === 'emerald' ? '#101613' : appearance.theme === 'crimson' ? '#161014' : '#111214',
    '--bg-surface': appearance.theme === 'ice' ? '#141c22' : appearance.theme === 'emerald' ? '#151b18' : appearance.theme === 'crimson' ? '#201518' : '#18191d',
    '--bg-raised': appearance.theme === 'ice' ? '#18222a' : appearance.theme === 'emerald' ? '#1b211e' : appearance.theme === 'crimson' ? '#26181d' : '#1f2025',
    '--bg-hover': appearance.theme === 'ice' ? '#1d2932' : appearance.theme === 'emerald' ? '#202723' : appearance.theme === 'crimson' ? '#2b1d21' : '#25262c',
    '--border': appearance.theme === 'ice' ? '#23313c' : appearance.theme === 'emerald' ? '#243029' : appearance.theme === 'crimson' ? '#362329' : '#2a2b31',
    '--text-secondary': appearance.density === 'compact' ? '#9aa0aa' : '#8a8d97',
  };

  const handleOnboardingComplete = async (nextProfile) => {
    const savedProfile = await saveProfile(nextProfile);
    setProfile(savedProfile);
  };

  const handleLogout = async () => {
    const resetProfile = await saveProfile(createDefaultProfile());
    setProfile(resetProfile);
  };

  if (isLoadingProfile) {
    return (
      <div className="app-shell app-loading" style={shellStyle}>
        <main className="loading-card">
          <span className="loading-kicker">Loading profile</span>
          <h1>Preparing your workspace</h1>
          <p>
            I am checking whether this is your first time so I can either greet you or open the app.
          </p>
        </main>
      </div>
    );
  }

  if (profile?.firstTime !== false) {
    return (
      <div className="app-shell app-locked" style={shellStyle}>
        <FirstRunOnboarding initialProfile={profile || {}} onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="app-shell" style={shellStyle}>
      <NavBar
        items={NAV_CONFIG}
        activeNav={activeNav}
        onNavChange={handleNavChange}
        userName={profile?.name}
        onLogout={handleLogout}
        onStartSession={() => setShowLauncher(true)}
      />
      <div className="app-body">
        <Sidebar
          subtopics={currentNav.subtopics}
          activeSub={activeSub}
          onSubChange={handleSubChange}
          navLabel={currentNav.label}
        />
        <MainContent
          nav={currentNav}
          sub={currentSub}
          profile={profile}
          onProfileChange={handleOnboardingComplete}
        />
      </div>
      {showLauncher && (
        <SessionLauncher
          onStart={handleSessionStart}
          onCancel={() => setShowLauncher(false)}
        />
      )}
    </div>
  );
}

export default App;