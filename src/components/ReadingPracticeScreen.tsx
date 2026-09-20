import React, { useState, useEffect } from 'react';
import { Volume2, ArrowRight, Star, Sparkles, BookOpen } from 'lucide-react';
import { ChildProfile } from '../types';
import { speakText, stopSpeech, playStarChime, playPopSound } from '../utils/audio';
import { LuluAvatar } from './LuluAvatar';

interface ReadingPracticeScreenProps {
  profile: ChildProfile;
  onUpdateProfile: (newProfile: ChildProfile) => void;
  onBack: () => void;
}

interface WordCard {
  id: string;
  word: string;
  syllables: string[];
  emoji: string;
  category: string;
  exampleSentence: string;
}

const READING_WORDS: WordCard[] = [
  {
    id: 'w1',
    word: 'قَـلَـمٌ',
    syllables: ['قَـ', 'لَـ', 'مٌ'],
    emoji: '✏️',
    category: 'أدوات مدرسية',
    exampleSentence: 'أَكْتُبُ بِـالْـقَـلَـمِ الْـجَمِيلِ.',
  },
  {
    id: 'w2',
    word: 'كِـتَـابٌ',
    syllables: ['كِـ', 'تَـا', 'بٌ'],
    emoji: '📖',
    category: 'أدوات مدرسية',
    exampleSentence: 'أَقْرَأُ قِصَّةً فِي الْـكِـتَـابِ.',
  },
  {
    id: 'w3',
    word: 'شَـمْـسٌ',
    syllables: ['شَـمْـ', 'سٌ'],
    emoji: '☀️',
    category: 'طبيعة',
    exampleSentence: 'تُشْرِقُ الشَّمْسُ فِي الصَّبَاحِ.',
  },
  {
    id: 'w4',
    word: 'قَـمَـرٌ',
    syllables: ['قَـ', 'مَـ', 'رٌ'],
    emoji: '🌙',
    category: 'طبيعة',
    exampleSentence: 'يَظْهَرُ الْـقَـمَـرُ لَيْلًا فِي السَّمَاءِ.',
  },
  {
    id: 'w5',
    word: 'زَهْـرَةٌ',
    syllables: ['زَهْـ', 'رَ', 'ةٌ'],
    emoji: '🌸',
    category: 'نباتات',
    exampleSentence: 'الزَّهْرَةُ رَائِحَتُهَا جَمِيلَةٌ.',
  },
  {
    id: 'w6',
    word: 'سَيَّـارَةٌ',
    syllables: ['سَيْـ', 'يَـا', 'رَ', 'ةٌ'],
    emoji: '🚗',
    category: 'مواصلات',
    exampleSentence: 'تَسِيرُ السَّيَّارَةُ عَلَى الطَّرِيقِ.',
  },
  {
    id: 'w7',
    word: 'عُـصْفُـورٌ',
    syllables: ['عُصْـ', 'فُـو', 'رٌ'],
    emoji: '🐦',
    category: 'طيور',
    exampleSentence: 'يُغَرِّدُ الْعُصْفُورُ فَوْقَ الْغُصْنِ.',
  },
  {
    id: 'w8',
    word: 'سَمَـكَـةٌ',
    syllables: ['سَـ', 'مَـ', 'كَـ', 'ةٌ'],
    emoji: '🐟',
    category: 'حيوانات',
    exampleSentence: 'السَّمَكَةُ تَعِيشُ وَتَسْبَحُ فِي الْبَحْرِ.',
  },
];

export const ReadingPracticeScreen: React.FC<ReadingPracticeScreenProps> = ({
  profile,
  onUpdateProfile,
  onBack,
}) => {
  const [selectedWord, setSelectedWord] = useState<WordCard>(READING_WORDS[0]);
  const [practicedWords, setPracticedWords] = useState<Set<string>>(new Set());

  const instructionsSpeech =
    'أهلًا بكِ في مستكشف القراءة! اضغطي على أي كلمة أو مقطع صوتي لسماع النطق الصحيح!';

  useEffect(() => {
    const timer = setTimeout(() => {
      speakText(instructionsSpeech, profile.audioSettings);
    }, 350);

    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
  }, [profile.audioSettings]);

  const handleRepeatInstructions = () => {
    playPopSound(profile.audioSettings.soundEffects);
    speakText(instructionsSpeech, profile.audioSettings);
  };

  const handleSpeakWord = (word: WordCard) => {
    playPopSound(profile.audioSettings.soundEffects);
    setSelectedWord(word);

    // Speak word cleanly
    speakText(word.word, profile.audioSettings);

    if (!practicedWords.has(word.id)) {
      const nextSet = new Set(practicedWords);
      nextSet.add(word.id);
      setPracticedWords(nextSet);

      // Reward a star for exploring reading words
      playStarChime(profile.audioSettings.soundEffects);
      onUpdateProfile({
        ...profile,
        stars: profile.stars + 1,
        xp: profile.xp + 5,
      });
    }
  };

  const handleSpeakSyllable = (syl: string) => {
    playPopSound(profile.audioSettings.soundEffects);
    speakText(syl, profile.audioSettings);
  };

  const handleSpeakSentence = (sentence: string) => {
    speakText(sentence, profile.audioSettings);
  };

  return (
    <div id="reading-practice-screen" className="max-w-3xl mx-auto px-4 py-4 select-none pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          id="btn-back-from-reading"
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 bg-white text-slate-700 hover:text-slate-900 text-xs font-bold px-3 py-2 rounded-full border border-slate-300 shadow-2xs cursor-pointer active:scale-95"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للعوالم</span>
        </button>

        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
            مُسْتَكْشِفُ الْقِرَاءَةِ 📖
          </h2>
          <button
            id="btn-repeat-reading-instructions"
            type="button"
            onClick={handleRepeatInstructions}
            className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-300 shadow-2xs active:scale-95 transition-transform cursor-pointer"
            title="إعادة نطق التعليمات"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>اسمعي تاني 🔊</span>
          </button>
        </div>

        <div className="text-xs font-black bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-300">
          قرأتِ {practicedWords.size} من {READING_WORDS.length}
        </div>
      </div>

      {/* Featured Selected Word Box */}
      <div className="bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-50 rounded-3xl p-6 border-3 border-emerald-300 shadow-md text-center mb-6">
        <div className="flex justify-center mb-3">
          <span className="text-6xl sm:text-7xl filter drop-shadow-md animate-float">
            {selectedWord.emoji}
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <h3 className="text-4xl sm:text-5xl font-black text-emerald-950 tracking-wider">
            {selectedWord.word}
          </h3>
          <button
            id={`btn-speak-main-${selectedWord.id}`}
            type="button"
            onClick={() => handleSpeakWord(selectedWord)}
            className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-md active:scale-90 transition-transform cursor-pointer"
            title="استمعي لنطق الكلمة كاملة"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Syllable Breakdown (المقاطع الصوتية) */}
        <div className="mt-5 pt-4 border-t border-emerald-200">
          <p className="text-xs font-bold text-emerald-800 mb-2">
            المقاطع الصوتية (اضغطي على المقطع لسماعه):
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {selectedWord.syllables.map((syl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSpeakSyllable(syl)}
                className="bg-white hover:bg-emerald-200 text-emerald-900 text-xl font-black px-4 py-2 rounded-xl border-2 border-emerald-300 shadow-2xs active:scale-95 transition-transform"
              >
                {syl}
              </button>
            ))}
          </div>
        </div>

        {/* Example sentence */}
        <div className="mt-4 bg-white/80 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-2 text-right">
          <p className="text-sm sm:text-base font-bold text-slate-800 flex-1">
            « {selectedWord.exampleSentence} »
          </p>
          <button
            type="button"
            onClick={() => handleSpeakSentence(selectedWord.exampleSentence)}
            className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full active:scale-90 transition-transform"
            title="استمعي للجملة"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Words Grid */}
      <h4 className="text-base font-black text-slate-800 mb-3 px-1">
        اخْتَارِي كَلِمَةً لِتَقْرَئِيهَا وَتَسْمَعِيهَا:
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {READING_WORDS.map((w) => {
          const isSelected = selectedWord.id === w.id;
          const isDone = practicedWords.has(w.id);

          return (
            <button
              key={w.id}
              id={`btn-read-word-${w.id}`}
              type="button"
              onClick={() => handleSpeakWord(w)}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-md'
                  : isDone
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800'
              }`}
            >
              <div className="text-3xl mb-1">{w.emoji}</div>
              <div className="text-lg font-black">{w.word}</div>
              <div className="flex items-center justify-center gap-1 mt-1 text-[11px] font-semibold opacity-90">
                <span>{w.category}</span>
                {isDone && <span>⭐</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
