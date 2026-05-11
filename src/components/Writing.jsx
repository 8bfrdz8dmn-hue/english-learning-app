import { useState } from 'react'
import { writingPrompts, writingCriteria } from '../data/writing'

export default function Writing({ progress, setProgress, onXPGained }) {
  const [mode, setMode] = useState('list') // 'list' | 'write' | 'review'
  const [selected, setSelected] = useState(null)
  const [draft, setDraft] = useState('')
  const [selfScores, setSelfScores] = useState({})
  const [showModel, setShowModel] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const writingDrafts = progress.writing?.drafts || []

  function startWriting(prompt) {
    setSelected(prompt)
    const existing = writingDrafts.find(d => d.id === prompt.id)
    setDraft(existing?.text || '')
    setSelfScores({})
    setShowModel(false)
    setSubmitted(false)
    setMode('write')
  }

  function saveDraft() {
    setProgress(prev => {
      const drafts = (prev.writing?.drafts || []).filter(d => d.id !== selected.id)
      return {
        ...prev,
        writing: { ...prev.writing, drafts: [...drafts, { id: selected.id, text: draft, savedAt: new Date().toISOString() }] },
      }
    })
  }

  function submitForReview() {
    saveDraft()
    setSubmitted(true)
    setMode('review')
    onXPGained(30, 'Writing submitted for review!')
  }

  const wordCount = draft.trim().split(/\s+/).filter(Boolean).length

  if (mode === 'list') {
    return (
      <div className="fade-in space-y-4">
        <h1 className="text-xl font-bold text-slate-800">Writing Practice</h1>
        <p className="text-slate-500 text-sm">Practise essays and reports at B2/C1 level. Use the model answers and criteria to self-assess.</p>

        <div className="space-y-3">
          {writingPrompts.map(prompt => {
            const saved = writingDrafts.find(d => d.id === prompt.id)
            return (
              <div key={prompt.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => startWriting(prompt)}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl mt-1">✍️</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${prompt.level === 'C1' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {prompt.level}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{prompt.type}</span>
                      {saved && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Draft saved</span>}
                    </div>
                    <h3 className="font-bold text-slate-800 mb-1">{prompt.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2">{prompt.prompt.slice(0, 100)}…</p>
                    <p className="text-xs text-slate-400 mt-1">Target: {prompt.wordCount}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (mode === 'write') {
    return (
      <div className="fade-in max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode('list')} className="text-slate-400 hover:text-slate-600">← Back</button>
          <div className="flex gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selected.level === 'C1' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {selected.level}
            </span>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{selected.type}</span>
          </div>
        </div>

        {/* Prompt */}
        <div className="card bg-blue-50 border-blue-100">
          <h2 className="font-bold text-slate-800 mb-3">{selected.title}</h2>
          <p className="text-slate-700 text-sm leading-relaxed mb-4">{selected.prompt}</p>
          <p className="text-xs text-blue-600 font-semibold">Target: {selected.wordCount}</p>
        </div>

        {/* Tips */}
        <details className="card cursor-pointer">
          <summary className="font-semibold text-slate-700 text-sm">💡 Tips & Useful Phrases</summary>
          <div className="mt-3 space-y-3">
            <ul className="space-y-1">
              {selected.tips.map((tip, i) => (
                <li key={i} className="text-sm text-slate-600 flex gap-2"><span className="text-blue-500">•</span>{tip}</li>
              ))}
            </ul>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Useful Phrases</p>
              <div className="flex flex-wrap gap-2">
                {selected.usefulPhrases.map((p, i) => (
                  <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-lg italic">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </details>

        {/* Text area */}
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold text-slate-700 text-sm">Your Essay</label>
            <span className={`text-xs font-medium ${wordCount > 0 ? 'text-slate-600' : 'text-slate-400'}`}>
              {wordCount} words
            </span>
          </div>
          <textarea
            className="w-full h-72 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
            placeholder="Start writing your essay here..."
            value={draft}
            onChange={e => setDraft(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={saveDraft}>
            💾 Save Draft
          </button>
          <button
            className="btn-primary flex-1"
            onClick={submitForReview}
            disabled={wordCount < 50}
          >
            Submit for Self-Review →
          </button>
        </div>
        {wordCount < 50 && <p className="text-xs text-slate-400 text-center">Write at least 50 words to submit.</p>}
      </div>
    )
  }

  if (mode === 'review') {
    const totalScore = Object.values(selfScores).length > 0
      ? Math.round(Object.values(selfScores).reduce((a, b) => a + b, 0) / Object.values(selfScores).length)
      : null

    return (
      <div className="fade-in max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode('write')} className="text-slate-400 hover:text-slate-600">← Edit</button>
          <h2 className="font-bold text-slate-800">Self-Assessment</h2>
        </div>

        {/* Your draft */}
        <div className="card">
          <h3 className="font-bold text-slate-700 mb-3 text-sm">Your essay ({wordCount} words)</h3>
          <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap border border-slate-200">
            {draft}
          </div>
        </div>

        {/* Self-assessment criteria */}
        <div className="card">
          <h3 className="font-bold text-slate-700 mb-4">Rate your work (1 = Poor, 5 = Excellent)</h3>
          <div className="space-y-4">
            {writingCriteria.map((c, i) => (
              <div key={i}>
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{c.label}</p>
                    <p className="text-xs text-slate-500">{c.description}</p>
                  </div>
                  {selfScores[i] && (
                    <span className="text-blue-600 font-bold text-sm">{selfScores[i]}/5</span>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setSelfScores(s => ({ ...s, [i]: n }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                        selfScores[i] === n
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {totalScore !== null && (
            <div className={`mt-4 p-3 rounded-xl text-center ${
              totalScore >= 4 ? 'bg-green-50 text-green-700' :
              totalScore >= 3 ? 'bg-blue-50 text-blue-700' :
              'bg-orange-50 text-orange-700'
            }`}>
              <p className="font-bold">Overall self-score: {totalScore}/5</p>
              <p className="text-sm mt-1">
                {totalScore >= 4 ? 'Excellent! Your writing shows B2/C1 mastery.' :
                 totalScore >= 3 ? 'Good work. Focus on the weaker areas above.' :
                 'Keep practising. Read the model answer for guidance.'}
              </p>
            </div>
          )}
        </div>

        {/* Model answer */}
        {selected.modelAnswer && (
          <div className="card">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-700">Model Answer</h3>
              <button
                onClick={() => setShowModel(m => !m)}
                className="text-blue-600 text-sm font-semibold hover:text-blue-700"
              >
                {showModel ? 'Hide' : 'Show'}
              </button>
            </div>
            {showModel && (
              <div className="fade-in mt-4 bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-200">
                {selected.modelAnswer}
              </div>
            )}
          </div>
        )}

        <button className="btn-secondary w-full" onClick={() => setMode('list')}>
          ← Back to Prompts
        </button>
      </div>
    )
  }

  return null
}
