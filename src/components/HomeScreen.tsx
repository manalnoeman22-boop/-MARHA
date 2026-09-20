import React, { useEffect } from 'react';
import { Volume2, Play, BookOpen, Calculator, Sparkles, Brain, Award, Star } from 'lucide-react';
import { ChildProfile, WorldType } from '../types';
import { LuluAvatar } from './LuluAvatar';
import { speakText, playPopSound } from '../utils/audio';

interface HomeScreenProps {
  profile: ChildProfile;
  onSelectWorld: (world: WorldType) => void;
  onOpenReadingPractice: () => void;
  onOpenProgress: () => void;
}

interface WorldCardConfig {
  id: WorldType;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  speechIntro: string;
  description: string;
}

const WORLDS: WorldCardConfig[] = [
  {
    id: 'letters',
    title: 'جزيرة الحروف',
    subtitle: 'أصوات الحروف، الكلمات، والمدود',
    badge: '🔤 حروفنا الحلوة',
    icon: '🏝️',
    bgGradient: 'from-amber-100 via-orange-50 to-amber-200/60',
    borderColor: 'border-amber-400',
    accentColor: 'bg-amber-500 hover:bg-amber-600 text-white',
    speechIntro: 'جزيرة الحروف. هنا هنتعلم الحروف ونلعب ألعاب جميلة.',
    description: 'تعرفي على أصوات الحروف والحركات والمدود بطريقة ممتعة.',
  },
  {
    id: 'numbers',
    title: 'مدينة الأرقام',
    subtitle: 'العد، الجمع، الطرح، والمقارنة',
    badge: '🔢 أرقام ورياضيات',
    icon: '🏙️',
    bgGradient: 'from-sky-100 via-cyan-50 to-blue-200/60',
    borderColor: 'border-sky-400',
    accentColor: 'bg-sky-500 hover:bg-sky-600 text-white',
    speechIntro: 'مدينة الأرقام. هنا هنتعلم الأرقام والحساب.',
    description: 'عدّي العناصر، اجمعي واطرحي، وقارني بين الأرقام كالعلماء الصغار.',
  },
  {
    id: 'reading',
    title: 'غابة القراءة',
    subtitle: 'الكلمات، المقاطع، والجمل السهلة',
    badge: '📖 قراءة ذكية',
    icon: '🌳',
    bgGradient: 'from-emerald-100 via-teal-50 to-emerald-200/60',
    borderColor: 'border-emerald-400',
    accentColor: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    speechIntro: 'غابة القراءة. هنا هنتعلم القراءة والكلمات.',
    description: 'اقرئي الكلمات البسيطة واكتشفي معانيها وطابقيها مع الصور الجميلة.',
  },
  {
    id: 'thinking',
    title: 'مملكة التفكير',
    subtitle: 'الأنماط، المطابقة، وتحديات الذكاء',
    badge: '🧠 ألغاز وذكاء',
    icon: '🏰',
    bgGradient: 'from-purple-100 via-pink-50 to-purple-200/60',
    borderColor: 'border-purple-400',
    accentColor: 'bg-purple-500 hover:bg-purple-600 text-white',
    speechIntro: 'مملكة التفكير. هنا هنحل ألغاز ونمرن عقلنا.',
    description: 'أكملي الأنماط واكتشفي العنصر المختلف وحلي الألغاز المبتكرة.',
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  onSelectWorld,
  onOpenReadingPractice,
  onOpenProgress,
}) => {
  const welcomeSpeech = `أهلًا يا ${profile.name || 'بطلة'}! دي الصفحة الرئيسية. اختاري العالم اللي حابة تدخليه.`;

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(welcomeSpeech, profile.audioSettings);
    }, 350);

    return () => clearTimeout(timer);
  }, [profile.name, profile.audioSettings]);

  const handleRepeatWelcome = () => {
    playPopSound(profile.audioSettings.soundEffects);
    speakText(welcomeSpeech, profile.audioSettings);
  };

  const handleWorldHoverOrTap = (world: WorldCardConfig) => {
    speakText(world.speechIntro, profile.audioSettings);
  };

  return (
    <div id="home-screen" className="max-w-4xl mx-auto px-4 py-4 space-y-5 select-none pb-16">
      {/* Welcome Banner with Lulu */}
      <div className="relative bg-gradient-to-r from-amber-200 via-orange-100 to-amber-100 rounded-3xl p-4 sm:p-5 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
        <div className="flex items-center gap-3">
          <LuluAvatar size="md" mood="happy" animate={true} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
                أهلًا يا {profile.name || 'بطلتنا'}! 👋🏻
              </h2>
              <button
                id="btn-repeat-welcome-voice"
                type="button"
                onClick={handleRepeatWelcome}
                className="p-1 bg-white/80 hover:bg-white text-amber-700 rounded-full border border-amber-300 shadow-2xs transition-transform active:scale-90"
                title="إعادة نطق الترحيب"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-amber-800 text-sm sm:text-base font-medium mt-0.5">
              مستعدة لمغامرة جديدة اليوم؟ نلعب • نتعلم • ونقول: فهمتها! 💡
            </p>
          </div>
        </div>

        {/* Quick progress badges shortcut */}
        <button
          id="btn-view-profile-hero"
          type="button"
          onClick={onOpenProgress}
          className="flex items-center gap-2 bg-white/90 hover:bg-white text-amber-900 px-3 py-2 rounded-2xl border border-amber-300 shadow-2xs text-xs font-bold transition-transform active:scale-95 cursor-pointer"
        >
          <div className="flex items-center text-yellow-600 font-black">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500 mr-1" />
            <span>{profile.stars} نجمة</span>
          </div>
          <span className="text-amber-300">|</span>
          <div className="flex items-center text-rose-600 font-black">
            <Award className="w-4 h-4 text-rose-500 mr-1" />
            <span>{profile.unlockedBadges.length} شارات</span>
          </div>
        </button>
      </div>

      {/* Reading Exploratory Practice Shortcut */}
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🗣️</span>
          <div>
            <h4 className="text-sm sm:text-base font-black text-emerald-950">
              استكشاف ونطق الكلمات بالصوت
            </h4>
            <p className="text-xs text-emerald-800">
              اضغطي على أي كلمة لسماع نطقها حرفاً بحرف!
            </p>
          </div>
        </div>
        <button
          id="btn-open-reading-practice"
          type="button"
          onClick={onOpenReadingPractice}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black px-3.5 py-2 rounded-xl shadow-xs transition-transform active:scale-95 shrink-0"
        >
          تدرّبي الآن 📖
        </button>
      </div>

      {/* 4 Interactive Worlds Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <span>عَوَالِـمُ مَرْحَة التعليمية</span>
            <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
          </h3>
          <span className="text-xs text-slate-500 font-bold">اختاري عالماً وابدئي اللعب! 🚀</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {WORLDS.map((w) => (
            <div
              key={w.id}
              id={`card-world-${w.id}`}
              className={`relative bg-gradient-to-br ${w.bgGradient} border-2 ${w.borderColor} rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group`}
            >
              {/* World Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black bg-white/90 text-slate-800 px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                    {w.badge}
                  </span>
                  <button
                    id={`btn-hear-intro-${w.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWorldHoverOrTap(w);
                    }}
                    className="p-1.5 bg-white/80 hover:bg-white text-slate-700 rounded-full border border-slate-300 shadow-2xs active:scale-90"
                    title="استمعي إلى وصف هذا العالم"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">
                    {w.icon}
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                      {w.title}
                    </h4>
                    <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                      {w.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                  {w.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2 border-t border-black/5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  8 أسئلة ممتعة 🎯
                </span>
                <button
                  id={`btn-enter-world-${w.id}`}
                  type="button"
                  onClick={() => {
                    playPopSound(profile.audioSettings.soundEffects);
                    onSelectWorld(w.id);
                  }}
                  className={`flex items-center gap-1.5 text-sm font-black px-4 py-2.5 rounded-2xl shadow-sm transition-transform active:scale-95 cursor-pointer ${w.accentColor}`}
                >
                  <span>ادخلي العالم</span>
                  <Play className="w-4 h-4 fill-current" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
