import React, { useEffect } from 'react';
import { Sparkles, Star, Volume2 } from 'lucide-react';
import { LuluAvatar } from './LuluAvatar';
import { speakText, stopSpeech, playPopSound } from '../utils/audio';
import { AudioSettings } from '../types';

interface SplashScreenProps {
  audioSettings?: AudioSettings;
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ audioSettings, onComplete }) => {
  const welcomeNarration = 'أهلًا بكِ في مَرْحَة! هيا نبدأ مغامرتنا!';

  useEffect(() => {
    // Speak welcome message
    const speechTimer = setTimeout(() => {
      speakText(welcomeNarration, audioSettings);
    }, 300);

    const autoTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(speechTimer);
      clearTimeout(autoTimer);
    };
  }, [audioSettings, onComplete]);

  const handleManualStart = () => {
    stopSpeech();
    onComplete();
  };

  const handleReplayVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound(audioSettings?.soundEffects);
    speakText(welcomeNarration, audioSettings);
  };

  return (
    <div
      id="splash-screen"
      onClick={handleManualStart}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-amber-200 via-orange-100 to-amber-50 px-4 select-none overflow-hidden cursor-pointer"
    >
      {/* Floating background educational stars and letters */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <span className="absolute top-12 left-10 text-3xl animate-float opacity-75">⭐️</span>
        <span className="absolute top-24 right-14 text-2xl animate-float opacity-70" style={{ animationDelay: '0.8s' }}>🔤</span>
        <span className="absolute bottom-28 left-16 text-3xl animate-float opacity-75" style={{ animationDelay: '1.2s' }}>🔢</span>
        <span className="absolute bottom-20 right-12 text-3xl animate-float opacity-80" style={{ animationDelay: '0.4s' }}>✨</span>
        <span className="absolute top-1/3 left-6 text-xl font-black text-amber-500/40 animate-pulse-gentle">أ ب ت</span>
        <span className="absolute top-1/2 right-8 text-xl font-black text-orange-500/40 animate-pulse-gentle">١ ٢ ٣</span>
      </div>

      {/* Center Box */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        {/* Lulu Avatar */}
        <div className="mb-4">
          <LuluAvatar size="xl" mood="waving" animate={true} />
        </div>

        {/* App Title */}
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-5xl font-black text-amber-900 tracking-tight drop-shadow-xs">
            مَرْحَة
          </h1>
          <span className="text-4xl animate-spin" style={{ animationDuration: '6s' }}>🌟</span>
        </div>

        {/* English Title & Slogan */}
        <p className="text-amber-700 font-bold text-sm tracking-widest uppercase mb-3">
          MARHA
        </p>

        <div className="bg-white/85 backdrop-blur-xs border border-amber-300 px-4 py-2 rounded-2xl shadow-xs text-amber-900 font-bold text-sm sm:text-base mb-4">
          نلعب • نتعلم • ونقول: فهمتها! 💡
        </div>

        {/* Buttons: Replay Voice & Skip to Enter */}
        <div className="flex items-center gap-2 mb-2">
          <button
            id="btn-replay-splash-audio"
            type="button"
            onClick={handleReplayVoice}
            className="flex items-center gap-1.5 bg-white hover:bg-amber-100 text-amber-900 text-xs font-black px-3 py-1.5 rounded-full border border-amber-300 shadow-2xs cursor-pointer transition-transform active:scale-95"
            title="إعادة الاستماع للصوت"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span>اسمعي تاني 🔊</span>
          </button>

          <button
            id="btn-skip-splash"
            type="button"
            onClick={handleManualStart}
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-2xs cursor-pointer transition-transform active:scale-95"
          >
            ابدئي المغامرة 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
