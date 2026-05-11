import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import Vocabulary from './components/Vocabulary'
import Grammar from './components/Grammar'
import Reading from './components/Reading'
import Writing from './components/Writing'
import LevelTest from './components/LevelTest'
import { getProgress, saveProgress } from './utils/storage'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [progress, setProgress] = useState(getProgress)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  function showNotification(msg, type = 'success') {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3000)
  }

  function onXPGained(amount, label) {
    setProgress(prev => {
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      const newStreak =
        prev.lastActiveDate === today ? prev.streak :
        prev.lastActiveDate === yesterday ? prev.streak + 1 : 1
      return {
        ...prev,
        xp: (prev.xp || 0) + amount,
        streak: newStreak,
        lastActiveDate: today,
      }
    })
    showNotification(`+${amount} XP — ${label}`, 'xp')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation page={page} setPage={setPage} progress={progress} />

      {notification && (
        <div className={`fixed top-20 right-4 z-50 fade-in px-5 py-3 rounded-xl shadow-lg font-semibold text-sm ${
          notification.type === 'xp'
            ? 'bg-yellow-400 text-yellow-900'
            : notification.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-green-500 text-white'
        }`}>
          {notification.msg}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6">
        {page === 'dashboard' && (
          <Dashboard progress={progress} setPage={setPage} />
        )}
        {page === 'vocabulary' && (
          <Vocabulary progress={progress} setProgress={setProgress} onXPGained={onXPGained} />
        )}
        {page === 'grammar' && (
          <Grammar progress={progress} setProgress={setProgress} onXPGained={onXPGained} />
        )}
        {page === 'reading' && (
          <Reading progress={progress} setProgress={setProgress} onXPGained={onXPGained} />
        )}
        {page === 'writing' && (
          <Writing progress={progress} setProgress={setProgress} onXPGained={onXPGained} />
        )}
        {page === 'test' && (
          <LevelTest progress={progress} setProgress={setProgress} onXPGained={onXPGained} />
        )}
      </main>
    </div>
  )
}
