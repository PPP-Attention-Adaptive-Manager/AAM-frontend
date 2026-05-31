import { GeneralSettings } from "../pages/settings/General";
import { AdvancedSettings } from "../pages/settings/Advanced";

// Central config: add/remove nav items and subtopics here.
// Each subtopic can later carry a `component` or `page` reference.

export const NAV_CONFIG = [
  {
    id: "stats",
    label: "Stats",
    icon: "◈",
    subtopics: [
      { id: "overview", label: "Overview" },
      { id: "performance", label: "Performance" },
      { id: "history", label: "History" },
    ],
  },
  {
    id: "actions",
    label: "Actions",
    icon: "◆",
    subtopics: [
      { id: "quick", label: "Quick Actions" },
      { id: "scheduled", label: "Scheduled" },
      { id: "logs", label: "Logs" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: "◎",
    subtopics: [
      { id: "general", label: "General", component: GeneralSettings },
      { id: "appearance", label: "Appearance" },
      { id: "advanced", label: "Advanced", component: AdvancedSettings },
    ],
  },
  {
    id: "help",
    label: "Help",
    icon: "◉",
    subtopics: [
      { id: "docs", label: "Documentation" },
      { id: "shortcuts", label: "Shortcuts" },
      { id: "about", label: "About" },
    ],
  },
];