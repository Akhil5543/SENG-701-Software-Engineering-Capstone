import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "https://swdesign-backend.onrender.com";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (mins > 0) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  return "Just now";
}

export default function AnnotationSection({ entityType, entityId }) {
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const endpointMap = {
    method: `method/${entityId}`,
    architecture: `architecture/${entityId}`,
    tool: `tool/${entityId}`,
  };

  const fkMap = {
    method: { design_method_id: entityId },
    architecture: { architecture_id: entityId },
    tool: { tool_id: entityId },
  };

  async function fetchAnnotations() {
    try {
      const res = await fetch(`${API_BASE}/api/v1/annotations/${endpointMap[entityType]}`);
      if (res.ok) {
        const data = await res.json();
        setAnnotations(data);
      }
    } catch (e) {
      console.error("Failed to fetch annotations", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (entityId) fetchAnnotations();
  }, [entityId]);

  async function handleSubmit() {
    if (!content.trim()) {
      setError("Please enter a comment.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/v1/annotations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: author.trim() || "Anonymous",
          content: content.trim(),
          ...fkMap[entityType],
        }),
      });
      if (res.ok) {
        const newAnnotation = await res.json();
        setAnnotations([newAnnotation, ...annotations]);
        setContent("");
        setAuthor("");
        setSuccess("Comment added!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to submit comment. Please try again.");
      }
    } catch (e) {
      setError("Unable to connect. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold text-white">💬 Community Annotations</h3>
        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
          {annotations.length} comment{annotations.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Add comment form */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Leave a Comment</h4>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-500"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts, insights, or questions about this entry..."
          rows={3}
          className="w-full bg-gray-900 border border-gray-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-500 resize-none"
        />
        {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
        {success && <p className="text-green-400 text-xs mb-2">✓ {success}</p>}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {submitting ? "Posting..." : "Post Comment"}
        </button>
      </div>

      {/* Annotations list */}
      {loading ? (
        <div className="text-gray-500 text-sm text-center py-4">Loading comments...</div>
      ) : annotations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-sm">No comments yet — be the first to annotate!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {annotations.map((a) => (
            <div key={a.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">
                    {(a.author_name || "A")[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white">
                    {a.author_name || "Anonymous"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{timeAgo(a.created_at)}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{a.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
