import Bathroom, { hotspots as bathroomHotspots } from '../components/scenes/Bathroom'
import Kitchen, { hotspots as kitchenHotspots } from '../components/scenes/Kitchen'
import Bedroom, { hotspots as bedroomHotspots } from '../components/scenes/Bedroom'

export const electricalBasicsLesson = {
  id: 'electrical-basics',
  title: 'Electrical Rough-In Basics',
  questions: [
    {
      id: 'bathroom',
      jobLabel: 'Job: Bathroom Install',
      narrative:
        'You just wired this bathroom. Walk through your own work before the inspector does — tap anything that might fail code.',
      completeMessage: 'Clean job — you caught every violation. This passes inspection.',
      Scene: Bathroom,
      hotspots: bathroomHotspots,
    },
    {
      id: 'kitchen',
      jobLabel: 'Job: Kitchen Install',
      narrative:
        "Countertop's wired and the fridge is running. Check it over before you close up the walls.",
      completeMessage: 'Nice — the kitchen circuit is clean.',
      Scene: Kitchen,
      hotspots: kitchenHotspots,
    },
    {
      id: 'bedroom',
      jobLabel: 'Job: Ceiling Fan Upgrade',
      narrative:
        'You just swapped the old light for a ceiling fan, and touched up the outlets while you were in there. Make sure it all holds up to code.',
      completeMessage: "Fan's good to go — no violations left.",
      Scene: Bedroom,
      hotspots: bedroomHotspots,
    },
  ],
}
