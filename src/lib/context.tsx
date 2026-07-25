import React, { createContext, useContext, useState, ReactNode } from "react";
import { Role } from "./mockData";

export type Screen =
  | "dashboard"
  | "returns"
  | "documents"
  | "collaboration"
  | "tasks"
  | "settings";

interface Crumb {
  label: string;
  screen: Screen;
}

interface AppState {
  role: Role;
  personalMode: boolean;
  effectiveRole: Role;
  screen: Screen;
  trail: Crumb[];
  selectedFieldId: string;
  focusThreadId: string | null;
  commandOpen: boolean;
  navigate: (
    screen: Screen,
    label: string,
    opts?: { fieldId?: string; threadId?: string }
  ) => void;
  jump: (i: number) => void;
  back: () => void;
  switchRole: (r: Role) => void;
  togglePersonalMode: () => void;
  setCommandOpen: (v: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

const SCREEN_LABEL: Record<Screen, string> = {
  dashboard: "Dashboard",
  returns: "Returns",
  documents: "Documents",
  collaboration: "Collaboration",
  tasks: "Tasks",
  settings: "Settings",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("cpa");
  const [personalMode, setPersonalMode] = useState(false);
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [trail, setTrail] = useState<Crumb[]>([
    { label: "Dashboard", screen: "dashboard" },
  ]);
  const [selectedFieldId, setSelectedFieldId] = useState("f1");
  const [focusThreadId, setFocusThreadId] = useState<string | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);

  const effectiveRole: Role = personalMode ? "client" : role;

  function navigate(
    nextScreen: Screen,
    label: string,
    opts: { fieldId?: string; threadId?: string } = {}
  ) {
    setScreen(nextScreen);
    setTrail((t) => [
      ...t,
      { label: label || SCREEN_LABEL[nextScreen], screen: nextScreen },
    ]);
    if (opts.fieldId) setSelectedFieldId(opts.fieldId);
    if (opts.threadId !== undefined) setFocusThreadId(opts.threadId);
    setCommandOpen(false);
  }
  function jump(i: number) {
    setTrail((t) => t.slice(0, i + 1));
    setScreen(trail[i].screen);
  }
  function back() {
    jump(Math.max(trail.length - 2, 0));
  }
  function switchRole(r: Role) {
    setRole(r);
    setPersonalMode(false);
    setScreen("dashboard");
    setTrail([{ label: "Dashboard", screen: "dashboard" }]);
  }
  function togglePersonalMode() {
    setPersonalMode((v) => !v);
    setScreen("dashboard");
    setTrail([{ label: "Dashboard", screen: "dashboard" }]);
  }

  const value: AppState = {
    role,
    personalMode,
    effectiveRole,
    screen,
    trail,
    selectedFieldId,
    focusThreadId,
    commandOpen,
    navigate,
    jump,
    back,
    switchRole,
    togglePersonalMode,
    setCommandOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
