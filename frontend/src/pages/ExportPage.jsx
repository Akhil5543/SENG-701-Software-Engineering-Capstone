// ExportPage.jsx — replace frontend/src/pages/ExportPage.jsx
// Adds PDF export for all 4 catalog sections + a full platform report

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMethods, fetchArchitectures, fetchTools, fetchEvaluations } from "../utils/api";
import {
  exportMethodsPDF,
  exportArchitecturesPDF,
  exportToolsPDF,
  exportEvaluationsPDF,
  exportFullReportPDF,
} from "../utils/pdfExport";

const API = import.meta.env.VITE_API_URL || "https://swdesign-backend.onrender.com";

// ── Download helpers (existing JSON/CSV logic) ───────────────────────────────
async function downloadJSON(endpoint, filename) {
  const res = await fetch(`${API}${endpoint}`);
  const data = await res.json();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadCSV(endpoint, filename) {
  const res = await fetch(`${API}${endpoint}`);
  const items = await res.json();
  if (!items.length) return;
  const headers = Object.keys(items[0]);
  const rows = items.map((item) =>
    headers.map((h) => {
      const v = item[h];
      const str = Array.isArray(v) ? v.join("|") : String(v ?? "");
      return `"${str.replace(/"/g, '""')}"`;
    }).join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Single download button ───────────────────────────────────────────────────
function DownloadButton({ label, icon, onClick, loading, variant = "default" }) {
  const base =
    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed w-full";
  const styles = {
    default: "bg-slate-700 hover:bg-slate-600 text-slate-200",
    pdf: "bg-slate-700 hover:bg-slate-600 text-slate-200",
    full: "bg-blue-600 hover:bg-blue-500 text-white",
  };
  return (
    <button className={`${base} ${styles[variant]}`} onClick={onClick} disabled={loading}>
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        <span>{icon}</span>
      )}
      {label}
    </button>
  );
}

// ── Section card ─────────────────────────────────────────────────────────────
function ExportCard({ title, icon, color, description, jsonEndpoint, csvEndpoint, onPDF, pdfLoading }) {
  const [jsonLoading, setJsonLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-4 border-b border-slate-700 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: color + "22", border: `1px solid ${color}44` }}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{description}</p>
        </div>
      </div>

      {/* Download buttons */}
      <div className="px-5 py-4 space-y-2">
        {/* JSON */}
        <DownloadButton
          label={`${title} — JSON`}
          icon="📄"
          loading={jsonLoading}
          onClick={async () => {
            setJsonLoading(true);
            try { await downloadJSON(jsonEndpoint, `${title.toLowerCase().replace(/\s/g, "_")}.json`); }
            finally { setJsonLoading(false); }
          }}
        />
        {/* CSV */}
        <DownloadButton
          label={`${title} — CSV`}
          icon="📊"
          loading={csvLoading}
          onClick={async () => {
            setCsvLoading(true);
            try { await downloadCSV(csvEndpoint, `${title.toLowerCase().replace(/\s/g, "_")}.csv`); }
            finally { setCsvLoading(false); }
          }}
        />
        {/* PDF */}
        <DownloadButton
          label={`${title} — PDF Report`}
          icon="📋"
          variant="pdf"
          loading={pdfLoading}
          onClick={onPDF}
        />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ExportPage() {
  const [pdfLoading, setPdfLoading] = useState({});
  const [fullLoading, setFullLoading] = useState(false);

  const { data: methods = [] } = useQuery({ queryKey: ["methods"], queryFn: () => fetchMethods() });
  const { data: architectures = [] } = useQuery({ queryKey: ["architectures"], queryFn: () => fetchArchitectures() });
  const { data: tools = [] } = useQuery({ queryKey: ["tools"], queryFn: () => fetchTools() });
  const { data: evaluations = [] } = useQuery({ queryKey: ["evaluations"], queryFn: () => fetchEvaluations() });

  const handlePDF = (key, fn) => async () => {
    setPdfLoading((p) => ({ ...p, [key]: true }));
    try { await fn(); }
    finally { setPdfLoading((p) => ({ ...p, [key]: false })); }
  };

  const handleFullReport = async () => {
    setFullLoading(true);
    try {
      await exportFullReportPDF({ methods, architectures, tools, evaluations });
    } finally {
      setFullLoading(false);
    }
  };

  const sections = [
    {
      key: "methods",
      title: "Design Methods",
      icon: "📐",
      color: "#3b82f6",
      description: `${methods.length} entries — UML, ERD, DFD, Design Patterns`,
      jsonEndpoint: "/api/v1/methods/",
      csvEndpoint: "/api/v1/methods/",
      onPDF: handlePDF("methods", () => exportMethodsPDF(methods)),
    },
    {
      key: "architectures",
      title: "Architecture Styles",
      icon: "🏗️",
      color: "#f59e0b",
      description: `${architectures.length} entries — Layered, Microservices, Event-Driven`,
      jsonEndpoint: "/api/v1/architectures/",
      csvEndpoint: "/api/v1/architectures/",
      onPDF: handlePDF("architectures", () => exportArchitecturesPDF(architectures)),
    },
    {
      key: "tools",
      title: "Tools Catalog",
      icon: "🔧",
      color: "#10b981",
      description: `${tools.length} entries — Visual Paradigm, Mermaid.js, draw.io`,
      jsonEndpoint: "/api/v1/tools/",
      csvEndpoint: "/api/v1/tools/",
      onPDF: handlePDF("tools", () => exportToolsPDF(tools)),
    },
    {
      key: "evaluations",
      title: "Evaluations",
      icon: "⭐",
      color: "#f97316",
      description: `${evaluations.length} community evaluation records`,
      jsonEndpoint: "/api/v1/evaluations/",
      csvEndpoint: "/api/v1/evaluations/",
      onPDF: handlePDF("evaluations", () => exportEvaluationsPDF(evaluations)),
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Export Data</h1>
        <p className="text-slate-400 text-sm">
          Download the full catalog and evaluation data in JSON, CSV, or PDF format for offline
          analysis, research, or integration with other tools.
        </p>
      </div>

      {/* Full report banner */}
      <div className="mb-6 bg-gradient-to-r from-blue-900/40 to-slate-800/40 border border-blue-700/50 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">📑</span>
            <h2 className="text-white font-semibold">Full Platform Report — PDF</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Complete
            </span>
          </div>
          <p className="text-slate-400 text-sm">
            One PDF with all sections — cover page, design methods, architectures, tools, and
            evaluations with summary tables.
          </p>
        </div>
        <button
          onClick={handleFullReport}
          disabled={fullLoading}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-colors"
        >
          {fullLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : "📥"}
          Download Full Report
        </button>
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {sections.map((s) => (
          <ExportCard
            key={s.key}
            {...s}
            pdfLoading={pdfLoading[s.key]}
          />
        ))}
      </div>

      {/* Format descriptions */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
        <h3 className="text-white font-semibold text-sm mb-3">About Export Formats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span>📄</span>
              <span className="font-medium text-slate-200">JSON</span>
            </div>
            <p className="text-slate-400 text-xs">
              Full structured data including all fields and metadata. Suitable for programmatic
              processing and API integration.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span>📊</span>
              <span className="font-medium text-slate-200">CSV</span>
            </div>
            <p className="text-slate-400 text-xs">
              Flat tabular format compatible with Excel, Google Sheets, R, and Python pandas.
              Array fields are pipe-separated.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span>📋</span>
              <span className="font-medium text-slate-200">PDF</span>
            </div>
            <p className="text-slate-400 text-xs">
              Formatted report with cover page, summary tables, and metadata. Suitable for
              academic submission and stakeholder briefings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
