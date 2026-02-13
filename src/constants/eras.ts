// ---------------------------------------------------------------------------
// Tiered history topic system: Category > Topic
// ---------------------------------------------------------------------------

export interface HistoryTopic {
  id: string;
  name: string;
  emoji: string;
}

export interface HistoryCategory {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  topics: HistoryTopic[];
}

export const HISTORY_CATEGORIES: HistoryCategory[] = [
  {
    id: 'ancient-civilizations',
    name: 'Ancient Civilizations',
    emoji: '🏛️',
    color: '#F39C12',
    description: 'The earliest great empires and cultures',
    topics: [
      { id: 'ancient-egypt', name: 'Ancient Egypt', emoji: '🔺' },
      { id: 'ancient-greece', name: 'Ancient Greece', emoji: '⚔️' },
      { id: 'ancient-rome', name: 'Ancient Rome', emoji: '🏟️' },
      { id: 'mesopotamia', name: 'Mesopotamia', emoji: '📜' },
      { id: 'indus-valley', name: 'Indus Valley', emoji: '🧱' },
      { id: 'ancient-china', name: 'Ancient China', emoji: '🐉' },
    ],
  },
  {
    id: 'european-history',
    name: 'European History',
    emoji: '🏰',
    color: '#8E44AD',
    description: 'From medieval kingdoms to modern nations',
    topics: [
      { id: 'victorian-england', name: 'Victorian England', emoji: '👑' },
      { id: 'french-revolution', name: 'French Revolution', emoji: '🇫🇷' },
      { id: 'medieval-europe', name: 'Medieval Europe', emoji: '🏰' },
      { id: 'renaissance-italy', name: 'Renaissance Italy', emoji: '🎨' },
      { id: 'german-empire', name: 'German Empire', emoji: '🦅' },
      { id: 'spanish-empire', name: 'Spanish Empire', emoji: '⛵' },
      { id: 'viking-age', name: 'Viking Age', emoji: '🪓' },
      { id: 'russian-empire', name: 'Russian Empire', emoji: '🪆' },
    ],
  },
  {
    id: 'asian-history',
    name: 'Asian History',
    emoji: '🏯',
    color: '#E74C3C',
    description: 'Dynasties, empires, and traditions of the East',
    topics: [
      { id: 'feudal-japan', name: 'Feudal Japan', emoji: '⛩️' },
      { id: 'imperial-china', name: 'Imperial China', emoji: '🏯' },
      { id: 'mughal-india', name: 'Mughal India', emoji: '🕌' },
      { id: 'ottoman-empire', name: 'Ottoman Empire', emoji: '🌙' },
      { id: 'korean-kingdoms', name: 'Korean Kingdoms', emoji: '🎎' },
      { id: 'southeast-asian-empires', name: 'Southeast Asian Empires', emoji: '🛕' },
    ],
  },
  {
    id: 'american-history',
    name: 'American History',
    emoji: '🗽',
    color: '#3498DB',
    description: 'From native civilizations to revolution and beyond',
    topics: [
      { id: 'native-american', name: 'Native American Civilizations', emoji: '🪶' },
      { id: 'colonial-america', name: 'Colonial America', emoji: '🚢' },
      { id: 'american-revolution', name: 'American Revolution', emoji: '🔔' },
      { id: 'civil-war', name: 'Civil War', emoji: '⚔️' },
      { id: 'wild-west', name: 'Wild West', emoji: '🤠' },
      { id: 'latin-american-independence', name: 'Latin American Independence', emoji: '🌎' },
    ],
  },
  {
    id: 'african-history',
    name: 'African History',
    emoji: '🌍',
    color: '#27AE60',
    description: 'Rich kingdoms, trade routes, and resilience',
    topics: [
      { id: 'ancient-kingdoms-africa', name: 'Ancient Kingdoms of Africa', emoji: '👑' },
      { id: 'egyptian-dynasties', name: 'Egyptian Dynasties', emoji: '🏺' },
      { id: 'zulu-empire', name: 'Zulu Empire', emoji: '🛡️' },
      { id: 'scramble-for-africa', name: 'Scramble for Africa', emoji: '🗺️' },
      { id: 'ethiopian-empire', name: 'Ethiopian Empire', emoji: '🦁' },
      { id: 'trans-saharan-trade', name: 'Trans-Saharan Trade', emoji: '🐪' },
    ],
  },
  {
    id: 'modern-world-history',
    name: 'Modern World History',
    emoji: '🌐',
    color: '#2C3E50',
    description: 'The conflicts and innovations that shaped today',
    topics: [
      { id: 'world-war-1', name: 'World War I', emoji: '💣' },
      { id: 'world-war-2', name: 'World War II', emoji: '✈️' },
      { id: 'cold-war', name: 'Cold War', emoji: '🧊' },
      { id: 'space-race', name: 'Space Race', emoji: '🚀' },
      { id: 'industrial-revolution', name: 'Industrial Revolution', emoji: '🏭' },
      { id: 'decolonization', name: 'Decolonization', emoji: '🕊️' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Flat list of all topics across all categories */
export function getAllTopics(): HistoryTopic[] {
  return HISTORY_CATEGORIES.flatMap((cat) => cat.topics);
}

/** Find a topic by its ID */
export function getTopicById(topicId: string): HistoryTopic | undefined {
  return getAllTopics().find((t) => t.id === topicId);
}

/** Find the parent category for a given topic ID */
export function getCategoryForTopic(topicId: string): HistoryCategory | undefined {
  return HISTORY_CATEGORIES.find((cat) => cat.topics.some((t) => t.id === topicId));
}

// All available interest/topic tags (kept for backward compat)
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
