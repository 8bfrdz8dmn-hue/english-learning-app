export const levelTestQuestions = [
  // Grammar – B1/B2 boundary
  {
    id: 'lt1', section: 'Grammar', difficulty: 'B1',
    question: 'By the time we arrived, the film _____ already _____.',
    options: ['has / started', 'had / started', 'was / starting', 'did / start'],
    answer: 1,
  },
  {
    id: 'lt2', section: 'Grammar', difficulty: 'B1',
    question: 'She asked me where _____ the previous night.',
    options: ['had I been', 'I had been', 'I was', 'was I'],
    answer: 1,
  },
  {
    id: 'lt3', section: 'Grammar', difficulty: 'B2',
    question: 'If the weather _____ better, we would have gone to the beach.',
    options: ['was', 'is', 'had been', 'were'],
    answer: 2,
  },
  {
    id: 'lt4', section: 'Grammar', difficulty: 'B2',
    question: '_____ the contract carefully, she noticed several problematic clauses.',
    options: ['Having read', 'After read', 'She had read', 'Reading that'],
    answer: 0,
  },
  {
    id: 'lt5', section: 'Grammar', difficulty: 'B2',
    question: 'The report _____ before the board meeting.',
    options: ['must be submitted', 'must submit', 'must have submitted', 'must submitted'],
    answer: 0,
  },
  {
    id: 'lt6', section: 'Grammar', difficulty: 'C1',
    question: '_____ he known about the risks, he would never have agreed.',
    options: ['If', 'Had', 'Were', 'Should'],
    answer: 1,
  },
  {
    id: 'lt7', section: 'Grammar', difficulty: 'C1',
    question: 'It is essential that every employee _____ the new guidelines.',
    options: ['follows', 'follow', 'will follow', 'is following'],
    answer: 1,
  },
  {
    id: 'lt8', section: 'Grammar', difficulty: 'C1',
    question: 'The project succeeded despite _____ underfunded from the start.',
    options: ['it being', 'being', 'having been', 'it had been'],
    answer: 2,
  },

  // Vocabulary – B1/B2 boundary
  {
    id: 'lt9', section: 'Vocabulary', difficulty: 'B1',
    question: 'The politician\'s speech was full of _____ promises that were never kept.',
    options: ['empty', 'hollow', 'vain', 'blank'],
    answer: 0,
  },
  {
    id: 'lt10', section: 'Vocabulary', difficulty: 'B2',
    question: 'The new law is intended to _____ corruption in the public sector.',
    options: ['curb', 'shorten', 'lessen', 'weaken'],
    answer: 0,
  },
  {
    id: 'lt11', section: 'Vocabulary', difficulty: 'B2',
    question: 'The scientist\'s discovery _____ decades of previous research.',
    options: ['undermined', 'underlined', 'underpinned', 'undertook'],
    answer: 0,
  },
  {
    id: 'lt12', section: 'Vocabulary', difficulty: 'B2',
    question: 'The two companies reached an _____ agreement to share research data.',
    options: ['amicable', 'amiable', 'ambiguous', 'amicable'],
    answer: 0,
  },
  {
    id: 'lt13', section: 'Vocabulary', difficulty: 'C1',
    question: 'His argument, _____ convincing on the surface, contained several logical flaws.',
    options: ['albeit', 'whereas', 'despite', 'nevertheless'],
    answer: 0,
  },
  {
    id: 'lt14', section: 'Vocabulary', difficulty: 'C1',
    question: 'The government\'s response was _____ — too little, too late.',
    options: ['perfunctory', 'punctual', 'preliminary', 'peripheral'],
    answer: 0,
  },

  // Reading Comprehension
  {
    id: 'lt15', section: 'Reading', difficulty: 'B2',
    passage: 'Urban green spaces — parks, community gardens, and street trees — have been shown to deliver significant mental health benefits to city residents. Studies consistently find that access to nature reduces stress, improves mood, and fosters a sense of community. Yet in many rapidly growing cities, green spaces are the first casualty of development pressures.',
    question: 'Which of the following best summarises the main argument of the passage?',
    options: [
      'Cities should stop all new construction to protect green spaces.',
      'Green spaces benefit mental health but are frequently lost to urban development.',
      'Stress in cities is caused by lack of parks.',
      'Community gardens are more important than parks.',
    ],
    answer: 1,
  },
  {
    id: 'lt16', section: 'Reading', difficulty: 'C1',
    passage: 'The notion that economic growth and environmental sustainability are mutually exclusive is, increasingly, a false dichotomy. Mounting evidence from renewable energy sectors demonstrates that green investment can simultaneously reduce emissions and generate employment at scale. However, this transition is not without friction: fossil fuel-dependent regions face painful structural adjustments that demand proactive policy responses.',
    question: 'The phrase "false dichotomy" implies that:',
    options: [
      'Economic growth and sustainability are incompatible',
      'The two goals can in fact coexist, contrary to common belief',
      'Environmental sustainability is more important than growth',
      'Economic growth is always harmful to the environment',
    ],
    answer: 1,
  },
  {
    id: 'lt17', section: 'Reading', difficulty: 'C1',
    passage: 'The notion that economic growth and environmental sustainability are mutually exclusive is, increasingly, a false dichotomy. Mounting evidence from renewable energy sectors demonstrates that green investment can simultaneously reduce emissions and generate employment at scale. However, this transition is not without friction: fossil fuel-dependent regions face painful structural adjustments that demand proactive policy responses.',
    question: 'What does the author suggest about the transition to a green economy?',
    options: [
      'It will be painless if governments act quickly',
      'It will automatically create jobs in all regions',
      'It creates benefits but also significant challenges for some regions',
      'It is not possible without sacrificing economic growth',
    ],
    answer: 2,
  },
]

export function scoreLevelTest(answers) {
  let correct = 0
  let b1Correct = 0, b1Total = 0
  let b2Correct = 0, b2Total = 0
  let c1Correct = 0, c1Total = 0

  levelTestQuestions.forEach((q, i) => {
    const isCorrect = answers[i] === q.answer
    if (isCorrect) correct++
    if (q.difficulty === 'B1') { b1Total++; if (isCorrect) b1Correct++ }
    if (q.difficulty === 'B2') { b2Total++; if (isCorrect) b2Correct++ }
    if (q.difficulty === 'C1') { c1Total++; if (isCorrect) c1Correct++ }
  })

  const total = levelTestQuestions.length
  const pct = (correct / total) * 100

  let estimatedLevel
  if (pct < 40)      estimatedLevel = 'A2-B1'
  else if (pct < 60) estimatedLevel = 'B1'
  else if (pct < 75) estimatedLevel = 'B1-B2'
  else if (pct < 88) estimatedLevel = 'B2'
  else               estimatedLevel = 'B2-C1'

  return {
    correct, total, pct: Math.round(pct),
    estimatedLevel,
    breakdown: {
      B1: { correct: b1Correct, total: b1Total },
      B2: { correct: b2Correct, total: b2Total },
      C1: { correct: c1Correct, total: c1Total },
    },
  }
}
