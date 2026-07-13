import type { HealthyHabitGuideItem } from "@/lib/types";

/** Healthy habits guide (from Healthy-habits-update / Custom_Goals export) */
export const HEALTHY_HABIT_CATEGORIES = [
  {
    "key": "daily-goals",
    "label": "Daily Goals",
    "emoji": "📅",
    "description": "Everyday foundations you can stack with your protocols."
  },
  {
    "key": "weekly-goals",
    "label": "Weekly Goals",
    "emoji": "📆",
    "description": "Rhythm builders — aim for consistent weekly reps."
  },
  {
    "key": "monthly-goals",
    "label": "Monthly Goals",
    "emoji": "🗓️",
    "description": "Longer-horizon practices for meaning and community."
  },
  {
    "key": "bonus-activities",
    "label": "Bonus Activities",
    "emoji": "✨",
    "description": "Optional boosts when you have energy and curiosity."
  },
  {
    "key": "environmental-protocols",
    "label": "Environmental Protocols",
    "emoji": "🌿",
    "description": "Shape your environment so healthy choices get easier."
  }
] as const;

export const HEALTHY_HABITS: HealthyHabitGuideItem[] = [
  {
    "id": "hh-17",
    "categoryKey": "weekly-goals",
    "category": "Weekly Goals",
    "name": "Zone 2 cardio 30 min (target 2-3 times per week)",
    "science": "Zone 2 training builds mitochondria, enhancing fat burning and endurance. It improves metabolic health, insulin sensitivity, and longevity; evidence shows reduced fatigue and better cardiovascular efficiency.",
    "order": 1
  },
  {
    "id": "hh-16",
    "categoryKey": "weekly-goals",
    "category": "Weekly Goals",
    "name": "Resistance/weight training (target 2-3x per week)",
    "science": "Weight training builds muscle, burns calories, and reduces abdominal fat. It lowers risks of heart disease, improves glucose metabolism, and boosts longevity; women see notable boosts in lifespan.",
    "order": 2
  },
  {
    "id": "hh-18",
    "categoryKey": "environmental-protocols",
    "category": "Environmental Protocols",
    "name": "Use incandescent or halogen lightbulbs in your home",
    "science": "Incandescent and halogen light bulbs are preferred in homes for their natural, full-spectrum light that closely mimics sunlight.  Scientifically, their continuous spectrum - rich in red and infrared wavelengths with minimal blue light- supports circadian rhymems, promoting better sleep than LEDs.  LEDs also have been linked to rhythmhondrial stress, reducing energy levels and potentially causing other serious impacts.  This simple act of changing bulbs can do wonders for energy and mood.",
    "order": 2.5
  },
  {
    "id": "hh-15",
    "categoryKey": "monthly-goals",
    "category": "Monthly Goals",
    "name": "Get better at one hobby (practice today)",
    "science": "Hobbies improve happiness, cognitive health, and stress reduction. They lower depression symptoms and enhance clarity/creativity; studies link them to better overall well-being and life satisfaction.",
    "order": 3
  },
  {
    "id": "hh-14",
    "categoryKey": "monthly-goals",
    "category": "Monthly Goals",
    "name": "Participate in community volunteering (at least monthly)",
    "science": "Volunteering lowers mortality, stress, and depression while boosting purpose and skills. It enhances mental/physical health and relationships; meta-analyses show reduced fatigue and better well-being.",
    "order": 4
  },
  {
    "id": "hh-13",
    "categoryKey": "bonus-activities",
    "category": "Bonus Activities",
    "name": "Take a Yoga class (hot or traditional)",
    "science": "Yoga enhances flexibility, reduces stress, and improves mood.",
    "order": 5
  },
  {
    "id": "hh-12",
    "categoryKey": "bonus-activities",
    "category": "Bonus Activities",
    "name": "Take a Pilates class",
    "science": "Pilates improves core strength, flexibility, and posture, reducing injury risk.",
    "order": 6
  },
  {
    "id": "hh-08",
    "categoryKey": "weekly-goals",
    "category": "Weekly Goals",
    "name": "Engage in social activity or adventure (at least 1 per week)",
    "science": "Strong social networks reduce mortality, depression, and heart disease risks. They boost well-being, resilience, and cognitive health; studies link them to lower blood pressure and better immunity.",
    "order": 7
  },
  {
    "id": "hh-07",
    "categoryKey": "weekly-goals",
    "category": "Weekly Goals",
    "name": "Deliberate heat or cold exposure (1-2 times per week)",
    "science": "Hormetic stressors = Lowe dose stress that makes you stronger. \n\nCold plunging reduces inflammation, improves insulin sensitivity, and boosts mood via endorphins. Research shows it enhances recovery, immune function, and stress adaptation; it may lower risks of depression, diabetes, and neurodegenerative diseases.\n\nSauna/hot tub/steam shower use improves cardiovascular health by reducing blood pressure and enhancing DNA repair/longevity pathways. It lowers cortisol, boosts heat acclimation, and may decrease risks of heart disease and dementia; evidence links it to better metabolism and stress resilience.",
    "order": 8
  },
  {
    "id": "hh-02",
    "categoryKey": "daily-goals",
    "category": "Daily Goals",
    "name": "Walk > 7.5K steps",
    "science": "Reduces all-cause mortality, improves cardiovascular health, improves insulin sensitivity and glucose regulation and provides mental health benefits.",
    "order": 9
  },
  {
    "id": "hh-05",
    "categoryKey": "daily-goals",
    "category": "Daily Goals",
    "name": "Eat grass-fed beef (several times a week)",
    "science": "Grass-fed beef has higher omega-3s, antioxidants (e.g., vitamin E), and stearic acid, supporting heart health and reducing inflammation. It may lower CVD risks compared to grain-fed; better fatty acid profile.",
    "order": 10
  },
  {
    "id": "hh-04",
    "categoryKey": "daily-goals",
    "category": "Daily Goals",
    "name": "Eat vegetables",
    "science": "Vegetables provide fiber, vitamins, and minerals, lowering risks of heart disease, stroke, and cancer. 5 servings daily reduce mortality and support eye/digestive health; high in potassium/folate.",
    "order": 11
  },
  {
    "id": "hh-03",
    "categoryKey": "daily-goals",
    "category": "Daily Goals",
    "name": "Include healthy fats in meals",
    "science": "Healthy fats (olive oil, avocado, fish) lower cholesterol, support vitamin absorption, and control blood sugar. They aid heart health, cell function, and energy; evidence shows reduced CVD risks and better pressure.",
    "order": 12
  },
  {
    "id": "hh-09",
    "categoryKey": "environmental-protocols",
    "category": "Environmental Protocols",
    "name": "Use only natural cleaners (vinegar, baking soda, alcohol)",
    "science": "Natural cleaners reduce chemical exposure, lowering respiratory/irritation risks. They effectively deodorize, cut grease, and disinfect; studies show reduced toxins like chloroform vs. commercial products.",
    "order": 13
  },
  {
    "id": "hh-11",
    "categoryKey": "environmental-protocols",
    "category": "Environmental Protocols",
    "name": "Avoid herbicides outside",
    "science": "Avoiding pesticides/herbicides reduces health risks like cancer and neurotoxicity, while preserving ecosystems. Though they control pests (benefits in agriculture), home avoidance prevents chronic exposure; studies emphasize safer alternatives for human health.",
    "order": 14
  },
  {
    "id": "hh-10",
    "categoryKey": "environmental-protocols",
    "category": "Environmental Protocols",
    "name": "Avoid pesticides inside/outside",
    "science": "Avoiding pesticides/herbicides reduces health risks like cancer and neurotoxicity, while preserving ecosystems. Though they control pests (benefits in agriculture), home avoidance prevents chronic exposure; studies emphasize safer alternatives for human health.",
    "order": 15
  }
];

export function getHealthyHabitsByCategory(categoryKey: string) {
  return HEALTHY_HABITS.filter((h) => h.categoryKey === categoryKey).sort(
    (a, b) => a.order - b.order
  );
}
