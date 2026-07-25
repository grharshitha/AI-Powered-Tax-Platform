import React, { useEffect, useMemo, useState } from "react";
import {
  FileText,
  FolderOpen,
  MessageSquare,
  CheckSquare,
  Search,
} from "lucide-react";
import { useApp } from "../lib/context";
import { C } from "./ui";
import { RETURNS_LIST, LIBRARY, THREADS, TASKS } from "../lib/mockData";

interface Hit {
  id: string;
  label: string;
  sub: string;
  icon: any;
  go: () => void;
}

export default function CommandPalette() {
  const { commandOpen, setCommandOpen, navigate } = useApp();
  const [q, setQ] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
      if (e.key === "Escape") setCommandOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandOpen, setCommandOpen]);

  const hits: Hit[] = useMemo(() => {
    const all: Hit[] = [
      ...RETURNS_LIST.map((r) => ({
        id: "r-" + r.id,
        label: `${r.client} — ${r.year} return`,
        sub: r.statusLabel,
        icon: FileText,
        go: () => navigate("returns", `${r.client} — Return Review`),
      })),
      ...LIBRARY.slice(0, 40).map((d) => ({
        id: "d-" + d.id,
        label: d.name,
        sub: d.status,
        icon: FolderOpen,
        go: () => navigate("documents", "Documents"),
      })),
      ...THREADS.map((t) => ({
        id: "t-" + t.id,
        label: t.subject,
        sub: t.linkedLabel,
        icon: MessageSquare,
        go: () =>
          navigate("collaboration", "Collaboration", { threadId: t.id }),
      })),
      ...TASKS.map((tk) => ({
        id: "tk-" + tk.id,
        label: tk.label,
        sub: `Owner: ${tk.owner}`,
        icon: CheckSquare,
        go: () => navigate("tasks", "Tasks"),
      })),
    ];
    if (!q.trim()) return all.slice(0, 8);
    const query = q.toLowerCase();
    return all
      .filter(
        (h) =>
          h.label.toLowerCase().includes(query) ||
          h.sub.toLowerCase().includes(query)
      )
      .slice(0, 12);
  }, [q, navigate]);

  if (!commandOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] overlay-enter"
      style={{ backgroundColor: "rgba(11,11,15,0.4)" }}
      onClick={() => setCommandOpen(false)}
    >
      <div
        className="w-[560px] max-w-[90vw] rounded-xl border shadow-2xl overflow-hidden modal-enter"
        style={{ backgroundColor: C.surface, borderColor: C.border }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center gap-2.5 px-4 py-3 border-b"
          style={{ borderColor: C.border }}
        >
          <Search size={16} style={{ color: C.inkFaint }} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search returns, documents, threads, tasks…"
            className="flex-1 text-sm outline-none"
            style={{ color: C.ink }}
          />
          <span
            className="text-[10px] px-1.5 py-0.5 rounded border"
            style={{ borderColor: C.border, color: C.inkFaint }}
          >
            ESC
          </span>
        </div>
        <div className="max-h-[360px] overflow-y-auto py-1.5">
          {hits.length === 0 && (
            <div
              className="px-4 py-6 text-sm text-center"
              style={{ color: C.inkFaint }}
            >
              No results
            </div>
          )}
          {hits.map((h) => {
            const Icon = h.icon;
            return (
              <button
                key={h.id}
                onClick={() => {
                  h.go();
                  setQ("");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-black/[0.03]"
              >
                <Icon size={15} style={{ color: C.inkFaint }} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate" style={{ color: C.ink }}>
                    {h.label}
                  </div>
                  <div
                    className="text-xs truncate"
                    style={{ color: C.inkFaint }}
                  >
                    {h.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
