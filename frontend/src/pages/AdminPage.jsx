import { useState } from "react";
import { methodsApi, architecturesApi, toolsApi } from "../utils/api";

const CATEGORIES = ["UML", "ERD", "DFD", "Design Pattern", "Other"];
const ARCH_STYLES = ["Layered", "Microservices", "Event-Driven", "Client-Server", "Serverless", "Ports and Adapters", "CQRS", "Pipe and Filter", "Space-Based", "SOA", "Other"];
const LICENSE_TYPES = ["Commercial", "Freemium", "Open-Source", "Open-Standard", "Free"];
const PLATFORMS = ["Windows", "macOS", "Linux", "Web", "iOS", "Android", "Docker", "VS Code"];

function TagInput({ label, value, onChange, placeholder }) {
  const [input, setInput] = useState("");
  const tags = value || [];

  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) {
      onChange([...tags, v]);
      setInput("");
    }
  };

  const remove = (t) => onChange(tags.filter((x) => x !== t));

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="flex gap-2 mb-2 flex-wrap">
        {tags.map((t) => (
          <span key={t} className="flex items-center gap-1 bg-blue-900 text-blue-200 px-2 py-1 rounded text-sm">
            {t}
            <button onClick={() => remove(t)} className="text-blue-400 hover:text-white ml-1">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder || "Type and press Enter"}
          className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
        <button onClick={add} className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm">Add</button>
      </div>
    </div>
  );
}

function CheckboxGroup({ label, options, value, onChange }) {
  const selected = value || [];
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter((x) => x !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              className="accent-blue-500"
            />
            <span className="text-sm text-gray-300">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", rows, required, placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, required }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─────────────── Method Form ───────────────
function MethodForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "", category: "", description: "", diagram_example: "",
    tags: [], use_cases: "", case_study: "", academic_standard: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.category || !form.description) {
      setError("Name, category, and description are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await methodsApi.create({ ...form, slug });
      onSuccess("Design method added successfully!");
      setForm({ name: "", category: "", description: "", diagram_example: "", tags: [], use_cases: "", case_study: "", academic_standard: false });
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to create entry. Check for duplicate slug.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Method Name" value={form.name} onChange={set("name")} required placeholder="e.g. Composite Pattern" />
        <SelectField label="Category" value={form.category} onChange={set("category")} options={CATEGORIES} required />
      </div>
      <Field label="Description" value={form.description} onChange={set("description")} rows={3} required placeholder="Describe the method..." />
      <Field label="Mermaid.js Diagram" value={form.diagram_example} onChange={set("diagram_example")} rows={8} placeholder="classDiagram&#10;    class Example {&#10;        +method()&#10;    }" />
      <TagInput label="Tags" value={form.tags} onChange={set("tags")} placeholder="e.g. GoF, Behavioral" />
      <Field label="Use Cases" value={form.use_cases} onChange={set("use_cases")} rows={2} placeholder="When to use this method..." />
      <Field label="Case Study" value={form.case_study} onChange={set("case_study")} rows={2} placeholder="Real-world example..." />
      <label className="flex items-center gap-2 mb-4 cursor-pointer">
        <input type="checkbox" checked={form.academic_standard} onChange={(e) => set("academic_standard")(e.target.checked)} className="accent-blue-500" />
        <span className="text-sm text-gray-300">Academic Standard</span>
      </label>
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button onClick={submit} disabled={loading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded font-medium">
        {loading ? "Adding..." : "Add Design Method"}
      </button>
    </div>
  );
}

// ─────────────── Architecture Form ───────────────
function ArchitectureForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "", style: "", description: "", diagram_example: "",
    strengths: [], weaknesses: [],
    scalability_score: 5, maintainability_score: 5, complexity_score: 5,
    use_cases: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.style || !form.description) {
      setError("Name, style, and description are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await architecturesApi.create({
        ...form,
        slug,
        scalability_score: parseFloat(form.scalability_score),
        maintainability_score: parseFloat(form.maintainability_score),
        complexity_score: parseFloat(form.complexity_score),
      });
      onSuccess("Architecture added successfully!");
      setForm({ name: "", style: "", description: "", diagram_example: "", strengths: [], weaknesses: [], scalability_score: 5, maintainability_score: 5, complexity_score: 5, use_cases: "" });
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to create entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Architecture Name" value={form.name} onChange={set("name")} required placeholder="e.g. CQRS Architecture" />
        <SelectField label="Style" value={form.style} onChange={set("style")} options={ARCH_STYLES} required />
      </div>
      <Field label="Description" value={form.description} onChange={set("description")} rows={3} required />
      <Field label="Mermaid.js Diagram" value={form.diagram_example} onChange={set("diagram_example")} rows={8} placeholder="graph TB&#10;    A[Component] --> B[Component]" />
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Scalability (0-10)</label>
          <input type="number" min="0" max="10" step="0.5" value={form.scalability_score} onChange={(e) => set("scalability_score")(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Maintainability (0-10)</label>
          <input type="number" min="0" max="10" step="0.5" value={form.maintainability_score} onChange={(e) => set("maintainability_score")(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Complexity (0-10)</label>
          <input type="number" min="0" max="10" step="0.5" value={form.complexity_score} onChange={(e) => set("complexity_score")(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm text-white" />
        </div>
      </div>
      <TagInput label="Strengths" value={form.strengths} onChange={set("strengths")} placeholder="Add a strength..." />
      <TagInput label="Weaknesses" value={form.weaknesses} onChange={set("weaknesses")} placeholder="Add a weakness..." />
      <Field label="Use Cases" value={form.use_cases} onChange={set("use_cases")} rows={2} />
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button onClick={submit} disabled={loading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded font-medium">
        {loading ? "Adding..." : "Add Architecture"}
      </button>
    </div>
  );
}

// ─────────────── Tool Form ───────────────
function ToolForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "", vendor: "", description: "", license_type: "",
    cost_info: "", platforms: [], supported_methods: [], notations: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.vendor || !form.description || !form.license_type) {
      setError("Name, vendor, description, and license type are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await toolsApi.create({ ...form, slug });
      onSuccess("Tool added successfully!");
      setForm({ name: "", vendor: "", description: "", license_type: "", cost_info: "", platforms: [], supported_methods: [], notations: [] });
    } catch (e) {
      setError(e.response?.data?.detail || "Failed to create entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Tool Name" value={form.name} onChange={set("name")} required placeholder="e.g. Structurizr" />
        <Field label="Vendor" value={form.vendor} onChange={set("vendor")} required placeholder="e.g. Structurizr Ltd" />
      </div>
      <Field label="Description" value={form.description} onChange={set("description")} rows={3} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField label="License Type" value={form.license_type} onChange={set("license_type")} options={LICENSE_TYPES} required />
        <Field label="Cost Info" value={form.cost_info} onChange={set("cost_info")} placeholder="Free | $9/mo | Enterprise" />
      </div>
      <CheckboxGroup label="Platforms" options={PLATFORMS} value={form.platforms} onChange={set("platforms")} />
      <TagInput label="Supported Methods" value={form.supported_methods} onChange={set("supported_methods")} placeholder="e.g. UML Class" />
      <TagInput label="Supported Notations" value={form.notations} onChange={set("notations")} placeholder="e.g. UML 2.5" />
      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button onClick={submit} disabled={loading} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded font-medium">
        {loading ? "Adding..." : "Add Tool"}
      </button>
    </div>
  );
}

// ─────────────── Main Admin Page ───────────────
export default function AdminPage() {
  const [tab, setTab] = useState("method");
  const [success, setSuccess] = useState("");

  const onSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  const tabs = [
    { id: "method", label: "Add Design Method" },
    { id: "architecture", label: "Add Architecture" },
    { id: "tool", label: "Add Tool" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Admin Panel</h1>
        <p className="text-gray-400 text-sm">Add new entries to the catalog repository. All fields marked <span className="text-red-400">*</span> are required.</p>
      </div>

      {/* Success banner */}
      {success && (
        <div className="bg-green-900 border border-green-600 text-green-200 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <span className="text-lg">✓</span> {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-800 p-1 rounded-lg">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              tab === t.id ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        {tab === "method" && <MethodForm onSuccess={onSuccess} />}
        {tab === "architecture" && <ArchitectureForm onSuccess={onSuccess} />}
        {tab === "tool" && <ToolForm onSuccess={onSuccess} />}
      </div>

      {/* Info box */}
      <div className="mt-4 bg-gray-800 border border-gray-700 rounded-lg p-4">
        <p className="text-xs text-gray-400">
          <span className="font-medium text-gray-300">Note:</span> Entries are added directly to the live database. Slugs are auto-generated from the name. 
          Mermaid.js diagrams are rendered live — test your syntax at <a href="https://mermaid.live" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">mermaid.live</a> before submitting.
        </p>
      </div>
    </div>
  );
}
