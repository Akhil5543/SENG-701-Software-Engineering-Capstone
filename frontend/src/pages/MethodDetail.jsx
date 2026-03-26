import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, BookOpen, Star, MessageSquare } from 'lucide-react'
import { methodsApi, evaluationsApi } from '../utils/api'
import { LoadingSpinner, Tag, ScoreBar } from '../components/layout/Shared'
import MermaidDiagram from '../components/demo/MermaidDiagram'
import EvaluationForm from '../components/evaluation/EvaluationForm'

export default function MethodDetail() {
  const { slug } = useParams()
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)

  const { data: method, isLoading } = useQuery({
    queryKey: ['method', slug],
    queryFn: () => methodsApi.get(slug).then(r => r.data),
  })

  const { data: reviews } = useQuery({
    queryKey: ['method-reviews', method?.id],
    enabled: !!method?.id,
    queryFn: () => evaluationsApi.list({ method_id: method.id }).then(r => r.data),
  })

  if (isLoading) return <LoadingSpinner />
  if (!method) return <div className="text-slate-400">Method not found.</div>

  return (
    <div className="max-w-4xl space-y-6">
      <Link to="/methods" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm">
        <ArrowLeft size={14} /> Back to Methods
      </Link>

      {/* Header */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-blue-900/60 text-blue-300 border border-blue-800">{method.category}</span>
              {method.academic_standard && <span className="badge bg-purple-900/50 text-purple-300">Academic</span>}
              {method.industry_standard && <span className="badge bg-emerald-900/50 text-emerald-300">Industry</span>}
            </div>
            <h1 className="font-display text-2xl text-white">{method.name}</h1>
            <p className="text-slate-400 mt-2 leading-relaxed">{method.description}</p>
          </div>
          {method.avg_overall && (
            <div className="text-center shrink-0">
              <div className="text-3xl font-display text-amber-400">{method.avg_overall}</div>
              <div className="text-xs text-slate-500">{method.review_count} reviews</div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {method.tags?.map(t => <Tag key={t}>{t}</Tag>)}
        </div>
      </div>

      {/* Diagram Demo */}
      {method.diagram_example && (
        <div>
          <h2 className="font-display text-lg text-white mb-3 flex items-center gap-2">
            <BookOpen size={16} className="text-accent-400" /> Interactive Diagram
          </h2>
          <MermaidDiagram chart={method.diagram_example} title={`${method.diagram_type} diagram`} />
        </div>
      )}

      {/* Use Cases + Case Study */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {method.use_cases && (
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-2">Use Cases</h3>
            <p className="text-slate-400 text-sm">{method.use_cases}</p>
          </div>
        )}
        {method.case_study && (
          <div className="card">
            <h3 className="text-sm font-semibold text-white mb-2">Case Study</h3>
            <p className="text-slate-400 text-sm">{method.case_study}</p>
          </div>
        )}
      </div>

      {/* Evaluations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg text-white flex items-center gap-2">
            <Star size={16} className="text-amber-400" /> Evaluations
          </h2>
          <button className="btn-primary text-sm" onClick={() => setShowForm(v => !v)}>
            {showForm ? 'Cancel' : '+ Add Review'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-4">
            <EvaluationForm
              targetId={method.id}
              targetType="design_method"
              onSuccess={() => {
                setShowForm(false)
                qc.invalidateQueries(['method', slug])
                qc.invalidateQueries(['method-reviews', method.id])
              }}
            />
          </div>
        )}

        {reviews?.length ? (
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-white text-sm font-medium">{r.reviewer_name || 'Anonymous'}</span>
                    {r.reviewer_role && <span className="text-slate-500 text-xs ml-2">· {r.reviewer_role}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    <Star size={13} className="fill-amber-400" /> {r.overall}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  {['usability', 'scalability', 'cost_value', 'interoperability', 'documentation'].map(k => (
                    <div key={k} className="text-xs">
                      <span className="text-slate-500 capitalize">{k.replace('_', ' ')}: </span>
                      <span className="text-white">{r[k]}/5</span>
                    </div>
                  ))}
                </div>
                {r.comment && <p className="text-slate-400 text-sm mt-2 border-t border-navy-600 pt-2">{r.comment}</p>}
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
