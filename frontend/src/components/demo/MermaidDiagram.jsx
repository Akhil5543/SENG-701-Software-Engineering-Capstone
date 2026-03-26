import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#2E4D8F',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#4472C4',
    lineColor: '#60a5fa',
    secondaryColor: '#1A2E5A',
    tertiaryColor: '#0a1228',
    background: '#060b1a',
    mainBkg: '#0a1228',
    nodeBorder: '#2E4D8F',
    clusterBkg: '#0f1d3a',
    titleColor: '#e2e8f0',
    edgeLabelBackground: '#0a1228',
    actorBkg: '#1A2E5A',
    actorBorder: '#4472C4',
    actorTextColor: '#e2e8f0',
  },
  flowchart: { curve: 'basis' },
})

let diagramCount = 0

export default function MermaidDiagram({ chart, title }) {
  const ref = useRef(null)
  const [error, setError] = useState(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (!chart || !ref.current) return
    const id = `mermaid-${++diagramCount}`

    mermaid.render(id, chart)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg
          setRendered(true)
          setError(null)
        }
      })
      .catch(err => {
        setError('Diagram rendering failed.')
        console.error(err)
      })
  }, [chart])

  if (!chart) return null

  return (
    <div className="bg-navy-900 rounded-xl border border-navy-600 overflow-hidden">
      {title && (
        <div className="px-4 py-2.5 border-b border-navy-600 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-500" />
          <span className="text-xs text-slate-400 font-mono">{title}</span>
        </div>
      )}
      <div className="p-4 mermaid-wrapper overflow-x-auto" ref={ref}>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    </div>
  )
}
