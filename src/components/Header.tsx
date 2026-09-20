import React from 'react';
import { Volume2, VolumeX, Award, Star, Menu, Sparkles } from 'lucide-react';
import { ChildProfile } from '../types';
import { LuluAvatar } from './LuluAvatar';

interface HeaderProps {
  profile: ChildProfile;
  onOpenProgress: () => void;
  onOpenMama: () => void;
  onOpenSettings: () => void;
  onToggleSound: () => void;
  onHomeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenProgress,
  onOpenMama,
  onOpenSettings,
  onToggleSound,
  onHomeClick,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-amber-200/80 px-3 py-2 shadow-xs transition-all"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Child Profile Pill (Name & Avatar) */}
        <button
          id="btn-child-profile"
          type="button"
          onClick={onOpenProgress}
          className="flex items-center gap-1.5 bg-amber-100/80 hover:bg-amber-200/80 text-amber-950 px-2.5 py-1 rounded-full text-sm font-bold border border-amber-300/60 shadow-2xs transition-transform active:scale-95 cursor-pointer"
          title="عرض شاراتي وتقدمي"
        >
          <LuluAvatar size="sm" mood="happy" animate={false} className="w-6 h-6" />
          <span className="truncate max-w-[90px] sm:max-w-[130px]">
            {profile.name || 'بطلتنا'}
          </span>
          <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-black">
            م{profile.level}
          </span>
        </button>

        {/* Real Stats (Stars & Badges only as requested) */}
        <div className="flex items-center gap-2">
          {/* Real Stars */}
          <button
            id="btn-header-stars"
            type="button"
            onClick={onOpenProgress}
            className="flex items-center gap-1 bg-yellow-50 hover:bg-yellow-100 text-amber-800 px-2.5 py-1 rounded-full border border-yellow-300 text-sm font-black shadow-2xs transition-transform active:scale-95"
            title="نجومي المكتسبة"
          >
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-500 animate-pulse-gentle" />
            <span>{profile.stars}</span>
          </button>

          {/* Real Badges Count */}
          <button
            id="btn-header-badges"
            type="button"
            onClick={onOpenProgress}
            className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full border border-rose-300 text-sm font-black shadow-2xs transition-transform active:scale-95"
            title="الشارات المفتوحة"
          >
            <Award className="w-4 h-4 text-rose-500" />
            <span>{profile.unlockedBadges.length}</span>
          </button>
        </div>

        {/* Quick Actions (Audio, Mama Section, Menu) */}
        <div className="flex items-center gap-1.5">
          {/* Audio Quick Toggle */}
          <button
            id="btn-quick-audio-toggle"
            type="button"
            onClick={onToggleSound}
            className={`p-1.5 rounded-full border transition-transform active:scale-95 ${
              profile.audioSettings.enabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-600 hover:bg-emerald-100'
                : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
            }`}
            title={profile.audioSettings.enabled ? 'الصوت مفعّل' : 'الصوت متوقف'}
            aria-label="تبديل الصوت"
          >
            {profile.audioSettings.enabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Mama / Teacher button */}
          <button
            id="btn-open-mama-section"
            type="button"
            onClick={onOpenMama}
            className="flex items-center gap-1 bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1.5 rounded-full border border-purple-300 shadow-2xs transition-transform active:scale-95"
            title="قسم ماما والمعلمة"
          >
            <span className="text-xs">👩🏻🏫</span>
            <span className="hidden sm:inline">ماما</span>
          </button>

          {/* Settings / Menu */}
          <button
            id="btn-header-menu"
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full border border-slate-300 shadow-2xs transition-transform active:scale-95"
            title="الإعدادات"
            aria-label="القائمة والإعدادات"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
