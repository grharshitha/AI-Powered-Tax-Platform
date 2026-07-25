import React from "react";
import { Settings as SettingsIcon, ArrowLeftRight } from "lucide-react";
import { useApp } from "../lib/context";
import {
  C,
  Card,
  PageHeader,
  Avatar,
  ROLE_THEME,
  Button,
} from "../components/ui";
import { Role } from "../lib/mockData";

const ROLE_DESC: Record<Role, string> = {
  client: "See your return, documents, and checklist the way a taxpayer would.",
  cpa: "Your day-to-day workspace — dashboard, return review, and messages.",
  admin: "Everything a preparer sees, plus firm-wide workload visibility.",
};

export default function Settings() {
  const { role, switchRole, personalMode, togglePersonalMode } = useApp();

  return (
    <>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        subtitle="Role, workspace, and account preferences"
      />

      <h3 className="text-sm font-semibold mb-2" style={{ color: C.ink }}>
        Active role
      </h3>
      <p className="text-xs mb-3" style={{ color: C.inkFaint }}>
        The same product reshapes its navigation and permissions per role —
        switch here to preview any of them.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {(Object.keys(ROLE_THEME) as Role[]).map((r) => (
          <Card
            key={r}
            onClick={() => switchRole(r)}
            className="p-4 cursor-pointer transition-all duration-150 hover:shadow-md"
            style={{
              borderColor: r === role ? ROLE_THEME[r].accent : C.border,
              borderWidth: r === role ? 2 : 1,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Avatar name={ROLE_THEME[r].name} size={24} />
              <span className="text-sm font-medium" style={{ color: C.ink }}>
                {ROLE_THEME[r].name}
              </span>
            </div>
            <p className="text-xs" style={{ color: C.inkSoft }}>
              {ROLE_DESC[r]}
            </p>
          </Card>
        ))}
      </div>

      {(role === "cpa" || role === "admin") && (
        <>
          <h3 className="text-sm font-semibold mb-2" style={{ color: C.ink }}>
            Personal return
          </h3>
          <p className="text-xs mb-3" style={{ color: C.inkFaint }}>
            Firm staff can also have their own personal return in the system.
            Toggle this to preview your own return as a client would see it,
            without losing your firm login.
          </p>
          <Card className="p-4 flex items-center justify-between mb-8">
            <div>
              <div className="text-sm font-medium" style={{ color: C.ink }}>
                {personalMode
                  ? "Currently viewing your personal return"
                  : "Currently in firm workspace"}
              </div>
              <div className="text-xs mt-0.5" style={{ color: C.inkFaint }}>
                Your firm identity stays the same underneath — this only changes
                what's shown.
              </div>
            </div>
            <Button
              variant="secondary"
              icon={ArrowLeftRight}
              onClick={togglePersonalMode}
            >
              {personalMode
                ? "Back to firm workspace"
                : "Switch to personal view"}
            </Button>
          </Card>
        </>
      )}

      <h3 className="text-sm font-semibold mb-2" style={{ color: C.ink }}>
        About this prototype
      </h3>
      <Card className="p-4">
        <p className="text-sm" style={{ color: C.inkSoft }}>
          All data on this screen and throughout the app is fixture data for
          demonstration. No real authentication, document parsing, or AI model
          runs behind this build — see the README for the full breakdown of
          what's real vs. simulated.
        </p>
      </Card>
    </>
  );
}
