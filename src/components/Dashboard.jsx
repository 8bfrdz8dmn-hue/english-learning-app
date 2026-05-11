import { getLevelFromXP } from '../utils/storage'
import { vocabularyCards } from '../data/vocabulary'
import { grammarExercises } from '../data/grammar'
import { readingTexts } from '../data/reading'

const LEVEL_ROADMAP = [
  { label: 'A2', xp: 0, color: 'bg-slate-300' },
  { label: 'B1', xp: 200, color: 'bg-green-400' },
  { label: 'B2', xp: 500, color: 'bg-blue-500' },
  { label: 'C1', xp: 1000, color: 'bg-indigo-600' },
  { label: 'C2', xp: 2000, color: 'bg-purple-700' },
]

const QUICK_ACTIONS = [
  { page: 'vocabulary', label: 'Flashcards', desc: 'Practise B2/C1 vocabulary', icon: '📚', color: 'from-blue-500 to-blue-600' },
  { page: 'grammar', label: 'Grammar', desc: 'Master complex structures', icon: '✏️', color: 'from-indigo-500 to-indigo-600' },
  { page: 'reading', label: 'Reading', desc: 'B2/C1 comprehension texts', icon: '📖', color: 'from-teal-500 to-teal-600' },
  { page: 'writing', label: 'Writing', desc: 'Essay and report practice', icon: '✍️', color: 'from-rose-500 to-rose-600' },
  { page: 'test', label: 'Level Test', desc: 'Assess your current level', icon: '🎯', color: 'from-orange-500 to-orange-600' },
]

export default function Dashboard({ progress, setPage }) {
  const { xp = 0, streak = 0, vocab = {}, grammar = {}, reading = {} } = progress
  const { label, next } = getLevelFromXP(xp)
  const xpToNext = next ? next - xp : 0
  const xpPct = next ? Math.min(100, Math.round((xp / next) * 100)) : 100

  const vocabLearned = (vocab.learned || []).length
  const grammarDone = (grammar.completed || []).length
  const readingDone = (reading.completed || []).length

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="fade-in space-y-6">
      {/* Hero card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-blue-200 text-sm font-medium mb-1">{today}</p>
        <h1 className="text-2xl font-extrabold mb-1">Good day! 👋</h1>
        <p className="text-blue-100 text-sm mb-4">Your goal: reach B2 → C1 in English. Keep going!</p>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-4xl font-extrabold">{label}</div>
            <div className="text-blue-200 text-sm mt-1">
              {next ? `${xpToNext} XP to ${getLevelFromXP(next).label}` : 'Max level reached! 🎉'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{xp}</div>
            <div className="text-blue-200 text-sm">total XP</div>
          </div>
        </div>

        <div className="mt-4 bg-blue-800/40 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${xpPct}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-500">{streak}</div>
          <div className="text-slate-500 text-sm mt-1">Day streak 🔥</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">{vocabLearned}</div>
          <div className="text-slate-500 text-sm mt-1">Words learned</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-indigo-600">{grammarDone}</div>
          <div className="text-slate-500 text-sm mt-1">Grammar done</div>
        </div>
      </div>

      {/* Level roadmap */}
      <div className="card">
        <h2 className="text-base font-bold text-slate-700 mb-3">Your Level Roadmap</h2>
        <div className="relative">
          <div className="flex items-center justify-between relative">
            {/* Track line */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 z-0">
              <div
                className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600 transition-all duration-700"
                style={{ width: `${Math.min(100, (xp / 2000) * 100)}%` }}
              />
            </div>
            {LEVEL_ROADMAP.map(lvl => {
              const reached = xp >= lvl.xp
              return (
                <div key={lvl.label} className="relative z-10 flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow ${reached ? lvl.color : 'bg-slate-200 text-slate-400'}`}>
                    {reached ? '✓' : ''}
                  </div>
                  <span className={`text-xs font-semibold ${reached ? 'text-slate-700' : 'text-slate-400'}`}>{lvl.label}</span>
                  <span className="text-xs text-slate-400 hidden sm:block">{lvl.xp} XP</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">Start Practising</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.page}
              onClick={() => setPage(action.page)}
              className="text-left group hover:scale-[1.02] transition-transform duration-200"
            >
              <div className={`bg-gradient-to-r ${action.color} rounded-2xl p-4 text-white shadow-sm group-hover:shadow-md`}>
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="font-bold text-lg">{action.label}</div>
                <div className="text-white/80 text-sm">{action.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Progress summary */}
      <div className="card">
        <h2 className="text-base font-bold text-slate-700 mb-4">Progress Overview</h2>
        <div className="space-y-3">
          <ProgressBar label="Vocabulary" value={vocabLearned} max={vocabularyCards.length} color="bg-blue-500" />
          <ProgressBar label="Grammar" value={grammarDone} max={grammarExercises.length} color="bg-indigo-500" />
          <ProgressBar label="Reading" value={readingDone} max={readingTexts.length} color="bg-teal-500" />
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <h3 className="font-bold text-amber-800 mb-2">💡 Tip for B2/C1</h3>
        <p className="text-amber-700 text-sm">
          At B2/C1, focus on <strong>nuanced vocabulary</strong>, <strong>complex grammar structures</strong> (inversions, subjunctive, cleft sentences), and reading <strong>authentic texts</strong>. Aim for 20-30 minutes of practice every day.
        </p>
      </div>
    </div>
  )
}

function ProgressBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-400">{value}/{max}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
