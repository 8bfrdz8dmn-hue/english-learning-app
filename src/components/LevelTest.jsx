import { useState } from 'react'
import { levelTestQuestions, scoreLevelTest } from '../data/levelTest'

const SECTIONS = ['Grammar', 'Vocabulary', 'Reading']

export default function LevelTest({ progress, setProgress, onXPGained }) {
  const [started, setStarted] = useState(false)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [showReview, setShowReview] = useState(false)

  const lastTest = (progress.tests || []).slice(-1)[0]

  function startTest() {
    setAnswers({})
    setResult(null)
    setCurrentQ(0)
    setShowReview(false)
    setStarted(true)
  }

  function handleAnswer(qi, option) {
    setAnswers(a => ({ ...a, [qi]: option }))
    if (qi + 1 < levelTestQuestions.length) {
      setTimeout(() => setCurrentQ(qi + 1), 400)
    }
  }

  function submitTest() {
    const score = scoreLevelTest(answers)
    setResult(score)
    setStarted(false)

    setProgress(prev => ({
      ...prev,
      tests: [...(prev.tests || []), { ...score, date: new Date().toISOString() }],
    }))
    onXPGained(50, 'Level Test completed!')
  }

  const allAnswered = Object.keys(answers).length === levelTestQuestions.length

  // Landing page
  if (!started && !result) {
    return (
      <div className="fade-in max-w-xl mx-auto space-y-6">
        <div className="card text-center py-8">
          <div className="text-5xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold mb-2">English Level Test</h1>
          <p className="text-slate-500 text-sm mb-2">
            {levelTestQuestions.length} questions covering Grammar, Vocabulary, and Reading.
          </p>
          <p className="text-slate-400 text-xs mb-6">Takes approximately 10–15 minutes.</p>

          {lastTest && (
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm">
              <p className="text-slate-500 mb-1">Your last result:</p>
              <p className="text-2xl font-bold text-blue-600">{lastTest.estimatedLevel}</p>
              <p className="text-slate-400 text-xs mt-1">{new Date(lastTest.date).toLocaleDateString('fr-FR')}</p>
            </div>
          )}

          <button className="btn-primary text-base px-8" onClick={startTest}>
            Start Test
          </button>
        </div>

        {/* Sections info */}
        <div className="card">
          <h2 className="font-bold text-slate-700 mb-4">What's covered?</h2>
          <div className="space-y-3">
            {SECTIONS.map(section => {
              const count = levelTestQuestions.filter(q => q.section === section).length
              const icon = section === 'Grammar' ? '✏️' : section === 'Vocabulary' ? '📚' : '📖'
              return (
                <div key={section} className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm text-slate-700">{section}</span>
                      <span className="text-sm text-slate-400">{count} questions</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-slate-100 rounded-full">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(count / levelTestQuestions.length) * 100}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-amber-700 text-sm">
            <strong>💡 Note:</strong> This test gives an indicative level estimate. For an official certificate, take the IELTS, Cambridge B2 First, or C1 Advanced exam.
          </p>
        </div>
      </div>
    )
  }

  // Active test (one question at a time)
  if (started) {
    const q = levelTestQuestions[currentQ]
    const progress_pct = Math.round((currentQ / levelTestQuestions.length) * 100)

    return (
      <div className="fade-in max-w-2xl mx-auto space-y-4">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm text-slate-500 mb-1">
            <span>Question {currentQ + 1} / {levelTestQuestions.length}</span>
            <span className="font-medium text-blue-600">{q.section} · {q.difficulty}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress_pct}%` }}
            />
          </div>
        </div>

        <div className="card">
          {/* Reading passage */}
          {q.passage && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm text-slate-700 leading-relaxed border border-slate-200">
              {q.passage}
            </div>
          )}

          <p className="font-semibold text-slate-800 mb-4 text-base">{q.question}</p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const chosen = answers[currentQ] === i
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(currentQ, i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all active:scale-[0.98] ${
                    chosen
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2">
          {currentQ > 0 && (
            <button className="btn-secondary" onClick={() => setCurrentQ(q => q - 1)}>← Previous</button>
          )}
          <div className="flex-1" />
          {currentQ < levelTestQuestions.length - 1 ? (
            <button
              className="btn-primary"
              disabled={answers[currentQ] === undefined}
              onClick={() => setCurrentQ(q => q + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn-primary bg-green-600 hover:bg-green-700"
              disabled={!allAnswered}
              onClick={submitTest}
            >
              Submit Test ✓
            </button>
          )}
        </div>

        {!allAnswered && currentQ === levelTestQuestions.length - 1 && (
          <p className="text-xs text-slate-400 text-center">
            Answer all questions before submitting.
          </p>
        )}
      </div>
    )
  }

  // Results
  if (result) {
    const LEVEL_COLORS = {
      'A2-B1': 'text-slate-600 bg-slate-100',
      'B1': 'text-green-700 bg-green-100',
      'B1-B2': 'text-teal-700 bg-teal-100',
      'B2': 'text-blue-700 bg-blue-100',
      'B2-C1': 'text-indigo-700 bg-indigo-100',
    }
    const levelColor = LEVEL_COLORS[result.estimatedLevel] || 'text-blue-700 bg-blue-100'

    return (
      <div className="fade-in max-w-xl mx-auto space-y-4">
        <div className="card text-center py-8">
          <p className="text-slate-500 text-sm mb-2">Your estimated level</p>
          <div className={`inline-block text-4xl font-extrabold px-6 py-3 rounded-2xl mb-4 ${levelColor}`}>
            {result.estimatedLevel}
          </div>
          <p className="text-slate-600 mb-1">
            Score: <strong>{result.correct}/{result.total}</strong> ({result.pct}%)
          </p>
          <p className="text-slate-400 text-sm mb-6">
            {result.estimatedLevel.includes('C1') ? 'You\'re very close to your goal! Keep refining nuances.' :
             result.estimatedLevel === 'B2' ? 'Solid B2! Push further to reach C1.' :
             result.estimatedLevel.includes('B2') ? 'Good B1-B2 level. Focus on complex grammar and C1 vocabulary.' :
             'Good foundation. Focus on B2 grammar and vocabulary to progress.'}
          </p>
          <button className="btn-primary" onClick={startTest}>Retake Test</button>
        </div>

        {/* Section breakdown */}
        <div className="card">
          <h3 className="font-bold text-slate-700 mb-4">Breakdown by section</h3>
          <div className="space-y-3">
            {Object.entries(result.breakdown).map(([level, data]) => {
              const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
              return (
                <div key={level}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{level} questions</span>
                    <span className="text-slate-500">{data.correct}/{data.total} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-blue-500' : 'bg-orange-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Review answers */}
        <button
          onClick={() => setShowReview(v => !v)}
          className="btn-secondary w-full"
        >
          {showReview ? 'Hide' : 'Review'} All Answers
        </button>

        {showReview && (
          <div className="fade-in space-y-3">
            {levelTestQuestions.map((q, i) => {
              const userAns = answers[i]
              const correct = userAns === q.answer
              return (
                <div key={i} className={`card py-4 border-l-4 ${correct ? 'border-l-green-400' : 'border-l-red-400'}`}>
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{q.section}</span>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">{q.difficulty}</span>
                  </div>
                  {q.passage && (
                    <p className="text-xs text-slate-500 italic mb-2 line-clamp-2">{q.passage}</p>
                  )}
                  <p className="text-sm font-semibold text-slate-800 mb-2">{q.question}</p>
                  <p className={`text-sm ${correct ? 'text-green-600' : 'text-red-600'}`}>
                    {correct ? '✅' : '❌'} You: <em>{q.options[userAns]}</em>
                  </p>
                  {!correct && (
                    <p className="text-green-600 text-sm">✓ Answer: <em>{q.options[q.answer]}</em></p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return null
}
