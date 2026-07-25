import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  CheckSquare,
  Settings as SettingsIcon,
  ChevronDown,
  ArrowLeftRight,
  User,
  Shield,
} from "lucide-react";
import { useApp, Screen } from "../lib/context";
import { C, ROLE_THEME, Avatar } from "./ui";
import { Role } from "../lib/mockData";

const NAV: { id: Screen; icon: any; client: string; other: string }[] = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    client: "Home",
    other: "Dashboard",
  },
  { id: "returns", icon: FileText, client: "My Return", other: "Returns" },
  {
    id: "documents",
    icon: FolderOpen,
    client: "My Documents",
    other: "Documents",
  },
  {
    id: "collaboration",
    icon: MessageSquare,
    client: "Messages",
    other: "Collaboration",
  },
  { id: "tasks", icon: CheckSquare, client: "Checklist", other: "Tasks" },
  { id: "settings", icon: SettingsIcon, client: "Settings", other: "Settings" },
];

const ROLE_ICON: Record<Role, any> = {
  client: User,
  cpa: FileText,
  admin: Shield,
};
const ROLE_NAME: Record<Role, string> = {
  client: "Sarah Chen — Client",
  cpa: "You — CPA / Preparer",
  admin: "You — Firm Admin",
};

export default function Sidebar() {
  const {
    role,
    effectiveRole,
    personalMode,
    screen,
    navigate,
    switchRole,
    togglePersonalMode,
  } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const theme = ROLE_THEME[role];
  const RoleIcon = ROLE_ICON[role];

  return (
    <div
      className="w-64 shrink-0 border-r flex flex-col p-4"
      style={{ borderColor: C.border, backgroundColor: C.surface }}
    >
      <div className="flex items-center gap-2 mb-1 px-1">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: C.ink }}
        >
          L
        </div>
        <span className="font-semibold tracking-tight" style={{ color: C.ink }}>
          Ledgerline
        </span>
      </div>
      <div className="px-1 mb-5">
        <span
          className="text-[11px] uppercase tracking-wide font-medium"
          style={{ color: theme.text }}
        >
          {personalMode ? "Personal return mode" : theme.name}
        </span>
      </div>

      <div className="space-y-0.5 flex-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = screen === item.id;
          const label = effectiveRole === "client" ? item.client : item.other;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id, label)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              style={{
                backgroundColor: active ? theme.soft : "transparent",
                color: active ? theme.text : C.inkSoft,
              }}
            >
              <Icon size={16} /> {label}
            </button>
          );
        })}
      </div>

      {(role === "cpa" || role === "admin") && (
        <button
          onClick={togglePersonalMode}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mb-2 border transition-colors duration-150 hover:bg-black/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          style={{ borderColor: C.border, color: C.inkSoft }}
        >
          <ArrowLeftRight size={13} />{" "}
          {personalMode ? "Back to firm workspace" : "View my personal return"}
        </button>
      )}

      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border text-sm transition-colors duration-150 hover:bg-black/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          style={{ borderColor: C.border, color: C.ink }}
        >
          <Avatar name={ROLE_NAME[role].split(" — ")[0]} size={22} />
          <span className="flex-1 text-left truncate text-xs font-medium">
            {ROLE_NAME[role]}
          </span>
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${
              menuOpen ? "rotate-180" : ""
            }`}
            style={{ color: C.inkFaint }}
          />
        </button>
        {menuOpen && (
          <div
            className="absolute bottom-full mb-1 w-full rounded-lg border shadow-lg overflow-hidden pop-in"
            style={{ borderColor: C.border, backgroundColor: C.surface }}
          >
            {(Object.keys(ROLE_THEME) as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  switchRole(r);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm transition-colors duration-150 hover:bg-black/[0.03]"
                style={{
                  color: C.ink,
                  backgroundColor:
                    r === role ? ROLE_THEME[r].soft : "transparent",
                }}
              >
                {ROLE_THEME[r].name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
