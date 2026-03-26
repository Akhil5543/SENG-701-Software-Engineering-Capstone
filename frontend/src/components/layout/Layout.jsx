import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Building2, Wrench, GitCompare, Menu, X } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/methods', icon: BookOpen, label: 'Design Methods' },
  { to: '/architectures', icon: Building2, label: 'Architectures' },
  { to: '/tools', icon: Wrench, label: 'Tools' },
  { to: '/compare', icon: GitCompare, label: 'Compare' },
]

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-navy-900">
      {/* Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-40 w-60 bg-navy-800 border-r border-navy-600 flex flex-col transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-navy-600">
          <div className="w-8 h-8 rounded-lg bg-accent-600 flex items-center justify-center text-white font-bold text-sm">SD</div>
          <div>
            <div className="font-display text-white text-sm leading-tight">Software Design</div>
            <div className="text-slate-500 text-xs">Tool Platform</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-accent-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-navy-700'
              )}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-navy-600">
          <div className="text-xs text-slate-500">SENG 701 Capstone</div>
          <div className="text-xs text-slate-600">UMBC · Spring 2026</div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center px-4 py-3 bg-navy-800 border-b border-navy-600">
          <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-white mr-3">
            <Menu size={20} />
          </button>
          <span className="font-display text-white text-sm">Software Design Tool</span>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
