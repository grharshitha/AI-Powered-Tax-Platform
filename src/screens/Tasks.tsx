import React from "react";
import { CheckSquare, CheckCircle2, Lock } from "lucide-react";
import { useApp } from "../lib/context";
import { C, Card, PageHeader, StatusPill } from "../components/ui";
import { TASKS, RETURNS_LIST } from "../lib/mockData";

export default function Tasks() {
  const { effectiveRole, navigate } = useApp();
  const isClient = effectiveRole === "client";
  const tasks = isClient ? TASKS.filter((t) => t.returnId === "r1") : TASKS;
  const doneCount = tasks.filter((t) => t.done).length;

  const grouped: Record<string, typeof TASKS> = {};
  if (!isClient) {
    tasks.forEach((t) => {
      const key = t.owner;
      grouped[key] = grouped[key] || [];
      grouped[key].push(t);
    });
  }

  function returnLabel(returnId?: string) {
    const r = RETURNS_LIST.find((r) => r.id === returnId);
    return r ? `${r.client} — ${r.year}` : "";
  }

  return (
    <>
      <PageHeader
        icon={CheckSquare}
        title={isClient ? "Your checklist" : "Tasks"}
        subtitle={`${doneCount} of ${tasks.length} done`}
      />

      {isClient ? (
        <Card className="overflow-hidden">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0 transition-colors duration-150 hover:bg-black/[0.015]"
              style={{ borderColor: C.border }}
            >
              {t.done ? (
                <CheckCircle2 size={18} style={{ color: C.success }} />
              ) : t.locked ? (
                <Lock size={18} style={{ color: C.inkFaint }} />
              ) : (
                <div
                  className="w-[18px] h-[18px] rounded-full border-2"
                  style={{ borderColor: t.urgent ? C.danger : C.inkFaint }}
                />
              )}
              <span
                className="text-sm flex-1"
                style={{
                  color: t.locked ? C.inkFaint : C.ink,
                  textDecoration: t.done ? "line-through" : "none",
                }}
              >
                {t.label}
              </span>
              {t.urgent && (
                <StatusPill status="blocked" label="Do this first" />
              )}
            </div>
          ))}
        </Card>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([owner, items]) => (
            <div key={owner}>
              <h3
                className="text-xs font-semibold uppercase tracking-wide mb-2"
                style={{ color: C.inkSoft }}
              >
                {owner}
              </h3>
              <Card className="overflow-hidden">
                {items.map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      t.returnId && navigate("returns", returnLabel(t.returnId))
                    }
                    className="w-full flex items-center gap-3 px-4 py-3.5 border-b last:border-b-0 text-left transition-colors duration-150 hover:bg-black/[0.02]"
                    style={{ borderColor: C.border }}
                  >
                    {t.done ? (
                      <CheckCircle2 size={17} style={{ color: C.success }} />
                    ) : (
                      <div
                        className="w-[17px] h-[17px] rounded-full border-2 shrink-0"
                        style={{
                          borderColor: t.urgent ? C.danger : C.inkFaint,
                        }}
                      />
                    )}
                    <span
                      className="text-sm flex-1"
                      style={{
                        color: C.ink,
                        textDecoration: t.done ? "line-through" : "none",
                      }}
                    >
                      {t.label}
                    </span>
                    <span className="text-xs" style={{ color: C.inkFaint }}>
                      {returnLabel(t.returnId)}
                    </span>
                    {t.urgent && <StatusPill status="blocked" label="Urgent" />}
                  </button>
                ))}
              </Card>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
