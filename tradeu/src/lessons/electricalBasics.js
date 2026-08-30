import Bathroom, { hotspots as bathroomHotspots } from '../components/scenes/Bathroom'
import Kitchen, { hotspots as kitchenHotspots } from '../components/scenes/Kitchen'
import Bedroom, { hotspots as bedroomHotspots } from '../components/scenes/Bedroom'

export const electricalBasicsLesson = {
  id: 'electrical-basics',
  title: 'Spot the Violation',
  description: 'Three rooms, a few mistakes hiding in each. Can you find them?',
  questions: [
    {
      id: 'bathroom',
      type: 'inspect',
      jobLabel: 'Job: Bathroom Install',
      narrative: 'You just wired this bathroom. Tap anything you think might fail inspection.',
      completeMessage: 'Nice! You found every mistake in this room.',
      Scene: Bathroom,
      hotspots: bathroomHotspots,
    },
    {
      id: 'kitchen',
      type: 'inspect',
      jobLabel: 'Job: Kitchen Install',
      narrative: 'Same idea: tap anything in this kitchen that looks off.',
      completeMessage: 'Nice! The kitchen circuit is clean.',
      Scene: Kitchen,
      hotspots: kitchenHotspots,
    },
    {
      id: 'bedroom',
      type: 'inspect',
      jobLabel: 'Job: Ceiling Fan Upgrade',
      narrative: 'You just hung a new ceiling fan. Check the room over before you call it done.',
      completeMessage: "Fan's good to go. No mistakes left.",
      Scene: Bedroom,
      hotspots: bedroomHotspots,
    },
  ],
}
