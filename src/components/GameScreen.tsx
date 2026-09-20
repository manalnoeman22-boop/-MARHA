import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, ArrowRight, CheckCircle2, XCircle, Star, Sparkles, RefreshCw, Trophy, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, ChildProfile, WorldType, Option, ActivityLog } from '../types';
import { generateRoundForWorld } from '../data/questions';
import { LuluAvatar } from './LuluAvatar';
import { speakText, speakSequence, playSuccessChime, playErrorChime, playStarChime, playPopSound, playCelebrationFanfare, stopSpeech } from '../utils/audio';
import { formatStarsSpeech } from '../utils/arabicNumbers';
import { checkBadgeUnlocks } from '../utils/storage';

interface GameScreenProps {
  world: WorldType;
  profile: ChildProfile;
  onUpdateProfile: (newProfile: ChildProfile) => void;
  onExitGame: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  world,
  profile,
  onUpdateProfile,
  onExitGame,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'wrong' | null;
    messageVisible: string;
    messageSpeech: string;
  }>({ status: null, messageVisible: '', messageSpeech: '' });

  const [roundStats, setRoundStats] = useState({
    correctCount: 0,
    mistakesCount: 0,
    starsEarned: 0,
    xpEarned: 0,
    attemptsOnCurrent: 0,
  });

  const [isRoundFinished, setIsRoundFinished] = useState(false);
  const [unlockedBadgeBanner, setUnlockedBadgeBanner] = useState<string | null>(null);

  // Initialize round questions
  const startNewRound = useCallback(() => {
    stopSpeech();
    const roundQuestions = generateRoundForWorld(world, 8);
    setQuestions(roundQuestions);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setFeedback({ status: null, messageVisible: '', messageSpeech: '' });
    setRoundStats({
      correctCount: 0,
      mistakesCount: 0,
      starsEarned: 0,
      xpEarned: 0,
      attemptsOnCurrent: 0,
    });
    setIsRoundFinished(false);
    setUnlockedBadgeBanner(null);
  }, [world]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const currentQuestion = questions[currentIndex];

  // Auto-speak question text whenever currentIndex changes
  useEffect(() => {
    if (!currentQuestion || isRoundFinished) return;

    setSelectedOptionId(null);
    setFeedback({ status: null, messageVisible: '', messageSpeech: '' });

    const timer = setTimeout(() => {
      speakText(currentQuestion.speechText, profile.audioSettings);
    }, 300);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [currentIndex, currentQuestion, isRoundFinished, profile.audioSettings]);

  const handleRepeatQuestionAudio = () => {
    if (!currentQuestion) return;
    playPopSound(profile.audioSettings.soundEffects);
    speakText(currentQuestion.speechText, profile.audioSettings);
  };

  const handleSpeakAllOptions = () => {
    if (!currentQuestion) return;
    playPopSound(profile.audioSettings.soundEffects);
    const optionsSpeech = currentQuestion.options.map((opt, i) => `الاختيار: ${opt.speechLabel || opt.label}`);
    speakSequence([`السؤال هو: ${currentQuestion.speechText}`, ...optionsSpeech], profile.audioSettings);
  };

  const handleSpeakOption = (opt: Option, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToSpeak = opt.speechLabel || opt.label;
    speakText(textToSpeak, profile.audioSettings);
  };

  const handleSelectOption = (option: Option) => {
    if (feedback.status === 'correct' || !currentQuestion) return;

    setSelectedOptionId(option.id);

    if (option.isCorrect) {
      // Correct answer!
      playSuccessChime(profile.audioSettings.soundEffects);
      playStarChime(profile.audioSettings.soundEffects);

      const childName = profile.name || 'بطلة';
      const msgVisible = `برافو يا ${childName}! 🎉 إجابة صحيحة!`;
      const msgSpeech = `برافو يا ${childName}! إجابة صحيحة!`;

      setFeedback({
        status: 'correct',
        messageVisible: msgVisible,
        messageSpeech: msgSpeech,
      });

      speakText(msgSpeech, profile.audioSettings);

      // Trigger mini confetti burst
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899'],
        });
      } catch {
        // Ignored in headless environments
      }

      setRoundStats((prev) => ({
        ...prev,
        correctCount: prev.correctCount + 1,
        starsEarned: prev.starsEarned + 1,
        xpEarned: prev.xpEarned + 10,
      }));

      // Transition to next question or finish after brief celebratory pause
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((idx) => idx + 1);
        } else {
          finishRound(roundStats.correctCount + 1, roundStats.starsEarned + 1, roundStats.xpEarned + 10);
        }
      }, 1600);
    } else {
      // Soft encouraging wrong answer
      playErrorChime(profile.audioSettings.soundEffects);
      const msgVisible = `قريبة جدًا يا بطلة! 💛 فكري وجربي مرة تانية.`;
      const msgSpeech = `قريبة جدًا يا بطلة! فكري وجربي مرة تانية.`;

      setFeedback({
        status: 'wrong',
        messageVisible: msgVisible,
        messageSpeech: msgSpeech,
      });

      speakText(msgSpeech, profile.audioSettings);

      setRoundStats((prev) => ({
        ...prev,
        mistakesCount: prev.mistakesCount + 1,
        attemptsOnCurrent: prev.attemptsOnCurrent + 1,
      }));
    }
  };

  const speakResultsSequence = (finalStars: number, finalXp: number, hasNewBadge: boolean, newLevel?: number) => {
    const childName = profile.name || 'بطلة';
    const sequence: string[] = [
      `برافو يا ${childName}! حصلتِ على ${formatStarsSpeech(finalStars)}.`,
      `رائع! حصلتِ على ${finalXp} نقطة خبرة.`,
    ];

    if (hasNewBadge) {
      sequence.push('مبروك! حصلتِ على شارة جديدة!');
    }

    if (newLevel && newLevel > profile.level) {
      sequence.push(`مبروك! وصلتي للمستوى ${newLevel}!`);
    }

    speakSequence(sequence, profile.audioSettings);
  };

  const finishRound = (finalCorrect: number, finalStars: number, finalXp: number) => {
    setIsRoundFinished(true);
    playCelebrationFanfare(profile.audioSettings.soundEffects);

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {
      // Ignored
    }

    const worldNames: Record<WorldType, string> = {
      letters: 'جزيرة الحروف',
      numbers: 'مدينة الأرقام',
      reading: 'غابة القراءة',
      thinking: 'مملكة التفكير',
    };

    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      world,
      worldName: worldNames[world],
      timestamp: new Date().toISOString(),
      questionsTotal: questions.length,
      correctCount: finalCorrect,
      starsEarned: finalStars,
      xpEarned: finalXp,
    };

    const updatedProfile: ChildProfile = {
      ...profile,
      stars: profile.stars + finalStars,
      xp: profile.xp + finalXp,
      completedGames: profile.completedGames + 1,
      completedLessons: profile.completedLessons + 1,
      correctAnswers: profile.correctAnswers + finalCorrect,
      errorsCount: profile.errorsCount + roundStats.mistakesCount,
      streak: roundStats.mistakesCount === 0 ? profile.streak + 1 : 1,
      activities: [newActivity, ...profile.activities],
    };

    // Check for any newly unlocked badges
    const { updatedProfile: checkedProfile, newlyUnlocked } = checkBadgeUnlocks(updatedProfile);
    onUpdateProfile(checkedProfile);

    const hasNewBadge = newlyUnlocked.length > 0;
    if (hasNewBadge) {
      setUnlockedBadgeBanner(newlyUnlocked[0].title);
    }

    speakResultsSequence(finalStars, finalXp, hasNewBadge, checkedProfile.level);
  };

  if (!currentQuestion && !isRoundFinished) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin text-4xl">🌟</div>
      </div>
    );
  }

  // Finished Round Celebration Screen
  if (isRoundFinished) {
    return (
      <div id="game-finished-screen" className="max-w-xl mx-auto px-4 py-8 select-none">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-3 border-amber-300 shadow-xl text-center relative overflow-hidden">
          <div className="mb-4">
            <LuluAvatar size="xl" mood="celebrating" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-amber-900 mb-2">
            مبرووووك يا {profile.name || 'بطلتنا'}! 🎉
          </h2>
          <p className="text-slate-600 font-bold text-base sm:text-lg mb-6">
            أنهيتِ جولة التحدي بكل براعة وذكاء! 💡
          </p>

          {/* Badge unlocked celebration banner */}
          {unlockedBadgeBanner && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-3 mb-5 animate-star-pop">
              <span className="text-xs font-black text-rose-800 bg-rose-200 px-2 py-0.5 rounded-full">
                شارة جديدة فُتحت! 🏅
              </span>
              <h4 className="text-lg font-black text-rose-900 mt-1">
                {unlockedBadgeBanner}
              </h4>
            </div>
          )}

          {/* Real Rewards earned */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-3">
              <span className="text-2xl">⭐</span>
              <div className="text-xl font-black text-yellow-800 mt-1">
                +{roundStats.starsEarned}
              </div>
              <span className="text-xs font-bold text-yellow-700">نجوم</span>
            </div>

            <div className="bg-purple-50 border border-purple-300 rounded-2xl p-3">
              <span className="text-2xl">✨</span>
              <div className="text-xl font-black text-purple-800 mt-1">
                +{roundStats.xpEarned}
              </div>
              <span className="text-xs font-bold text-purple-700">XP</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3">
              <span className="text-2xl">🎯</span>
              <div className="text-xl font-black text-emerald-800 mt-1">
                {roundStats.correctCount}/{questions.length}
              </div>
              <span className="text-xs font-bold text-emerald-700">إجابة صحيحة</span>
            </div>
          </div>

          {/* Replay Results Speech */}
          <button
            id="btn-replay-results-speech"
            type="button"
            onClick={() => speakResultsSequence(roundStats.starsEarned, roundStats.xpEarned, Boolean(unlockedBadgeBanner))}
            className="flex items-center justify-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm font-black py-2.5 px-4 rounded-2xl border border-amber-300 shadow-2xs mb-4 w-full transition-transform active:scale-95 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>اسمعي النتيجة تاني 🔊</span>
          </button>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="btn-play-again-round"
              type="button"
              onClick={startNewRound}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-3.5 px-6 rounded-2xl shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" />
              <span>جولة جديدة 🚀</span>
            </button>

            <button
              id="btn-return-home"
              type="button"
              onClick={onExitGame}
              className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-6 rounded-2xl border border-slate-300 shadow-2xs transition-transform active:scale-95 cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span>العودة للعوالم 🗺️</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Question Round
  return (
    <div id="active-game-screen" className="max-w-2xl mx-auto px-4 py-3 select-none pb-12">
      {/* Top Navigation Bar & Progress */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <button
          id="btn-exit-to-home"
          type="button"
          onClick={onExitGame}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white text-xs font-bold px-2.5 py-1.5 rounded-full border border-slate-200 shadow-2xs"
          title="الخروج إلى الصفحة الرئيسية"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>الرئيسية</span>
        </button>

        {/* Question Counter & Progress Track */}
        <div className="flex-1 max-w-xs">
          <div className="flex justify-between items-center text-xs font-black text-amber-900 mb-1 px-1">
            <span>سؤال {currentIndex + 1} من {questions.length}</span>
            <span className="flex items-center gap-1 text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              +{roundStats.starsEarned}
            </span>
          </div>
          <div className="w-full h-2.5 bg-amber-100 rounded-full overflow-hidden border border-amber-200">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Audio Repeat Button */}
        <button
          id="btn-repeat-game-question-audio"
          type="button"
          onClick={handleRepeatQuestionAudio}
          className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-black px-3 py-1.5 rounded-full border border-amber-300 shadow-2xs active:scale-90 transition-transform cursor-pointer"
          title="إعادة نطق السؤال"
        >
          <Volume2 className="w-4 h-4 text-amber-700" />
          <span>اسمعي تاني 🔊</span>
        </button>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-300 shadow-md relative overflow-hidden">
        {/* Companion Lulu Header */}
        <div className="flex items-center gap-3 mb-4 border-b border-amber-100 pb-3">
          <LuluAvatar
            size="md"
            mood={
              feedback.status === 'correct'
                ? 'celebrating'
                : feedback.status === 'wrong'
                ? 'thinking'
                : 'happy'
            }
          />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {currentQuestion.topic}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-inline-hear-question"
                  type="button"
                  onClick={handleRepeatQuestionAudio}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300"
                  title="استمعي إلى نص السؤال"
                >
                  <Volume2 className="w-3 h-3 text-amber-700" />
                  <span>السؤال 🔊</span>
                </button>
                <button
                  id="btn-hear-all-choices"
                  type="button"
                  onClick={handleSpeakAllOptions}
                  className="flex items-center gap-1 text-[11px] font-bold text-sky-900 bg-sky-100/90 hover:bg-sky-200 px-2 py-0.5 rounded-full border border-sky-300"
                  title="استمعي إلى جميع الخيارات بالصوت"
                >
                  <span>الخيارات 🎧</span>
                </button>
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 leading-snug">
              {currentQuestion.visibleText}
            </h3>
          </div>
        </div>

        {/* Visual Math / Counting representation if present */}
        {currentQuestion.visualItems && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 my-4 flex items-center justify-center flex-wrap gap-2 text-3xl sm:text-4xl text-center shadow-inner">
            {currentQuestion.visualItems.op === '+' ? (
              <div className="flex items-center flex-wrap justify-center gap-3">
                <span className="tracking-widest">
                  {currentQuestion.visualItems.emoji.repeat(currentQuestion.visualItems.count)}
                </span>
                <span className="text-2xl font-black text-amber-700">+</span>
                <span className="tracking-widest">
                  {currentQuestion.visualItems.emoji.repeat(currentQuestion.visualItems.count2 || 0)}
                </span>
              </div>
            ) : currentQuestion.visualItems.op === '-' ? (
              <div className="flex items-center flex-wrap justify-center gap-3">
                <span className="tracking-widest">
                  {currentQuestion.visualItems.emoji.repeat(currentQuestion.visualItems.count)}
                </span>
                <span className="text-2xl font-black text-rose-600">-</span>
                <span className="text-xl font-bold bg-rose-100 text-rose-800 px-2 py-1 rounded-xl">
                  {currentQuestion.visualItems.count2}
                </span>
              </div>
            ) : (
              <span className="tracking-widest">
                {currentQuestion.visualItems.emoji.repeat(currentQuestion.visualItems.count)}
              </span>
            )}
          </div>
        )}

        {/* Options List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrectAnswer = opt.isCorrect;
            const showSuccess = feedback.status === 'correct' && isCorrectAnswer;
            const showFailure = isSelected && feedback.status === 'wrong';

            return (
              <button
                key={opt.id}
                id={`btn-option-${idx}-${opt.id}`}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={feedback.status === 'correct'}
                className={`group relative flex items-center justify-between p-4 rounded-2xl border-2 text-lg sm:text-xl font-black transition-all cursor-pointer select-none active:scale-98 text-right ${
                  showSuccess
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300/60'
                    : showFailure
                    ? 'bg-rose-50 border-rose-400 text-rose-900'
                    : 'bg-amber-50/50 hover:bg-amber-100/80 border-amber-200 hover:border-amber-400 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs font-bold text-amber-800 border border-amber-300">
                    {idx + 1}
                  </span>
                  <span>{opt.label}</span>
                </div>

                {/* Speaker icon to hear individual option pronunciation */}
                <div className="flex items-center gap-1.5">
                  <button
                    id={`btn-speak-opt-${opt.id}`}
                    type="button"
                    onClick={(e) => handleSpeakOption(opt, e)}
                    className="p-1.5 text-slate-400 hover:text-amber-700 bg-white/70 hover:bg-white rounded-full border border-slate-200 transition-colors"
                    title="سماع نطق هذا الاختيار"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {showSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {showFailure && <XCircle className="w-5 h-5 text-rose-500" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Message Bar */}
        {feedback.status && (
          <div
            className={`mt-4 p-3.5 rounded-2xl text-center font-black text-base sm:text-lg animate-star-pop border-2 ${
              feedback.status === 'correct'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                : 'bg-amber-50 border-amber-400 text-amber-900'
            }`}
          >
            {feedback.messageVisible}
          </div>
        )}
      </div>
    </div>
  );
};
