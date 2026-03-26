import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GitCompare, Plus, X, BarChart2 } from 'lucide-react'
import { architecturesApi } from '../utils/api'
import { LoadingSpinner, SectionHeader, ScoreBar } from '../components/layout/Shared'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function ComparePage() {
  const [selected, setSelected] = useState([])

  const { data: allArchs, isLoading } = useQuery({
    queryKey: ['architectures-all'],
    queryFn: () => architecturesApi.list({}).then(r => r.data),
  })

  const { data: compareData, isLoading: comparing } = useQuery({
    queryKey: ['compare', selected],
    enabled: selected.length >= 2,
    queryFn: () => architecturesApi.compare(selected).then(r => r.data),
  })

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 4 ? [...prev, id] : prev
    )
  }

  // Build radar data
  const radarData = compareData ? [
    { criterion: 'Scalability', ...Object.fromEntries(compareData.map(a => [a.name, a.scalability_score])) },
    { criterion: 'Maintainability', ...Object.fromEntries(compareData.map(a => [a.name, a.maintainability_score])) },
    { criterion: 'Simplicity', ...Object.fromEntries(compareData.map(a => [a.name, 10 - a.complexity_score])) },
    { criterion: 'Community Rating', ...Object.fromEntries(compareData.map(a => [a.name, (a.avg_community_rating || 0) * 2])) },
  ] : []

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Architecture Comparison"
        description="Select 2–4 architecture styles to compare side-by-side across key criteria."
      />

      {/* Selector */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Select architectures to compare ({selected.length}/4):</h2>
        {isLoading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {allArchs?.map(a => {
              const active = selected.includes(a.id)
              return (
                <button
                  key={a.id}
                  onClick={() => toggle(a.id)}
                  className={`p-3 rounded-xl border text-left transition-all text-sm ${
                    active
                      ? 'border-accent-500 bg-accent-600/20 text-white'
                      : 'border-navy-600 bg-navy-800 text-slate-400 hover:border-navy-500 hover:text-white'
                  }`}
                >
                  <div className="font-medium leading-tight">{a.name}</div>
                  <div className="text-xs mt-0.5 opacity-60 capitalize">{a.style}</div>
                  {active && <div className="mt-1"><span className="text-accent-400 text-xs">✓ Selected</span></div>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selected.length < 2 && (
        <div className="card text-center text-slate-500 text-sm py-10">
          <GitCompare size={28} className="mx-auto mb-2 opacity-30" />
          Select at least 2 architectures above to start comparing.
        </div>
      )}

      {selected.length >= 2 && (
        <>
          {comparing ? <LoadingSpinner /> : compareData && (
            <>
              {/* Radar chart */}
              <div className="card">
                <h3 className="font-display text-lg text-white mb-4 flex items-center gap-2">
                  <BarChart2 size={16} className="text-accent-400" /> Radar Comparison
                </h3>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1A2E5A" />
                    <PolarAngleAxis dataKey="criterion" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    {compareData.map((a, i) => (
                      <Radar
                        key={a.id}
                        name={a.name}
                        dataKey={a.name}
                        stroke={COLORS[i]}
                        fill={COLORS[i]}
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: '#0a1228', border: '1px solid #2E4D8F', borderRadius: 8, fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Side-by-side detail cards */}
              <div className={`grid gap-4 ${compareData.length === 2 ? 'grid-cols-2' : compareData.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {compareData.map((a, i) => (
                  <div key={a.id} className="card space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                      <h3 className="font-medium text-white text-sm">{a.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <ScoreBar label="Scalability" value={a.scalability_score} max={10} color="bg-emerald-500" />
                      <ScoreBar label="Maintainability" value={a.maintainability_score} max={10} color="bg-blue-500" />
                      <ScoreBar label="Complexity" value={a.complexity_score} max={10} color="bg-red-400" />
                    </div>
                    {a.avg_community_rating && (
                      <div className="text-xs text-slate-400">
                        Community: <span className="text-amber-400">{a.avg_community_rating}/5</span>
                        <span className="text-slate-600"> ({a.review_count} reviews)</span>
                      </div>
                    )}
                    <div>
                      <div className="text-xs text-emerald-400 mb-1">Strengths</div>
                      {a.strengths?.slice(0, 2).map((s, j) => <div key={j} className="text-xs text-slate-500">• {s}</div>)}
                    </div>
                    <div>
                      <div className="text-xs text-red-400 mb-1">Weaknesses</div>
                      {a.weaknesses?.slice(0, 2).map((w, j) => <div key={j} className="text-xs text-slate-500">• {w}</div>)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
