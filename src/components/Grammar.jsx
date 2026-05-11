import { useState } from 'react'
import { grammarExercises, grammarCategories } from '../data/grammar'

export default function Grammar({ progress, setProgress, onXPGained }) {
  const [category, setCategory] = useState('All')
  const [exerciseIdx, setExerciseIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  const grammarDone = progress.grammar?.completed || []

  const exercises = grammarExercises.filter(
    e => category === 'All' || e.category === category
  )

  const exercise = exercises[exerciseIdx]
  const isAnswered = selected !== null
  const isCorrect = selected === exercise?.answer

  function handleSelect(idx) {
    if (isAnswered) return
    setSelected(idx)
    setShowExplanation(true)

    const correct = idx === exercise.answer
    const newTotal = sessionScore.total + 1
    const newCorrect = sessionScore.correct + (correct ? 1 : 0)
    setSessionScore({ correct: newCorrect, total: newTotal })

    if (correct) {
      setProgress(prev => {
        const completed = prev.grammar?.completed || []
        if (!completed.includes(exercise.id)) {
          return { ...prev, grammar: { ...prev.grammar, completed: [...completed, exercise.id] } }
        }
        return prev
      })
    }

    if (newTotal % 5 === 0) onXPGained(15, 'Grammar practice!')
  }

  function handleNext() {
    if (exerciseIdx + 1 >= exercises.length) {
      setFinished(true)
      onXPGained(25, 'Grammar session complete!')
    } else {
      setExerciseIdx(i => i + 1)
      setSelected(null)
      setShowExplanation(false)
    }
  }

  function restart() {
    setExerciseIdx(0)
    setSelected(null)
    setShowExplanation(false)
    setSessionScore({ correct: 0, total: 0 })
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((sessionScore.correct / sessionScore.total) * 100)
    return (
      <div className="fade-in max-w-xl mx-auto">
        <div className="card text-center py-10">
          <div className="text-5xl mb-4">{pct >= 70 ? '🏆' : '💪'}</div>
          <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
          <p className="text-slate-600 mb-2">
            Score: <strong className="text-blue-600">{sessionScore.correct}/{sessionScore.total}</strong> ({pct}%)
          </p>
          <p className="text-slate-500 text-sm mb-6">
            {pct >= 80 ? 'Excellent work! Your grammar is solid.' :
             pct >= 60 ? 'Good effort! Review the explanations for missed questions.' :
             'Keep practising — grammar takes time. Review the rules carefully.'}
          </p>
          <button className="btn-primary" onClick={restart}>Practice Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Grammar</h1>
        <span className="text-sm text-slate-500">{exerciseIdx + 1}/{exercises.length}</span>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <CategoryBtn label="All" active={category === 'All'} onClick={() => { setCategory('All'); restart() }} />
        {grammarCategories.map(c => (
          <CategoryBtn key={c} label={c} active={category === c} onClick={() => { setCategory(c); restart() }} />
        ))}
      </div>

      {exercise && (
        <div className="card">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">{exercise.category}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${exercise.level === 'C1' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {exercise.level}
            </span>
            {grammarDone.includes(exercise.id) && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full ml-auto">✓ Done</span>
            )}
          </div>

          <h2 className="font-bold text-slate-700 mb-1">{exercise.title}</h2>
          <p className="text-slate-500 text-sm mb-4">{exercise.instruction}</p>

          {/* Passage (for reading-based questions) */}
          {exercise.passage && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm text-slate-600 leading-relaxed border border-slate-200">
              {exercise.passage}
            </div>
          )}

          {/* Question */}
          <p className="font-semibold text-slate-800 mb-4 text-base">{exercise.question}</p>

          {/* Options */}
          <div className="space-y-2">
            {exercise.options.map((opt, i) => {
              let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              if (isAnswered) {
                if (i === exercise.answer) style = 'bg-green-50 border-green-400 text-green-800'
                else if (i === selected && !isCorrect) style = 'bg-red-50 border-red-400 text-red-700'
                else style = 'bg-slate-50 border-slate-200 text-slate-400'
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${style} ${!isAnswered ? 'active:scale-[0.98]' : ''}`}
                >
                  <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Result & Explanation */}
          {showExplanation && (
            <div className={`fade-in mt-4 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </p>
              <p className="text-slate-600 text-sm">{exercise.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {isAnswered && (
            <div className="fade-in mt-4 text-right">
              <button className="btn-primary" onClick={handleNext}>
                {exerciseIdx + 1 >= exercises.length ? 'See Results' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Session progress */}
      <div className="card flex items-center justify-between py-3">
        <span className="text-sm text-slate-500">Session score</span>
        <span className="font-bold text-slate-700">{sessionScore.correct}/{sessionScore.total}</span>
      </div>
    </div>
  )
}

function CategoryBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  )
}
