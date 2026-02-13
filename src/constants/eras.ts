import { Era } from '../types';

// Static era definitions - these seed the Firestore eras collection
export const ERA_DEFINITIONS: Omit<Era, 'totalLessons'>[] = [
  {
    id: 'ancient-egypt',
    name: 'Ancient Egypt',
    description: 'Explore the land of pharaohs, pyramids, and the mighty Nile. Discover one of the oldest civilizations in human history.',
    iconUrl: 'pyramid',
    color: '#F39C12',
    order: 1,
    requiredXpToUnlock: 0,
    subcategories: ['Pharaohs', 'Pyramids & Architecture', 'Daily Life', 'Religion & Mythology'],
  },
  {
    id: 'ancient-greece',
    name: 'Ancient Greece',
    description: 'From Athenian democracy to Spartan warriors, uncover the ideas and battles that shaped Western civilization.',
    iconUrl: 'temple',
    color: '#3498DB',
    order: 2,
    requiredXpToUnlock: 500,
    subcategories: ['Democracy & Politics', 'Philosophy', 'Mythology', 'Wars & Battles'],
  },
  {
    id: 'ancient-rome',
    name: 'Ancient Rome',
    description: 'Rise and fall of the greatest empire. From the Republic to the Empire, explore Rome\'s lasting legacy.',
    iconUrl: 'colosseum',
    color: '#C0392B',
    order: 3,
    requiredXpToUnlock: 1500,
    subcategories: ['Republic', 'Empire', 'Daily Life', 'Military'],
  },
  {
    id: 'medieval-europe',
    name: 'Medieval Europe',
    description: 'Knights, castles, and the Black Death. Dive into the Middle Ages and its transformative events.',
    iconUrl: 'castle',
    color: '#8E44AD',
    order: 4,
    requiredXpToUnlock: 3000,
    subcategories: ['Feudalism', 'Crusades', 'Black Death', 'Culture & Religion'],
  },
  {
    id: 'renaissance',
    name: 'The Renaissance',
    description: 'Art, science, and rebirth. Discover how Europe emerged from the Middle Ages into a new era of creativity.',
    iconUrl: 'palette',
    color: '#27AE60',
    order: 5,
    requiredXpToUnlock: 5000,
    subcategories: ['Art & Artists', 'Scientific Revolution', 'Exploration', 'Politics & Power'],
  },
  {
    id: 'wwii',
    name: 'World War II',
    description: 'The conflict that shaped the modern world. Understand the causes, key battles, and aftermath of WWII.',
    iconUrl: 'globe',
    color: '#2C3E50',
    order: 6,
    requiredXpToUnlock: 8000,
    subcategories: ['Causes', 'Major Battles', 'Home Front', 'Aftermath & Legacy'],
  },
];

// Helper to get era by ID
export function getEraById(id: string): Omit<Era, 'totalLessons'> | undefined {
  return ERA_DEFINITIONS.find(era => era.id === id);
}

// Helper to get eras in order
export function getErasInOrder(): Omit<Era, 'totalLessons'>[] {
  return [...ERA_DEFINITIONS].sort((a, b) => a.order - b.order);
}

// All available interest/topic tags
export const INTEREST_TAGS = [
  'Military & Battles',
  'Culture & Society',
  'Politics & Government',
  'Science & Technology',
  'Art & Architecture',
  'Religion & Philosophy',
  'Economics & Trade',
  'Daily Life',
] as const;

export type InterestTag = typeof INTEREST_TAGS[number];
