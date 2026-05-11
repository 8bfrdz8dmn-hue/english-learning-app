import { useState, useMemo } from 'react'
import { vocabularyCards, idioms } from '../data/vocabulary'
import { calculateNextReview, isDue } from '../utils/spaced-repetition'

const MODES = ['Flashcards', 'Idioms', 'Browse']

export default function Vocabulary({ progress, setProgress, onXPGained }) {
  const [mode, setMode] = useState('Flashcards')
  const [filter, setFilter] = useState('All')
  const [cardIndex, setCardIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [session, setSession] = useState({ done: 0, correct: 0 })
  const [finished, setFinished] = useState(false)

  const vocabData = progress.vocab || { learned: [], scores: {} }

  const dueCards = useMemo(() => {
    return vocabularyCards
      .filter(c => filter === 'All' || c.level === filter)
      .filter(c => {
        const score = vocabData.scores[c.id]
        return !score || isDue(score)
      })
  }, [filter, vocabData.scores])

  const currentCard = dueCards[cardIndex % Math.max(1, dueCards.length)]

  function handleRating(quality) {
    if (!currentCard) return
    const prevScore = vocabData.scores[currentCard.id] || {}
    const newScore = calculateNextReview(prevScore, quality)

    setProgress(prev => {
      const vocab = prev.vocab || { learned: [], scores: {} }
      const learned = vocab.learned.includes(currentCard.id)
        ? vocab.learned
        : [...vocab.learned, currentCard.id]
      return {
        ...prev,
        vocab: { ...vocab, learned, scores: { ...vocab.scores, [currentCard.id]: newScore } },
      }
    })

    const isCorrect = quality >= 3
    const newDone = session.done + 1
    const newCorrect = session.correct + (isCorrect ? 1 : 0)

    if (newDone % 5 === 0) {
      onXPGained(10, 'Vocab review batch')
    }

    if (cardIndex + 1 >= dueCards.length) {
      setFinished(true)
      setSession({ done: newDone, correct: newCorrect })
      onXPGained(20, 'Vocabulary session complete!')
    } else {
      setSession({ done: newDone, correct: newCorrect })
      setCardIndex(i => i + 1)
      setFlipped(false)
    }
  }

  function restart() {
    setCardIndex(0)
    setFlipped(false)
    setSession({ done: 0, correct: 0 })
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="fade-in max-w-xl mx-auto">
        <div className="card text-center py-10">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
          <p className="text-slate-600 mb-6">
            You reviewed <strong>{session.done}</strong> cards with{' '}
            <strong>{Math.round((session.correct / session.done) * 100)}%</strong> accuracy.
          </p>
          <button className="btn-primary" onClick={restart}>Review Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Vocabulary</h1>
        <div className="flex gap-1">
          {['All', 'B2', 'C1'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCardIndex(0); setFlipped(false) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        {MODES.map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setCardIndex(0); setFlipped(false) }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === m ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'Flashcards' && (
        <FlashcardMode
          cards={dueCards}
          currentCard={currentCard}
          cardIndex={cardIndex}
          flipped={flipped}
          setFlipped={setFlipped}
          session={session}
          onRating={handleRating}
        />
      )}
      {mode === 'Idioms' && <IdiomMode idioms={idioms} onXPGained={onXPGained} />}
      {mode === 'Browse' && <BrowseMode cards={vocabularyCards} filter={filter} />}
    </div>
  )
}

function FlashcardMode({ cards, currentCard, cardIndex, flipped, setFlipped, session, onRating }) {
  if (cards.length === 0) {
    return (
      <div className="card text-center py-10">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="font-bold text-lg mb-1">All caught up!</h3>
        <p className="text-slate-500 text-sm">No cards due for review right now. Come back later!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between text-sm text-slate-500 mb-3 px-1">
        <span>Card {Math.min(cardIndex + 1, cards.length)} / {cards.length}</span>
        <span className="font-medium text-green-600">✓ {session.correct} correct</span>
      </div>

      {/* Flip Card */}
      <div className="flip-card w-full h-64 cursor-pointer" onClick={() => setFlipped(f => !f)}>
        <div className={`flip-card-inner relative w-full h-full ${flipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flip-card-front absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex flex-col items-center justify-center p-6 text-white shadow-lg">
            <span className="text-xs uppercase tracking-widest text-blue-300 mb-2">{currentCard?.level}</span>
            <h2 className="text-4xl font-extrabold mb-2">{currentCard?.word}</h2>
            <p className="text-blue-200 text-sm">{currentCard?.phonetic}</p>
            <p className="text-blue-300 text-xs mt-6">Tap to reveal →</p>
          </div>
          {/* Back */}
          <div className="flip-card-back absolute inset-0 bg-white rounded-2xl p-6 shadow-lg border border-slate-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">{currentCard?.level}</span>
                <span className="text-slate-400 text-xs">{currentCard?.phonetic}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{currentCard?.word}</h3>
              <p className="text-slate-600 text-sm mb-3">{currentCard?.definition}</p>
              <p className="text-slate-500 text-sm italic">"{currentCard?.example}"</p>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-slate-400 text-xs">🇫🇷</span>
              <span className="text-slate-500 text-sm">{currentCard?.fr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons */}
      {flipped && (
        <div className="fade-in mt-4">
          <p className="text-center text-sm text-slate-500 mb-3">How well did you know this word?</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { q: 0, label: '😕 Forgot', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
              { q: 2, label: '🤔 Hard', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
              { q: 3, label: '🙂 Good', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
              { q: 5, label: '😊 Easy', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
            ].map(({ q, label, color }) => (
              <button
                key={q}
                onClick={() => onRating(q)}
                className={`${color} rounded-xl py-3 text-sm font-semibold transition-all active:scale-95`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!flipped && (
        <div className="text-center mt-4">
          <button
            className="btn-primary"
            onClick={() => setFlipped(true)}
          >
            Reveal Answer
          </button>
        </div>
      )}
    </div>
  )
}

function IdiomMode({ idioms, onXPGained }) {
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const idiom = idioms[idx]

  function next() {
    if (idx + 1 >= idioms.length) {
      onXPGained(15, 'Idioms reviewed!')
      setIdx(0)
    } else {
      setIdx(i => i + 1)
    }
    setRevealed(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-slate-500 px-1">
        <span>Idiom {idx + 1} / {idioms.length}</span>
        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">{idiom.level}</span>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg min-h-40 flex flex-col justify-center">
        <p className="text-orange-200 text-xs uppercase tracking-widest mb-3">Idiom</p>
        <h2 className="text-2xl font-extrabold mb-4">"{idiom.phrase}"</h2>
        {revealed ? (
          <div className="fade-in space-y-3">
            <p className="text-white/90 font-medium">{idiom.meaning}</p>
            <p className="text-white/70 text-sm italic">Example: {idiom.example}</p>
          </div>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl text-sm w-fit transition-all"
          >
            Reveal meaning →
          </button>
        )}
      </div>

      {revealed && (
        <div className="fade-in text-center">
          <button className="btn-primary" onClick={next}>
            Next Idiom →
          </button>
        </div>
      )}
    </div>
  )
}

function BrowseMode({ cards, filter }) {
  const filtered = cards.filter(c => filter === 'All' || c.level === filter)
  const [search, setSearch] = useState('')
  const results = filtered.filter(c =>
    c.word.toLowerCase().includes(search.toLowerCase()) ||
    c.definition.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search words..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {results.map(card => (
          <div key={card.id} className="card py-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800">{card.word}</span>
                  <span className="text-slate-400 text-xs">{card.phonetic}</span>
                </div>
                <p className="text-slate-600 text-sm">{card.definition}</p>
                <p className="text-slate-400 text-sm italic mt-1">"{card.example}"</p>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                card.level === 'C1' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {card.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
