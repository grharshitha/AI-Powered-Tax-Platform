import React from "react";
import { CheckCircle2 } from "lucide-react";
import { C } from "../../components/ui";

export default function StatusTimeline({
  stages,
  currentIndex,
  dense = false,
}: {
  stages: string[];
  currentIndex: number;
  dense?: boolean;
}) {
  return (
    <div className="flex items-center w-full mb-6">
      {stages.map((label, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <React.Fragment key={label}>
            <div
              className="flex flex-col items-center"
              style={{ minWidth: dense ? 64 : 100 }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors duration-300"
                style={{
                  backgroundColor: done
                    ? C.success
                    : active
                    ? C.successSoft
                    : C.neutralSoft,
                  color: done ? "#fff" : active ? C.successText : C.inkFaint,
                  border: active ? `2px solid ${C.success}` : "none",
                }}
              >
                {done ? <CheckCircle2 size={13} /> : i + 1}
              </div>
              <span
                className="text-[11px] mt-1.5 text-center leading-tight"
                style={{
                  color: active ? C.ink : C.inkFaint,
                  fontWeight: active ? 600 : 400,
                }}
              >
                {label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div
                className="flex-1 h-[2px] -mt-4 transition-colors duration-300"
                style={{
                  backgroundColor: i < currentIndex ? C.success : C.border,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
