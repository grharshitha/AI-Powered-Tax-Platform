import React from "react";
import { Sparkles, AlertTriangle, CheckCircle2, Edit3 } from "lucide-react";
import { ReturnField, SourceDoc } from "../../lib/mockData";
import { C, Button, StateBadge, hexToRgba } from "../../components/ui";

export default function AIInsights({
  field,
  doc,
}: {
  field: ReturnField;
  doc: SourceDoc | undefined;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <StateBadge state={field.state} confidence={field.confidence} />
        {field.state === "ai" && (field.confidence ?? 100) < 80 && (
          <span
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
            style={{ backgroundColor: C.dangerSoft, color: C.dangerText }}
          >
            <AlertTriangle size={12} /> Worth a quick look
          </span>
        )}
      </div>

      <div
        className="rounded-lg border p-4"
        style={{ borderColor: C.border, backgroundColor: C.bg }}
      >
        <div
          className="text-xs font-medium uppercase tracking-wide mb-1.5"
          style={{ color: C.inkSoft }}
        >
          How this value was derived
        </div>
        <p className="text-sm" style={{ color: C.ink }}>
          {field.calc}
        </p>
        {doc && (
          <p className="text-xs mt-2" style={{ color: C.inkFaint }}>
            Source: {doc.name} · page {field.page} of {doc.pages}
          </p>
        )}
      </div>

      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: hexToRgba(C.warning, 0.25),
          backgroundColor: C.warningSoft,
        }}
      >
        <div
          className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide mb-1.5"
          style={{ color: C.warningText }}
        >
          <Sparkles size={13} /> Why the AI landed here
        </div>
        <p className="text-sm" style={{ color: C.ink }}>
          {field.why}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap pt-1">
        {field.state !== "locked" && (
          <>
            <Button variant="primary" icon={CheckCircle2}>
              Confirm as correct
            </Button>
            <Button variant="secondary" icon={Edit3}>
              Edit value
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
