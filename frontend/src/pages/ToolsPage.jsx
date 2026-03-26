import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { Star, ArrowRight, ArrowLeft, ExternalLink, Monitor, MessageSquare } from 'lucide-react'
import { toolsApi, evaluationsApi } from '../utils/api'
import { SearchBar, FilterChip, LoadingSpinner, EmptyState, SectionHeader, Tag } from '../components/layout/Shared'
import EvaluationForm from '../components/evaluation/EvaluationForm'

const LICENSES = ['All', 'free', 'freemium', 'commercial', 'open-source', 'open-standard']

export default function ToolsPage() {
  const [search, setSearch] = useState('')
  const [license, setLicense] = useState('All')

  const { data: tools, isLoading } = useQuery({
    queryKey: ['tools', search, license],
    queryFn: () => toolsApi.list({
      search: search || undefined,
      license_type: license === 'All' ? undefined : license,
    }).then(r => r.data),
  })

  return (
    <div>
      <SectionHeader
        title="Tools Catalog"
        description="Compare Visual Paradigm, Enterprise Architect, draw.io, PlantUML and more."
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tools..." className="flex-1" />
        <div className="flex gap-2 flex-wrap">
          {LICENSES.map(l => (
            <FilterChip key={l} label={l} active={license === l} onClick={() => setLicense(l)} />
          ))}
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : !tools?.length ? <EmptyState title="No tools found" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tools.map(t => (
            <Link key={t.id} to={`/tools/${t.slug}`} className="card group flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className={`badge capitalize border ${
                  t.license_type === 'open-source' ? 'bg-emerald-900/50 text-emerald-300 border-emerald-800' :
                  t.license_type === 'free' ? 'bg-blue-900/50 text-blue-300 border-blue-800' :
                  t.license_type === 'commercial' ? 'bg-orange-900/50 text-orange-300 border-orange-800' :
                  'bg-navy-700 text-slate-300 border-navy-600'
                }`}>{t.license_type}</span>
                {t.avg_overall && (
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star size={12} className="fill-amber-400" /> {t.avg_overall}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-accent-400 transition-colors">{t.name}</h3>
                {t.vendor && <div className="text-slate-500 text-xs">{t.vendor}</div>}
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{t.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-auto">
                {t.platforms?.slice(0, 3).map(p => (
                  <span key={p} className="badge bg-navy-700 text-slate-400 text-xs flex items-center gap-1">
                    <Monitor size={9} />{p}
                  </span>
                ))}
              </div>
              <div className="text-xs text-slate-500">{t.cost_info}</div>
              <div className="flex items-center gap-1 text-xs text-accent-400 group-hover:text-accent-300">
                View details <ArrowRight size={11} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function ToolDetail() {
  const { slug } = useParams()
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: tool, isLoading } = useQuery({
    queryKey: ['tool', slug],
    queryFn: () => toolsApi.get(slug).then(r => r.data),
  })
  const { data: reviews } = useQuery({
    queryKey: ['tool-reviews', tool?.id],
    enabled: !!tool?.id,
    queryFn: () => evaluationsApi.list({ tool_id: tool.id }).then(r => r.data),
  })

  if (isLoading) return <LoadingSpinner />
  if (!tool) return <div className="text-slate-400">Tool not found.</div>

  return (
    <div className="max-w-4xl space-y-6">
      <Link to="/tools" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm">
        <ArrowLeft size={14} /> Back to Tools
      </Link>

      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-navy-700 text-slate-300 capitalize">{tool.license_type}</span>
              <span className="badge bg-navy-700 text-slate-300">{tool.category}</span>
            </div>
            <h1 className="font-display text-2xl text-white">{tool.name}</h1>
            {tool.vendor && <div className="text-slate-500 text-sm">{tool.vendor}</div>}
            <p className="text-slate-400 mt-2 leading-relaxed">{tool.description}</p>
            {tool.website_url && (
              <a href={tool.website_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent-400 hover:text-accent-300 text-sm mt-2">
                Visit website <ExternalLink size={12} />
              </a>
            )}
          </div>
          {tool.avg_overall && (
            <div className="text-center shrink-0">
              <div className="text-3xl font-display text-amber-400">{tool.avg_overall}</div>
              <div className="text-xs text-slate-500">{tool.review_count} reviews</div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {tool.tags?.map(t => <Tag key={t}>{t}</Tag>)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-2">Platforms</h3>
          <div className="flex flex-wrap gap-1">{tool.platforms?.map(p => <Tag key={p}>{p}</Tag>)}</div>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-2">Supported Methods</h3>
          <div className="flex flex-wrap gap-1">{tool.supported_methods?.map(m => <Tag key={m}>{m}</Tag>)}</div>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-white mb-2">Notations</h3>
          <div className="flex flex-wrap gap-1">{tool.supported_notations?.map(n => <Tag key={n}>{n}</Tag>)}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-semibold text-white mb-1">Cost / Licensing</h3>
        <p className="text-slate-400 text-sm">{tool.cost_info}</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg text-white">Evaluations</h2>
          <button className="btn-primary text-sm" onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Cancel' : '+ Add Review'}
          </button>
        </div>
        {showForm && (
          <div className="card mb-4">
            <EvaluationForm
              targetId={tool.id}
              targetType="tool"
              onSuccess={() => { setShowForm(false); qc.invalidateQueries(['tool-reviews', tool.id]) }}
            />
          </div>
        )}
        {reviews?.length ? (
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="card">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{r.reviewer_name || 'Anonymous'}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-sm"><Star size={12} className="fill-amber-400" /> {r.overall}</div>
                </div>
                {r.comment && <p className="text-slate-400 text-sm">{r.comment}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center text-slate-500 text-sm py-8">
            <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
            No evaluations yet. Be the first to review!
          </div>
        )}
      </div>
    </div>
  )
}
