import React, { useState } from "react";
import { FileText, MessageSquare } from "lucide-react";
import { useApp } from "../../lib/context";
import {
  C,
  Card,
  Button,
  Ledger,
  StateBadge,
  PageHeader,
} from "../../components/ui";
import {
  RETURN_FIELDS,
  DOCS,
  THREADS,
  STAGES_SIMPLE,
  STAGES_DETAILED,
  CURRENT_STAGE_SIMPLE,
  CURRENT_STAGE_DETAILED,
} from "../../lib/mockData";
import StatusTimeline from "./StatusTimeline";
import Traceability from "./Traceability";
import AIInsights from "./AIInsights";

type Tab = "status" | "trace" | "ai";

export default function ReturnReview() {
  const { effectiveRole, selectedFieldId, navigate } = useApp();
  const [tab, setTab] = useState<Tab>("trace");
  const field =
    RETURN_FIELDS.find((f) => f.id === selectedFieldId) || RETURN_FIELDS[0];
  const doc = DOCS.find((d) => d.id === field.docId);
  const isClient = effectiveRole === "client";

  function openThreadFor(docId: string | null) {
    const t = THREADS.find(
      (th) =>
        docId &&
        th.linkedLabel.includes(
          DOCS.find((d) => d.id === docId)?.name.split(" — ")[1] || "###"
        )
    );
    navigate("collaboration", "Collaboration", {
      threadId: t ? t.id : THREADS[0].id,
    });
  }

  return (
    <>
      <PageHeader
        icon={FileText}
        title="Sarah Chen · 2025 return"
        subtitle="Form 1040 — every field traces back to its source"
      />

      <div className="grid grid-cols-12 gap-5">
        <Card className="col-span-12 lg:col-span-4 overflow-hidden self-start">
          <div
            className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide"
            style={{ backgroundColor: C.bg, color: C.inkSoft }}
          >
            Return fields
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            {RETURN_FIELDS.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  navigate("returns", "Returns", { fieldId: f.id });
                }}
                className="w-full text-left px-4 py-3 border-t flex items-center justify-between gap-2 transition-colors duration-150 focus:outline-none"
                style={{
                  borderColor: C.border,
                  backgroundColor:
                    f.id === selectedFieldId ? C.primarySoft : "transparent",
                }}
              >
                <div className="min-w-0">
                  <div
                    className="text-xs truncate"
                    style={{ color: C.inkFaint }}
                  >
                    {f.form}
                  </div>
                  <div
                    className="text-sm font-medium truncate"
                    style={{ color: C.ink }}
                  >
                    {f.label}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm mb-1" style={{ color: C.ink }}>
                    <Ledger>{f.value}</Ledger>
                  </div>
                  <StateBadge state={f.state} compact />
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-8 p-5">
          <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
            <div>
              <div className="text-xs" style={{ color: C.inkFaint }}>
                {field.form}
              </div>
              <h3
                className="text-lg font-semibold tracking-tight"
                style={{ color: C.ink }}
              >
                {field.label}
              </h3>
            </div>
            <div className="text-2xl font-semibold" style={{ color: C.ink }}>
              <Ledger>{field.value}</Ledger>
            </div>
          </div>

          <div
            className="flex items-center gap-1 mb-4 border-b"
            style={{ borderColor: C.border }}
          >
            {(
              [
                ["status", "Status"],
                ["trace", "Traceability"],
                ["ai", "AI Review"],
              ] as [Tab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="px-3 py-2 text-sm font-medium relative transition-colors duration-150 focus:outline-none"
                style={{ color: tab === id ? C.ink : C.inkFaint }}
              >
                {label}
                {tab === id && (
                  <span
                    className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full"
                    style={{ backgroundColor: C.primary }}
                  />
                )}
              </button>
            ))}
          </div>

          <div key={tab + field.id} className="pop-in">
            {tab === "status" && (
              <div>
                <StatusTimeline
                  stages={isClient ? STAGES_SIMPLE : STAGES_DETAILED}
                  currentIndex={
                    isClient ? CURRENT_STAGE_SIMPLE : CURRENT_STAGE_DETAILED
                  }
                />
                <p className="text-sm" style={{ color: C.inkSoft }}>
                  {isClient
                    ? "We're currently preparing your return. We'll let you know the moment it's ready for you to review."
                    : "In preparer review. 2 AI-extracted fields below 80% confidence still need a human check before this moves to client review."}
                </p>
              </div>
            )}
            {tab === "trace" && <Traceability field={field} doc={doc} />}
            {tab === "ai" && <AIInsights field={field} doc={doc} />}
          </div>

          <div className="flex justify-end mt-5">
            <Button
              variant="ghost"
              icon={MessageSquare}
              onClick={() => openThreadFor(field.docId)}
            >
              Ask about this
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
