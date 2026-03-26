import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { Star, ArrowRight, ArrowLeft, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import { architecturesApi, evaluationsApi } from '../utils/api'
import { SearchBar, FilterChip, LoadingSpinner, EmptyState, SectionHeader, Tag, ScoreBar } from '../components/layout/Shared'
import MermaidDiagram from '../components/demo/MermaidDiagram'
import EvaluationForm from '../components/evaluation/EvaluationForm'

const STYLES = ['All', 'layered', 'microservices', 'event-driven', 'client-server', 'serverless']

export function ArchitecturesPage() {
  const [search, setSearch] = useState('')
  const [style, setStyle] = useState('All')

  const { data: archs, isLoading } = useQuery({
    queryKey: ['architectures', search, style],
    queryFn: () => architecturesApi.list({
      search: search || undefined,
      style: style === 'All' ? undefined : style,
    }).then(r => r.data),
  })

  return (
    <div>
      <SectionHeader
        title="Architecture Styles"
        description="Explore layered, microservices, event-driven and other architecture patterns with diagrams and scoring."
        action={<Link to="/compare" className="btn-primary text-sm">Compare →</Link>}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search architectures..." className="flex-1" />
        <div className="flex gap-2 flex-wrap">
          {STYLES.map(s => (
            <FilterChip key={s} label={s} active={style === s} onClick={() => setStyle(s)} />
          ))}
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : !archs?.length ? <EmptyState title="No architectures found" /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {archs.map(a => (
            <Link key={a.id} to={`/architectures/${a.slug}`} className="card group flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className="badge bg-purple-900/50 text-purple-300 border border-purple-800 capitalize">{a.style}</span>
                {a.avg_overall && (
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star size={12} className="fill-amber-400" /> {a.avg_overall}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-accent-400 transition-colors">{a.name}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{a.description}</p>
              </div>
              <div className="space-y-1.5 mt-auto">
                <ScoreBar label="Scalability" value={a.scalability_score} max={10} color="bg-emerald-500" />
                <ScoreBar label="Maintainability" value={a.maintainability_score} max={10} color="bg-blue-500" />
              </div>
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

export function ArchitectureDetail() {
  const { slug } = useParams()
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: arch, isLoading } = useQuery({
    queryKey: ['architecture', slug],
    queryFn: () => architecturesApi.get(slug).then(r => r.data),
  })
  const { data: reviews } = useQuery({
    queryKey: ['arch-reviews', arch?.id],
    enabled: !!arch?.id,
    queryFn: () => evaluationsApi.list({ architecture_id: arch.id }).then(r => r.data),
  })

  if (isLoading) return <LoadingSpinner />
  if (!arch) return <div className="text-slate-400">Architecture not found.</div>

  return (
    <div className="max-w-4xl space-y-6">
      <Link to="/architectures" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm">
        <ArrowLeft size={14} /> Back to Architectures
      </Link>

      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="badge bg-purple-900/50 text-purple-300 border border-purple-800 capitalize mb-2 inline-block">{arch.style}</span>
            <h1 className="font-display text-2xl text-white">{arch.name}</h1>
            <p className="text-slate-400 mt-2 leading-relaxed">{arch.description}</p>
          </div>
          {arch.avg_overall && (
            <div className="text-center shrink-0">
              <div className="text-3xl font-display text-amber-400">{arch.avg_overall}</div>
              <div className="text-xs text-slate-500">{arch.review_count} reviews</div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <ScoreBar label="Scalability" value={arch.scalability_score} max={10} color="bg-emerald-500" />
          <ScoreBar label="Maintainability" value={arch.maintainability_score} max={10} color="bg-blue-500" />
          <ScoreBar label="Complexity" value={arch.complexity_score} max={10} color="bg-red-400" />
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {arch.tags?.map(t => <Tag key={t}>{t}</Tag>)}
        </div>
      </div>

      {arch.diagram_example && <MermaidDiagram chart={arch.diagram_example} title="Architecture Diagram" />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-1"><CheckCircle size={13} />Strengths</h3>
          <ul className="space-y-1">{arch.strengths?.map((s, i) => <li key={i} className="text-slate-400 text-xs">• {s}</li>)}</ul>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-1"><XCircle size={13} />Weaknesses</h3>
          <ul className="space-y-1">{arch.weaknesses?.map((w, i) => <li key={i} className="text-slate-400 text-xs">• {w}</li>)}</ul>
        </div>
        <div className="card">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Use Cases</h3>
          <ul className="space-y-1">{arch.use_cases?.map((u, i) => <li key={i} className="text-slate-400 text-xs">• {u}</li>)}</ul>
        </div>
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
              targetId={arch.id}
              targetType="architecture"
              onSuccess={() => { setShowForm(false); qc.invalidateQueries(['arch-reviews', arch.id]) }}
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

export default ArchitecturesPage
