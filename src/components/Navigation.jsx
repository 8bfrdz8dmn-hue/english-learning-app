import { getLevelFromXP } from '../utils/storage'

const TABS = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'vocabulary', label: 'Vocab', icon: '📚' },
  { id: 'grammar', label: 'Grammar', icon: '✏️' },
  { id: 'reading', label: 'Reading', icon: '📖' },
  { id: 'writing', label: 'Writing', icon: '✍️' },
  { id: 'test', label: 'Level Test', icon: '🎯' },
]

export default function Navigation({ page, setPage, progress }) {
  const { xp = 0, streak = 0 } = progress
  const { label, next } = getLevelFromXP(xp)
  const xpPct = next ? Math.min(100, Math.round((xp / next) * 100)) : 100

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-blue-600 tracking-tight">EnglishUp</span>
            <span className="hidden sm:flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {label}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* XP bar */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">{xp} XP</span>
            </div>
            {/* Streak */}
            <div className="flex items-center gap-1 bg-orange-50 text-orange-600 text-sm font-bold px-3 py-1.5 rounded-full">
              🔥 {streak}
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setPage(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                page === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
