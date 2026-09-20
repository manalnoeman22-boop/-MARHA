import React from 'react';
import { Volume2, GraduationCap } from 'lucide-react';
import { speakText, playPopSound } from '../utils/audio';
import { AudioSettings } from '../types';

export const TEACHER_CREDIT_TEXT = 'إعداد المعلمة: منال عادل';

interface TeacherCreditProps {
  variant?: 'footer' | 'pill' | 'card' | 'inline';
  className?: string;
  showIcon?: boolean;
  showAudioButton?: boolean;
  audioSettings?: AudioSettings;
  id?: string;
}

export const TeacherCredit: React.FC<TeacherCreditProps> = ({
  variant = 'footer',
  className = '',
  showIcon = true,
  showAudioButton = true,
  audioSettings,
  id = 'teacher-credit',
}) => {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioSettings?.soundEffects) {
      playPopSound(true);
    }
    // Pronounce clearly in Arabic when requested by user
    speakText(TEACHER_CREDIT_TEXT, audioSettings);
  };

  if (variant === 'pill') {
    return (
      <button
        id={id}
        type="button"
        onClick={handleSpeak}
        className={`inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 hover:bg-amber-200/90 text-amber-900 border border-amber-300/80 rounded-full text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer select-none ${className}`}
        title="اضغطي للاستماع: إعداد المعلمة: منال عادل"
      >
        {showIcon && <GraduationCap className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
        <span className="font-bold text-amber-950">{TEACHER_CREDIT_TEXT}</span>
        {showAudioButton && (
          <Volume2 className="w-3 h-3 text-amber-600 shrink-0 hover:text-amber-800" />
        )}
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <div
        id={id}
        onClick={handleSpeak}
        className={`p-3 bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-100/60 border border-amber-200/90 rounded-2xl flex items-center justify-between gap-2 shadow-2xs hover:border-amber-300 transition-all cursor-pointer select-none ${className}`}
        title="اضغطي للاستماع: إعداد المعلمة: منال عادل"
      >
        <div className="flex items-center gap-2">
          {showIcon && (
            <div className="w-7 h-7 rounded-xl bg-amber-200/70 flex items-center justify-center text-amber-800 shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
          )}
          <span className="text-sm font-bold text-amber-950">
            {TEACHER_CREDIT_TEXT}
          </span>
        </div>
        {showAudioButton && (
          <button
            id={`${id}-audio-btn`}
            type="button"
            onClick={handleSpeak}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-amber-800 border border-amber-200 shadow-2xs transition-transform active:scale-90"
            title="الاستماع"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span
        id={id}
        onClick={handleSpeak}
        className={`inline-flex items-center gap-1 text-xs font-bold text-amber-900/90 hover:text-amber-950 cursor-pointer select-none transition-colors ${className}`}
        title="اضغطي للاستماع: إعداد المعلمة: منال عادل"
      >
        {showIcon && <GraduationCap className="w-3.5 h-3.5 text-amber-700 shrink-0" />}
        <span>{TEACHER_CREDIT_TEXT}</span>
        {showAudioButton && <Volume2 className="w-3 h-3 text-amber-600 shrink-0" />}
      </span>
    );
  }

  // Default: Footer style (Persistent, elegant, responsive)
  return (
    <footer
      id={id}
      className={`w-full py-2.5 px-4 mt-auto border-t border-amber-200/70 bg-white/90 backdrop-blur-xs text-center select-none ${className}`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
        <button
          id={`${id}-click-btn`}
          type="button"
          onClick={handleSpeak}
          className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full hover:bg-amber-100/60 text-slate-700 hover:text-amber-950 transition-all active:scale-95 cursor-pointer group"
          title="اضغطي للاستماع: إعداد المعلمة: منال عادل"
        >
          {showIcon && (
            <GraduationCap className="w-3.5 h-3.5 text-amber-600 group-hover:text-amber-800 shrink-0 transition-colors" />
          )}
          <span className="text-xs sm:text-sm font-bold tracking-normal text-slate-800 group-hover:text-amber-950">
            {TEACHER_CREDIT_TEXT}
          </span>
          {showAudioButton && (
            <span
              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100/80 group-hover:bg-amber-200 text-amber-700 transition-colors mr-0.5"
              title="استمعي"
            >
              <Volume2 className="w-3 h-3" />
            </span>
          )}
        </button>
      </div>
    </footer>
  );
};
