import React, { useState } from "react";
import { Search, Bell, ChevronRight, ChevronLeft } from "lucide-react";
import { useApp } from "../lib/context";
import { C, Kbd } from "./ui";
import { NOTIFICATIONS } from "../lib/mockData";

export default function Topbar() {
  const { trail, jump, back, setCommandOpen } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div
      className="h-14 shrink-0 border-b flex items-center gap-3 px-6"
      style={{ borderColor: C.border, backgroundColor: C.surface }}
    >
      <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
        {trail.length > 1 && (
          <button
            onClick={back}
            className="mr-1 p-1 rounded-md hover:bg-black/5 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ChevronLeft size={15} style={{ color: C.inkSoft }} />
          </button>
        )}
        {trail.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <ChevronRight size={13} style={{ color: C.inkFaint }} />}
            <button
              onClick={() => jump(i)}
              disabled={i === trail.length - 1}
              className={`px-1.5 py-0.5 rounded-md transition-colors duration-150 truncate ${
                i === trail.length - 1 ? "font-semibold" : "hover:underline"
              }`}
              style={{ color: i === trail.length - 1 ? C.ink : C.inkSoft }}
            >
              {crumb.label}
            </button>
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => setCommandOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors duration-150 hover:bg-black/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        style={{ borderColor: C.border, color: C.inkFaint, width: 260 }}
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search returns, docs, clients…</span>
        <Kbd>⌘K</Kbd>
      </button>

      <div className="relative">
        <button
          onClick={() => setNotifOpen((v) => !v)}
          className="relative p-2 rounded-lg transition-colors duration-150 hover:bg-black/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Bell size={17} style={{ color: C.inkSoft }} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: C.danger }}
          />
        </button>
        {notifOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-80 rounded-lg border shadow-lg overflow-hidden pop-in z-40"
            style={{ borderColor: C.border, backgroundColor: C.surface }}
          >
            <div
              className="px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wide"
              style={{
                borderBottom: `1px solid ${C.border}`,
                color: C.inkSoft,
              }}
            >
              Notifications
            </div>
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className="px-3.5 py-3 text-sm border-b last:border-b-0 transition-colors duration-150 hover:bg-black/[0.02]"
                style={{ borderColor: C.border, color: C.ink }}
              >
                {n.text}
                <div className="text-xs mt-0.5" style={{ color: C.inkFaint }}>
                  {n.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
