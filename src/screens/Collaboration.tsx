import React, { useState } from "react";
import { MessageSquare, Shield, Users, Send } from "lucide-react";
import { useApp } from "../lib/context";
import { C, Card, PageHeader } from "../components/ui";
import { THREADS } from "../lib/mockData";

export default function Collaboration() {
  const { effectiveRole, focusThreadId, navigate } = useApp();
  const [activeId, setActiveId] = useState(focusThreadId || THREADS[0].id);
  const [draft, setDraft] = useState("");
  const [asInternal, setAsInternal] = useState(false);
  const [localMsgs, setLocalMsgs] = useState<Record<string, any[]>>({});
  const thread = THREADS.find((t) => t.id === activeId) || THREADS[0];
  const isClient = effectiveRole === "client";
  const extra = localMsgs[activeId] || [];

  function send() {
    if (!draft.trim()) return;
    setLocalMsgs((m) => ({
      ...m,
      [activeId]: [
        ...(m[activeId] || []),
        { from: "You", internal: asInternal, text: draft, time: "Just now" },
      ],
    }));
    setDraft("");
  }

  return (
    <>
      <PageHeader
        icon={MessageSquare}
        title="Collaboration"
        subtitle="Every thread stays linked to the document or task it's about"
      />
      <div className="grid grid-cols-12 gap-5">
        <Card className="col-span-12 lg:col-span-4 overflow-hidden self-start">
          <div
            className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide"
            style={{ backgroundColor: C.bg, color: C.inkSoft }}
          >
            Threads
          </div>
          {THREADS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className="w-full text-left px-4 py-3 border-t transition-colors duration-150"
              style={{
                borderColor: C.border,
                backgroundColor:
                  t.id === activeId ? C.primarySoft : "transparent",
              }}
            >
              <div className="text-sm font-medium" style={{ color: C.ink }}>
                {t.subject}
              </div>
              <div
                className="text-xs mt-0.5 truncate"
                style={{ color: C.inkFaint }}
              >
                {t.linkedLabel}
              </div>
              <div className="text-xs mt-1" style={{ color: C.inkSoft }}>
                Owner: {t.owner}
              </div>
            </button>
          ))}
        </Card>

        <Card
          className="col-span-12 lg:col-span-8 flex flex-col"
          style={{ minHeight: 440 }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: C.border }}
          >
            <div>
              <div className="text-sm font-semibold" style={{ color: C.ink }}>
                {thread.subject}
              </div>
              <button
                onClick={() =>
                  navigate(
                    thread.linkedScreen,
                    thread.linkedScreen === "returns" ? "Returns" : "Dashboard"
                  )
                }
                className="text-xs hover:underline transition-colors duration-150"
                style={{ color: C.primaryText }}
              >
                {thread.linkedLabel} →
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {[...thread.messages, ...extra].map((m, i) => {
              const mine = m.from === "You" || m.from.startsWith("You");
              return (
                <div
                  key={i}
                  className="rounded-lg p-3 max-w-[80%] pop-in"
                  style={{
                    backgroundColor: m.internal
                      ? C.neutralSoft
                      : mine
                      ? C.primarySoft
                      : C.bg,
                    marginLeft: mine ? "auto" : 0,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: C.ink }}
                    >
                      {m.from}
                    </span>
                    {m.internal && (
                      <span
                        className="text-xs px-1.5 rounded-full text-white"
                        style={{ backgroundColor: C.neutral }}
                      >
                        Internal only
                      </span>
                    )}
                    <span
                      className="text-xs ml-auto"
                      style={{ color: C.inkFaint }}
                    >
                      {m.time}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: C.ink }}>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>
          {!isClient && (
            <div
              className="p-3 border-t flex items-center gap-2"
              style={{ borderColor: C.border }}
            >
              <button
                onClick={() => setAsInternal((v) => !v)}
                className="text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1 whitespace-nowrap transition-colors duration-150"
                style={{
                  borderColor: C.border,
                  backgroundColor: asInternal ? C.neutralSoft : "transparent",
                  color: C.inkSoft,
                }}
              >
                {asInternal ? <Shield size={12} /> : <Users size={12} />}{" "}
                {asInternal ? "Internal note" : "Visible to client"}
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Write a message…"
                className="flex-1 text-sm px-3 py-2 rounded-lg border outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-500"
                style={{ borderColor: C.border }}
              />
              <button
                onClick={send}
                className="p-2.5 rounded-lg text-white transition-transform duration-150 hover:scale-105 active:scale-95"
                style={{ backgroundColor: C.ink }}
              >
                <Send size={14} />
              </button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
