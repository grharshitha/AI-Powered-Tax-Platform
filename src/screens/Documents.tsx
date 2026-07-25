import React, { useMemo, useState } from "react";
import {
  FolderOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquare,
  X as CloseIcon,
} from "lucide-react";
import { useApp } from "../lib/context";
import { C, Card, PageHeader, Button } from "../components/ui";
import { LIBRARY, DOC_TYPES, LibraryDoc } from "../lib/mockData";

function DocDrawer({
  doc,
  onClose,
}: {
  doc: LibraryDoc | null;
  onClose: () => void;
}) {
  const { navigate } = useApp();
  if (!doc) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end overlay-enter"
      style={{ backgroundColor: "rgba(11,11,15,0.35)" }}
      onClick={onClose}
    >
      <div
        className="w-[380px] h-full p-5 overflow-y-auto drawer-enter"
        style={{ backgroundColor: C.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: C.ink }}>
            Document detail
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-black/5 transition-colors duration-150"
          >
            <CloseIcon size={18} style={{ color: C.inkSoft }} />
          </button>
        </div>
        <div className="text-sm font-medium mb-1" style={{ color: C.ink }}>
          {doc.name}
        </div>
        <div className="text-xs mb-4" style={{ color: C.inkFaint }}>
          {doc.type} · Uploaded {doc.uploaded} · {doc.client}
        </div>
        <div
          className="text-xs font-medium uppercase tracking-wide mb-2"
          style={{ color: C.inkSoft }}
        >
          Connected objects
        </div>
        <div className="space-y-2">
          <button
            onClick={() => navigate("returns", "Returns")}
            className="w-full text-left px-3 py-2.5 rounded-lg border flex items-center gap-2 text-sm transition-colors duration-150 hover:bg-black/[0.02]"
            style={{ borderColor: C.border, color: C.ink }}
          >
            <FileText size={14} style={{ color: C.primary }} /> Linked return
            field
          </button>
          <button
            onClick={() => navigate("collaboration", "Collaboration")}
            className="w-full text-left px-3 py-2.5 rounded-lg border flex items-center gap-2 text-sm transition-colors duration-150 hover:bg-black/[0.02]"
            style={{ borderColor: C.border, color: C.ink }}
          >
            <MessageSquare size={14} style={{ color: C.primary }} /> 1 message
            thread references this
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Documents() {
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [drawerDoc, setDrawerDoc] = useState<LibraryDoc | null>(null);
  const perPage = 12;

  const filtered = useMemo(
    () =>
      LIBRARY.filter(
        (d) =>
          (typeFilter === "All" || d.type === typeFilter) &&
          (q === "" ||
            d.name.toLowerCase().includes(q.toLowerCase()) ||
            d.client.toLowerCase().includes(q.toLowerCase()))
      ),
    [q, typeFilter]
  );

  const pageCount = Math.ceil(filtered.length / perPage) || 1;
  const shown = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
      <PageHeader
        icon={FolderOpen}
        title="Document library"
        subtitle={`${filtered.length.toLocaleString()} documents across every client`}
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        <div
          className="flex-1 min-w-[220px] flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors duration-150 focus-within:ring-2 focus-within:ring-indigo-500"
          style={{ borderColor: C.border }}
        >
          <Search size={15} style={{ color: C.inkFaint }} />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search by document or client name…"
            className="flex-1 text-sm outline-none"
            style={{ color: C.ink }}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="text-sm px-3 py-2 rounded-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          style={{ borderColor: C.border, color: C.ink }}
        >
          <option>All</option>
          {DOC_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <Card className="overflow-hidden">
        <div
          className="grid grid-cols-12 px-4 py-2.5 text-xs font-medium uppercase tracking-wide"
          style={{ backgroundColor: C.bg, color: C.inkSoft }}
        >
          <div className="col-span-5">Document</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Uploaded</div>
        </div>
        {shown.map((d) => (
          <button
            key={d.id}
            onClick={() => setDrawerDoc(d)}
            className="w-full grid grid-cols-12 px-4 py-2.5 text-left border-t items-center transition-colors duration-150 hover:bg-black/[0.02]"
            style={{ borderColor: C.border }}
          >
            <div
              className="col-span-5 text-sm flex items-center gap-2 truncate"
              style={{ color: C.ink }}
            >
              <FileText size={14} style={{ color: C.inkFaint }} />
              <span className="truncate">{d.name}</span>
              {d.linked && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: C.primarySoft,
                    color: C.primaryText,
                  }}
                >
                  Linked
                </span>
              )}
            </div>
            <div
              className="col-span-3 text-sm truncate"
              style={{ color: C.inkSoft }}
            >
              {d.client}
            </div>
            <div className="col-span-2 text-xs" style={{ color: C.inkFaint }}>
              {d.status}
            </div>
            <div className="col-span-2 text-xs" style={{ color: C.inkFaint }}>
              {d.uploaded}
            </div>
          </button>
        ))}
      </Card>

      <div
        className="flex items-center justify-between mt-3 text-sm"
        style={{ color: C.inkSoft }}
      >
        <span>
          Page {page} of {pageCount}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            size="sm"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      <DocDrawer doc={drawerDoc} onClose={() => setDrawerDoc(null)} />
    </>
  );
}
