// pdfExport.js — place in frontend/src/utils/pdfExport.js
// Uses jsPDF + jspdf-autotable (install: npm install jspdf jspdf-autotable)

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ── Palette ──────────────────────────────────────────────────────────────────
const COLORS = {
  primary: [30, 58, 138],      // deep blue
  accent:  [59, 130, 246],     // blue-500
  dark:    [15, 23, 42],       // slate-900
  mid:     [30, 41, 59],       // slate-800
  light:   [100, 116, 139],    // slate-500
  white:   [255, 255, 255],
  green:   [16, 185, 129],     // emerald-500
  muted:   [148, 163, 184],    // slate-400
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function addHeader(doc, title, subtitle) {
  const W = doc.internal.pageSize.getWidth();

  // Dark header bar
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, W, 32, "F");

  // Accent line
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 32, W, 2, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.white);
  doc.text(title, 14, 13);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text(subtitle, 14, 22);

  // Date
  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  doc.text(`Generated: ${now}`, W - 14, 22, { align: "right" });

  return 42; // y position after header
}

function addSectionTitle(doc, text, y, color = COLORS.accent) {
  const W = doc.internal.pageSize.getWidth();
  doc.setFillColor(...color);
  doc.rect(14, y, 3, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.dark);
  doc.text(text, 20, y + 5.5);
  // Light separator
  doc.setDrawColor(...COLORS.muted);
  doc.setLineWidth(0.3);
  doc.line(14, y + 9, W - 14, y + 9);
  return y + 14;
}

function addFooter(doc) {
  const pages = doc.internal.getNumberOfPages();
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFillColor(...COLORS.dark);
    doc.rect(0, H - 10, W, 10, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text("SW Design Tool — UMBC SENG 701 Capstone", 14, H - 3.5);
    doc.text(`Page ${i} of ${pages}`, W - 14, H - 3.5, { align: "right" });
  }
}

function safeStr(val) {
  if (val == null) return "—";
  if (Array.isArray(val)) return val.join(", ") || "—";
  return String(val);
}

// ── Design Methods PDF ────────────────────────────────────────────────────────
export function exportMethodsPDF(methods) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = addHeader(
    doc,
    "Software Design Tool — Design Methods Report",
    `${methods.length} design methods · UMBC SENG 701 Capstone`
  );

  y = addSectionTitle(doc, "Design Methods Catalog", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Name", "Category", "Tags", "Academic", "Avg Rating", "Reviews"]],
    body: methods.map((m) => [
      m.name,
      safeStr(m.category),
      safeStr(m.tags),
      m.academic_standard ? "Yes" : "No",
      m.avg_rating != null ? m.avg_rating.toFixed(1) : "—",
      safeStr(m.review_count),
    ]),
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: "bold" },
      1: { cellWidth: 28 },
      2: { cellWidth: 50 },
      3: { cellWidth: 18, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 18, halign: "center" },
    },
  });

  y = doc.lastAutoTable.finalY + 10;

  // Detail cards for each method
  methods.forEach((m, idx) => {
    if (y > 240) { doc.addPage(); y = 20; }

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, doc.internal.pageSize.getWidth() - 28, 38, 2, 2, "F");
    doc.setFillColor(...COLORS.accent);
    doc.roundedRect(14, y, 3, 38, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.dark);
    doc.text(`${idx + 1}. ${m.name}`, 20, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.light);
    doc.text(`Category: ${safeStr(m.category)}  ·  Tags: ${safeStr(m.tags)}`, 20, y + 12);

    if (m.description) {
      const desc = doc.splitTextToSize(m.description, doc.internal.pageSize.getWidth() - 42);
      doc.setTextColor(50, 65, 80);
      doc.text(desc.slice(0, 3), 20, y + 19);
    }

    y += 43;
  });

  addFooter(doc);
  doc.save("SW_Design_Tool_Methods_Report.pdf");
}

// ── Architectures PDF ─────────────────────────────────────────────────────────
export function exportArchitecturesPDF(architectures) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  let y = addHeader(
    doc,
    "Software Design Tool — Architecture Styles Report",
    `${architectures.length} architecture styles · UMBC SENG 701 Capstone`
  );

  y = addSectionTitle(doc, "Architecture Styles Catalog", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Name", "Style", "Scalability", "Maintainability", "Complexity", "Strengths", "Weaknesses", "Avg Rating"]],
    body: architectures.map((a) => [
      a.name,
      safeStr(a.style),
      a.scalability_score != null ? a.scalability_score.toFixed(1) : "—",
      a.maintainability_score != null ? a.maintainability_score.toFixed(1) : "—",
      a.complexity_score != null ? a.complexity_score.toFixed(1) : "—",
      Array.isArray(a.strengths) ? a.strengths.slice(0, 2).join("; ") : safeStr(a.strengths),
      Array.isArray(a.weaknesses) ? a.weaknesses.slice(0, 2).join("; ") : safeStr(a.weaknesses),
      a.avg_rating != null ? a.avg_rating.toFixed(1) : "—",
    ]),
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 7.5,
    },
    bodyStyles: { fontSize: 7.5, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: 38, fontStyle: "bold" },
      1: { cellWidth: 22 },
      2: { cellWidth: 20, halign: "center" },
      3: { cellWidth: 24, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 50 },
      6: { cellWidth: 50 },
      7: { cellWidth: 20, halign: "center" },
    },
  });

  addFooter(doc);
  doc.save("SW_Design_Tool_Architectures_Report.pdf");
}

// ── Tools PDF ─────────────────────────────────────────────────────────────────
export function exportToolsPDF(tools) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  let y = addHeader(
    doc,
    "Software Design Tool — Tools Catalog Report",
    `${tools.length} tools · UMBC SENG 701 Capstone`
  );

  y = addSectionTitle(doc, "Tools Catalog", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Name", "Vendor", "License", "Cost", "Platforms", "Supported Notations", "Avg Rating", "Reviews"]],
    body: tools.map((t) => [
      t.name,
      safeStr(t.vendor),
      safeStr(t.license_type),
      safeStr(t.cost_info),
      safeStr(t.platforms),
      safeStr(t.supported_methods),
      t.avg_rating != null ? t.avg_rating.toFixed(1) : "—",
      safeStr(t.review_count),
    ]),
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 7.5,
    },
    bodyStyles: { fontSize: 7.5, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: 35, fontStyle: "bold" },
      1: { cellWidth: 28 },
      2: { cellWidth: 20 },
      3: { cellWidth: 22 },
      4: { cellWidth: 30 },
      5: { cellWidth: 60 },
      6: { cellWidth: 18, halign: "center" },
      7: { cellWidth: 18, halign: "center" },
    },
  });

  addFooter(doc);
  doc.save("SW_Design_Tool_Tools_Report.pdf");
}

// ── Evaluations PDF ───────────────────────────────────────────────────────────
export function exportEvaluationsPDF(evaluations) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  let y = addHeader(
    doc,
    "Software Design Tool — Evaluations Report",
    `${evaluations.length} evaluation records · UMBC SENG 701 Capstone`
  );

  y = addSectionTitle(doc, "Community Evaluations", y);

  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Reviewer", "Role", "Target", "Usability", "Scalability", "Cost Value", "Interop.", "Documentation", "Overall", "Comment"]],
    body: evaluations.map((e) => [
      safeStr(e.reviewer_name),
      safeStr(e.reviewer_role),
      e.design_method_id
        ? `Method #${e.design_method_id}`
        : e.architecture_id
        ? `Arch #${e.architecture_id}`
        : `Tool #${e.tool_id}`,
      safeStr(e.usability),
      safeStr(e.scalability),
      safeStr(e.cost_value),
      safeStr(e.interoperability),
      safeStr(e.documentation),
      safeStr(e.overall),
      e.comment ? e.comment.slice(0, 60) + (e.comment.length > 60 ? "…" : "") : "—",
    ]),
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 7,
    },
    bodyStyles: { fontSize: 7, textColor: COLORS.dark },
    alternateRowStyles: { fillColor: [241, 245, 249] },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 22 },
      2: { cellWidth: 20 },
      3: { cellWidth: 17, halign: "center" },
      4: { cellWidth: 17, halign: "center" },
      5: { cellWidth: 17, halign: "center" },
      6: { cellWidth: 17, halign: "center" },
      7: { cellWidth: 22, halign: "center" },
      8: { cellWidth: 15, halign: "center" },
      9: { cellWidth: 55 },
    },
  });

  addFooter(doc);
  doc.save("SW_Design_Tool_Evaluations_Report.pdf");
}

// ── Full Platform Report PDF ──────────────────────────────────────────────────
export async function exportFullReportPDF({ methods, architectures, tools, evaluations }) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();

  // ── Cover page ──
  doc.setFillColor(...COLORS.dark);
  doc.rect(0, 0, W, doc.internal.pageSize.getHeight(), "F");

  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 80, W, 3, "F");
  doc.rect(0, 160, W, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...COLORS.white);
  doc.text("Software Design Tool", W / 2, 70, { align: "center" });

  doc.setFontSize(13);
  doc.setTextColor(...COLORS.muted);
  doc.text("Platform Report", W / 2, 90, { align: "center" });

  doc.setFontSize(9);
  doc.text("UMBC SENG 701 — Software Engineering Capstone", W / 2, 105, { align: "center" });

  // Stats box
  const stats = [
    ["Design Methods", methods.length],
    ["Architecture Styles", architectures.length],
    ["Tools", tools.length],
    ["Evaluations", evaluations.length],
  ];
  const boxW = 38, boxH = 28, gap = 6;
  const totalW = stats.length * boxW + (stats.length - 1) * gap;
  let bx = (W - totalW) / 2;
  stats.forEach(([label, count]) => {
    doc.setFillColor(...COLORS.mid);
    doc.roundedRect(bx, 125, boxW, boxH, 2, 2, "F");
    doc.setFillColor(...COLORS.accent);
    doc.roundedRect(bx, 125, boxW, 2, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...COLORS.white);
    doc.text(String(count), bx + boxW / 2, 141, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text(label, bx + boxW / 2, 149, { align: "center" });
    bx += boxW + gap;
  });

  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text(now, W / 2, 170, { align: "center" });
  doc.text("https://swdesign-frontend.onrender.com", W / 2, 178, { align: "center" });

  // ── Methods section ──
  doc.addPage();
  let y = addHeader(doc, "1. Design Methods", `${methods.length} entries`);
  y = addSectionTitle(doc, "Design Methods Catalog", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Name", "Category", "Tags", "Avg Rating"]],
    body: methods.map((m) => [
      m.name,
      safeStr(m.category),
      safeStr(m.tags),
      m.avg_rating != null ? m.avg_rating.toFixed(1) : "—",
    ]),
    headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [241, 245, 249] },
  });

  // ── Architectures section ──
  doc.addPage();
  y = addHeader(doc, "2. Architecture Styles", `${architectures.length} entries`);
  y = addSectionTitle(doc, "Architecture Styles Catalog", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Name", "Style", "Scalability", "Maintainability", "Complexity", "Avg Rating"]],
    body: architectures.map((a) => [
      a.name,
      safeStr(a.style),
      a.scalability_score != null ? a.scalability_score.toFixed(1) : "—",
      a.maintainability_score != null ? a.maintainability_score.toFixed(1) : "—",
      a.complexity_score != null ? a.complexity_score.toFixed(1) : "—",
      a.avg_rating != null ? a.avg_rating.toFixed(1) : "—",
    ]),
    headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [241, 245, 249] },
  });

  // ── Tools section ──
  doc.addPage();
  y = addHeader(doc, "3. Tools Catalog", `${tools.length} entries`);
  y = addSectionTitle(doc, "Tools Catalog", y);
  autoTable(doc, {
    startY: y,
    margin: { left: 14, right: 14 },
    head: [["Name", "Vendor", "License", "Cost", "Platforms", "Avg Rating"]],
    body: tools.map((t) => [
      t.name,
      safeStr(t.vendor),
      safeStr(t.license_type),
      safeStr(t.cost_info),
      safeStr(t.platforms),
      t.avg_rating != null ? t.avg_rating.toFixed(1) : "—",
    ]),
    headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [241, 245, 249] },
  });

  // ── Evaluations section ──
  if (evaluations.length > 0) {
    doc.addPage();
    y = addHeader(doc, "4. Evaluations", `${evaluations.length} records`);
    y = addSectionTitle(doc, "Community Evaluations", y);
    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [["Reviewer", "Role", "Overall", "Usability", "Scalability", "Comment"]],
      body: evaluations.map((e) => [
        safeStr(e.reviewer_name),
        safeStr(e.reviewer_role),
        safeStr(e.overall),
        safeStr(e.usability),
        safeStr(e.scalability),
        e.comment ? e.comment.slice(0, 80) + (e.comment.length > 80 ? "…" : "") : "—",
      ]),
      headStyles: { fillColor: COLORS.primary, textColor: COLORS.white, fontStyle: "bold", fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [241, 245, 249] },
    });
  }

  addFooter(doc);
  doc.save("SW_Design_Tool_Full_Platform_Report.pdf");
}
