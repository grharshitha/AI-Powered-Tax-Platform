// ============================================================
// Central fixture data + types. Every screen imports from here
// so the app feels like one connected product, not ten demos.
// ============================================================

export type FieldState = "ai" | "verified" | "locked" | "editable";
export type ReturnStatus = "blocked" | "review" | "progress" | "filed";
export type Role = "client" | "cpa" | "admin";

export interface SourceDoc {
  id: string;
  name: string;
  type: string;
  pages: number;
}

export interface ReturnField {
  id: string;
  label: string;
  form: string;
  value: string;
  state: FieldState;
  confidence: number | null;
  docId: string | null;
  page: number | null;
  calc: string;
  why: string;
  highlight: {
    top: string;
    left: string;
    width: string;
    height: string;
  } | null;
}

export interface ReturnSummary {
  id: string;
  client: string;
  year: number;
  status: ReturnStatus;
  statusLabel: string;
  owner: string;
  urgency: number;
  note: string;
}

export interface Message {
  from: string;
  internal: boolean;
  text: string;
  time: string;
}

export interface Thread {
  id: string;
  subject: string;
  linkedLabel: string;
  linkedScreen: "returns" | "dashboard" | "documents";
  owner: string;
  messages: Message[];
}

export interface LibraryDoc {
  id: string;
  name: string;
  type: string;
  client: string;
  status: string;
  uploaded: string;
  linked: boolean;
}

export interface TaskItem {
  id: string;
  label: string;
  done: boolean;
  urgent?: boolean;
  locked?: boolean;
  owner: string;
  returnId?: string;
}

export const DOCS: SourceDoc[] = [
  { id: "d1", name: "W-2 — Meridian Health Systems", type: "W-2", pages: 1 },
  {
    id: "d2",
    name: "1099-INT — Riverstone Credit Union",
    type: "1099-INT",
    pages: 1,
  },
  { id: "d3", name: "1098 — Riverstone Mortgage", type: "1098", pages: 2 },
  {
    id: "d4",
    name: "Schedule K-1 — Alder Consulting LLC",
    type: "K-1",
    pages: 3,
  },
  {
    id: "d5",
    name: "Receipts — Home Office Supplies",
    type: "Receipts",
    pages: 6,
  },
];

export const RETURN_FIELDS: ReturnField[] = [
  {
    id: "f1",
    label: "Wages (Box 1)",
    form: "Form 1040, Line 1a",
    value: "$118,420.00",
    state: "verified",
    confidence: 99,
    docId: "d1",
    page: 1,
    calc: "Pulled directly from W-2 Box 1, no transformation applied.",
    why: "Exact match to employer-reported wage box; high-confidence field with no ambiguity.",
    highlight: { top: "16%", left: "10%", width: "42%", height: "7%" },
  },
  {
    id: "f2",
    label: "Federal Tax Withheld",
    form: "Form 1040, Line 25a",
    value: "$21,340.00",
    state: "verified",
    confidence: 99,
    docId: "d1",
    page: 1,
    calc: "Pulled directly from W-2 Box 2.",
    why: "Single clean source, standard field, nothing to reconcile.",
    highlight: { top: "27%", left: "10%", width: "38%", height: "7%" },
  },
  {
    id: "f3",
    label: "Taxable Interest",
    form: "Form 1040, Line 2b",
    value: "$1,284.50",
    state: "ai",
    confidence: 91,
    docId: "d2",
    page: 1,
    calc: "Extracted from 1099-INT Box 1 ($1,284.50), no adjustments needed.",
    why: "High-confidence extraction, but the source scan is slightly skewed around this box — flagged for a quick glance rather than full re-derivation.",
    highlight: { top: "34%", left: "12%", width: "36%", height: "7%" },
  },
  {
    id: "f4",
    label: "Mortgage Interest Deduction",
    form: "Schedule A, Line 8a",
    value: "$9,760.12",
    state: "ai",
    confidence: 74,
    docId: "d3",
    page: 2,
    calc: "Sum of Box 1 interest ($9,410.00) plus points amortization ($350.12) from 1098 page 2 table.",
    why: "Two numbers were combined from different parts of the document — combination logic is more error-prone than a single-box read, so this is a good one to double check.",
    highlight: { top: "52%", left: "14%", width: "50%", height: "8%" },
  },
  {
    id: "f5",
    label: "K-1 Ordinary Business Income",
    form: "Schedule E, Line 28",
    value: "$34,900.00",
    state: "ai",
    confidence: 58,
    docId: "d4",
    page: 1,
    calc: "Box 1 of Schedule K-1, cross-checked against the partnership basis worksheet on page 3.",
    why: "This scan's box layout differs from the template we trained against — treat as a strong draft, not a final number.",
    highlight: { top: "40%", left: "16%", width: "46%", height: "8%" },
  },
  {
    id: "f6",
    label: "Home Office Deduction",
    form: "Schedule C, Line 30",
    value: "$1,920.00",
    state: "editable",
    confidence: null,
    docId: "d5",
    page: 3,
    calc: "Simplified method: 240 sq ft × $8/sq ft, based on receipts bundle.",
    why: "The method choice (simplified vs. actual expense) is a judgment call the system can't make — left open for preparer input.",
    highlight: { top: "22%", left: "10%", width: "55%", height: "7%" },
  },
  {
    id: "f7",
    label: "Prior-Year AGI (e-file signature)",
    form: "Form 1040, Line 11 (2024)",
    value: "$142,110.00",
    state: "locked",
    confidence: null,
    docId: null,
    page: null,
    calc: "Carried forward from last year's filed return; locked to prevent edits that would break e-file verification.",
    why: "IRS e-file requires this to match last year's accepted return exactly.",
    highlight: null,
  },
  {
    id: "f8",
    label: "Total Tax Liability",
    form: "Form 1040, Line 24",
    value: "$28,114.00",
    state: "locked",
    confidence: null,
    docId: null,
    page: null,
    calc: "Calculated automatically from all lines above; recalculates live as source fields change.",
    why: "A derived value — editing it directly would desync it from its inputs, so it reacts to upstream changes instead.",
    highlight: null,
  },
];

export const RETURNS_LIST: ReturnSummary[] = [
  {
    id: "r1",
    client: "Sarah Chen",
    year: 2025,
    status: "blocked",
    statusLabel: "Waiting on client",
    owner: "You",
    urgency: 3,
    note: "Missing signed engagement letter",
  },
  {
    id: "r2",
    client: "Marcus Webb",
    year: 2025,
    status: "review",
    statusLabel: "Ready for your review",
    owner: "You",
    urgency: 3,
    note: "Preparer marked complete 2 days ago",
  },
  {
    id: "r3",
    client: "Alder Consulting LLC",
    year: 2025,
    status: "progress",
    statusLabel: "In preparation",
    owner: "Priya",
    urgency: 2,
    note: "K-1 income needs confirmation",
  },
  {
    id: "r4",
    client: "Dana Ilić",
    year: 2025,
    status: "blocked",
    statusLabel: "Waiting on client",
    owner: "You",
    urgency: 2,
    note: "2 documents requested, none uploaded",
  },
  {
    id: "r5",
    client: "Tom Okafor",
    year: 2025,
    status: "progress",
    statusLabel: "In preparation",
    owner: "You",
    urgency: 1,
    note: "On track",
  },
  {
    id: "r6",
    client: "Reyes Family Trust",
    year: 2025,
    status: "filed",
    statusLabel: "Filed & accepted",
    owner: "—",
    urgency: 0,
    note: "Accepted by IRS 7/18",
  },
  {
    id: "r7",
    client: "Elena Petrova",
    year: 2025,
    status: "review",
    statusLabel: "Ready for your review",
    owner: "You",
    urgency: 2,
    note: "Preparer marked complete today",
  },
  {
    id: "r8",
    client: "Northgate Rentals LLC",
    year: 2025,
    status: "progress",
    statusLabel: "In preparation",
    owner: "Priya",
    urgency: 1,
    note: "On track",
  },
];

export const THREADS: Thread[] = [
  {
    id: "t1",
    subject: "Mortgage interest — points question",
    linkedLabel: "1098 — Riverstone Mortgage",
    linkedScreen: "returns",
    owner: "Sarah Chen",
    messages: [
      {
        from: "You",
        internal: false,
        text: "Quick question — did you pay any points to lower your rate when you refinanced in March?",
        time: "Mon 9:14 AM",
      },
      {
        from: "Sarah Chen",
        internal: false,
        text: "Yes, 0.5 points. I can dig up the closing disclosure if that helps.",
        time: "Mon 2:02 PM",
      },
      {
        from: "You (internal)",
        internal: true,
        text: "If she sends the CD, re-run the amortization split before finalizing Schedule A line 8a.",
        time: "Mon 2:05 PM",
      },
    ],
  },
  {
    id: "t2",
    subject: "K-1 basis worksheet missing page",
    linkedLabel: "Schedule K-1 — Alder Consulting LLC",
    linkedScreen: "returns",
    owner: "Priya",
    messages: [
      {
        from: "Priya (internal)",
        internal: true,
        text: "Basis worksheet page looks cut off in the client upload — only 3 of 4 pages came through.",
        time: "Fri 11:40 AM",
      },
      {
        from: "You (internal)",
        internal: true,
        text: "Good catch — I'll request the missing page from the client directly.",
        time: "Fri 11:52 AM",
      },
    ],
  },
  {
    id: "t3",
    subject: "Engagement letter reminder",
    linkedLabel: "Task: Sign engagement letter",
    linkedScreen: "dashboard",
    owner: "Sarah Chen",
    messages: [
      {
        from: "You",
        internal: false,
        text: "Hi Sarah — just a reminder we can't start filing until the engagement letter is signed. It's the first item on your checklist.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "t4",
    subject: "Home office method — simplified vs actual",
    linkedLabel: "Receipts — Home Office Supplies",
    linkedScreen: "returns",
    owner: "Marcus Webb",
    messages: [
      {
        from: "Marcus Webb",
        internal: false,
        text: "Does it matter which home office method you use? I have receipts for both.",
        time: "2 days ago",
      },
      {
        from: "You",
        internal: false,
        text: "For your square footage, simplified comes out slightly ahead — I'll use that unless you'd rather see both calculated.",
        time: "2 days ago",
      },
    ],
  },
];

export const DOC_TYPES = [
  "W-2",
  "1099-NEC",
  "1099-INT",
  "1099-DIV",
  "K-1",
  "Receipt",
  "Bank Statement",
  "1098",
];
export const CLIENT_NAMES = [
  "Sarah Chen",
  "Marcus Webb",
  "Alder Consulting LLC",
  "Dana Ilić",
  "Tom Okafor",
  "Reyes Family Trust",
  "Elena Petrova",
  "Northgate Rentals LLC",
];

function generateLibrary(n: number): LibraryDoc[] {
  const rows: LibraryDoc[] = [];
  for (let i = 0; i < n; i++) {
    const type = DOC_TYPES[i % DOC_TYPES.length];
    const client = CLIENT_NAMES[i % CLIENT_NAMES.length];
    rows.push({
      id: "lib" + i,
      name: `${type} — ${client} #${Math.floor(i / DOC_TYPES.length) + 1}`,
      type,
      client,
      status: ["Extracted", "Needs review", "Verified"][i % 3],
      uploaded: `${(i % 28) + 1} Jun 2026`,
      linked: i % 3 === 0,
    });
  }
  return rows;
}
export const LIBRARY: LibraryDoc[] = generateLibrary(214);

export const TASKS: TaskItem[] = [
  {
    id: "tk1",
    label: "Sign engagement letter",
    done: false,
    urgent: true,
    owner: "Sarah Chen",
    returnId: "r1",
  },
  {
    id: "tk2",
    label: "Upload 2025 W-2",
    done: true,
    owner: "Sarah Chen",
    returnId: "r1",
  },
  {
    id: "tk3",
    label: "Upload mortgage interest statement (1098)",
    done: true,
    owner: "Sarah Chen",
    returnId: "r1",
  },
  {
    id: "tk4",
    label: "Answer 6 quick questions about your year",
    done: false,
    owner: "Sarah Chen",
    returnId: "r1",
  },
  {
    id: "tk5",
    label: "Review draft return",
    done: false,
    locked: true,
    owner: "Sarah Chen",
    returnId: "r1",
  },
  {
    id: "tk6",
    label: "Confirm K-1 ordinary income figure",
    done: false,
    urgent: true,
    owner: "You",
    returnId: "r3",
  },
  {
    id: "tk7",
    label: "Request missing basis worksheet page",
    done: false,
    owner: "Priya",
    returnId: "r3",
  },
  {
    id: "tk8",
    label: "Final review before e-file",
    done: false,
    urgent: true,
    owner: "You",
    returnId: "r2",
  },
  {
    id: "tk9",
    label: "Send document request to Dana",
    done: true,
    owner: "You",
    returnId: "r4",
  },
  {
    id: "tk10",
    label: "Confirm home office method with Marcus",
    done: false,
    owner: "You",
    returnId: "r5",
  },
];

export const STAGES_DETAILED = [
  "Documents received",
  "Extraction & review",
  "Preparer review",
  "Client review",
  "Signed & filed",
];
export const STAGES_SIMPLE = [
  "Gathering documents",
  "Preparing your return",
  "Ready for your review",
];
export const CURRENT_STAGE_DETAILED = 2;
export const CURRENT_STAGE_SIMPLE = 1;

export const NOTIFICATIONS = [
  {
    id: "n1",
    text: "Sarah Chen replied about mortgage points",
    time: "5m ago",
  },
  {
    id: "n2",
    text: "K-1 extraction finished for Alder Consulting",
    time: "1h ago",
  },
  {
    id: "n3",
    text: "Marcus Webb's return is ready for your review",
    time: "2h ago",
  },
];
