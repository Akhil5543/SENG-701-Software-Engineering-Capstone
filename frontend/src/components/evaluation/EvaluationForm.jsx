import { useState } from 'react'
import { Star } from 'lucide-react'
import { evaluationsApi } from '../../utils/api'
import clsx from 'clsx'

const CRITERIA = [
  { key: 'usability', label: 'Usability' },
  { key: 'scalability', label: 'Scalability' },
  { key: 'cost_value', label: 'Cost / Value' },
  { key: 'interoperability', label: 'Interoperability' },
  { key: 'documentation', label: 'Documentation' },
  { key: 'overall', label: 'Overall' },
]

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={20}
            className={clsx(
              'transition-colors',
              n <= (hover || value) ? 'text-amber-400 fill-amber-400' : 'text-navy-600'
            )}
          />
        </button>
      ))}
    </div>
  )
}

export default function EvaluationForm({ targetId, targetType, onSuccess }) {
  const [form, setForm] = useState({
    reviewer_name: '',
    reviewer_role: '',
    usability: 0,
    scalability: 0,
    cost_value: 0,
    interoperability: 0,
    documentation: 0,
    overall: 0,
    comment: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const zeros = CRITERIA.filter(c => form[c.key] === 0)
    if (zeros.length) {
      setError(`Please rate: ${zeros.map(c => c.label).join(', ')}`)
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        ...form,
        [`${targetType}_id`]: targetId,
      }
      await evaluationsApi.create(payload)
      setForm({ reviewer_name: '', reviewer_role: '', usability: 0, scalability: 0, cost_value: 0, interoperability: 0, documentation: 0, overall: 0, comment: '' })
      onSuccess?.()
    } catch (err) {
      setError('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Your Name</label>
          <input
            className="input w-full"
            placeholder="Anonymous"
            value={form.reviewer_name}
            onChange={e => setForm(f => ({ ...f, reviewer_name: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Your Role</label>
          <select
            className="input w-full"
            value={form.reviewer_role}
            onChange={e => setForm(f => ({ ...f, reviewer_role: e.target.value }))}
          >
            <option value="">Select role...</option>
            <option value="student">Student</option>
            <option value="developer">Developer</option>
            <option value="researcher">Researcher</option>
            <option value="architect">Architect</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {CRITERIA.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-slate-300 w-36">{label}</span>
            <StarPicker value={form[key]} onChange={v => setForm(f => ({ ...f, [key]: v }))} />
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs text-slate-400 mb-1 block">Comment (optional)</label>
        <textarea
          className="input w-full h-24 resize-none"
          placeholder="Share your experience..."
          value={form.comment}
          onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Evaluation'}
      </button>
    </form>
  )
}
