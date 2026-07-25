import React, { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Filter,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useApp } from "../lib/context";
import { C, Card, Button, StatusPill, PageHeader } from "../components/ui";
import {
  RETURNS_LIST,
  TASKS,
  STAGES_SIMPLE,
  CURRENT_STAGE_SIMPLE,
} from "../lib/mockData";
import StatusTimeline from "./returns/StatusTimeline";

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: string;
}) {
  return (
    <Card className="p-4 flex-1 min-w-[140px]">
      <div
        className="text-2xl font-semibold tracking-tight"
        style={{ color: C.ink }}
      >
        {value}
      </div>
      <div
        className="text-xs mt-1 flex items-center gap-1.5"
        style={{ color: C.inkSoft }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: tone }}
        />
        {label}
      </div>
    </Card>
  );
}

function CpaDashboard({ role }: { role: "cpa" | "admin" }) {
  const { navigate } = useApp();
  const [sortUrgent, setSortUrgent] = useState(true);
  const list = useMemo(() => {
    const arr = [...RETURNS_LIST];
    if (sortUrgent) arr.sort((a, b) => b.urgency - a.urgency);
    return arr;
  }, [sortUrgent]);

  const counts = {
    blocked: RETURNS_LIST.filter((r) => r.status === "blocked").length,
    review: RETURNS_LIST.filter((r) => r.status === "review").length,
    progress: RETURNS_LIST.filter((r) => r.status === "progress").length,
    filed: RETURNS_LIST.filter((r) => r.status === "filed").length,
  };

  return (
    <>
      <PageHeader
        icon={LayoutDashboard}
        title={role === "admin" ? "Firm workload" : "Your queue"}
        subtitle={`${counts.blocked + counts.review} returns need action today`}
      />

      <div className="flex gap-3 mb-6 flex-wrap">
        <StatCard
          label="Waiting on client"
          value={counts.blocked}
          tone={C.danger}
        />
        <StatCard
          label="Ready for review"
          value={counts.review}
          tone={C.warning}
        />
        <StatCard
          label="In preparation"
          value={counts.progress}
          tone={C.neutral}
        />
        <StatCard
          label="Filed & accepted"
          value={counts.filed}
          tone={C.success}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: C.ink }}>
          All returns
        </h3>
        <Button
          size="sm"
          icon={Filter}
          onClick={() => setSortUrgent((v) => !v)}
        >
          {sortUrgent ? "Sorted by urgency" : "Sorted by client"}
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div
          className="grid grid-cols-12 px-4 py-2.5 text-xs font-medium uppercase tracking-wide"
          style={{ backgroundColor: C.bg, color: C.inkSoft }}
        >
          <div className="col-span-3">Client</div>
          <div className="col-span-3">Status</div>
          <div className="col-span-3">Owner</div>
          <div className="col-span-3">Why it's here</div>
        </div>
        {list.map((r) => (
          <button
            key={r.id}
            onClick={() => navigate("returns", `${r.client} — Return Review`)}
            className="w-full grid grid-cols-12 px-4 py-3.5 text-left border-t items-center transition-colors duration-150 hover:bg-black/[0.02] focus:outline-none"
            style={{ borderColor: C.border }}
          >
            <div className="col-span-3">
              <div className="text-sm font-medium" style={{ color: C.ink }}>
                {r.client}
              </div>
              <div className="text-xs" style={{ color: C.inkFaint }}>
                {r.year} return
              </div>
            </div>
            <div className="col-span-3">
              <StatusPill status={r.status} label={r.statusLabel} />
            </div>
            <div className="col-span-3 text-sm" style={{ color: C.inkSoft }}>
              {r.owner}
            </div>
            <div
              className="col-span-3 text-xs flex items-center justify-between"
              style={{ color: C.inkFaint }}
            >
              <span className="truncate">{r.note}</span>
              <ArrowRight size={13} className="shrink-0 ml-2" />
            </div>
          </button>
        ))}
      </Card>
    </>
  );
}

function ClientHome() {
  const { navigate } = useApp();
  const myTasks = TASKS.filter((t) => t.returnId === "r1");
  const doneCount = myTasks.filter((t) => t.done).length;

  return (
    <>
      <Card
        className="p-6 mb-6"
        style={{ backgroundColor: "#E5F4FD", borderColor: "#BEE3F8" }}
      >
        <p className="text-sm font-medium mb-1" style={{ color: "#075985" }}>
          Welcome, Sarah
        </p>
        <h1
          className="text-2xl font-semibold mb-2 tracking-tight"
          style={{ color: C.ink }}
        >
          One thing needs your attention right now
        </h1>
        <p className="text-sm mb-4" style={{ color: C.inkSoft }}>
          Sign your engagement letter so your preparer can start working on your
          2025 return.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("tasks", "Checklist")}
        >
          Sign engagement letter
        </Button>
      </Card>

      <StatusTimeline
        stages={STAGES_SIMPLE}
        currentIndex={CURRENT_STAGE_SIMPLE}
      />

      <div className="flex items-center justify-between mb-3 mt-2">
        <h3 className="text-sm font-semibold" style={{ color: C.ink }}>
          Your checklist
        </h3>
        <span className="text-xs" style={{ color: C.inkSoft }}>
          {doneCount} of {myTasks.length} done
        </span>
      </div>
      <Card className="overflow-hidden">
        {myTasks.map((t) => (
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
            {t.urgent && <StatusPill status="blocked" label="Do this first" />}
          </div>
        ))}
      </Card>
    </>
  );
}

export default function Dashboard() {
  const { effectiveRole, role } = useApp();
  return effectiveRole === "client" ? (
    <ClientHome />
  ) : (
    <CpaDashboard role={role as "cpa" | "admin"} />
  );
}
