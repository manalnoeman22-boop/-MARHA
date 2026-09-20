import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Rocket } from 'lucide-react';
import { LuluAvatar } from './LuluAvatar';
import { speakText, playSuccessChime, playPopSound } from '../utils/audio';
import { AudioSettings } from '../types';

interface OnboardingScreenProps {
  audioSettings: AudioSettings;
  onSaveName: (name: string) => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  audioSettings,
  onSaveName,
}) => {
  const [name, setName] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');

  const promptSpeech = 'أهلًا يا بطلة! اكتبي اسمك عشان نبدأ مغامرتنا!';

  useEffect(() => {
    // Friendly auto speech on mount
    const timer = setTimeout(() => {
      speakText(promptSpeech, audioSettings);
    }, 400);

    return () => clearTimeout(timer);
  }, [audioSettings]);

  const handleRepeatVoice = () => {
    playPopSound(audioSettings.soundEffects);
    speakText(promptSpeech, audioSettings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    setIsSubmitting(true);
    playSuccessChime(audioSettings.soundEffects);

    const greetingVisible = `أهلًا يا ${cleanName}! سعيدة جدًا إنكِ هنا. يلا نبدأ! 🎉`;
    const greetingSpeech = `أهلًا يا ${cleanName}! سعيدة جدًا إنكِ هنا. يلا نبدأ!`;
    setWelcomeText(greetingVisible);

    speakText(greetingSpeech, audioSettings, () => {
      setTimeout(() => {
        onSaveName(cleanName);
      }, 500);
    });

    // Fallback in case speech finishes or cancelled
    setTimeout(() => {
      onSaveName(cleanName);
    }, 3000);
  };

  return (
    <div
      id="onboarding-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-100 via-yellow-50 to-orange-50 px-4 py-8 select-none"
    >
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-300 text-center relative overflow-hidden">
        {/* Top Decorative Stars */}
        <div className="flex justify-between items-center text-amber-400 mb-2">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <button
            id="btn-repeat-onboarding-voice"
            type="button"
            onClick={handleRepeatVoice}
            className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-300 shadow-2xs active:scale-95 transition-transform"
            title="إعادة نطق التعليمات"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>اسمعي تاني 🔊</span>
          </button>
        </div>

        {/* Lulu Mascot */}
        <div className="mb-4">
          <LuluAvatar size="lg" mood={isSubmitting ? 'celebrating' : 'happy'} />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-amber-900 mb-2">
          أهلًا يا بطلة! 🌟
        </h2>

        {/* Subtitle instructions */}
        <p className="text-slate-700 text-base sm:text-lg font-medium mb-6 leading-relaxed">
          اكتبي اسمكِ الجميل عشان نبدأ مغامرتنا في <span className="font-bold text-amber-600">مَرْحَة</span>! 🎨
        </p>

        {welcomeText ? (
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-emerald-800 font-black text-lg animate-star-pop">
            {welcomeText}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                id="input-child-name"
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: سارة، مريم، نورة..."
                maxLength={20}
                className="w-full text-center text-xl sm:text-2xl font-black text-amber-950 bg-amber-50/70 border-2 border-amber-400 rounded-2xl py-3 px-4 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-300/50 shadow-inner placeholder:text-amber-400/80"
              />
            </div>

            <button
              id="btn-start-adventure"
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className={`w-full flex items-center justify-center gap-2 text-xl font-black py-4 px-6 rounded-2xl shadow-lg transition-all transform active:scale-95 ${
                name.trim() && !isSubmitting
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white cursor-pointer shadow-orange-300/50'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>يلا نبدأ!</span>
              <Rocket className="w-6 h-6 animate-bounce" />
            </button>
          </form>
        )}

        {/* Friendly advice */}
        <div className="mt-5 text-xs text-amber-800/70">
          نلعب • نتعلم • ونقول: فهمتها! 💡
        </div>
      </div>
    </div>
  );
};
