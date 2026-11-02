export type GameScreen = 
  | 'home' 
  | 'alphabet' 
  | 'numbers' 
  | 'shapes-colors' 
  | 'puzzle-mode';

export type AlphabetSubMode = 'explore' | 'find-letter' | 'match-shadow';
export type NumberSubMode = 'explore' | 'count-objects' | 'sequence-train';
export type ShapeColorSubMode = 'shape-match' | 'balloon-pop' | 'color-sort';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AlphabetItem {
  letter: string;
  word: string;
  phonics: string;
  emoji: string;
  color: string;
  shadowColor: string;
  exampleSentence: string;
  category: 'fruit' | 'animal' | 'toy' | 'nature' | 'vehicle';
}

export interface NumberItem {
  value: number;
  word: string;
  objectEmoji: string;
  color: string;
}

export interface ShapeItem {
  id: string;
  name: string;
  color: string;
  svgShape: 'circle' | 'square' | 'triangle' | 'rectangle' | 'star' | 'heart' | 'diamond' | 'oval' | 'pentagon' | 'hexagon';
  realWorldItems: {
    name: string;
    emoji: string;
    hint: string;
  }[];
}

export interface ColorItem {
  id: string;
  name: string;
  hex: string;
  textClass: string;
  bgClass: string;
  items: {
    name: string;
    emoji: string;
  }[];
}

export interface Trophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredStars: number;
  unlocked: boolean;
  category: 'alphabet' | 'number' | 'shape' | 'puzzle' | 'general';
}

export interface DailyQuest {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  rewardStars: number;
  icon: string;
}

export interface UserProgress {
  stars: number;
  alphabetCompleted: string[];
  numbersMastered: number[];
  shapesMastered: string[];
  puzzlesSolved: number;
  trophies: string[];
  dailyQuests: DailyQuest[];
  lastDailyDate: string;
}

export interface SoundSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  speechEnabled: boolean;
  speechRate: number; // 0.8 for slow, 1.0 for normal
}
