import React, { useEffect } from 'react';
import { X, Volume2, VolumeX, Gauge, Sliders, Bell } from 'lucide-react';
import { AudioSettings } from '../types';
import { playPopSound, speakText, stopSpeech } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AudioSettings;
  onUpdateSettings: (settings: AudioSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      return;
    }

    const timer = setTimeout(() => {
      speakText('إعدادات الصوت والنطق.', settings);
    }, 300);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    playPopSound(settings.soundEffects);
    speakText('مَرْحَة! نلعب، نتعلم، ونقول فهمتها!', settings);
  };

  const handleToggleAudio = () => {
    playPopSound(settings.soundEffects);
    const updated = { ...settings, enabled: !settings.enabled };
    onUpdateSettings(updated);
    if (!settings.enabled) {
      speakText('تم تفعيل الصوت والنطق بنجاح!', updated);
    }
  };

  const handleRateChange = (rate: number) => {
    playPopSound(settings.soundEffects);
    const updated = { ...settings, rate };
    onUpdateSettings(updated);
    speakText('هذه سرعة الصوت الجديدة.', updated);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    const updated = { ...settings, volume };
    onUpdateSettings(updated);
  };

  const handleToggleSoundEffects = () => {
    playPopSound(!settings.soundEffects);
    onUpdateSettings({ ...settings, soundEffects: !settings.soundEffects });
  };

  return (
    <div
      id="settings-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 select-none"
    >
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-xl border-2 border-slate-300 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center justify-between text-slate-900">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-black">إعدادات الصوت والتطبيق ⚙️</h3>
          </div>
          <button
            id="btn-close-settings"
            type="button"
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-800 rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-5 space-y-5 text-right">
          {/* Audio Enable / Disable */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {settings.enabled ? (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <h4 className="text-sm font-black text-slate-800">
                  تشغيل الصوت والنطق 🔊
                </h4>
                <p className="text-[11px] text-slate-500">
                  نطق التعليمات والأسئلة والكلمات
                </p>
              </div>
            </div>
            <button
              id="btn-toggle-main-sound"
              type="button"
              onClick={handleToggleAudio}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.enabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  settings.enabled ? 'left-1' : 'right-1'
                }`}
              />
            </button>
          </div>

          {/* Sound Effects toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="text-sm font-black text-slate-800">
                  المؤثرات الصوتية والتشجيع 🎵
                </h4>
                <p className="text-[11px] text-slate-500">
                  أصوات الإجابة الصحيحة وتناغم النجوم
                </p>
              </div>
            </div>
            <button
              id="btn-toggle-sound-fx"
              type="button"
              onClick={handleToggleSoundEffects}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.soundEffects ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  settings.soundEffects ? 'left-1' : 'right-1'
                }`}
              />
            </button>
          </div>

          {/* Speech Rate (سرعة الصوت) */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-purple-600" />
              <h4 className="text-sm font-black text-slate-800">
                سرعة الصوت 🗣️
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'بطيء 🐢', rate: 0.8 },
                { label: 'مناسب 🌸', rate: 0.95 },
                { label: 'سريع 🐇', rate: 1.15 },
              ].map((r) => (
                <button
                  key={r.rate}
                  type="button"
                  onClick={() => handleRateChange(r.rate)}
                  className={`py-2 px-1 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                    Math.abs(settings.rate - r.rate) < 0.05
                      ? 'bg-purple-100 border-purple-400 text-purple-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Volume slider */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center mb-1 text-xs font-black text-slate-800">
              <span>مستوى الصوت 🔈</span>
              <span>{Math.round(settings.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              onChange={handleVolumeChange}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Test Voice Button */}
          <div className="pt-3 border-t border-slate-100">
            <button
              id="btn-test-tts-voice"
              type="button"
              onClick={handleTestVoice}
              className="w-full flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-black py-2.5 px-4 rounded-2xl border border-amber-300 shadow-2xs active:scale-95 transition-transform cursor-pointer text-sm"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>اختبار الصوت والنطق 🔊</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
