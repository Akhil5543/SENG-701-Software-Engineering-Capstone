import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'
import { methodsApi } from '../utils/api'
import { SearchBar, FilterChip, LoadingSpinner, EmptyState, SectionHeader, Tag } from '../components/layout/Shared'

const CATEGORIES = ['All', 'UML', 'ERD', 'DFD', 'Design Pattern']

export default function MethodsPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const { data: methods, isLoading } = useQuery({
    queryKey: ['methods', search, category],
    queryFn: () => methodsApi.list({
      search: search || undefined,
      category: category === 'All' ? undefined : category,
    }).then(r => r.data),
  })

  return (
    <div>
      <SectionHeader
        title="Design Methods"
        description="Browse UML, ERD, DFD, and design patterns with interactive diagrams and case studies."
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search methods..." className="flex-1" />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c => (
            <FilterChip key={c} label={c} active={category === c} onClick={() => setCategory(c)} />
          ))}
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : !methods?.length ? (
        <EmptyState title="No methods found" description="Try a different search or category." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {methods.map(m => (
            <Link key={m.id} to={`/methods/${m.slug}`} className="card group flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className="badge bg-blue-900/60 text-blue-300 border border-blue-800">{m.category}</span>
                {m.avg_overall ? (
                  <div className="flex items-center gap-1 text-xs text-amber-400">
                    <Star size={12} className="fill-amber-400" />
                    <span>{m.avg_overall}</span>
                    <span className="text-slate-600">({m.review_count})</span>
                  </div>
                ) : null}
              </div>
              <div>
                <h3 className="font-medium text-white group-hover:text-accent-400 transition-colors">{m.name}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{m.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-auto">
                {m.tags?.slice(0, 3).map(t => <Tag key={t}>{t}</Tag>)}
              </div>
              <div className="flex items-center gap-1 text-xs text-accent-400 group-hover:text-accent-300 mt-1">
                View details <ArrowRight size={11} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
