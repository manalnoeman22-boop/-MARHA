export type WorldType = 'letters' | 'numbers' | 'reading' | 'thinking';

export interface Option {
  id: string;
  label: string;
  speechLabel?: string;
  imageOrEmoji?: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  world: WorldType;
  topic: string;
  type: 
    | 'multiple_choice' 
    | 'image_choice' 
    | 'listen_choice' 
    | 'find_letter' 
    | 'count_objects' 
    | 'addition'
    | 'subtraction'
    | 'compare' 
    | 'pattern' 
    | 'word_match' 
    | 'odd_one_out';
  visibleText: string;
  speechText: string;
  hint?: string;
  options: Option[];
  correctAnswer: string;
  explanation: string;
  visualItems?: { emoji: string; count: number; count2?: number; op?: '+' | '-' };
}

export interface ActivityLog {
  id: string;
  world: WorldType;
  worldName: string;
  timestamp: string;
  questionsTotal: number;
  correctCount: number;
  starsEarned: number;
  xpEarned: number;
}

export interface AudioSettings {
  enabled: boolean;
  rate: number; // 0.8, 1.0, 1.2
  volume: number; // 0.0 to 1.0
  soundEffects: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'general' | 'letters' | 'numbers' | 'streak';
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ChildProfile {
  name: string;
  createdAt: string;
  stars: number;
  xp: number;
  level: number;
  completedGames: number;
  completedLessons: number;
  correctAnswers: number;
  errorsCount: number;
  streak: number;
  unlockedBadges: string[];
  activities: ActivityLog[];
  audioSettings: AudioSettings;
}
