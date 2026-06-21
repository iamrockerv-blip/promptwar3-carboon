// src/components/quiz/questions.ts

export interface QuizOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  category: 'transport' | 'diet' | 'energy' | 'travel' | 'consumption';
  text: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'transport',
    text: 'How do you get around most days?',
    options: [
      {
        value: 'car_petrol',
        label: 'Petrol/Diesel Car',
        description: 'Standard combustion engine commute',
        icon: '🚗'
      },
      {
        value: 'car_electric',
        label: 'Electric Car',
        description: 'Clean vehicle run on grid/solar mix',
        icon: '🔌'
      },
      {
        value: 'public_transit',
        label: 'Public Transit',
        description: 'Subways, trains, or city buses',
        icon: '🚌'
      },
      {
        value: 'bike_walk',
        label: 'Walk or Cycle',
        description: 'Human-powered, active commuting',
        icon: '🚲'
      },
      {
        value: 'remote',
        label: 'No Commute / Remote',
        description: 'Work from home or stay local',
        icon: '🏠'
      }
    ]
  },
  {
    id: 'q2',
    category: 'diet',
    text: 'What does your daily plate look like?',
    options: [
      {
        value: 'meat_lover',
        label: 'Meat Lover',
        description: 'Fresh beef, pork, or poultry with most meals',
        icon: '🥩'
      },
      {
        value: 'meat_regular',
        label: 'Regular Meat Eater',
        description: 'Average mix of meat, fish, and greens',
        icon: '🍖'
      },
      {
        value: 'flexitarian',
        label: 'Flexitarian',
        description: 'Mostly plant-based, occasional meat consumption',
        icon: '🥗'
      },
      {
        value: 'pescatarian',
        label: 'Pescatarian',
        description: 'Vegetables, dairy, eggs, and seafood',
        icon: '🐟'
      },
      {
        value: 'vegetarian',
        label: 'Vegetarian',
        description: 'No meat or fish; includes eggs and dairy',
        icon: '🥬'
      },
      {
        value: 'vegan',
        label: 'Vegan',
        description: '100% plant-based food items only',
        icon: '🌱'
      }
    ]
  },
  {
    id: 'q3',
    category: 'energy',
    text: 'How is your household powered and heated?',
    options: [
      {
        value: 'grid_gas',
        label: 'Grid Electricity & Gas',
        description: 'Standard utilities, fossil fuel heavy',
        icon: '⚡'
      },
      {
        value: 'solar_mix',
        label: 'Renewable / Solar Mix',
        description: 'Partially or fully offset by clean energy',
        icon: '☀️'
      },
      {
        value: 'oil_wood',
        label: 'Oil or Wood Pellets',
        description: 'High carbon density individual heating systems',
        icon: '🔥'
      },
      {
        value: 'shared_low',
        label: 'Shared / Low Energy',
        description: 'Apartments or highly efficient passive builds',
        icon: '🏢'
      }
    ]
  },
  {
    id: 'q4',
    category: 'travel',
    text: 'How often do you fly annually?',
    options: [
      {
        value: 'never',
        label: 'Never Fly',
        description: 'Leisure staycations or rail-based trips',
        icon: '✈️'
      },
      {
        value: 'flights_1_2',
        label: '1 to 2 Flights',
        description: 'Short-haul business or annual vacations',
        icon: '🛫'
      },
      {
        value: 'flights_3_5',
        label: '3 to 5 Flights',
        description: 'Frequent domestic or multiple long-hauls',
        icon: '✈️✈️'
      },
      {
        value: 'flights_6_plus',
        label: '6+ Flights',
        description: 'Highly frequent transcontinental flyer',
        icon: '🌍'
      }
    ]
  },
  {
    id: 'q5',
    category: 'consumption',
    text: 'How would you describe your shopping habits?',
    options: [
      {
        value: 'minimalist',
        label: 'Minimalist',
        description: 'Only buy essentials, prefer pre-loved and repairing',
        icon: '🛍️'
      },
      {
        value: 'average',
        label: 'Average Shopper',
        description: 'Occasional clothing, updates electronics when needed',
        icon: '🛒'
      },
      {
        value: 'frequent',
        label: 'Frequent Buyer',
        description: 'Constant online packages, fast fashion explorer',
        icon: '📦'
      },
      {
        value: 'luxury',
        label: 'High Consumer / Luxury',
        description: 'Enjoy regular retail therapy and latest gadgets',
        icon: '🤑'
      }
    ]
  }
];
