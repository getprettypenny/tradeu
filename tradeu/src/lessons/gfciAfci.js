import BreakerPanel from '../components/scenes/BreakerPanel'

export const gfciAfciLesson = {
  id: 'gfci-afci',
  title: 'GFCI vs. AFCI',
  description: 'Where each protection type is actually required — and where you need both.',
  questions: [
    {
      id: 'gfci-bathroom',
      type: 'quiz',
      visual: BreakerPanel,
      jobLabel: 'GFCI Basics',
      narrative: "You've seen GFCI outlets in every room so far. Time to know the rule behind them.",
      prompt: 'Which of these needs a GFCI-protected outlet?',
      options: [
        { id: 'bedroom', label: 'Bedroom outlet' },
        { id: 'bathroom', label: 'Bathroom outlet' },
        { id: 'hallway', label: 'Hallway outlet' },
        { id: 'living-room', label: 'Living room outlet' },
      ],
      correctOptionId: 'bathroom',
      explanation:
        'Bathrooms are one of the classic GFCI-required locations — anywhere water and outlets mix (NEC 210.8).',
    },
    {
      id: 'gfci-sink-distance',
      type: 'quiz',
      visual: BreakerPanel,
      jobLabel: 'GFCI Basics',
      narrative: "This one's a distance rule, and it applies to more than just kitchens.",
      prompt: 'GFCI protection is required for any outlet within how many feet of a sink?',
      options: [
        { id: '3', label: '3 ft' },
        { id: '6', label: '6 ft' },
        { id: '10', label: '10 ft' },
        { id: '12', label: '12 ft' },
      ],
      correctOptionId: '6',
      explanation:
        "6 ft from the edge of any sink — kitchen, bathroom, wet bar, utility sink, doesn't matter (NEC 210.8).",
    },
    {
      id: 'afci-bedroom',
      type: 'quiz',
      visual: BreakerPanel,
      jobLabel: 'AFCI Basics',
      narrative: "Different hazard, different rule. Let's talk AFCI.",
      prompt: 'Which room type most likely needs AFCI protection?',
      options: [
        { id: 'garage', label: 'Garage' },
        { id: 'bathroom', label: 'Bathroom' },
        { id: 'bedroom', label: 'Bedroom' },
        { id: 'patio', label: 'Outdoor patio' },
      ],
      correctOptionId: 'bedroom',
      explanation:
        'AFCI covers most living spaces — bedrooms, living rooms, family rooms, hallways, and more (NEC 210.12).',
    },
    {
      id: 'gfci-vs-afci',
      type: 'quiz',
      visual: BreakerPanel,
      jobLabel: 'GFCI vs. AFCI',
      narrative: "You know where each goes. Now — what's each one actually watching for?",
      prompt: 'What does AFCI protect against that GFCI does not?',
      options: [
        { id: 'shock', label: 'Electric shock from a ground fault' },
        { id: 'arc', label: 'Arcing that can start an electrical fire' },
        { id: 'overload', label: 'A simple circuit overload' },
        { id: 'lightning', label: 'Lightning strikes' },
      ],
      correctOptionId: 'arc',
      explanation:
        "GFCI watches for current leaking to ground — a shock risk. AFCI watches for arcing in the wiring itself — a fire risk. Different hazard, different protection.",
    },
    {
      id: 'kitchen-both',
      type: 'quiz',
      visual: BreakerPanel,
      jobLabel: 'The Gotcha',
      narrative: 'Last one — this is where a lot of people get tripped up.',
      prompt: 'A kitchen circuit often needs which combination of protection?',
      options: [
        { id: 'gfci-only', label: 'GFCI only' },
        { id: 'afci-only', label: 'AFCI only' },
        { id: 'both', label: 'GFCI and AFCI, both' },
        { id: 'neither', label: 'Neither — kitchens are exempt' },
      ],
      correctOptionId: 'both',
      explanation:
        'Kitchens (and laundry areas) can need both at once — a dual-function breaker, or a GFCI outlet fed from an AFCI-protected circuit — since both shock and arc-fault risks are present.',
    },
  ],
}
