import React, { useEffect } from 'react';
import { X, Star, Award, Zap, Gamepad2, BookOpen, Lock, CheckCircle2, Volume2 } from 'lucide-react';
import { ChildProfile, Badge } from '../types';
import { ALL_BADGES } from '../utils/storage';
import { LuluAvatar } from './LuluAvatar';
import { speakText, stopSpeech, playPopSound } from '../utils/audio';
import { formatStarsSpeech, formatBadgesSpeech, numberToOrdinalArabic } from '../utils/arabicNumbers';

interface ChildProgressModalProps {
  isOpen: boolean;
  profile: ChildProfile;
  onClose: () => void;
}

export const ChildProgressModal: React.FC<ChildProgressModalProps> = ({
  isOpen,
  profile,
  onClose,
}) => {
  const getSummarySpeech = () => {
    return `أهلًا يا ${profile.name || 'بطلة'}! دي شاشتكِ الخاصة! رصيدكِ الآن: ${formatStarsSpeech(
      profile.stars
    )}، ولديكِ ${formatBadgesSpeech(
      profile.unlockedBadges.length
    )}، وأنتِ في المستوى ${numberToOrdinalArabic(profile.level)}!`;
  };

  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      return;
    }

    const timer = setTimeout(() => {
      speakText(getSummarySpeech(), profile.audioSettings);
    }, 300);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [isOpen, profile.stars, profile.level, profile.unlockedBadges.length]);

  if (!isOpen) return null;

  const handleRepeatProgressVoice = () => {
    playPopSound(profile.audioSettings.soundEffects);
    speakText(getSummarySpeech(), profile.audioSettings);
  };

  const handleBadgeClick = (badge: Badge, isUnlocked: boolean) => {
    playPopSound(profile.audioSettings.soundEffects);
    const statusText = isUnlocked ? 'شارة مفتوحة' : 'شارة مقفلة، اكملي التحديات لفتحها';
    const speech = `شارة: ${badge.title}. ${badge.description}. ${statusText}.`;
    speakText(speech, profile.audioSettings);
  };

  // XP Progress towards next level
  const currentLevelBaseXP = (profile.level - 1) * 50;
  const xpInCurrentLevel = profile.xp - currentLevelBaseXP;
  const levelProgressPct = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / 50) * 100)));

  return (
    <div
      id="child-progress-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none overflow-y-auto"
    >
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl border-3 border-amber-300 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-amber-950 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LuluAvatar size="sm" mood="happy" animate={false} />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white drop-shadow-xs">
                  إنجازات وتقدم البطلة {profile.name} 🌟
                </h3>
                <button
                  id="btn-speak-child-progress"
                  type="button"
                  onClick={handleRepeatProgressVoice}
                  className="p-1 bg-white/80 hover:bg-white text-amber-800 rounded-full border border-amber-300 shadow-2xs active:scale-95 transition-transform cursor-pointer"
                  title="استمعي إلى ملخص تقدمكِ"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-amber-100 font-bold">
                المستوى الحالي: المستوى {profile.level}
              </p>
            </div>
          </div>
          <button
            id="btn-close-progress-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Level Progress Bar */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <div className="flex justify-between items-center text-xs font-black text-amber-900 mb-1.5">
              <span>المستوى {profile.level}</span>
              <span>
                {xpInCurrentLevel} / 50 XP للمستوى {profile.level + 1}
              </span>
            </div>
            <div className="w-full h-3 bg-amber-200/70 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
          </div>

          {/* Real Metrics Cards Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 text-center">
              <span className="text-2xl">⭐</span>
              <div className="text-xl font-black text-yellow-900 mt-1">
                {profile.stars}
              </div>
              <span className="text-[11px] font-bold text-yellow-700">النجوم</span>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-center">
              <span className="text-2xl">✨</span>
              <div className="text-xl font-black text-purple-900 mt-1">
                {profile.xp}
              </div>
              <span className="text-[11px] font-bold text-purple-700">XP</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center">
              <span className="text-2xl">🏅</span>
              <div className="text-xl font-black text-rose-900 mt-1">
                {profile.unlockedBadges.length}
              </div>
              <span className="text-[11px] font-bold text-rose-700">الشارات</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
              <span className="text-2xl">🎮</span>
              <div className="text-xl font-black text-emerald-900 mt-1">
                {profile.completedGames}
              </div>
              <span className="text-[11px] font-bold text-emerald-700">ألعاب مكتملة</span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center">
              <span className="text-2xl">📚</span>
              <div className="text-xl font-black text-blue-900 mt-1">
                {profile.completedLessons}
              </div>
              <span className="text-[11px] font-bold text-blue-700">دروس مكتملة</span>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-center">
              <span className="text-2xl">🎯</span>
              <div className="text-xl font-black text-teal-900 mt-1">
                {profile.correctAnswers}
              </div>
              <span className="text-[11px] font-bold text-teal-700">إجابات صحيحة</span>
            </div>
          </div>

          {/* Badges Section */}
          <div>
            <h4 className="text-base font-black text-slate-800 mb-2.5 flex items-center gap-1.5">
              <span>شاراتي وأوسمتي 🏅</span>
              <span className="text-xs text-slate-500 font-bold">
                ({profile.unlockedBadges.length} من {ALL_BADGES.length})
              </span>
            </h4>

            <div className="grid grid-cols-2 gap-2.5">
              {ALL_BADGES.map((badge) => {
                const isUnlocked = profile.unlockedBadges.includes(badge.id);

                return (
                  <button
                    key={badge.id}
                    type="button"
                    onClick={() => handleBadgeClick(badge, isUnlocked)}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 text-right transition-all cursor-pointer active:scale-95 ${
                      isUnlocked
                        ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-500 opacity-75'
                    }`}
                    title="اضغطي للاستماع لتفاصيل الشارة"
                  >
                    <div className="text-2xl sm:text-3xl shrink-0">
                      {isUnlocked ? badge.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs sm:text-sm font-black truncate">
                        {badge.title}
                      </h5>
                      <p className="text-[10px] sm:text-[11px] line-clamp-2 mt-0.5 leading-snug text-slate-600">
                        {badge.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
