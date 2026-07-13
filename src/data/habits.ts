import type { Habit } from "@/lib/types";

/** Daily protocol habits imported from Thrive Daily (Adalo) data. Max total: 263 pts */
export const HABITS: Habit[] = [
  {
    "id": "habit-001",
    "category": "Wake-Up",
    "time": "At wake up",
    "name": "Make bed immediately",
    "points": 4,
    "order": 1,
    "howTo": "Immediately upon waking, straighten sheets and pillows to make your bed neatly.",
    "whyImportant": "Making the bed fosters accomplishment, reduces stress, improves mood, and enhances sleep hygiene. Done first thing to trigger positive habits and boost productivity for the day. Neuropsychologically, it symbolizes control over chaos, boosting executive function and self-regulation for sustained energy.",
    "detailedScience": "Making the bed correlates with happiness, productivity, and better sleep quality per surveys. It reduces stress via tidy environment and acts as a keystone habit. Messy homes link to poorer mental health.",
    "links": [
      "https://www.verywellmind.com/mental-health-benefits-of-making-your-bed-5093540",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC9529170/",
      "https://www.indexdigital.co.uk/health-beauty/the-psychology-of-making-your-bed",
      "https://confidecoaching.com/morning-routine-guide/",
      "https://pubmed.ncbi.nlm.nih.gov/33054339/"
    ],
    "categoryKey": "wake-up"
  },
  {
    "id": "habit-002",
    "category": "Wake-Up",
    "time": "At wake up",
    "name": "Recall prior nights' dreams",
    "points": 2,
    "order": 2,
    "howTo": "Upon waking, recall and write down dreams in a journal for 2-5 minutes.",
    "whyImportant": "Recording dreams enhances emotional processing, self-awareness, memory, and creativity, reducing grogginess. Done at wake-up when dreams are fresh for better cognitive function and mood.",
    "detailedScience": "Dream journaling improves self-awareness and emotional integration, activating prefrontal cortex for memory. It boosts creativity by capturing REM insights and reduces PTSD symptoms. Dreams aid emotional memory processing.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC11018802/",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC6428732/",
      "https://www.bps.org.uk/research-digest/how-keeping-dream-diary-could-boost-your-creativity",
      "https://health.clevelandclinic.org/dream-journal",
      "https://www.nature.com/articles/s41598-023-43319-z"
    ],
    "categoryKey": "wake-up"
  },
  {
    "id": "habit-003",
    "category": "Wake-Up",
    "time": "At wake up",
    "name": "Daily Identity Affirmation - I will Thrive today",
    "points": 20,
    "order": 3,
    "howTo": "Upon waking, state aloud or write: \"I am a virtuous person who practices excellence today.\" Briefly recall one virtue you will embody (e.g., fortitude, kindness, prudence).",
    "whyImportant": "Identity priming shapes behavior more effectively than goals alone. When you see yourself as virtuous, small choices align with that identity. Done at wake-up to set the day's moral and behavioral compass before distractions intervene.",
    "detailedScience": "Self-identity theory and implementation research show that identity-based habits (\"I am the kind of person who...\") produce more durable behavior change than outcome goals. Priming core values early engages prefrontal self-regulation and reduces ego-depletion later in the day.",
    "links": [
      "https://jamesclear.com/identity-based-habits",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC9529170/"
    ],
    "categoryKey": "wake-up"
  },
  {
    "id": "habit-004",
    "category": "Wake-Up",
    "time": "At wake up",
    "name": "Drink 10-16 oz of mineralized water",
    "points": 20,
    "order": 4,
    "howTo": "Drink 10-16 oz of water with a pinch of Baja gold salt or sugar-free electrolytes upon waking.",
    "whyImportant": "Rehydrates and replenishes sodium lost overnight, balancing electrolytes, reducing cortisol spikes, and boosting energy. Done at wake-up to combat grogginess and support brain performance.",
    "detailedScience": "Morning electrolyte water aids hydration and stress reduction via lower cortisol. Studies show salt intake affects cortisol, with adequate sodium lowering levels. Hydration patterns link to health.",
    "links": [
      "https://science.drinklmnt.com/electrolytes/electrolytes-and-hormones",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC7859973/",
      "https://www.webmd.com/balance/stress-management/adrenal-cocktail",
      "https://drleila.com/salt-treatment-for-adrenal-fatigue/",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC2908954/"
    ],
    "categoryKey": "wake-up"
  },
  {
    "id": "habit-005",
    "category": "Morning",
    "time": "0-2 hours after waking",
    "name": "AVOID CAFFEINE FOR 2 HOURS AFTER WAKING",
    "points": 20,
    "order": 5,
    "howTo": "Delay coffee or caffeinated drinks for at least 2 hours after waking; opt for water instead.",
    "whyImportant": "Delaying caffeine aligns with natural cortisol peaks, preventing crashes and improving sustained energy and mood. Done after waking to avoid interfering with adenosine and cortisol levels.",
    "detailedScience": "Caffeine stimulates cortisol, but chronic intake reduces responses. Studies show delaying caffeine prevents interference with morning cortisol, reducing stress and improving energy. It boosts metabolism but can cause hypoperfusion.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC2257922/",
      "https://pubmed.ncbi.nlm.nih.gov/16204431/",
      "https://sleepfoundation.org/sleep-hygiene/caffeine-and-sleep",
      "https://www.thorne.com/take-5-daily/article/why-you-should-reconsider-that-morning-cup-of-coffee",
      "https://sleep.sleepopolis.com/sleep-news/controversy-over-wait-to-caffeinate-rule/"
    ],
    "categoryKey": "morning"
  },
  {
    "id": "habit-006",
    "category": "Wake-Up",
    "time": "At wake up",
    "name": "Avoid social media/news for 1 hour after waking",
    "points": 5,
    "order": 6,
    "howTo": "avoid checking social media or news on your phone.",
    "whyImportant": "Delaying phone use prevents cognitive overload and early blue light,  improving focus and mood. It also allows you to set your own intentions for the day without distractions from external influences which naturally side track your thoughts and intentions.  Practice daily for reduced stress, better energy, and a more focused morning.",
    "detailedScience": "Smartphone use increases stress and reduces well-being; blocking internet improves mood and reduces addiction. Starting reactively increases anxiety; breaks from phones boost happiness and sleep quality.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC10491487/",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC10740995/",
      "https://academic.oup.com/pnasnexus/article/4/2/pgaf017/8016017",
      "https://unplugged.rest/blog/why-you-shouldn-t-use-your-phone-in-the-morning",
      "https://www.npr.org/2025/02/24/nx-s1-5304417/smartphone-break-digital-detox-screen-addiction"
    ],
    "categoryKey": "wake-up"
  },
  {
    "id": "habit-007",
    "category": "Morning",
    "time": "0-2 hours",
    "name": "GET MORNING SUNLIGHT",
    "points": 30,
    "order": 7,
    "howTo": "Get 10 minutes of morning sunlight or 10,000 LUX light within 1 hour of waking, avoiding sunglasses.",
    "whyImportant": "Morning light regulates circadian rhythms, spikes cortisol appropriately, boosts melatonin later, improves vitamin D, and reduces fatigue. Done shortly after waking to align metabolism and enhance mood and energy.  This is a key protocol to improve sleep and enhance mood and energy daily.",
    "detailedScience": "Morning bright light improves nocturnal sleep and alertness. Sunlight sets the clock, reducing stress and improving duration.",
    "links": [
      "https://pubmed.ncbi.nlm.nih.gov/36058557/"
    ],
    "categoryKey": "morning"
  },
  {
    "id": "habit-008",
    "category": "Morning",
    "time": "0-2 hours after waking",
    "name": "Take a morning walk (15 minutes for optic flow)",
    "points": 20,
    "order": 8,
    "howTo": "Walk outdoors for at least 15 minutes, focusing on the visual flow of surroundings.",
    "whyImportant": "Walking generates optic flow, calming the brain, reducing stress, and boosting creativity and mood. Done in the morning to activate metabolism and improve focus for the day.",
    "detailedScience": "Brisk walking improves mood compared to controls. Optic flow relaxes the brain, mimicking EMDR for emotional processing. Exercise relieves psychological symptoms.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC6064756/",
      "https://www.aarp.org/health/healthy-living/ways-walking-improves-your-brain/",
      "https://med.stanford.edu/news/all-news/2020/06/setting-your-biological-clock-reducing-stress-while-sheltering-in-place.html",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC5928534/",
      "https://www.melrobbins.com/episode/episode-88/"
    ],
    "categoryKey": "morning"
  },
  {
    "id": "habit-009",
    "category": "Morning",
    "time": "0-2 hours after waking",
    "name": "Plank for 60 seconds (2x)",
    "points": 10,
    "order": 9,
    "howTo": "Hold a plank position for 60 seconds, repeat twice in the morning, maintaining straight body alignment.",
    "whyImportant": "Planking builds core strength, improves posture, boosts metabolism, releases endorphins for mood, and promotes alertness. Done in the morning to activate muscles and set discipline for the day.",
    "detailedScience": "Plank enhances core muscles and respiratory capacity. It increases endorphin release for mood elevation. Maximum plank correlates with fitness and mood in athletes.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC11235748/",
      "https://health.clevelandclinic.org/plank-exercise-benefits",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC9806881/",
      "https://www.boxrox.com/what-happens-to-your-body-if-you-do-the-plank-exercise-every-day/",
      "https://www.researchgate.net/publication/364281826_Relationship_between_a_Maximum_Plank_Assessment_and_Fitness_Health_Behaviors_and_Moods_in_Tactical_Athletes_An_Exploratory_Study"
    ],
    "categoryKey": "morning"
  },
  {
    "id": "habit-010",
    "category": "Morning",
    "time": "0-2 hours after waking",
    "name": "Practice breath work (deep breathing methods)",
    "points": 10,
    "order": 10,
    "howTo": "Perform box breathing (inhale 4secs, hold 4secs, exhale 4sec, hold 4secs) or Wim Hof method for 5-10 minutes.",
    "whyImportant": "Breath work increases epinephrine, reduces inflammation, boosts immune response, lowers stress, and improves mood and energy. Done in the morning to enhance focus and willpower for the day.",
    "detailedScience": "Wim Hof method reduces stress, anxiety, and improves mood via epinephrine and immune modulation. Breathwork significantly reduces stress, depression, and enhances energy.",
    "links": [
      "https://www.nature.com/articles/s41598-023-44902-0",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC11136795/",
      "https://www.news-medical.net/health/The-Science-Behind-Breathwork-and-Stress-Reduction.aspx",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC9540300/",
      "https://www.wimhofmethod.com/breathing-exercises"
    ],
    "categoryKey": "morning"
  },
  {
    "id": "habit-011",
    "category": "Morning",
    "time": "0-2 hours after waking",
    "name": "Set YOUR intentions and plan YOUR day",
    "points": 5,
    "order": 11,
    "howTo": "Spend 5 minutes setting daily intentions and planning tasks, using a journal or mental note.",
    "whyImportant": "Setting YOUR intentions fosters mindfulness and purpose, reducing overwhelm and boosting productivity and mood. Done in the morning to set a positive tone and enhance focus for the day.",
    "detailedScience": "Morning routines with intentions improve focus, stress management, and productivity. Mindfulness in the morning boosts engagement and creativity, laying a foundation for well-being.",
    "links": [
      "https://medium.com/@jeremirichardson/mindful-mornings-how-starting-your-day-with-intention-can-change-your-year-346010dbc6e5",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC9529170/",
      "https://complex.so/insights/morning-routines-of-productive-people",
      "https://confidecoaching.com/morning-routine-guide/",
      "https://info.totalwellnesshealth.com/blog/creating-a-mindful-morning-routine"
    ],
    "categoryKey": "morning"
  },
  {
    "id": "habit-012",
    "category": "Morning",
    "time": "0-2 hours after waking",
    "name": "Use red light therapy on face/neck (10-15 min)",
    "points": 10,
    "order": 12,
    "howTo": "Use a red light device on skin or face for 5-10 minutes in the morning.  If not available, morning sunlight is just as good or better.",
    "whyImportant": "Red light stimulates collagen, reduces inflammation, improves skin and cognitive function. Done in the morning to aid pain relief and energy for the day.",
    "detailedScience": "Photobiomodulation heals, relieves pain, reduces inflammation. Studies show it promotes tissue repair, relieves pain in trials, and enhances brain health.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC5523874/",
      "https://www.uclahealth.org/news/article/5-health-benefits-red-light-therapy",
      "https://www.webmd.com/skin-problems-and-treatments/red-light-therapy",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC9980499/",
      "https://platinumtherapylights.com/blogs/news/brain-light-therapy"
    ],
    "categoryKey": "morning"
  },
  {
    "id": "habit-013",
    "category": "Morning",
    "time": "0-2 hours after waking",
    "name": "Take 3g-5g creatine",
    "points": 10,
    "order": 13,
    "howTo": "Take 3-5g of creatine monohydrate supplement with water or in a shake 0-2 hours after waking.",
    "whyImportant": "Creatine boosts muscle energy, strength, and brain health, improving performance and glucose metabolism. Taken in the morning to support daily energy and cognitive function.",
    "detailedScience": "Creatine acts as an energy buffer, reducing oxidative stress and inflammation. Studies show it enhances the muscle-brain axis, improves mood in sleep-deprived states, and supports brain function. It increases strength and aids neurological conditions.",
    "links": [
      "https://pubmed.ncbi.nlm.nih.gov/40771202/",
      "https://pubmed.ncbi.nlm.nih.gov/11740297/",
      "https://pubmed.ncbi.nlm.nih.gov/16416332/",
      "https://pubmed.ncbi.nlm.nih.gov/22549035/",
      "https://pubmed.ncbi.nlm.nih.gov/26184303/"
    ],
    "categoryKey": "morning"
  },
  {
    "id": "habit-014",
    "category": "Mid-Morning",
    "time": "3-6 hours after waking",
    "name": "Eat grapefruit for cortisol modulation",
    "points": 2,
    "order": 14,
    "howTo": "Eat a fresh grapefruit or grapefruit juice (w/ no sugar added) 3-6 hours after waking, as a late morning snack.",
    "whyImportant": "Grapefruit modulates cortisol and can extend the feeling of alertness in the morning.  It also provides vitamin C for immune boost, fiber for energy stability, and aids blood sugar control. Eat mid-morning to enhance alertness without crashes and support heart health.",
    "detailedScience": "Grapefruit is a cortisol modulator.  It inhibits CYP3A4 enzyme, a liver enzyme responsible for metabolizing cortisol into inactive forms.  This leads to reduced excretion of cortisol metabolites and higher circulating cortisol levels.  Studies have shown consuming grapefruit effectively prolongs cortisol's presence in the body.  It's also associated with higher nutrient intakes and reduced heart disease risk. It lowers blood sugar, offsets carbs with fiber, and contains phytochemicals that fight stroke. Some studies show no significant effects on weight or lipids, but overall, it supports health.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC4016745/",
      "https://sleepfoundation.org/sleep-hygiene/grapefruit-benefits",
      "https://www.heart.org/en/news/2020/01/17/before-grabbing-a-grapefruit-understand-its-power",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC3984491/",
      "https://www.sciencedirect.com/science/article/abs/pii/S0026049511004136"
    ],
    "categoryKey": "mid-morning"
  },
  {
    "id": "habit-015",
    "category": "Mid-Morning",
    "time": "3-6 hours after waking",
    "name": "Take collagen peptides & vitamin c",
    "points": 10,
    "order": 15,
    "howTo": "Mix 10-20g of collagen peptides powder into water, coffee, or a smoothie and consume shortly after eating grapefruit or take vitamin c supplement with the peptides.",
    "whyImportant": "Collagen peptides reduce fatigue, improve mood and vigor, enhance sleep restfulness, and support cognitive function, leading to better energy and alertness. Taken mid-morning after grapefruit to synergize with its vitamin C content, which enhances collagen synthesis and absorption for optimal benefits.",
    "detailedScience": "Collagen peptide supplementation (10g/day for 8 weeks) ameliorates mood status related to fatigue and vigor, increases feelings of sleep restfulness, reduces awakenings, and improves cognitive function in physically active individuals. It may have anti-fatigue effects, support brain health, and mitigate muscle stress from training. Vitamin C is essential for collagen synthesis, accelerating type I collagen production and bone healing; combining collagen peptides with vitamin C improves absorption, bioavailability, and overall efficacy in promoting new collagen formation.",
    "links": [
      "https://pubmed.ncbi.nlm.nih.gov/39291817/",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC10799148/",
      "https://www.cibdol.com/blog/1566-the-potential-energy-boosting-effects-of-collagen",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC6204628/",
      "https://nativepath.com/blogs/supplements/collagen-and-vitamin-c"
    ],
    "categoryKey": "mid-morning"
  },
  {
    "id": "habit-016",
    "category": "Mid-Day",
    "time": "Mid-day",
    "name": "Eat a high protein lunch; >30grams protein",
    "points": 20,
    "order": 16,
    "howTo": "Consume a lunch with 30+ grams of protein, low in carbs, such as pasture raised beef with veggies.  Get high quality beef at www.tarheelbeef.com",
    "whyImportant": "High-protein lunches stabilize blood sugar, prevent crashes, sustain energy, improve mood, and support muscle maintenance. Done mid-day to maintain focus and metabolic health throughout the afternoon.",
    "detailedScience": "High-protein meals lower postprandial glucose and insulin, improving satiety and cognitive function. Studies show they reduce fatigue, enhance mood, and aid glucose metabolism compared to high-carb meals.",
    "links": [
      "https://pubmed.ncbi.nlm.nih.gov/12034132/",
      "https://pubmed.ncbi.nlm.nih.gov/9416027/",
      "https://pubmed.ncbi.nlm.nih.gov/28919842/",
      "https://pubmed.ncbi.nlm.nih.gov/23888431/",
      "https://pubmed.ncbi.nlm.nih.gov/9145937/"
    ],
    "categoryKey": "mid-day"
  },
  {
    "id": "habit-017",
    "category": "Mid-Day",
    "time": "Mid-day",
    "name": "Walk outside after eating (15 minutes)",
    "points": 5,
    "order": 17,
    "howTo": "After lunch, go for a 15-minute walk outdoors at a casual or moderate pace.",
    "whyImportant": "Post-meal walking improves digestion, stabilizes blood sugar, reduces bloating, and boosts mood via endorphins. Done after eating to immediately lower diabetes risk and aid weight management for sustained energy.",
    "detailedScience": "Walking after meals improves glycemic response, with even 2 minutes helping blood sugar. Studies show brisk walking post-meal enhances digestion, controls glucose, and improves mood.",
    "links": [
      "https://www.ncbi.nlm.nih.gov/search/research-news/17034",
      "https://pubmed.ncbi.nlm.nih.gov/35268055/",
      "https://www.uclahealth.org/news/article/taking-walk-after-eating-can-help-with-blood-sugar-control",
      "https://www.nytimes.com/2022/08/04/well/move/walking-after-eating-blood-sugar.html",
      "https://health.clevelandclinic.org/walking-after-eating"
    ],
    "categoryKey": "mid-day"
  },
  {
    "id": "habit-018",
    "category": "Mid-Day",
    "time": "Mid-day",
    "name": "Take 20 minutes and perform non-sleep deep rest",
    "points": 5,
    "order": 18,
    "howTo": "Find a quiet place, lie down or sit comfortably for 20 minutes, practicing yoga nidra or similar guided relaxation without sleeping.",
    "whyImportant": "NSDR reduces stress, improves focus, and enhances recovery, lowering cortisol for better mood and cognitive function. Done mid-day to recharge energy and combat afternoon slump.",
    "detailedScience": "NSDR, like yoga nidra, supports emotional regulation, stress reduction, and sleep improvement. It replenishes dopamine, decreases cortisol, and improves alertness and calm. Studies show it enhances performance, well-being, and reduces anxiety.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC11136748/",
      "https://positivepsychology.com/non-sleep-deep-rest-nsdr/",
      "https://www.hubermanlab.com/nsdr",
      "https://recognitionhealth.com/unlocking-the-power-of-non-sleep-deep-rest-what-it-is-and-why-it-matters/",
      "https://pubmed.ncbi.nlm.nih.gov/38953770/"
    ],
    "categoryKey": "mid-day"
  },
  {
    "id": "habit-019",
    "category": "Evening",
    "time": "Evening",
    "name": "Move/elevate heart rate after dinner (10-15 minutes)",
    "points": 10,
    "order": 19,
    "howTo": "Go for a 10-15 minute brisk walk after dinner, cycle, or jump rope.  Anything to get the heart rate higher.",
    "whyImportant": "Evening walks regulate glucose, aid digestion, and prevent spikes for better sleep, mood, and energy. Done after dinner to immediately impact postprandial glucose and promote relaxation.",
    "detailedScience": "Post-dinner walking reduces blood sugar spikes, with even 2 minutes helping control levels. Studies show exercise after meals improves glycemic response, with light walking moderating blood sugar and aiding digestion.",
    "links": [
      "https://pubmed.ncbi.nlm.nih.gov/36715875/",
      "https://www.ncbi.nlm.nih.gov/search/research-news/17034",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC10036272/",
      "https://www.nytimes.com/2022/08/04/well/move/walking-after-eating-blood-sugar.html",
      "https://health.clevelandclinic.org/walking-after-eating"
    ],
    "categoryKey": "evening"
  },
  {
    "id": "habit-020",
    "category": "Evening",
    "time": "Evening",
    "name": "Take an adaptogen - i.e ashwagandha",
    "points": 5,
    "order": 20,
    "howTo": "Take 300-600 mg of ashwagandha supplement with water in the evening.",
    "whyImportant": "Ashwagandha reduces stress and anxiety, improving sleep and mood by lowering cortisol. Taken in the evening to support relaxation and well-being for better energy and alertness.",
    "detailedScience": "Ashwagandha exhibits anti-stress and anti-anxiety effects, improving symptoms of depression and cognitive function. Studies show it lowers cortisol, enhances sleep quality, and moderates the HPA axis. It alleviates stress, anxiety, and improves memory, psychological well-being.",
    "links": [
      "https://pubmed.ncbi.nlm.nih.gov/34254920/",
      "https://pubmed.ncbi.nlm.nih.gov/23439798/",
      "https://pubmed.ncbi.nlm.nih.gov/37832082/",
      "https://pubmed.ncbi.nlm.nih.gov/31517876/",
      "https://pubmed.ncbi.nlm.nih.gov/34858513/"
    ],
    "categoryKey": "evening"
  },
  {
    "id": "habit-021",
    "category": "Late Evening",
    "time": "1-2 hours before bed",
    "name": "Avoid bright lights/blue lights before bed",
    "points": 10,
    "order": 21,
    "howTo": "Use blue light filters on devices, red light bulbs, or dim lights in the house and bathroom 1-2 hours before bed; wear blue-blocking glasses if needed.",
    "whyImportant": "Reducing bright/blue light preserves melatonin, improving sleep quality and reducing diabetes/heart risks. Done 1-2 hours before bed to align with circadian rhythms for better recovery, mood, energy, and alertness.",
    "detailedScience": "Blue light suppresses melatonin, delaying sleep and reducing quality. Studies show exposure to blue light (460 nm) suppresses melatonin, affecting circadian rhythms and performance. LE-eBooks reduce evening sleepiness and shift circadian timing. Blue light filters may improve sleep outcomes.",
    "links": [
      "https://pubmed.ncbi.nlm.nih.gov/36051910/",
      "https://pubmed.ncbi.nlm.nih.gov/38461462/",
      "https://pubmed.ncbi.nlm.nih.gov/30311830/",
      "https://pubmed.ncbi.nlm.nih.gov/29101797/",
      "https://pubmed.ncbi.nlm.nih.gov/25535358/"
    ],
    "categoryKey": "late-evening"
  },
  {
    "id": "habit-022",
    "category": "Late Evening",
    "time": "1 hour prior to bed",
    "name": "Take magnesium - bisglycinate",
    "points": 5,
    "order": 22,
    "howTo": "Take 200-400 mg of magnesium bisglycinate supplement with water 1 hour before bed.",
    "whyImportant": "Magnesium relaxes muscles and calms the nervous system, improving sleep efficiency and mood. Taken in the evening to aid wind-down, reducing insomnia and supporting GABA for better energy and alertness.",
    "detailedScience": "Magnesium supplementation improves subjective insomnia measures like sleep efficiency, time, and onset latency. It associates with better sleep quality, duration, and reduced snoring. Magnesium-L-threonate enhances deep/REM sleep, mood, energy, and productivity.",
    "links": [
      "https://pubmed.ncbi.nlm.nih.gov/23853635/",
      "https://pubmed.ncbi.nlm.nih.gov/35184264/",
      "https://pubmed.ncbi.nlm.nih.gov/39252819/"
    ],
    "categoryKey": "late-evening"
  },
  {
    "id": "habit-023",
    "category": "Late Evening",
    "time": "1 hour prior to bed",
    "name": "Drink chamomile tea in late evening",
    "points": 5,
    "order": 23,
    "howTo": "Brew chamomile tea with hot water and a tea bag or loose flowers, drink it warm about 1 hour before bed, optionally with honey for taste.",
    "whyImportant": "Chamomile promotes relaxation and reduces anxiety, leading to faster sleep onset and better quality rest. Taken 1 hour before bed to allow apigenin to bind GABA receptors, calming the nervous system for improved mood and energy.",
    "detailedScience": "Chamomile contains apigenin, which binds to GABA receptors, reducing anxiety and improving sleep. Studies show it enhances sleep quality, decreases depression, stress, and awakenings. Inhalation of lavender and chamomile essential oils also lowers depression, anxiety, and stress.",
    "links": [
      "https://pubmed.ncbi.nlm.nih.gov/31006899/",
      "https://pubmed.ncbi.nlm.nih.gov/33454232/"
    ],
    "categoryKey": "late-evening"
  },
  {
    "id": "habit-024",
    "category": "Bedtime",
    "time": "Bedtime",
    "name": "Reflect/journal on day - What good did I do?",
    "points": 5,
    "order": 24,
    "howTo": "Spend 5-10 minutes before bed writing in a journal about positive actions or good deeds from the day, focusing on gratitude and reflection.",
    "whyImportant": "Evening reflection processes emotions, reduces stress, enhances self-awareness, and boosts mood and gratitude, leading to better sleep quality. Done at bedtime to clear mental clutter and foster positive neural pathways for improved energy and alertness the next day.",
    "detailedScience": "Evening journaling promotes emotional processing and gratitude, improving mood, satisfaction with life, and sleep. Studies show gratitude interventions reduce stress, anxiety, and depression, enhancing well-being and sleep quality. Practicing gratitude lowers heart rate, blood pressure, and improves exercise habits. It acts as expressive writing, reducing stress and boosting mental health.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC9070006/",
      "https://childmind.org/blog/the-power-of-journaling/",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC1118581/",
      "https://www.uclahealth.org/news/article/health-benefits-gratitude",
      "https://criticaldebateshsgj.scholasticahq.com/article/141840"
    ],
    "categoryKey": "bedtime"
  },
  {
    "id": "habit-025",
    "category": "Bedtime",
    "time": "Bedtime",
    "name": "Ensure room is completely dark/cool",
    "points": 5,
    "order": 25,
    "howTo": "Make your bedroom pitch black by using blackout curtains, eye masks, or covering light sources; set the thermostat to 60-67°F (15-19°C) for a cool environment.",
    "whyImportant": "Darkness and cool temperatures boost melatonin production, improving sleep quality, reducing oxidative stress, and lowering risks of diabetes and heart disease. Done at bedtime to optimize recovery during sleep, leading to better mood, energy, and alertness the next day.",
    "detailedScience": "Darkness enhances melatonin secretion, which regulates sleep and has antioxidant properties, reducing oxidative stress and promoting health. Studies show that light exposure at night suppresses melatonin, increasing risks for metabolic disorders; cool environments decrease wakefulness and support deep sleep stages. Heat or cold exposure affects REM and slow-wave sleep, with room light suppressing melatonin by over 50%, causing hypoperfusion and fatigue. Melatonin combats oxidative stress and inflammation, restoring tissue function.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC3427038/",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC1114906/",
      "https://www.sciencedirect.com/science/article/abs/pii/S1095643313001037",
      "https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2017.00785/full",
      "https://onlinelibrary.wiley.com/doi/10.1111/jpi.12360"
    ],
    "categoryKey": "bedtime"
  },
  {
    "id": "habit-026",
    "category": "Bedtime",
    "time": "Bedtime",
    "name": "Place phone in RF blocker away from bed before sleep",
    "points": 5,
    "order": 26,
    "howTo": "Place your phone in an RF-blocking pouch or faraday bag and keep it at least 3 feet away from your bed or in another room before sleeping.  Check out www.TarheelBeef.com/dreamsafer for a quality RF phone cradle.",
    "whyImportant": "Reducing EMF exposure minimizes sleep disruptions, anxiety, and melatonin suppression, improving sleep quality and mood. Done at bedtime to prevent interference with natural sleep cycles, supporting better energy and alertness upon waking.",
    "detailedScience": "EMF from phones can suppress melatonin, increase stress hormones, and disrupt sleep. Studies show RF-EMF exposure reduces melatonin levels by 10-15%, increasing inflammation and anxiety. Grounding or reducing EMF improves sleep quality and normalizes cortisol and melatonin secretion. Long-term phone use has no direct effect on sleep quality in some studies, but arousal from blue light and EMFs delays sleep and affects well-being.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC9608227/",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC1111718/",
      "https://ehjournal.biomedcentral.com/articles/10.1186/s12940-022-00882-8",
      "https://jcsm.aasm.org/doi/10.5664/jcsm.10392",
      "https://www.sciencedirect.com/science/article/pii/S2319417023000033"
    ],
    "categoryKey": "bedtime"
  },
  {
    "id": "habit-027",
    "category": "Bedtime",
    "time": "Bedtime",
    "name": "Finish night with silent prayer (Lord's Prayer) and gratitude",
    "points": 5,
    "order": 27,
    "howTo": "Recite the Lord's Prayer silently in your mind or softly out loud while lying in bed, focusing on the words and their meaning to promote a sense of peace and closure for the day.",
    "whyImportant": "Silent prayer helps reduce stress and anxiety, fostering a positive mood and better sleep quality by clearing mental clutter before rest. Performed at bedtime, it aids in winding down, aligning with the body's natural transition to sleep, enhancing emotional processing and gratitude for improved energy the next day.",
    "detailedScience": "Prayer acts as a form of mindfulness meditation, which research shows can improve sleep quality by reducing insomnia symptoms and promoting relaxation. Studies indicate that mindfulness practices decrease stress levels, lower blood pressure, and enhance calmness, potentially through emotional regulation and awareness of the present moment. Preliminary findings suggest effectiveness in treating sleep disturbances, with benefits for overall mental health.",
    "links": [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC6557693/",
      "https://www.health.harvard.edu/blog/mindfulness-meditation-helps-fight-insomnia-improves-sleep-201502187726",
      "https://www.megawecare.com/good-health-by-yourself/sleep-health/night-prayer-before-sleep",
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC11117174/",
      "https://www.aurahealth.io/blog/the-power-of-prayer-a-guide-to-praying-for-a-good-nights-sleep\""
    ],
    "categoryKey": "bedtime"
  }
];

export const CATEGORIES = [
  { key: "wake-up", label: "Wake-Up", emoji: "🌅", description: "At wake up" },
  { key: "morning", label: "Morning", emoji: "☀️", description: "0–2 hours after waking" },
  { key: "mid-morning", label: "Mid-Morning", emoji: "🌤️", description: "Mid-morning window" },
  { key: "mid-day", label: "Mid-Day", emoji: "🕛", description: "Midday protocols" },
  { key: "evening", label: "Evening", emoji: "🌆", description: "After dinner" },
  { key: "late-evening", label: "Late Evening", emoji: "🌙", description: "Wind-down" },
  { key: "bedtime", label: "Bedtime", emoji: "😴", description: "Before sleep" },
] as const;

export const MAX_DAILY_POINTS = HABITS.reduce((sum, h) => sum + h.points, 0);

export function getHabitById(id: string) {
  return HABITS.find((h) => h.id === id);
}

export function getHabitsByCategory(categoryKey: string) {
  return HABITS.filter((h) => h.categoryKey === categoryKey).sort((a, b) => a.order - b.order);
}
