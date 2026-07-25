import React from "react";
import { Lock, FileText } from "lucide-react";
import { ReturnField, SourceDoc } from "../../lib/mockData";
import { C, hexToRgba, stateStyle } from "../../components/ui";

export default function Traceability({
  field,
  doc,
}: {
  field: ReturnField;
  doc: SourceDoc | undefined;
}) {
  if (!doc || !field.highlight) {
    return (
      <div
        className="rounded-lg border flex flex-col items-center justify-center gap-2 py-14"
        style={{ borderColor: C.border, backgroundColor: C.bg }}
      >
        <Lock size={20} style={{ color: C.inkFaint }} />
        <span className="text-xs" style={{ color: C.inkFaint }}>
          No source document — carried forward or calculated
        </span>
      </div>
    );
  }
  const tone = stateStyle[field.state].tone;
  return (
    <div
      className="relative rounded-lg border overflow-hidden"
      style={{
        borderColor: C.border,
        backgroundColor: "#FFFFFF",
        aspectRatio: "4 / 3",
      }}
    >
      <div className="p-5 space-y-2.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full"
            style={{
              backgroundColor: C.border,
              width: i % 3 === 0 ? "55%" : i % 4 === 0 ? "70%" : "90%",
            }}
          />
        ))}
      </div>
      <div
        className="absolute rounded-md pulse-highlight transition-all duration-300"
        style={{
          top: field.highlight.top,
          left: field.highlight.left,
          width: field.highlight.width,
          height: field.highlight.height,
          border: `2px solid ${tone}`,
          backgroundColor: hexToRgba(tone, 0.14),
          boxShadow: `0 0 0 3px ${hexToRgba(tone, 0.12)}`,
        }}
      />
      <div
        className="absolute bottom-2.5 right-3 text-[11px] px-2 py-0.5 rounded-full text-white"
        style={{ backgroundColor: hexToRgba(C.ink, 0.82) }}
      >
        Page {field.page} of {doc.pages}
      </div>
      <div
        className="absolute top-2.5 left-3 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1 text-white"
        style={{ backgroundColor: hexToRgba(C.ink, 0.82) }}
      >
        <FileText size={11} /> {doc.type}
      </div>
    </div>
  );
}
