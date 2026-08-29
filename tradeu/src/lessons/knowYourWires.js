export const knowYourWiresLesson = {
  id: 'know-your-wires',
  title: 'Know Your Wires',
  description: 'Quick-fire questions on wire colors, voltage, and gauge.',
  questions: [
    {
      id: 'outlet-voltage',
      type: 'quiz',
      jobLabel: 'Voltage',
      narrative: 'Start with something every house has.',
      prompt: "What's the standard voltage for a household outlet in the US?",
      options: [
        { id: '12', label: '12V' },
        { id: '120', label: '120V' },
        { id: '240', label: '240V' },
        { id: '480', label: '480V' },
      ],
      correctOptionId: '120',
      explanation:
        'Most general household outlets run 120V. Big appliances like dryers, ranges, and AC units usually need 240V.',
    },
    {
      id: 'hot-wire',
      type: 'quiz',
      interaction: 'wires',
      jobLabel: 'Wire Colors',
      narrative: "Now let's open one up. Tap the wire that answers each question.",
      prompt: 'Which wire is "hot" — energized and able to shock you?',
      options: [
        { id: 'white', label: 'White', shortLabel: 'White', color: '#DCD5C4' },
        { id: 'green', label: 'Green', shortLabel: 'Green', color: 'var(--green)' },
        { id: 'black', label: 'Black', shortLabel: 'Black', color: '#1A1A1A' },
        { id: 'bare', label: 'Bare copper', shortLabel: 'Bare', color: '#B5824B' },
      ],
      correctOptionId: 'black',
      explanation:
        "Black is the classic hot wire (red and blue show up too on multi-wire circuits). Always treat it as live until you've tested it yourself.",
    },
    {
      id: 'ground-wire',
      type: 'quiz',
      interaction: 'wires',
      jobLabel: 'Wire Colors',
      narrative: 'Same box, next wire.',
      prompt: 'Which wire is the grounding conductor?',
      options: [
        { id: 'black', label: 'Black', shortLabel: 'Black', color: '#1A1A1A' },
        { id: 'white', label: 'White', shortLabel: 'White', color: '#DCD5C4' },
        { id: 'green', label: 'Green or bare copper', shortLabel: 'Green', color: 'var(--green)' },
        { id: 'red', label: 'Red', shortLabel: 'Red', color: 'var(--red)' },
      ],
      correctOptionId: 'green',
      explanation:
        "Green or bare copper carries the safety ground back to the panel and into the earth — it shouldn't carry current under normal conditions.",
    },
    {
      id: 'grounded-conductor',
      type: 'quiz',
      jobLabel: 'Code Terms',
      narrative: "This one trips up a lot of people — codebooks don't say what you'd expect.",
      prompt: 'The white wire is technically called the "grounded conductor." What do electricians actually call it?',
      options: [
        { id: 'ground', label: 'Ground' },
        { id: 'hot', label: 'Hot' },
        { id: 'neutral', label: 'Neutral' },
        { id: 'ungrounded', label: 'Ungrounded' },
      ],
      correctOptionId: 'neutral',
      explanation:
        "Confusing but true — the white \"grounded conductor\" is what everyone calls the neutral. It's not the same as the green ground wire, even though both eventually bond at the panel.",
    },
    {
      id: 'wire-gauge',
      type: 'quiz',
      jobLabel: 'Wire Gauge',
      narrative: 'Last one — this is a real jobsite mistake, not just trivia.',
      prompt: 'What wire gauge do you need for a standard 20-amp circuit?',
      options: [
        { id: '14', label: '14 AWG' },
        { id: '12', label: '12 AWG' },
        { id: '10', label: '10 AWG' },
        { id: '8', label: '8 AWG' },
      ],
      correctOptionId: '12',
      explanation:
        '12 AWG copper is rated for 20A. 14 AWG is only good for 15A circuits — running it on a 20A breaker is a fire hazard.',
    },
  ],
}
