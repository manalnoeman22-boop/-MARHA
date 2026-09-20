import React, { useState, useEffect } from 'react';
import { Lock, Unlock, X, Phone, UserCheck, AlertTriangle, RotateCcw, CheckCircle, BarChart3, Award, Star, BookOpen, Clock, Volume2 } from 'lucide-react';
import { ChildProfile } from '../types';
import { playPopSound, playSuccessChime, playErrorChime, speakText, stopSpeech } from '../utils/audio';
import { formatStarsSpeech, formatBadgesSpeech, numberToOrdinalArabic, numberToCardinalArabic } from '../utils/arabicNumbers';
import { clearProfile, getInitialProfile } from '../utils/storage';

interface MamaSectionProps {
  isOpen: boolean;
  profile: ChildProfile;
  onClose: () => void;
  onResetProgress: (resetProfile: ChildProfile) => void;
}

export const MamaSection: React.FC<MamaSectionProps> = ({
  isOpen,
  profile,
  onClose,
  onResetProgress,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'stats' | 'activities' | 'teacher'>('stats');

  // Trigger appropriate TTS narration on open / auth change
  useEffect(() => {
    if (!isOpen) {
      stopSpeech();
      return;
    }

    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        speakText('دخول ماما. اكتبي الرقم السري للدخول.', profile.audioSettings);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        speakMamaDashboardReport();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isAuthenticated]);

  const speakMamaDashboardReport = () => {
    const reportSpeech = `أهلًا يا ماما. دي لوحة متابعة التقدم. عدد النجوم: ${formatStarsSpeech(
      profile.stars
    )}. عدد الشارات: ${formatBadgesSpeech(
      profile.unlockedBadges.length
    )}. المستوى الحالي: المستوى ${numberToOrdinalArabic(
      profile.level
    )}. عدد الألعاب التي تم لعبها: ${numberToCardinalArabic(profile.completedGames)}.`;

    speakText(reportSpeech, profile.audioSettings);
  };

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '3434') {
      playSuccessChime(profile.audioSettings.soundEffects);
      setIsAuthenticated(true);
      setErrorMessage('');
      setPin('');
    } else {
      playErrorChime(profile.audioSettings.soundEffects);
      setErrorMessage('الرقم السري مش صحيح، جربي تاني 💛');
      speakText('الرقم السري غير صحيح، جربي مرة تانية.', profile.audioSettings);
      setPin('');
    }
  };

  const handleDigitClick = (digit: string) => {
    playPopSound(profile.audioSettings.soundEffects);
    // Note: Do NOT speak digits out loud to keep the PIN secure!
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === '3434') {
          playSuccessChime(profile.audioSettings.soundEffects);
          setIsAuthenticated(true);
          setErrorMessage('');
          setPin('');
        } else {
          playErrorChime(profile.audioSettings.soundEffects);
          setErrorMessage('الرقم السري مش صحيح، جربي تاني 💛');
          speakText('الرقم السري غير صحيح، جربي مرة تانية.', profile.audioSettings);
          setPin('');
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleConfirmReset = () => {
    clearProfile();
    const freshProfile = getInitialProfile(profile.name);
    onResetProgress(freshProfile);
    setShowResetConfirm(false);
    onClose();
  };

  // Calculate real progress percentage based on completed activities vs goal
  const totalQuestionsAnswered = profile.correctAnswers + profile.errorsCount;
  const accuracyPercentage =
    totalQuestionsAnswered > 0
      ? Math.round((profile.correctAnswers / totalQuestionsAnswered) * 100)
      : 0;

  return (
    <div
      id="mama-section-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none overflow-y-auto"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border-2 border-purple-300 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👩🏻🏫</span>
            <div>
              <h3 className="text-lg font-black">
                {isAuthenticated ? 'لوحة تحكم ماما والمعلمة' : 'دخول ماما 👩🏻🏫'}
              </h3>
              <p className="text-xs text-purple-100">
                {isAuthenticated ? `متابعة إنجازات البطلة ${profile.name}` : 'منطقة خاصة بأولياء الأمور والمعلمات'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-mama-modal"
            type="button"
            onClick={onClose}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unauthenticated: PIN Entry */}
        {!isAuthenticated ? (
          <div className="p-6 text-center max-w-sm mx-auto">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-700">
              <Lock className="w-7 h-7" />
            </div>

            <h4 className="text-xl font-black text-slate-800 mb-1">
              اكتبي الرقم السري للدخول.
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              هذه الشاشة مخصصة لماما والمعلمة لمتابعة التقدم الفعلي.
            </p>

            {/* Masked PIN Display */}
            <div className="flex justify-center gap-3 mb-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-10 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
                    pin.length > i
                      ? 'border-purple-600 bg-purple-50 text-purple-900'
                      : 'border-slate-300 bg-slate-50 text-slate-300'
                  }`}
                >
                  {pin.length > i ? '●' : ''}
                </div>
              ))}
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="text-sm font-bold text-rose-600 mb-4 animate-star-pop">
                {errorMessage}
              </div>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto mb-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigitClick(digit)}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-800 hover:text-purple-900 font-black text-xl active:scale-95 transition-transform cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                onClick={handleBackspace}
                className="h-12 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm flex items-center justify-center active:scale-95 cursor-pointer"
              >
                مسح ⌫
              </button>
              <button
                type="button"
                onClick={() => handleDigitClick('0')}
                className="h-12 rounded-xl bg-slate-100 hover:bg-purple-100 text-slate-800 hover:text-purple-900 font-black text-xl active:scale-95 transition-transform cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={() => setPin('')}
                className="h-12 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center active:scale-95 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('stats')}
                className={`pb-2 px-3 text-sm font-black border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'stats'
                    ? 'border-purple-600 text-purple-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                📊 إحصائيات الحساب الفعلية
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className={`pb-2 px-3 text-sm font-black border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'activities'
                    ? 'border-purple-600 text-purple-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                📝 سجل الأنشطة ({profile.activities.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('teacher')}
                className={`pb-2 px-3 text-sm font-black border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'teacher'
                    ? 'border-purple-600 text-purple-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                👩🏻🏫 بيانات المعلمة
              </button>
            </div>

            {/* TAB 1: Real Account Stats */}
            {activeTab === 'stats' && (
              <div className="space-y-4">
                {/* Child Summary Card with Audio Narration Trigger */}
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-lg font-black text-purple-950">
                      ملف البطلة: {profile.name || 'لم يُحدد'}
                    </h4>
                    <p className="text-xs text-purple-700 mt-0.5">
                      تاريخ البدء: {new Date(profile.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-speak-mama-report"
                      type="button"
                      onClick={() => speakMamaDashboardReport()}
                      className="flex items-center gap-1.5 bg-white hover:bg-purple-100 text-purple-900 px-3 py-1.5 rounded-xl text-xs font-black border border-purple-300 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                      title="الاستماع إلى تقرير التقدم بالصوت"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>اسمعي التقرير 🔊</span>
                    </button>
                    <div className="bg-purple-600 text-white px-3 py-1.5 rounded-xl text-sm font-black">
                      المستوى {profile.level}
                    </div>
                  </div>
                </div>

                {/* 100% Real Stats Grid - Zero Fake Placeholders */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
                    <span className="text-xl">⭐</span>
                    <div className="text-2xl font-black text-amber-900 mt-1">
                      {profile.stars}
                    </div>
                    <span className="text-xs text-amber-700 font-bold">النجوم المكتسبة</span>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-center">
                    <span className="text-xl">✨</span>
                    <div className="text-2xl font-black text-indigo-900 mt-1">
                      {profile.xp}
                    </div>
                    <span className="text-xs text-indigo-700 font-bold">نقاط الخبرة (XP)</span>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-center">
                    <span className="text-xl">🏅</span>
                    <div className="text-2xl font-black text-rose-900 mt-1">
                      {profile.unlockedBadges.length}
                    </div>
                    <span className="text-xs text-rose-700 font-bold">الشارات المفتوحة</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center">
                    <span className="text-xl">🎮</span>
                    <div className="text-2xl font-black text-emerald-900 mt-1">
                      {profile.completedGames}
                    </div>
                    <span className="text-xs text-emerald-700 font-bold">الألعاب المكتملة</span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center">
                    <span className="text-xl">📚</span>
                    <div className="text-2xl font-black text-blue-900 mt-1">
                      {profile.completedLessons}
                    </div>
                    <span className="text-xs text-blue-700 font-bold">الدروس المكتملة</span>
                  </div>

                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3 text-center">
                    <span className="text-xl">✅</span>
                    <div className="text-2xl font-black text-teal-900 mt-1">
                      {profile.correctAnswers}
                    </div>
                    <span className="text-xs text-teal-700 font-bold">إجابات صحيحة</span>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-center">
                    <span className="text-xl">⚠️</span>
                    <div className="text-2xl font-black text-orange-900 mt-1">
                      {profile.errorsCount}
                    </div>
                    <span className="text-xs text-orange-700 font-bold">محاولات غير موفقة</span>
                  </div>

                  <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 text-center">
                    <span className="text-xl">📈</span>
                    <div className="text-2xl font-black text-sky-900 mt-1">
                      {accuracyPercentage}%
                    </div>
                    <span className="text-xs text-sky-700 font-bold">نسبة الدقة</span>
                  </div>
                </div>

                {/* Reset Progress Section (Locked inside Mama Section only) */}
                <div className="pt-4 border-t border-slate-200">
                  {!showResetConfirm ? (
                    <button
                      id="btn-trigger-reset"
                      type="button"
                      onClick={() => setShowResetConfirm(true)}
                      className="flex items-center gap-2 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>إعادة ضبط تقدم الطفلة والبدء من جديد 🔄</span>
                    </button>
                  ) : (
                    <div className="bg-rose-50 border-2 border-rose-400 rounded-2xl p-4 text-right">
                      <div className="flex items-center gap-2 text-rose-800 font-black mb-2">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                        <span>تأكيد إعادة الضبط</span>
                      </div>
                      <p className="text-xs text-rose-900 mb-3">
                        هل أنتِ متأكدة من حذف جميع النجوم والشارات وسجل الأنشطة وإعادة تصفير التقدم؟ لا يمكن التراجع عن هذه الخطوة.
                      </p>
                      <div className="flex gap-2">
                        <button
                          id="btn-confirm-reset"
                          type="button"
                          onClick={handleConfirmReset}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-transform active:scale-95 cursor-pointer"
                        >
                          نعم، إعادة الضبط بالكامل
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowResetConfirm(false)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Activity Logs */}
            {activeTab === 'activities' && (
              <div className="space-y-3">
                {profile.activities.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    لم تلعب الطفلة أي جولات حتى الآن. ستظهر الجولات تلقائيًا هنا بعد الانتهاء منها!
                  </div>
                ) : (
                  profile.activities.map((act) => (
                    <div
                      key={act.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-right"
                    >
                      <div>
                        <h5 className="font-black text-slate-800 text-sm">
                          {act.worldName}
                        </h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(act.timestamp).toLocaleTimeString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' - '}
                          {new Date(act.timestamp).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-black">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg">
                          {act.correctCount}/{act.questionsTotal} إجابة صحيحة
                        </span>
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-lg">
                          +{act.starsEarned} ⭐
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: Teacher Information */}
            {activeTab === 'teacher' && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserCheck className="w-8 h-8" />
                </div>

                <h4 className="text-xl font-black text-purple-950 mb-1">
                  إعداد المعلمة: منال عادل
                </h4>
                <p className="text-xs text-purple-700 font-semibold mb-4">
                  مطور المحتوى التعليمي والتأسيسي لتطبيق مَرْحَة
                </p>

                <div className="bg-white border border-purple-200 rounded-2xl p-4 max-w-xs mx-auto shadow-xs">
                  <div className="flex items-center justify-center gap-2 text-purple-900 font-black text-lg" dir="ltr">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <span>01033445583</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold block mt-1">
                    رقم التواصل المباشر والمتابعة
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
