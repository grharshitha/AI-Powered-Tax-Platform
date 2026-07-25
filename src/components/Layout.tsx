import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import CommandPalette from "./CommandPalette";
import { useApp } from "../lib/context";
import { C, ROLE_THEME } from "./ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { role, screen } = useApp();
  const theme = ROLE_THEME[role];

  return (
    <div className="h-screen w-full flex" style={{ backgroundColor: C.bg }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div
          className="h-[3px] w-full transition-colors duration-300"
          style={{ backgroundColor: theme.accent, opacity: 0.85 }}
        />
        <div className="flex-1 overflow-y-auto">
          <div
            className="max-w-6xl mx-auto px-8 py-7 screen-enter"
            key={screen}
          >
            {children}
          </div>
        </div>
      </div>
      <CommandPalette />
    </div>
  );
}
