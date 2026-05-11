import { useState } from 'react'
import { readingTexts } from '../data/reading'

export default function Reading({ progress, setProgress, onXPGained }) {
  const [selectedText, setSelectedText] = useState(null)
  const [mode, setMode] = useState('list') // 'list' | 'read' | 'quiz' | 'result'
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)

  const readingDone = progress.reading?.completed || []

  function startReading(text) {
    setSelectedText(text)
    setAnswers({})
    setScore(null)
    setMode('read')
  }

  function startQuiz() {
    setMode('quiz')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function submitQuiz() {
    const text = selectedText
    let correct = 0
    text.questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++
    })
    const pct = Math.round((correct / text.questions.length) * 100)
    setScore({ correct, total: text.questions.length, pct })

    setProgress(prev => {
      const completed = prev.reading?.completed || []
      if (!completed.includes(text.id)) {
        return { ...prev, reading: { ...prev.reading, completed: [...completed, text.id] } }
      }
      return prev
    })

    onXPGained(pct >= 80 ? 40 : pct >= 60 ? 25 : 15, `Reading: ${text.title}`)
    setMode('result')
  }

  if (mode === 'list') {
    return (
      <div className="fade-in space-y-4">
        <h1 className="text-xl font-bold text-slate-800">Reading Comprehension</h1>
        <p className="text-slate-500 text-sm">Read authentic B2/C1 level texts and test your understanding.</p>

        <div className="space-y-3">
          {readingTexts.map(text => (
            <div key={text.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => startReading(text)}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${text.level === 'C1' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {text.level}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{text.topic}</span>
                    {readingDone.includes(text.id) && (
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">✓ Done</span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{text.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>⏱ {text.readingTime}</span>
                    <span>❓ {text.questions.length} questions</span>
                  </div>
                </div>
                <div className="text-2xl">📖</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (mode === 'read') {
    return (
      <div className="fade-in max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode('list')} className="text-slate-400 hover:text-slate-600 transition-colors">
            ← Back
          </button>
          <div className="flex gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedText.level === 'C1' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {selectedText.level}
            </span>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{selectedText.topic}</span>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{selectedText.title}</h2>
          <div className="prose prose-slate max-w-none">
            {selectedText.text.split('\n\n').map((para, i) => (
              <p key={i} className="text-slate-700 leading-relaxed mb-4 text-[15px]">{para}</p>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button className="btn-primary text-base px-8" onClick={startQuiz}>
            Comprehension Questions →
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'quiz') {
    return (
      <div className="fade-in max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800">{selectedText.title}</h2>
          <button onClick={() => setMode('read')} className="text-slate-400 hover:text-slate-600 text-sm">
            Re-read ↩
          </button>
        </div>

        <div className="space-y-4">
          {selectedText.questions.map((q, qi) => (
            <div key={qi} className="card">
              <p className="font-semibold text-slate-800 mb-3">
                {qi + 1}. {q.q}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                    className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      answers[qi] === oi
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pb-4">
          <button
            className="btn-primary px-8"
            onClick={submitQuiz}
            disabled={Object.keys(answers).length < selectedText.questions.length}
          >
            Submit Answers
          </button>
          {Object.keys(answers).length < selectedText.questions.length && (
            <p className="text-xs text-slate-400 mt-2">
              Answer all {selectedText.questions.length} questions to submit.
            </p>
          )}
        </div>
      </div>
    )
  }

  if (mode === 'result') {
    return (
      <div className="fade-in max-w-xl mx-auto space-y-4">
        <div className={`card text-center py-8 ${score.pct >= 80 ? 'border-green-200' : score.pct >= 60 ? 'border-blue-200' : 'border-orange-200'}`}>
          <div className="text-5xl mb-3">{score.pct >= 80 ? '🏆' : score.pct >= 60 ? '👍' : '📚'}</div>
          <h2 className="text-2xl font-bold mb-2">{score.pct >= 80 ? 'Excellent!' : score.pct >= 60 ? 'Well done!' : 'Keep practising!'}</h2>
          <p className="text-slate-600 mb-1">
            Score: <strong className={score.pct >= 80 ? 'text-green-600' : 'text-blue-600'}>{score.correct}/{score.total}</strong>
          </p>
          <p className="text-slate-400 text-sm mb-6">{score.pct}% correct</p>

          <div className="flex gap-2 justify-center">
            <button className="btn-secondary" onClick={() => setMode('quiz')}>Review Answers</button>
            <button className="btn-primary" onClick={() => setMode('list')}>← All Texts</button>
          </div>
        </div>

        {/* Answer review */}
        <div className="space-y-3">
          {selectedText.questions.map((q, qi) => {
            const userAns = answers[qi]
            const correct = userAns === q.answer
            return (
              <div key={qi} className={`card py-4 border-l-4 ${correct ? 'border-l-green-400' : 'border-l-red-400'}`}>
                <p className="font-semibold text-slate-800 mb-2 text-sm">{qi + 1}. {q.q}</p>
                <p className={`text-sm ${correct ? 'text-green-700' : 'text-red-600'}`}>
                  {correct ? '✅' : '❌'} Your answer: <em>{q.options[userAns]}</em>
                </p>
                {!correct && (
                  <p className="text-green-700 text-sm mt-1">✓ Correct: <em>{q.options[q.answer]}</em></p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}
