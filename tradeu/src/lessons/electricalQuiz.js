// The full electrical quiz question pool for the /challenge flow:
// all 10 existing questions, kept intact rather than trimmed to a
// round number, combining the two lesson-picker quizzes' content
// without touching those lessons themselves (they're untouched at
// /play). Order matters here: voltage first (easy on-ramp), through
// the wire-tap questions, into GFCI/AFCI, ending on the "gotcha".
import { knowYourWiresLesson } from './knowYourWires'
import { gfciAfciLesson } from './gfciAfci'

export const electricalQuizQuestions = [...knowYourWiresLesson.questions, ...gfciAfciLesson.questions]
