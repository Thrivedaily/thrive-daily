export interface Touchstone {
  id: string;
  title: string;
  description: string;
  order: number;
}

/** Daily Touchstones from Daily Touchstones.docx */
export const TOUCHSTONES: Touchstone[] = [
  {
    id: "ts-01",
    title: "Practice Gratitude",
    description:
      "Consciously acknowledge things you're grateful for each day to nurture happiness.",
    order: 1,
  },
  {
    id: "ts-02",
    title: "Cultivate Excellence Through Habit",
    description:
      "Focus on the virtues you value and review them daily to make excellence a habit.",
    order: 2,
  },
  {
    id: "ts-03",
    title: "Incorporate Daily Physical Activity",
    description:
      "Alternate between weight lifting and zone 2 cardio (moderate cardio). Rest once per week.",
    order: 3,
  },
  {
    id: "ts-04",
    title: "Meditate and Relax Regularly",
    description:
      "Allocate time for relaxation, meditation, and prayer to maintain mental and spiritual health.",
    order: 4,
  },
  {
    id: "ts-05",
    title: "Be Conscious of Nutrition",
    description:
      "Ensure nutritional balance. Eat healthy fats (olive oil, etc.), quality proteins and vegetables.",
    order: 5,
  },
  {
    id: "ts-06",
    title: "Manage Anger Wisely",
    description:
      "Practice being quick to listen, slow to speak, and slow to anger.",
    order: 6,
  },
  {
    id: "ts-07",
    title: "Cherish Time and Nurture Relationships",
    description:
      "Make quality time with family and friends a priority. Actively work on strengthening connections.",
    order: 7,
  },
  {
    id: "ts-08",
    title: "Adopt a Calm and Patient Approach",
    description:
      "Avoid raising your voice, aiming for calm strength and wisdom in interactions.",
    order: 8,
  },
  {
    id: "ts-09",
    title: "Remember Personal Details and Connect with Friends",
    description:
      "Make an effort to remember names and important details about people. Proactively connect with friends.",
    order: 9,
  },
  {
    id: "ts-10",
    title: "Develop Hobbies",
    description: "Improve skills in hobbies you enjoy.",
    order: 10,
  },
  {
    id: "ts-11",
    title: "Maintain a Positive Outlook",
    description: "Cultivate positivity in thoughts and actions.",
    order: 11,
  },
  {
    id: "ts-12",
    title: "Be Proactive",
    description:
      "Take decisive action towards your goals and responsibilities.",
    order: 12,
  },
];

export const TOUCHSTONES_INTRO =
  "Daily Touchstones are your reliable guiding principles. Return to them each day to stay aligned with your values, build lasting habits, and cultivate eudaimonia — the good life.";

/** Rotating touchstone of the day based on day-of-year */
export function getTouchstoneOfTheDay(date = new Date()): Touchstone {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const sorted = [...TOUCHSTONES].sort((a, b) => a.order - b.order);
  return sorted[day % sorted.length];
}
