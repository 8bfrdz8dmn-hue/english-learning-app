export const writingPrompts = [
  {
    id: 'w1',
    level: 'B2',
    type: 'Opinion Essay',
    title: 'Technology & Human Connection',
    prompt: 'Some people believe that technology has made it easier for people to connect with each other, while others argue that it has led to greater isolation. To what extent do you agree with the view that technology has improved human relationships?',
    tips: [
      'Write a clear introduction with your thesis',
      'Present at least two arguments for and one against (or vice versa)',
      'Use linking words: Furthermore, However, On the other hand, Nevertheless',
      'Give specific examples to support each point',
      'Write a conclusion that summarises your view',
    ],
    wordCount: '250-300 words',
    usefulPhrases: [
      'It is widely argued that...',
      'Proponents of this view claim that...',
      'There is, however, a counter-argument...',
      'On balance, I would contend that...',
      'To a certain extent, this view has merit...',
    ],
    modelAnswer: `The question of whether technology fosters or hinders human connection is one of the defining debates of our era. While certain technologies have undoubtedly created new forms of social interaction, I would argue that their overall effect on the depth of human relationships is, at best, ambiguous.

On the one hand, digital platforms have made it possible to maintain contact across vast distances. Families separated by migration, friendships formed at university and dispersed by career moves — these connections can now be sustained with a degree of ease that previous generations would have found extraordinary. Furthermore, individuals with social anxiety or physical disabilities may find online interaction more accessible than traditional face-to-face contact.

However, there is a compelling counter-argument. Research consistently demonstrates that face-to-face interaction produces qualitatively different outcomes in terms of emotional bonding and empathy. Many critics contend that social media, in particular, encourages superficial engagement — the accumulation of "likes" and followers — rather than meaningful connection. There is growing evidence that heavy social media use is associated with increased loneliness and reduced life satisfaction, especially among young people.

On balance, the relationship between technology and human connection is neither uniformly positive nor negative. The technology itself is, arguably, neutral; the outcomes depend largely on how it is used. A video call cannot replicate the warmth of a shared meal, but it is infinitely preferable to silence. Perhaps the crucial point is intentionality: technology enriches human relationships when it supplements, rather than substitutes for, genuine interpersonal engagement.`,
  },
  {
    id: 'w2',
    level: 'B2',
    type: 'Discussion Essay',
    title: 'Should university education be free?',
    prompt: 'Many countries are debating whether higher education should be free for all students, funded by taxation, or whether students should bear the cost of their own education through tuition fees. Discuss the advantages and disadvantages of making university education free.',
    tips: [
      'Discuss BOTH sides — do not take a strong personal stance in a discussion essay',
      'Use impersonal language: "It is argued that...", "Critics point out..."',
      'Organise by: advantages (paragraph 2) + disadvantages (paragraph 3)',
      'Conclude with a balanced summary',
    ],
    wordCount: '280-320 words',
    usefulPhrases: [
      'Advocates of this policy argue that...',
      'A significant drawback, however, is...',
      'This would inevitably place a strain on...',
      'From an economic perspective...',
      'It is worth noting that...',
    ],
    modelAnswer: `The debate surrounding free university education touches on fundamental questions of social equity, economic efficiency, and the role of the state. Both positions have merit, and each carries significant implications.

The primary argument in favour of free higher education is one of equality. When tuition fees are high, access to university becomes contingent on financial means rather than academic ability, perpetuating cycles of social inequality. Advocates point to Scandinavian countries, where free higher education has contributed to high levels of social mobility and skilled workforces. Furthermore, a more educated population generates broader economic benefits — in innovation, productivity, and reduced reliance on welfare.

On the other hand, there are compelling objections to universal free education. The financial burden on the state would be considerable. Critics argue that taxpayers who did not attend university would be subsidising those who, statistically, will earn significantly more over their lifetimes. Some economists contend that this represents a regressive transfer of wealth. Additionally, when universities lack tuition fee income, there is a risk of under-investment in facilities and teaching quality.

A middle ground has been proposed in several countries: income-contingent loans, whereby graduates repay the cost of their education only once their income exceeds a certain threshold. This model attempts to balance accessibility with fiscal responsibility.

In conclusion, while free university education is an admirable aspiration rooted in principles of equality, its practical implementation raises legitimate concerns about sustainability and fairness. The optimal solution likely lies in carefully designed hybrid models that ensure access for all while maintaining the quality and funding of higher education institutions.`,
  },
  {
    id: 'w3',
    level: 'C1',
    type: 'Argumentative Essay',
    title: 'Artificial Intelligence and Creative Work',
    prompt: 'With artificial intelligence now capable of generating art, music, and written content, some argue that human creativity is being devalued. Others believe AI is simply a new tool that expands creative possibilities. Write an argumentative essay defending ONE clear position on this issue.',
    tips: [
      'Take a clear, unambiguous position from the outset',
      'Use sophisticated vocabulary: "inherent", "nuanced", "contentious", "paradigm shift"',
      'Acknowledge counter-arguments and refute them persuasively',
      'Aim for formal, academic register throughout',
      'End with a resonant concluding statement',
    ],
    wordCount: '320-380 words',
    usefulPhrases: [
      'It would be a grave error to conclude that...',
      'Far from threatening creativity, AI...',
      'Those who contend that... fundamentally misunderstand...',
      'The crux of the matter lies in...',
      'One must distinguish between...',
    ],
    modelAnswer: null,
  },
  {
    id: 'w4',
    level: 'C1',
    type: 'Report Writing',
    title: 'Report on Employee Wellbeing',
    prompt: 'You work for a large company. Your manager has asked you to write a report on the current state of employee wellbeing within the organisation, based on a recent staff survey. The survey found high levels of stress (68%), inadequate work-life balance (57%), and lack of recognition (49%). Write the report with findings and recommendations.',
    tips: [
      'Use formal report structure: Introduction, Findings, Recommendations, Conclusion',
      'Use headings for each section',
      'Write in impersonal/formal style: "It was found that...", "The data indicates..."',
      'Use precise language and modal verbs for recommendations: "should", "could", "might consider"',
      'Be concise and objective',
    ],
    wordCount: '280-330 words',
    usefulPhrases: [
      'This report aims to...',
      'The findings reveal that...',
      'A significant proportion of respondents...',
      'It is recommended that...',
      'In the light of these findings...',
    ],
    modelAnswer: null,
  },
]

export const writingCriteria = [
  { label: 'Task Achievement', description: 'Did you address all parts of the prompt clearly?' },
  { label: 'Coherence & Cohesion', description: 'Is your text logically organised with clear linking?' },
  { label: 'Vocabulary', description: 'Did you use a range of precise and appropriate vocabulary?' },
  { label: 'Grammar Range & Accuracy', description: 'Did you use complex structures correctly?' },
  { label: 'Register', description: 'Is the style appropriate (formal/semi-formal)?' },
]
