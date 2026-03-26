import { Search, Star, ExternalLink, Loader2 } from 'lucide-react'
import clsx from 'clsx'

export function SearchBar({ value, onChange, placeholder = 'Search...', className }) {
  return (
    <div className={clsx('relative', className)}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
      <input
        className="input w-full pl-9"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'badge cursor-pointer transition-colors',
        active
          ? 'bg-accent-600 text-white'
          : 'bg-navy-700 text-slate-400 hover:bg-navy-600 hover:text-white'
      )}
    >
      {label}
    </button>
  )
}

export function StarRating({ value, max = 5, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(value) ? 'star-filled fill-amber-400' : 'star-empty'}
        />
      ))}
    </div>
  )
}

export function ScoreBar({ label, value, max = 10, color = 'bg-accent-600' }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-mono">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
        <div className={clsx('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function Tag({ children }) {
  return (
    <span className="badge bg-navy-700 text-slate-400 text-xs">{children}</span>
  )
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={32} className="text-accent-500 animate-spin" />
    </div>
  )
}

export function EmptyState({ title = 'No results', description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-slate-600 text-4xl mb-3">∅</div>
      <div className="text-white font-medium">{title}</div>
      {description && <div className="text-slate-500 text-sm mt-1">{description}</div>}
    </div>
  )
}

export function SectionHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="section-title">{title}</h1>
        {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
      </div>
      {action}
    </div>
  )
}
