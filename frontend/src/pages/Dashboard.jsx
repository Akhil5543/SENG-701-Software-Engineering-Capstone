import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { BookOpen, Building2, Wrench, Star, ArrowRight, GitCompare } from 'lucide-react'
import { statsApi, methodsApi, architecturesApi, toolsApi } from '../utils/api'
import { LoadingSpinner, StarRating } from '../components/layout/Shared'

function StatCard({ icon: Icon, label, value, to, color }) {
  return (
    <Link to={to} className="card flex items-center gap-4 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <div className="text-2xl font-display text-white">{value ?? '—'}</div>
        <div className="text-slate-400 text-sm">{label}</div>
      </div>
      <ArrowRight size={16} className="ml-auto text-slate-600 group-hover:text-accent-400 transition-colors" />
    </Link>
  )
}

function RecentCard({ item, type }) {
  const to = `/${type}/${item.slug}`
  return (
    <Link to={to} className="card flex flex-col gap-2 group hover:scale-[1.01] transition-transform">
      <div className="flex items-start justify-between">
        <span className="badge bg-navy-700 text-slate-400 text-xs">{item.category || item.style || item.license_type}</span>
        {item.avg_overall && (
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <Star size={11} className="fill-amber-400" />
            {item.avg_overall}
          </div>
        )}
      </div>
      <div className="font-medium text-white text-sm leading-tight">{item.name}</div>
      <p className="text-slate-500 text-xs line-clamp-2">{item.description}</p>
    </Link>
  )
}

export default function Dashboard() {
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: () => statsApi.get().then(r => r.data) })
  const { data: methods } = useQuery({ queryKey: ['methods-recent'], queryFn: () => methodsApi.list({ limit: 3 }).then(r => r.data) })
  const { data: archs } = useQuery({ queryKey: ['archs-recent'], queryFn: () => architecturesApi.list({ limit: 3 }).then(r => r.data) })
  const { data: tools } = useQuery({ queryKey: ['tools-recent'], queryFn: () => toolsApi.list({ limit: 3 }).then(r => r.data) })

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 border border-navy-600 p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-600/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <h1 className="font-display text-3xl text-white mb-2">Software Design Tool</h1>
        <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
          A unified repository to survey, demonstrate, and evaluate software design and architecture methods and tools.
          Built for developers, researchers, and students.
        </p>
        <div className="flex gap-3 mt-5">
          <Link to="/methods" className="btn-primary text-sm">Browse Methods</Link>
          <Link to="/compare" className="btn-ghost text-sm flex items-center gap-1.5">
            <GitCompare size={14} /> Compare Architectures
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Design Methods" value={stats?.total_methods} to="/methods" color="bg-blue-600" />
        <StatCard icon={Building2} label="Architectures" value={stats?.total_architectures} to="/architectures" color="bg-purple-600" />
        <StatCard icon={Wrench} label="Tools" value={stats?.total_tools} to="/tools" color="bg-emerald-600" />
        <StatCard icon={Star} label="Evaluations" value={stats?.total_evaluations} to="/methods" color="bg-amber-600" />
      </div>

      {/* Recent sections */}
      {[
        { label: 'Design Methods', items: methods, type: 'methods' },
        { label: 'Architecture Styles', items: archs, type: 'architectures' },
        { label: 'Tools', items: tools, type: 'tools' },
      ].map(({ label, items, type }) => (
        <section key={type}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg text-white">{label}</h2>
            <Link to={`/${type}`} className="text-xs text-accent-400 hover:text-accent-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {!items ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {items.map(item => <RecentCard key={item.id} item={item} type={type} />)}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
