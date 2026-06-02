import { GeneralSettings } from "../pages/settings/General";
import { AppearanceSettings } from "../pages/settings/Appearance";
import { AdvancedSettings } from "../pages/settings/Advanced";
import { StatsOverview } from "../pages/stats/StatsOverview";
import { LatestSession } from "../pages/stats/LatestSession";
import { StatsPerformance } from "../pages/stats/StatsPerformance";
import { StatsHistory } from "../pages/stats/StatsHistory";
import { QuickActions } from "../pages/actions/Quick";
import { ScheduledActions } from "../pages/actions/Scheduled";
import { ActionLogs } from "../pages/actions/Logs";
import { Documentation } from "../pages/help/Documentation";
import { Shortcuts } from "../pages/help/Shortcuts";
import { About } from "../pages/help/About";

// Central config: add/remove nav items and subtopics here.
// Each subtopic can later carry a `component` or `page` reference.

export const NAV_CONFIG = [
  {
    id: "stats",
    label: "Stats",
    icon: "◈",
    subtopics: [
      { id: "overview", label: "Overview", component: StatsOverview },
      { id: "latest", label: "Latest Session", component: LatestSession },
      { id: "performance", label: "Performance", component: StatsPerformance },
      { id: "history", label: "History", component: StatsHistory },
    ],
  },
  {
    id: "actions",
    label: "Actions",
    icon: "◆",
    subtopics: [
      { id: "quick", label: "Quick Actions", component: QuickActions },
      { id: "scheduled", label: "Scheduled", component: ScheduledActions },
      { id: "logs", label: "Logs", component: ActionLogs },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: "◎",
    subtopics: [
      { id: "general", label: "General", component: GeneralSettings },
      { id: "appearance", label: "Appearance", component: AppearanceSettings },
      { id: "advanced", label: "Advanced", component: AdvancedSettings },
    ],
  },
  {
    id: "help",
    label: "Help",
    icon: "◉",
    subtopics: [
      { id: "docs", label: "Documentation", component: Documentation },
      { id: "shortcuts", label: "Shortcuts", component: Shortcuts },
      { id: "about", label: "About", component: About },
    ],
  },
];