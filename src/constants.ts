import { FirstAidProcedure } from "./types";

export const FIRST_AID_PROCEDURES: FirstAidProcedure[] = [
  {
    id: "bleeding",
    title: "Bleeding",
    steps: [
      { text: "Stay calm and wear gloves if available." },
      { text: "Apply direct pressure using clean cloth or bandage." },
      { text: "Raise injured area above heart level if possible." },
      { text: "Do not remove soaked bandages, add another layer." },
      { text: "Call emergency services if bleeding continues." },
    ],
    tips: [
      "Use sterile dressings if available.",
      "Calm the victim to lower heart rate."
    ],
    warnings: [
      "Do not remove embedded objects.",
      "Do not apply a tourniquet unless trained."
    ]
  },
  {
    id: "burns",
    title: "Burns",
    steps: [
      { text: "Move away from heat source." },
      { text: "Cool burn under running water for 20 minutes." },
      { text: "Remove tight jewelry carefully." },
      { text: "Cover with sterile non-stick dressing." },
      { text: "Do not apply ice, butter, or toothpaste." },
    ],
    tips: [
      "Use lukewarm water, not freezing cold.",
      "Keep the person warm elsewhere to prevent shock."
    ],
    warnings: [
      "No ice: it can damage tissue.",
      "No ointments or home remedies on fresh burns."
    ]
  },
  {
    id: "fractures",
    title: "Fractures",
    steps: [
      { text: "Do not move injured area." },
      { text: "Support area using splint." },
      { text: "Apply ice wrapped in cloth." },
      { text: "Keep person comfortable." },
      { text: "Seek immediate medical help." },
    ],
    tips: [
      "Immobilize the joints above and below the break.",
      "Check for pulse below the injury site."
    ],
    warnings: [
      "Don't try to realign the bone.",
      "Don't give the person anything to eat or drink in case surgery is needed."
    ]
  },
  {
    id: "cpr",
    title: "CPR",
    steps: [
      { text: "Check responsiveness." },
      { text: "Call emergency services." },
      { text: "Place hands in center of chest." },
      { text: "Push hard and fast, 100 to 120 compressions per minute." },
      { text: "Continue until help arrives." },
    ],
    tips: [
      "Push down at least 2 inches.",
      "Allow the chest to recoil completely between compressions."
    ],
    warnings: [
      "Avoid pauses in compressions.",
      "Only perform rescue breaths if you are trained and comfortable."
    ]
  },
  {
    id: "choking",
    title: "Choking",
    steps: [
      { text: "Ask if person can speak." },
      { text: "Give 5 back blows." },
      { text: "Give 5 abdominal thrusts." },
      { text: "Repeat until object comes out." },
      { text: "Call emergency services if unconscious." },
    ],
    tips: [
      "Stand behind the person for thrusts.",
      "If the person is pregnant or large, perform chest thrusts instead."
    ],
    warnings: [
      "Don't perform a blind finger sweep.",
      "Don't give water or food to a choking person."
    ]
  },
  {
    id: "snake-bite",
    title: "Snake Bite",
    steps: [
      { text: "Keep victim calm." },
      { text: "Keep bitten area below heart level." },
      { text: "Remove rings or tight items." },
      { text: "Do not cut, suck, or apply ice." },
      { text: "Seek urgent medical treatment." },
    ],
    tips: [
      "Try to remember the color and shape of the snake.",
      "Restrict movement of the limb."
    ],
    warnings: [
      "No alcohol or caffeine.",
      "Do not try to catch the snake."
    ]
  }
];
