import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const NAV = [
  { to: "/", label: "Dashboard", icon: "📊", exact: true },
  { to: "/methods", label: "Design Methods", icon: "📐" },
  { to: "/architectures", label: "Architectures", icon: "🏗️" },
  { to: "/tools", label: "Tools", icon: "🔧" },
  { to: "/compare", label: "Compare", icon: "⚖️" },
  { to: "/export", label: "Export Data", icon: "📥" },
  { to: "/admin", label: "Admin", icon: "⚙️" },
];

function NavItem({ to, label, icon, exact }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`
      }
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-56 bg-gray-800 border-r border-gray-700 p-4 fixed h-full">
        <div className="mb-6 px-1">
          <h1 className="text-white font-bold text-base leading-tight">SW Design Tool</h1>
          <p className="text-gray-500 text-xs mt-0.5">UMBC SENG 701 — Beta</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map((n) => (
            <NavItem key={n.to} {...n} />
          ))}
        </nav>
        <div className="pt-4 border-t border-gray-700">
          <a
            href="https://swdesign-backend.onrender.com/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-700"
          >
            <span>📖</span> API Docs
          </a>
          <a
            href="https://github.com/Akhil5543/SENG-701-Software-Engineering-Capstone"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-700"
          >
            <span>🐙</span> GitHub
          </a>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <h1 className="text-white font-bold text-sm">SW Design Tool</h1>
        <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-white text-xl">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden fixed top-12 left-0 right-0 z-40 bg-gray-800 border-b border-gray-700 p-4">
          <nav className="flex flex-col gap-1">
            {NAV.map((n) => (
              <NavItem key={n.to} {...n} />
            ))}
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-56 p-6 mt-0 md:mt-0 pt-16 md:pt-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
