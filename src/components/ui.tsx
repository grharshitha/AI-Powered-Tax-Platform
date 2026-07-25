import React from "react";
import { LucideIcon, Sparkles, CheckCircle2, Lock, Edit3 } from "lucide-react";
import { FieldState, Role } from "../lib/mockData";

/* ============================================================
   DESIGN TOKENS
   Neutral, near-monochrome base (Linear/Vercel-style) with a
   single indigo accent reserved for primary actions and focus —
   color is spent almost entirely on meaning (status/state), not
   decoration. JetBrains Mono is used for every numeric or ID-like
   value, the one deliberate "financial software" signature.
============================================================ */
export const C = {
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  ink: "#0B0B0F",
  inkSoft: "#65656B",
  inkFaint: "#9A9AA2",
  border: "#E8E8EA",
  borderStrong: "#D8D8DC",

  primary: "#4F46E5",
  primarySoft: "#EEF0FE",
  primaryText: "#4338CA",

  success: "#0E9F6E",
  successSoft: "#E6F7F0",
  successText: "#057A55",

  warning: "#D97706",
  warningSoft: "#FEF3E2",
  warningText: "#92400E",

  danger: "#DC2626",
  dangerSoft: "#FDECEC",
  dangerText: "#B91C1C",

  neutral: "#6B7280",
  neutralSoft: "#F1F1F3",
};

export function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export const ROLE_THEME: Record<
  Role,
  { accent: string; soft: string; text: string; name: string }
> = {
  cpa: {
    accent: C.primary,
    soft: C.primarySoft,
    text: C.primaryText,
    name: "CPA / Preparer workspace",
  },
  client: {
    accent: "#0EA5E9",
    soft: "#E5F4FD",
    text: "#075985",
    name: "Client workspace",
  },
  admin: {
    accent: "#7C3AED",
    soft: "#F2E9FE",
    text: "#5B21B6",
    name: "Firm admin workspace",
  },
};

export const stateStyle: Record<
  FieldState,
  { bg: string; fg: string; tone: string; icon: LucideIcon; label: string }
> = {
  ai: {
    bg: C.warningSoft,
    fg: C.warningText,
    tone: C.warning,
    icon: Sparkles,
    label: "AI-generated",
  },
  verified: {
    bg: C.successSoft,
    fg: C.successText,
    tone: C.success,
    icon: CheckCircle2,
    label: "Verified",
  },
  locked: {
    bg: C.neutralSoft,
    fg: C.neutral,
    tone: C.neutral,
    icon: Lock,
    label: "Locked",
  },
  editable: {
    bg: C.surface,
    fg: C.inkSoft,
    tone: C.inkFaint,
    icon: Edit3,
    label: "Editable",
  },
};

export const statusMap: Record<string, { bg: string; fg: string }> = {
  blocked: { bg: C.dangerSoft, fg: C.dangerText },
  review: { bg: C.warningSoft, fg: C.warningText },
  progress: { bg: C.neutralSoft, fg: C.neutral },
  filed: { bg: C.successSoft, fg: C.successText },
};

/* ============================================================
   GLOBAL STYLE — fonts + hand-rolled keyframes. No compiler is
   assumed here, so animation + font-face live in one <style> tag
   mounted once at the app root.
============================================================ */
export function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
      html, body, #root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
      .font-ledger { font-family: 'JetBrains Mono', ui-monospace, monospace; }

      @keyframes screenIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      .screen-enter { animation: screenIn 220ms cubic-bezier(0.16, 1, 0.3, 1); }

      @keyframes popIn { from { opacity: 0; transform: translateY(-4px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .pop-in { animation: popIn 140ms ease-out; }

      @keyframes drawerIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      .drawer-enter { animation: drawerIn 200ms cubic-bezier(0.16, 1, 0.3, 1); }

      @keyframes modalIn { from { opacity: 0; transform: scale(0.97) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      .modal-enter { animation: modalIn 160ms cubic-bezier(0.16, 1, 0.3, 1); }

      @keyframes pulseGlow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      .pulse-highlight { animation: pulseGlow 2.4s ease-in-out infinite; }

      @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
      .overlay-enter { animation: overlayIn 160ms ease-out; }

      * { scrollbar-width: thin; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: #D8D8DC; border-radius: 8px; }
    `}</style>
  );
}

/* ============================================================
   PRIMITIVES
============================================================ */
export function Card({
  children,
  className = "",
  style = {},
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border bg-white ${className}`}
      style={{ borderColor: C.border, ...style }}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  onClick,
  disabled,
  icon: Icon,
}: {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
}) {
  const base =
    "inline-flex items-center gap-1.5 font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed";
  const sizes = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm";
  const variants: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: C.ink, color: "#fff" },
    secondary: {
      backgroundColor: "transparent",
      color: C.ink,
      border: `1px solid ${C.border}`,
    },
    ghost: { backgroundColor: "transparent", color: C.inkSoft },
    danger: { backgroundColor: C.dangerSoft, color: C.dangerText },
  };
  const hover =
    variant === "primary"
      ? "hover:opacity-90"
      : variant === "ghost"
      ? "hover:bg-black/[0.03]"
      : "hover:bg-black/[0.02]";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes} ${hover} active:scale-[0.98] focus-visible:ring-indigo-500 ${className}`}
      style={variants[variant]}
    >
      {Icon && <Icon size={size === "sm" ? 12 : 14} />}
      {children}
    </button>
  );
}

export function StatusPill({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const s = statusMap[status] || statusMap.progress;
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {label}
    </span>
  );
}

export function StateBadge({
  state,
  confidence,
  compact = false,
}: {
  state: FieldState;
  confidence?: number | null;
  compact?: boolean;
}) {
  const s = stateStyle[state];
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors duration-150"
      style={{
        backgroundColor: s.bg,
        color: s.fg,
        borderColor: hexToRgba(s.tone, 0.3),
      }}
    >
      <Icon size={12} />
      {!compact && s.label}
      {confidence != null && (
        <span className="opacity-70">· {confidence}%</span>
      )}
    </span>
  );
}

export function Ledger({ children }: { children: React.ReactNode }) {
  return <span className="font-ledger tabular-nums">{children}</span>;
}

export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  right,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
      <div className="flex items-start gap-3">
        {Icon && (
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: C.primarySoft }}
          >
            <Icon size={17} style={{ color: C.primaryText }} />
          </div>
        )}
        <div>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: C.ink }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm mt-0.5" style={{ color: C.inkSoft }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {right}
    </div>
  );
}

export function Avatar({ name, size = 26 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        backgroundColor: C.primarySoft,
        color: C.primaryText,
      }}
    >
      {initials}
    </div>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className="text-[10px] font-medium px-1.5 py-0.5 rounded border"
      style={{
        borderColor: C.border,
        color: C.inkFaint,
        backgroundColor: C.bg,
      }}
    >
      {children}
    </kbd>
  );
}

export function EmptyState({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-2 py-14"
      style={{ color: C.inkFaint }}
    >
      <Icon size={22} />
      <span className="text-sm">{text}</span>
    </div>
  );
}
