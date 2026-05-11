const PREFIX = 'englishup_'

export const storage = {
  get: (key, fallback = null) => {
    try {
      const val = localStorage.getItem(PREFIX + key)
      return val !== null ? JSON.parse(val) : fallback
    } catch {
      return fallback
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {}
  },
}

export function getProgress() {
  return storage.get('progress', {
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    level: 'B1',
    vocab: { learned: [], due: [], scores: {} },
    grammar: { completed: [], scores: {} },
    reading: { completed: [] },
    writing: { drafts: [] },
    tests: [],
  })
}

export function saveProgress(progress) {
  storage.set('progress', progress)
}

export function addXP(amount) {
  const p = getProgress()
  p.xp = (p.xp || 0) + amount
  const today = new Date().toDateString()
  if (p.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    p.streak = p.lastActiveDate === yesterday ? (p.streak || 0) + 1 : 1
    p.lastActiveDate = today
  }
  saveProgress(p)
  return p
}

export function getLevelFromXP(xp) {
  if (xp < 200)  return { label: 'A2', next: 200 }
  if (xp < 500)  return { label: 'B1', next: 500 }
  if (xp < 1000) return { label: 'B2', next: 1000 }
  if (xp < 2000) return { label: 'C1', next: 2000 }
  return { label: 'C2', next: null }
}
