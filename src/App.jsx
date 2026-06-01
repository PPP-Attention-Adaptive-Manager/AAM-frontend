import { useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import { FirstRunOnboarding } from "./components/FirstRunOnboarding";
import SessionLauncher from "./components/SessionLauncher";
import { NAV_CONFIG } from "./config/navConfig";

import {
  saveProfile as saveProfileAPI,
} from "./api/profile";
import {
  getProfileExists,
  getProfile,
} from "./api/profile";

import {
  startSession,
  stopSession,
  getSessionStatus,
} from "./api/session";

import "./App.css";

function App() {
  const firstNav = NAV_CONFIG[0];

  const [activeNav, setActiveNav] = useState(firstNav.id);
  const [activeSub, setActiveSub] = useState(firstNav.subtopics[0].id);

  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [showLauncher, setShowLauncher] = useState(false);
  import {profile as createDefaultProfile} from "./utils/profileUtils";
  // ONLY SOURCE OF TRUTH FOR SESSION
  const [sessionState, setSessionState] = useState({
    active: false,
    config: null,
  });

  // ----------------------------------------
  // PROFILE INIT
  // ----------------------------------------
  useEffect(() => {
    let alive = true;

    async function init() {
      try {
        const res = await getProfileExists();

        const exists =
          res?.exists === true ||
          res === true ||
          res === "true";

        if (!alive) return;

        if (!exists) {
          const defaultProfile = createDefaultProfile();
          await saveProfileAPI(defaultProfile);

          setProfile(defaultProfile);
          setIsLoadingProfile(false);
          return;
        }

        const loaded = await getProfile();

        if (!alive) return;

        setProfile(loaded || createDefaultProfile());
        setIsLoadingProfile(false);

      } catch (err) {
        console.error(err);

        if (alive) {
          setProfile(createDefaultProfile());
          setIsLoadingProfile(false);
        }
      }
    }

    init();

    return () => {
      alive = false;
    };
  }, []);

  // ----------------------------------------
  // SESSION SYNC (IMPORTANT PART)
  // ----------------------------------------
  useEffect(() => {
    let alive = true;

    const sync = async () => {
      try {
        const status = await getSessionStatus();
        if (!alive) return;

        setSessionState({
          active: status?.active ?? false,
          config: status?.config ?? null,
        });
      } catch (err) {
        console.error("[session sync error]", err);
      }
    };

    sync();
    const interval = setInterval(sync, 2000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  // ----------------------------------------
  // NAV
  // ----------------------------------------
  const handleNavChange = (navId) => {
    const nav = NAV_CONFIG.find((n) => n.id === navId);
    setActiveNav(navId);
    setActiveSub(nav.subtopics[0].id);
  };

  const handleSubChange = (subId) => {
    setActiveSub(subId);
  };

  // ----------------------------------------
  // SESSION START
  // ----------------------------------------
  const handleSessionStart = async (config) => {
    setShowLauncher(false);

    try {
      const res = await startSession(config);

      if (res?.status === "already_running") {
        return;
      }

      // don't trust blindly — backend sync will confirm
      const status = await getSessionStatus();

      setSessionState({
        active: status.active,
        config: status.config,
      });

    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
  const theme = profile?.appearance?.theme || "amber";

  document.documentElement.setAttribute("data-theme", theme);
}, [profile?.appearance?.theme]);

  // ----------------------------------------
  // SESSION STOP
  // ----------------------------------------
  const handleSessionStop = async () => {
    try {
      await stopSession();

      const status = await getSessionStatus();

      setSessionState({
        active: status.active,
        config: status.config,
      });

    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------
  // ONBOARDING
  // ----------------------------------------
  const handleOnboardingComplete = async (nextProfile) => {
    try {
      const payload = {
        ...nextProfile,
        firstTime: false,
      };

      await saveProfileAPI(payload);
      setProfile(payload);

    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    const reset = createDefaultProfile();
    await saveProfileAPI(reset);
    setProfile(reset);
  };

  // ----------------------------------------
  // LOADING
  // ----------------------------------------
  if (isLoadingProfile) {
    return (
      <div className="app-shell app-loading">
        <h1>Loading...</h1>
      </div>
    );
  }

  // ----------------------------------------
  // ONBOARDING
  // ----------------------------------------
  const shouldShowOnboarding =
    !profile || profile.firstTime !== false;

  if (shouldShowOnboarding) {
    return (
      <div className="app-shell app-locked">
        <FirstRunOnboarding
          initialProfile={profile || createDefaultProfile()}
          onComplete={handleOnboardingComplete}
        />
      </div>
    );
  }

  // ----------------------------------------
  // MAIN APP
  // ----------------------------------------
  const currentNav = NAV_CONFIG.find((n) => n.id === activeNav);
  const currentSub = currentNav.subtopics.find((s) => s.id === activeSub);

  return (
    <div className="app-shell">

      <NavBar
        items={NAV_CONFIG}
        activeNav={activeNav}
        onNavChange={handleNavChange}
        userName={profile?.name || "User"}
        onLogout={handleLogout}

        onStartSession={() => setShowLauncher(true)}
        onStopSession={handleSessionStop}

        sessionActive={sessionState.active}
        sessionStatus={
          sessionState.active ? "RUNNING" : "IDLE"
        }
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