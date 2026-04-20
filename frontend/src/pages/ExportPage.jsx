import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const EXPORTS = [
  {
    category: "Design Methods",
    icon: "📐",
    items: [
      { label: "Methods — JSON", url: "/api/v1/export/methods/json", filename: "design_methods.json", type: "json" },
      { label: "Methods — CSV", url: "/api/v1/export/methods/csv", filename: "design_methods.csv", type: "csv" },
    ],
  },
  {
    category: "Architecture Styles",
    icon: "🏗️",
    items: [
      { label: "Architectures — JSON", url: "/api/v1/export/architectures/json", filename: "architectures.json", type: "json" },
      { label: "Architectures — CSV", url: "/api/v1/export/architectures/csv", filename: "architectures.csv", type: "csv" },
    ],
  },
  {
    category: "Tools Catalog",
    icon: "🔧",
    items: [
      { label: "Tools — JSON", url: "/api/v1/export/tools/json", filename: "tools.json", type: "json" },
      { label: "Tools — CSV", url: "/api/v1/export/tools/csv", filename: "tools.csv", type: "csv" },
    ],
  },
  {
    category: "Evaluations",
    icon: "⭐",
    items: [
      { label: "Evaluations — JSON", url: "/api/v1/export/evaluations/json", filename: "evaluations.json", type: "json" },
      { label: "Evaluations — CSV", url: "/api/v1/export/evaluations/csv", filename: "evaluations.csv", type: "csv" },
    ],
  },
];

function ExportCard({ category, icon, items }) {
  const [loading, setLoading] = useState({});
  const [error, setError] = useState("");

  const download = async (item) => {
    setLoading((l) => ({ ...l, [item.url]: true }));
    setError("");
    try {
      const res = await axios.get(`${API}${item.url}`, { responseType: "blob" });
      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = item.filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      setError("Download failed. Please try again.");
    } finally {
      setLoading((l) => ({ ...l, [item.url]: false }));
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-white font-semibold">{category}</h3>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.url}
            onClick={() => download(item)}
            disabled={loading[item.url]}
            className="flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg px-4 py-3 text-sm text-gray-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{item.type === "json" ? "📄" : "📊"}</span>
              {item.label}
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              {loading[item.url] ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </>
              )}
            </span>
          </button>
        ))}
      </div>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}

export default function ExportPage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Export Data</h1>
        <p className="text-gray-400 text-sm">
          Download the full catalog and evaluation data in JSON or CSV format for offline analysis, research, or integration with other tools.
        </p>
      </div>

      {/* Export cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {EXPORTS.map((group) => (
          <ExportCard key={group.category} {...group} />
        ))}
      </div>

      {/* Info */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-300 mb-2">About the Export Formats</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
          <div>
            <p className="font-medium text-gray-300 mb-1">📄 JSON</p>
            <p>Full structured data including all fields and metadata. Suitable for programmatic processing, API integration, and research analysis.</p>
          </div>
          <div>
            <p className="font-medium text-gray-300 mb-1">📊 CSV</p>
            <p>Flat tabular format compatible with Excel, Google Sheets, R, and Python pandas. Array fields (tags, platforms) are pipe-separated.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
