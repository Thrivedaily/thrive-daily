import type { Virtue } from "@/lib/types";

export const VIRTUES: Virtue[] = [
  {
    "id": "virtue-5",
    "name": "Faith",
    "description": "Power received from the Holy Sprit, to consent with our wills and asset with our minds to everything which God has revealed.  We accept the word of God not because we comprehend, but because God who can neither decive nor be decived has told us it is true. Trust in God.  All is a gift from God.",
    "order": 0,
    "group": "theological",
    "reflections": [
      "Where did I place my trust today?",
      "How did I acknowledge gifts beyond my control?"
    ]
  },
  {
    "id": "virtue-6",
    "name": "Hope",
    "description": "The positive precept.  A future good, difficult but possible to attain, by means of the Divine Assistance, on Whose help it lends.",
    "order": 1,
    "group": "theological",
    "reflections": [
      "What future good am I working toward?",
      "Where did I choose optimism over despair?"
    ]
  },
  {
    "id": "virtue-2",
    "name": "Forgiveness",
    "description": "Voluntarily release the debt someone owes you for their wrong, so your future is no longer chained to their past. Avoid the avalanche of harm that can come when we yield to anger. \"Lord, I need you to stop my tongue from saying any word that does not build up those who listen.\"",
    "order": 2,
    "group": "additional",
    "reflections": [
      "Whom do I need to release from a debt today?",
      "Did I speak words that build others up?"
    ]
  },
  {
    "id": "virtue-16",
    "name": "Cleanliness",
    "description": "Tolerate no uncleanness in body, clothes, or habitation.",
    "order": 3,
    "group": "additional",
    "reflections": [
      "Is my body, space, and environment ordered?",
      "What small tidy act would reduce friction tomorrow?"
    ]
  },
  {
    "id": "virtue-4",
    "name": "Kindness",
    "description": "Love thy neigbhor.  Empathy without resentment. Chearful demeanor and positive outlook.",
    "order": 4,
    "group": "additional",
    "reflections": [
      "Who needed empathy from me today?",
      "Did I show a cheerful demeanor under stress?"
    ]
  },
  {
    "id": "virtue-1",
    "name": "Humility",
    "description": "Find joy in simple things. Stay grounded.  Turn outward vs inward.  Enjoy the ride and star in a theo drama vs an ego drama.  Give attention to others.",
    "order": 5,
    "group": "additional",
    "reflections": [
      "Did I turn outward toward others, or inward toward ego?",
      "Where did I find joy in simple things?"
    ]
  },
  {
    "id": "virtue-3",
    "name": "Patience",
    "description": "Quick to listen, slow to speak, slow to become angry. Forbearance and endurance through moderation (avoid extremes).  Accepting the grace to forgive, to show mercy to sinners and creating peaceful stability to those around us.",
    "order": 6,
    "group": "additional",
    "reflections": [
      "Was I quick to listen and slow to anger?",
      "Where can I practice forbearance tomorrow?"
    ]
  },
  {
    "id": "virtue-7",
    "name": "Prudence",
    "description": "The right reason applied to practice.  Recognition of what is good and evil.",
    "order": 7,
    "group": "cardinal",
    "reflections": [
      "Did I choose the good wisely in practice?",
      "What decision needs more careful reason?"
    ]
  },
  {
    "id": "virtue-8",
    "name": "Justice",
    "description": "Wrong none by doing injuries, or omitting the benefits that are your duty.",
    "order": 8,
    "group": "cardinal",
    "reflections": [
      "Did I wrong anyone by action or omission?",
      "Whom can I benefit as my duty requires?"
    ]
  },
  {
    "id": "virtue-9",
    "name": "Fortitude",
    "description": "Resolve to perform your intentions. Perform without fail what you resolve.",
    "order": 9,
    "group": "cardinal",
    "reflections": [
      "Did I perform what I resolved?",
      "Where did I need courage and follow through?"
    ]
  },
  {
    "id": "virtue-10",
    "name": "Temperance",
    "description": "Eat not to dullness. Drink not to elevation.",
    "order": 10,
    "group": "cardinal",
    "reflections": [
      "Did I practice moderation in food, drink, and pleasure?",
      "Where did excess creep in?"
    ]
  },
  {
    "id": "virtue-11",
    "name": "Tranquility",
    "description": "Be not disturbed at trifles or at accidents unavoidable.",
    "order": 11,
    "group": "additional",
    "reflections": [
      "What trifles disturbed my peace unnecessarily?",
      "How can I accept the unavoidable with calm?"
    ]
  },
  {
    "id": "virtue-12",
    "name": "Order",
    "description": "Let all your things have their places. Let each part of your business have its time.",
    "order": 12,
    "group": "additional",
    "reflections": [
      "Did my things and tasks have their proper place and time?",
      "What system would reduce chaos tomorrow?"
    ]
  },
  {
    "id": "virtue-13",
    "name": "Diligence",
    "description": "Zealous and careful nature in one's actions and work.  Productive use of time to avoid laziness.",
    "order": 13,
    "group": "additional",
    "reflections": [
      "Did I use time productively and zealously?",
      "Where did laziness win, and how will I reclaim it?"
    ]
  },
  {
    "id": "virtue-14",
    "name": "Sincerity",
    "description": "Use no hurtful deceit. Think innocently and justly; and if you speak, speak accordingly.",
    "order": 14,
    "group": "additional",
    "reflections": [
      "Did I speak and think justly without deceit?",
      "Was my inner life aligned with my words?"
    ]
  },
  {
    "id": "virtue-15",
    "name": "Frugality",
    "description": "Make no expense but to do good to others or yourself.  Avoid materialism.",
    "order": 15,
    "group": "additional",
    "reflections": [
      "Did I spend only for good to others or myself?",
      "Where is materialism pulling me off course?"
    ]
  }
];

export const VIRTUE_GROUPS = [
  { key: "cardinal", label: "Classical (Cardinal) Virtues", description: "The four pillars of moral excellence from the classical tradition." },
  { key: "theological", label: "Theological Virtues", description: "Faith and Hope — orientation toward the transcendent." },
  { key: "additional", label: "Additional Virtues for Eudaimonia", description: "Practices that cultivate human flourishing day to day." },
] as const;

/** Rotating virtue of the day based on day-of-year */
export function getVirtueOfTheDay(date = new Date()): Virtue {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const sorted = [...VIRTUES].sort((a, b) => a.order - b.order);
  return sorted[day % sorted.length];
}
