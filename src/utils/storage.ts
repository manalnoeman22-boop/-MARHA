import { ChildProfile, Badge } from '../types';

const STORAGE_KEY = 'marha_child_profile_v1';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_game',
    title: 'أول لعبة',
    description: 'أكملتِ أول جولة ألعاب بنجاح!',
    icon: '🌟',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'five_correct',
    title: 'نجمة الذكاء',
    description: 'أجبتِ عن 5 أسئلة بشكل صحيح!',
    icon: '🎯',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'streak_3',
    title: 'سلسلة انتصارات',
    description: '3 إجابات صحيحة متتالية!',
    icon: '🔥',
    category: 'streak',
    unlocked: false,
  },
  {
    id: 'letters_champion',
    title: 'أميرة الحروف',
    description: 'أكملتِ مغامرة في جزيرة الحروف!',
    icon: '🔤',
    category: 'letters',
    unlocked: false,
  },
  {
    id: 'math_genius',
    title: 'عبقرية الأرقام',
    description: 'أكملتِ مغامرة في مدينة الأرقام!',
    icon: '🔢',
    category: 'numbers',
    unlocked: false,
  },
  {
    id: 'reading_explorer',
    title: 'بطلة القراءة',
    description: 'قرأتِ واستكشفتِ غابة القراءة!',
    icon: '📖',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'thinking_master',
    title: 'تاج التفكير',
    description: 'أبدعتِ في حل ألغاز مملكة التفكير!',
    icon: '🧠',
    category: 'general',
    unlocked: false,
  },
  {
    id: 'level_2_hero',
    title: 'بطلة المستوى الثاني',
    description: 'وصلتِ للمستوى الثاني بإصرارك وذكائك!',
    icon: '👑',
    category: 'general',
    unlocked: false,
  },
];

export function getInitialProfile(name = ''): ChildProfile {
  return {
    name,
    createdAt: new Date().toISOString(),
    stars: 0,
    xp: 0,
    level: 1,
    completedGames: 0,
    completedLessons: 0,
    correctAnswers: 0,
    errorsCount: 0,
    streak: 0,
    unlockedBadges: [],
    activities: [],
    audioSettings: {
      enabled: true,
      rate: 0.95,
      volume: 1.0,
      soundEffects: true,
    },
  };
}

export function loadProfile(): ChildProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string') {
      return parsed as ChildProfile;
    }
  } catch (err) {
    console.error('Failed to load profile:', err);
  }
  return null;
}

export function saveProfile(profile: ChildProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile:', err);
  }
}

export function clearProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear profile:', err);
  }
}

/**
 * Check and unlock any new badges based on actual progress
 */
export function checkBadgeUnlocks(profile: ChildProfile): { updatedProfile: ChildProfile; newlyUnlocked: Badge[] } {
  const newlyUnlocked: Badge[] = [];
  const currentBadges = new Set(profile.unlockedBadges);

  ALL_BADGES.forEach(badge => {
    if (!currentBadges.has(badge.id)) {
      let shouldUnlock = false;
      if (badge.id === 'first_game' && profile.completedGames >= 1) shouldUnlock = true;
      if (badge.id === 'five_correct' && profile.correctAnswers >= 5) shouldUnlock = true;
      if (badge.id === 'streak_3' && profile.streak >= 3) shouldUnlock = true;
      if (badge.id === 'level_2_hero' && profile.level >= 2) shouldUnlock = true;
      if (badge.id === 'letters_champion' && profile.activities.some(a => a.world === 'letters')) shouldUnlock = true;
      if (badge.id === 'math_genius' && profile.activities.some(a => a.world === 'numbers')) shouldUnlock = true;
      if (badge.id === 'reading_explorer' && profile.activities.some(a => a.world === 'reading')) shouldUnlock = true;
      if (badge.id === 'thinking_master' && profile.activities.some(a => a.world === 'thinking')) shouldUnlock = true;

      if (shouldUnlock) {
        currentBadges.add(badge.id);
        newlyUnlocked.push({ ...badge, unlocked: true, unlockedAt: new Date().toISOString() });
      }
    }
  });

  // Calculate Level based on XP: 50 XP per level
  const computedLevel = Math.max(1, Math.floor(profile.xp / 50) + 1);

  const updatedProfile: ChildProfile = {
    ...profile,
    level: computedLevel,
    unlockedBadges: Array.from(currentBadges),
  };

  saveProfile(updatedProfile);
  return { updatedProfile, newlyUnlocked };
}
