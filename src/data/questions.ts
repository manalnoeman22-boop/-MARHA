import { Question, Option, WorldType } from '../types';

/**
 * Shuffle array using Fisher-Yates
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Validate that a question meets all requirements:
 * 1. Exactly one correct answer
 * 2. At least 2 options, at most 4
 * 3. Unique option IDs and distinct labels
 * 4. Correct answer matches one valid option ID
 */
export function validateQuestion(q: Question): boolean {
  if (!q.options || q.options.length < 2) return false;
  const correctOptions = q.options.filter(o => o.isCorrect);
  if (correctOptions.length !== 1) return false;
  if (correctOptions[0].id !== q.correctAnswer) return false;

  const labels = new Set(q.options.map(o => o.label.trim()));
  if (labels.size !== q.options.length) return false; // Duplicate options detected

  if (!q.visibleText || !q.speechText) return false;
  return true;
}

/**
 * Generate a dynamic math addition question
 */
export function generateAdditionQuestion(): Question {
  const a = Math.floor(Math.random() * 6) + 1; // 1 to 6
  const b = Math.floor(Math.random() * 5) + 1; // 1 to 5
  const sum = a + b;
  const fruits = ['🍎', '⭐', '🎈', '🍓', '🍊'];
  const fruit = fruits[Math.floor(Math.random() * fruits.length)];

  // Generate plausible distractors
  const distractor1 = sum + 1;
  const distractor2 = Math.max(1, sum - 1);
  const distractor3 = sum + 2;

  const distractorSet = new Set<number>([sum]);
  [distractor1, distractor2, distractor3].forEach(d => {
    if (d > 0 && d !== sum) distractorSet.add(d);
  });
  while (distractorSet.size < 3) {
    const r = Math.floor(Math.random() * 12) + 1;
    distractorSet.add(r);
  }

  const allNumbers = Array.from(distractorSet).slice(0, 3);
  const options: Option[] = allNumbers.map(n => ({
    id: `opt_${n}`,
    label: `${n}`,
    speechLabel: `${n}`,
    isCorrect: n === sum,
  }));

  const shuffledOptions = shuffleArray(options);

  const question: Question = {
    id: `math_add_${Date.now()}_${Math.random()}`,
    world: 'numbers',
    topic: 'الجمع الممتع',
    type: 'addition',
    visibleText: `كم مجموع العناصر؟ ${fruit.repeat(a)} + ${fruit.repeat(b)} = ؟`,
    speechText: `كم مجموع ${a} زائد ${b}؟ اجمعي العناصر واختاري الناتج الصحيح!`,
    options: shuffledOptions,
    correctAnswer: `opt_${sum}`,
    explanation: `${a} زائد ${b} يساوي ${sum}! شطورة يا بطلة!`,
    visualItems: { emoji: fruit, count: a, count2: b, op: '+' },
  };

  return question;
}

/**
 * Generate a dynamic math subtraction question
 */
export function generateSubtractionQuestion(): Question {
  const total = Math.floor(Math.random() * 6) + 4; // 4 to 9
  const takeAway = Math.floor(Math.random() * (total - 1)) + 1; // 1 to total-1
  const diff = total - takeAway;
  const symbols = ['🎈', '⭐️', '🍬', '🍪', '🌸'];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];

  const distractor1 = diff + 1;
  const distractor2 = Math.max(1, diff - 1);
  const distractor3 = diff + 2;

  const distractorSet = new Set<number>([diff]);
  [distractor1, distractor2, distractor3].forEach(d => {
    if (d > 0 && d !== diff) distractorSet.add(d);
  });
  while (distractorSet.size < 3) {
    const r = Math.floor(Math.random() * 10) + 1;
    distractorSet.add(r);
  }

  const allNumbers = Array.from(distractorSet).slice(0, 3);
  const options: Option[] = allNumbers.map(n => ({
    id: `opt_sub_${n}`,
    label: `${n}`,
    speechLabel: `${n}`,
    isCorrect: n === diff,
  }));

  const question: Question = {
    id: `math_sub_${Date.now()}_${Math.random()}`,
    world: 'numbers',
    topic: 'الطرح البسيط',
    type: 'subtraction',
    visibleText: `كان معنا ${symbol.repeat(total)} أخذنا منها ${takeAway}، كم تبقى؟`,
    speechText: `كان معنا ${total}، نقصنا منها ${takeAway}، كم يتبقى لدينا؟`,
    options: shuffleArray(options),
    correctAnswer: `opt_sub_${diff}`,
    explanation: `${total} ناقص ${takeAway} يساوي ${diff}! إجابة رائعة!`,
    visualItems: { emoji: symbol, count: total, count2: takeAway, op: '-' },
  };

  return question;
}

/**
 * Generate dynamic counting question
 */
export function generateCountQuestion(): Question {
  const count = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const emojis = ['🐱', '🐰', '🐥', '🚗', '🍓', '🌟', '🦋', '🐟'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  const distractors = new Set<number>([count]);
  distractors.add(count + 1);
  distractors.add(Math.max(1, count - 1));
  while (distractors.size < 3) {
    distractors.add(Math.floor(Math.random() * 10) + 1);
  }

  const options: Option[] = Array.from(distractors).slice(0, 3).map(n => ({
    id: `opt_cnt_${n}`,
    label: `${n}`,
    speechLabel: `${n}`,
    isCorrect: n === count,
  }));

  return {
    id: `cnt_${Date.now()}_${Math.random()}`,
    world: 'numbers',
    topic: 'عد الأشياء',
    type: 'count_objects',
    visibleText: `عدّي العناصر الموجودة واختاري العدد الصحيح:`,
    speechText: `عدي الأشكال المعروضة على الشاشة واختاري العدد المناسب.`,
    options: shuffleArray(options),
    correctAnswer: `opt_cnt_${count}`,
    explanation: `عدد العناصر هو ${count}! بارك الله فيكِ!`,
    visualItems: { emoji, count },
  };
}

/**
 * Base curated questions pool for Letters Island (جزيرة الحروف)
 */
const LETTERS_POOL: Omit<Question, 'id'>[] = [
  {
    world: 'letters',
    topic: 'الحرف الأول',
    type: 'multiple_choice',
    visibleText: 'أيّ كلمة من الكلمات التالية تبدأ بحرف الباء (ب)؟',
    speechText: 'أي كلمة من هذه الكلمات تبدأ بحرف الباء؟ استمعي واختاري!',
    options: [
      { id: 'b1', label: 'بَطَّة 🦆', speechLabel: 'بطة', isCorrect: true },
      { id: 'b2', label: 'قِطَّة 🐱', speechLabel: 'قطة', isCorrect: false },
      { id: 'b3', label: 'سَمَكَة 🐟', speechLabel: 'سمكة', isCorrect: false },
    ],
    correctAnswer: 'b1',
    explanation: 'كلمة بَطَّة تبدأ بحرف الباء (بـ)!',
  },
  {
    world: 'letters',
    topic: 'الحرف الأول',
    type: 'multiple_choice',
    visibleText: 'أيّ كلمة تبدأ بحرف التاء (ت)؟',
    speechText: 'أي كلمة تبدأ بحرف التاء؟',
    options: [
      { id: 't1', label: 'تُفَّاحَة 🍎', speechLabel: 'تفاحة', isCorrect: true },
      { id: 't2', label: 'مَوْز 🍌', speechLabel: 'موز', isCorrect: false },
      { id: 't3', label: 'عِنَب 🍇', speechLabel: 'عنب', isCorrect: false },
    ],
    correctAnswer: 't1',
    explanation: 'كلمة تُفَّاحَة تبدأ بحرف التاء (تـ)!',
  },
  {
    world: 'letters',
    topic: 'شكل الحرف',
    type: 'find_letter',
    visibleText: 'أين هو حرف السين (س)؟',
    speechText: 'أين هو حرف السين؟ اضغطي عليه يا شاطرة!',
    options: [
      { id: 's1', label: 'س', speechLabel: 'سين', isCorrect: true },
      { id: 's2', label: 'ص', speechLabel: 'صاد', isCorrect: false },
      { id: 's3', label: 'ش', speechLabel: 'شين', isCorrect: false },
    ],
    correctAnswer: 's1',
    explanation: 'هذا هو حرف السين بأسنانِه الجميلة!',
  },
  {
    world: 'letters',
    topic: 'الحركات القصيرة',
    type: 'multiple_choice',
    visibleText: 'ما هي الحركة على حرف الميم في كلمة: مِـفْـتَـاح؟',
    speechText: 'ما هي الحركة الموجودة تحت حرف الميم في كلمة مفتاح؟',
    options: [
      { id: 'm1', label: 'الكسرة (مِـ)', speechLabel: 'الكسرة', isCorrect: true },
      { id: 'm2', label: 'الفتحة (مَـ)', speechLabel: 'الفتحة', isCorrect: false },
      { id: 'm3', label: 'الضمة (مُـ)', speechLabel: 'الضمة', isCorrect: false },
    ],
    correctAnswer: 'm1',
    explanation: 'مِفتاح يبدأ بميم مكسورة (مِـ)!',
  },
  {
    world: 'letters',
    topic: 'المدود',
    type: 'multiple_choice',
    visibleText: 'أيّ كلمة تحتوي على مدّ بالألف؟',
    speechText: 'أي كلمة تحتوي على مد بالألف؟',
    options: [
      { id: 'md1', label: 'بَـاب 🚪', speechLabel: 'باب', isCorrect: true },
      { id: 'md2', label: 'تِـيـن 🍈', speechLabel: 'تين', isCorrect: false },
      { id: 'md3', label: 'تُـوت 🫐', speechLabel: 'توت', isCorrect: false },
    ],
    correctAnswer: 'md1',
    explanation: 'كلمة بـاب فيها صوت ألف ممدود طويل: بَـااا-ب!',
  },
  {
    world: 'letters',
    topic: 'صوت الحرف',
    type: 'multiple_choice',
    visibleText: 'أيّ كلمة تبدأ بحرف الجيم (ج)؟',
    speechText: 'أي كلمة تبدأ بحرف الجيم؟',
    options: [
      { id: 'j1', label: 'جَـمَـل 🐪', speechLabel: 'جمل', isCorrect: true },
      { id: 'j2', label: 'فِـيـل 🐘', speechLabel: 'فيل', isCorrect: false },
      { id: 'j3', label: 'حِـصَـان 🐎', speechLabel: 'حصان', isCorrect: false },
    ],
    correctAnswer: 'j1',
    explanation: 'جَـمَـل يبدأ بحرف الجيم الجميل!',
  },
  {
    world: 'letters',
    topic: 'الحرف الناقص',
    type: 'multiple_choice',
    visibleText: 'ما هو الحرف الناقص في كلمة: ...ـَمْـس ☀️؟',
    speechText: 'ما هو الحرف الناقص في كلمة شمس؟',
    options: [
      { id: 'sh1', label: 'ش', speechLabel: 'شين', isCorrect: true },
      { id: 'sh2', label: 'س', speechLabel: 'سين', isCorrect: false },
      { id: 'sh3', label: 'د', speechLabel: 'دال', isCorrect: false },
    ],
    correctAnswer: 'sh1',
    explanation: 'شَـمْس تبدأ بحرف الشين!',
  },
  {
    world: 'letters',
    topic: 'شكل الحرف',
    type: 'find_letter',
    visibleText: 'أين هو حرف الدال (د)؟',
    speechText: 'أين هو حرف الدال؟',
    options: [
      { id: 'd1', label: 'د', speechLabel: 'دال', isCorrect: true },
      { id: 'd2', label: 'ر', speechLabel: 'راء', isCorrect: false },
      { id: 'd3', label: 'ذ', speechLabel: 'ذال', isCorrect: false },
    ],
    correctAnswer: 'd1',
    explanation: 'أحسنتِ! هذا هو حرف الدال!',
  },
  {
    world: 'letters',
    topic: 'الحرف الأول',
    type: 'multiple_choice',
    visibleText: 'أيّ كلمة تبدأ بحرف الزاي (ز)؟',
    speechText: 'أي كلمة تبدأ بحرف الزاي؟',
    options: [
      { id: 'z1', label: 'زَهْـرَة 🌸', speechLabel: 'زهرة', isCorrect: true },
      { id: 'z2', label: 'شَـجَـرَة 🌳', speechLabel: 'شجرة', isCorrect: false },
      { id: 'z3', label: 'نَـخْـلَـة 🌴', speechLabel: 'نخلة', isCorrect: false },
    ],
    correctAnswer: 'z1',
    explanation: 'زَهْـرَة تبدأ بحرف الزاي (ز)!',
  },
  {
    world: 'letters',
    topic: 'التاء المربوطة والمفتوحة',
    type: 'multiple_choice',
    visibleText: 'كلمة (سَيَّارَة 🚗) تنتهي بـ:',
    speechText: 'كلمة سيارة تنتهي بتاء مربوطة أم تاء مفتوحة؟',
    options: [
      { id: 'tm1', label: 'تاء مربوطة (ـة)', speechLabel: 'تاء مربوطة', isCorrect: true },
      { id: 'tm2', label: 'تاء مفتوحة (ت)', speechLabel: 'تاء مفتوحة', isCorrect: false },
      { id: 'tm3', label: 'نون (ن)', speechLabel: 'نون', isCorrect: false },
    ],
    correctAnswer: 'tm1',
    explanation: 'تنتهي بتاء مربوطة لطيفة (ـة)!',
  },
];

/**
 * Base curated questions pool for Reading Forest (غابة القراءة)
 */
const READING_POOL: Omit<Question, 'id'>[] = [
  {
    world: 'reading',
    topic: 'مطابقة الكلمة بالصورة',
    type: 'word_match',
    visibleText: 'ما هي الكلمة التي تطابق الصورة 📖؟',
    speechText: 'ما هي الكلمة التي تطابق صورة الكتاب؟ اضغطي على الكلمة واقرئيها!',
    options: [
      { id: 'r1', label: 'كِـتَـاب', speechLabel: 'كِتاب', isCorrect: true },
      { id: 'r2', label: 'قَـلَـم', speechLabel: 'قَلَم', isCorrect: false },
      { id: 'r3', label: 'دَفْـتَـر', speechLabel: 'دَفْتَر', isCorrect: false },
    ],
    correctAnswer: 'r1',
    explanation: 'كِـتَـاب تطابق صورة الكتاب!',
  },
  {
    world: 'reading',
    topic: 'مطابقة الكلمة بالصورة',
    type: 'word_match',
    visibleText: 'ما هي الكلمة التي تطابق الصورة 🏠؟',
    speechText: 'ما هي الكلمة التي تطابق صورة البيت؟',
    options: [
      { id: 'r4', label: 'بَـيْـت', speechLabel: 'بَيْت', isCorrect: true },
      { id: 'r5', label: 'مَـسْـجِـد', speechLabel: 'مَسْجِد', isCorrect: false },
      { id: 'r6', label: 'حَـدِيـقَـة', speechLabel: 'حَدِيقَة', isCorrect: false },
    ],
    correctAnswer: 'r4',
    explanation: 'بَـيْـت كلمة رائعة تتكون من 3 حروف: بـ، يـ، ت!',
  },
  {
    world: 'reading',
    topic: 'المقاطع الصوتية',
    type: 'multiple_choice',
    visibleText: 'ما هو المقطع الصوتي الأول في كلمة: مَـلْـعَـب؟',
    speechText: 'ما هو المقطع الصوتي الأول في كلمة مَلْعَب؟',
    options: [
      { id: 'syl1', label: 'مَـلْـ', speechLabel: 'مَلْ', isCorrect: true },
      { id: 'syl2', label: 'عَـبْـ', speechLabel: 'عَبْ', isCorrect: false },
      { id: 'syl3', label: 'لَـعَـ', speechLabel: 'لَعَ', isCorrect: false },
    ],
    correctAnswer: 'syl1',
    explanation: 'المقطع الساكن هو (مَـلْـ)! ميم مفتوحة ولام ساكنة!',
  },
  {
    world: 'reading',
    topic: 'فهم المقروء',
    type: 'multiple_choice',
    visibleText: 'اقرئي الجملة: «تَـلْـعَـبُ نُـورَةُ بِـالْـكُـرَة ⚽» — بِمَاذَا تَلْعَبُ نُورَةُ؟',
    speechText: 'اقرئي الجملة: تلعب نورة بالكرة. بماذا تلعب نورة؟',
    options: [
      { id: 'q1', label: 'بِـالْـكُـرَة ⚽', speechLabel: 'بالكرة', isCorrect: true },
      { id: 'q2', label: 'بِـالْـدُّمْـيَـة 🧸', speechLabel: 'بالدمية', isCorrect: false },
      { id: 'q3', label: 'بِـالْـرَّسْـم 🎨', speechLabel: 'بالرسم', isCorrect: false },
    ],
    correctAnswer: 'q1',
    explanation: 'ممتازة! تلعب نورة بالكرة!',
  },
  {
    world: 'reading',
    topic: 'تركيب الكلمات',
    type: 'multiple_choice',
    visibleText: 'إذا جمعنا الحروف (قَ + لَ + م)، تتكون كلمة:',
    speechText: 'إذا جمعنا أصوات الحروف: قَ، لَ، م، أي كلمة نحصل عليها؟',
    options: [
      { id: 'w1', label: 'قَـلَـم ✏️', speechLabel: 'قَلَم', isCorrect: true },
      { id: 'w2', label: 'قَـمَـر 🌙', speechLabel: 'قَمَر', isCorrect: false },
      { id: 'w3', label: 'قَـلْـب ❤️', speechLabel: 'قَلْب', isCorrect: false },
    ],
    correctAnswer: 'w1',
    explanation: 'قَ + لَ + م = قَلَم! بطلة القراءة!',
  },
  {
    world: 'reading',
    topic: 'مطابقة الكلمة بالصورة',
    type: 'word_match',
    visibleText: 'أيّ كلمة تطابق الصورة 🐱؟',
    speechText: 'أي كلمة تطابق صورة القطة اللطيفة؟',
    options: [
      { id: 'w4', label: 'قِـطَّـة', speechLabel: 'قِطَّة', isCorrect: true },
      { id: 'w5', label: 'أَرْنَـب', speechLabel: 'أَرْنَب', isCorrect: false },
      { id: 'w6', label: 'عُـصْـفُـور', speechLabel: 'عُصْفُور', isCorrect: false },
    ],
    correctAnswer: 'w4',
    explanation: 'قِـطَّـة كلمة مطابقة تماماً!',
  },
  {
    world: 'reading',
    topic: 'اللام الشمسية والقمرية',
    type: 'multiple_choice',
    visibleText: 'كلمة (الْـقَـمَـر 🌕) تحتوي على لام:',
    speechText: 'كلمة القمر، تحتوي على لام قمرية نكتبها وننطقها، أم لام شمسية؟',
    options: [
      { id: 'l1', label: 'قَـمَـرِيَّـة (تُنطق وتُكتب)', speechLabel: 'لام قمرية', isCorrect: true },
      { id: 'l2', label: 'شَـمْـسِـيَّـة (تُكتب ولا تُنطق)', speechLabel: 'لام شمسية', isCorrect: false },
    ],
    correctAnswer: 'l1',
    explanation: 'اللام في الْـقمر لام قمرية واضحة الصوت!',
  },
  {
    world: 'reading',
    topic: 'فهم المقروء',
    type: 'multiple_choice',
    visibleText: '«أَكَلَتْ لَيْلَى تُفَّاحَةً لَذِيذَةً 🍎» — مَاذَا أَكَلَتْ لَيْلَى؟',
    speechText: 'أكلت ليلى تفاحة لذيذة. ماذا أكلت ليلى؟',
    options: [
      { id: 'l3', label: 'تُـفَّـاحَـة 🍎', speechLabel: 'تفاحة', isCorrect: true },
      { id: 'l4', label: 'بُـرْتُـقَـالَـة 🍊', speechLabel: 'برتقالة', isCorrect: false },
      { id: 'l5', label: 'مَـوْزَة 🍌', speechLabel: 'موزة', isCorrect: false },
    ],
    correctAnswer: 'l3',
    explanation: 'رائعة! أكلت ليلى تفاحة لذيذة!',
  },
];

/**
 * Base curated questions pool for Thinking Kingdom (مملكة التفكير)
 */
const THINKING_POOL: Omit<Question, 'id'>[] = [
  {
    world: 'thinking',
    topic: 'إكمال النمط',
    type: 'pattern',
    visibleText: 'أكملي النمط الذكي: 🔴 🔵 🔴 🔵 ... ؟',
    speechText: 'أكملي النمط: دائرة حمراء، ثم زرقاء، ثم حمراء، ثم زرقاء، ما التالي؟',
    options: [
      { id: 'p1', label: '🔴 أحمر', speechLabel: 'أحمر', isCorrect: true },
      { id: 'p2', label: '🔵 أزرق', speechLabel: 'أزرق', isCorrect: false },
      { id: 'p3', label: '🟢 أخضر', speechLabel: 'أخضر', isCorrect: false },
    ],
    correctAnswer: 'p1',
    explanation: 'النمط يتكرر بالتبادل: أحمر ثم أزرق، فالدور الآن على الأحمر!',
  },
  {
    world: 'thinking',
    topic: 'اختاري المختلف',
    type: 'odd_one_out',
    visibleText: 'اختاري الشيء المختلف بين هذه العناصر:',
    speechText: 'أي من هذه العناصر هو المختلف عن البقية؟ فكري جيداً!',
    options: [
      { id: 'diff1', label: 'سَيَّارَة 🚗', speechLabel: 'سيارة', isCorrect: true },
      { id: 'diff2', label: 'تُفَّاحَة 🍎', speechLabel: 'تفاحة', isCorrect: false },
      { id: 'diff3', label: 'مَوْزَة 🍌', speechLabel: 'موزة', isCorrect: false },
      { id: 'diff4', label: 'عِنَب 🍇', speechLabel: 'عنب', isCorrect: false },
    ],
    correctAnswer: 'diff1',
    explanation: 'السيارة وسيلة مواصلات، بينما التفاح والموز والعنب فواكه!',
  },
  {
    world: 'thinking',
    topic: 'إكمال النمط',
    type: 'pattern',
    visibleText: 'ما الشكل التالي في النمط: ⭐ 🌙 ⭐ 🌙 ... ؟',
    speechText: 'ما الشكل التالي في النمط: نجمة، هلال، نجمة، هلال، ما التالي؟',
    options: [
      { id: 'p4', label: 'نجمة ⭐', speechLabel: 'نجمة', isCorrect: true },
      { id: 'p5', label: 'هلال 🌙', speechLabel: 'هلال', isCorrect: false },
      { id: 'p6', label: 'شمس ☀️', speechLabel: 'شمس', isCorrect: false },
    ],
    correctAnswer: 'p4',
    explanation: 'بعد الهلال تأتي النجمة اللامعة!',
  },
  {
    world: 'thinking',
    topic: 'التصنيف والذكاء',
    type: 'multiple_choice',
    visibleText: 'أيّ من هذه الأشياء نرتديه عندما يكون الجو بارداً في الشتاء؟',
    speechText: 'أي من هذه الأشياء نرتديه في الجو البارد؟',
    options: [
      { id: 'c1', label: 'مِـعْـطَـف دَافِـئ 🧥', speechLabel: 'معطف دافئ', isCorrect: true },
      { id: 'c2', label: 'نَـظَّـارَة شَـمْـسِـيَّـة 🕶️', speechLabel: 'نظارة شمسية', isCorrect: false },
      { id: 'c3', label: 'مِـظَـلَّـة شَـاطِـئ ⛱️', speechLabel: 'مظلة شاطئ', isCorrect: false },
    ],
    correctAnswer: 'c1',
    explanation: 'المعطف يحمينا من البرد ويشعرنا بالدفء!',
  },
  {
    world: 'thinking',
    topic: 'بيوت الحيوانات',
    type: 'multiple_choice',
    visibleText: 'أين يعيش العصفور الصغير 🐦؟',
    speechText: 'أين يعيش العصفور الصغير؟',
    options: [
      { id: 'h1', label: 'فِـي الْـعُـشّ 🪺', speechLabel: 'في العش', isCorrect: true },
      { id: 'h2', label: 'فِـي الْـبَـحْـر 🌊', speechLabel: 'في البحر', isCorrect: false },
      { id: 'h3', label: 'فِـي الْـجُـحْـر 🕳️', speechLabel: 'في الجحر', isCorrect: false },
    ],
    correctAnswer: 'h1',
    explanation: 'العصفور يبني عشه الجميل فوق أغصان الأشجار!',
  },
  {
    world: 'thinking',
    topic: 'المطابقة المنطقية',
    type: 'multiple_choice',
    visibleText: 'السمكة تسبح في الماء 🐟، أما الطائر فيطير في:',
    speechText: 'السمكة تسبح في الماء، أما الطائر فإلى أين يطير؟',
    options: [
      { id: 'sky1', label: 'الْـسَّـمَـاء ☁️', speechLabel: 'السماء', isCorrect: true },
      { id: 'sky2', label: 'الْـرِّمَـال 🏖️', speechLabel: 'الرمال', isCorrect: false },
      { id: 'sky3', label: 'الْـمَـغَـارَة ⛰️', speechLabel: 'المغارة', isCorrect: false },
    ],
    correctAnswer: 'sky1',
    explanation: 'الطائر يمتلك أجنحة ليحلق بها في السماء!',
  },
  {
    world: 'thinking',
    topic: 'اختاري المختلف',
    type: 'odd_one_out',
    visibleText: 'أيّ حيوان مختلف لأنه يعيش في الماء؟',
    speechText: 'أي حيوان مختلف لأنه يسبح ويعيش في الماء؟',
    options: [
      { id: 'diff5', label: 'دُلْـفِـيـن 🐬', speechLabel: 'دلفين', isCorrect: true },
      { id: 'diff6', label: 'أَسَـد 🦁', speechLabel: 'أسد', isCorrect: false },
      { id: 'diff7', label: 'زَرَافَـة 🦒', speechLabel: 'زرافة', isCorrect: false },
    ],
    correctAnswer: 'diff5',
    explanation: 'الدلفين يسبح ويعيش في الماء، بينما البقية على اليابسة!',
  },
];

/**
 * Comparison questions for Numbers City
 */
function generateComparisonQuestion(): Question {
  const n1 = Math.floor(Math.random() * 9) + 1; // 1 to 9
  let n2 = Math.floor(Math.random() * 9) + 1;
  while (n2 === n1) {
    n2 = Math.floor(Math.random() * 9) + 1;
  }
  const isBiggerQuery = Math.random() > 0.5;
  const correctNum = isBiggerQuery ? Math.max(n1, n2) : Math.min(n1, n2);

  const options: Option[] = [
    { id: `comp_${n1}`, label: `${n1}`, speechLabel: `${n1}`, isCorrect: n1 === correctNum },
    { id: `comp_${n2}`, label: `${n2}`, speechLabel: `${n2}`, isCorrect: n2 === correctNum },
  ];

  return {
    id: `cmp_${Date.now()}_${Math.random()}`,
    world: 'numbers',
    topic: 'المقارنة الذكية',
    type: 'compare',
    visibleText: isBiggerQuery ? `أيّ الرقمين هو الأكبر: ${n1} أم ${n2}؟` : `أيّ الرقمين هو الأصغر: ${n1} أم ${n2}؟`,
    speechText: isBiggerQuery ? `أي الرقمين هو الأكبر؟ ${n1} أم ${n2}؟` : `أي الرقمين هو الأصغر؟ ${n1} أم ${n2}؟`,
    options: shuffleArray(options),
    correctAnswer: `comp_${correctNum}`,
    explanation: isBiggerQuery ? `العدد ${correctNum} هو الأكبر!` : `العدد ${correctNum} هو الأصغر!`,
  };
}

/**
 * Generate a validated, randomized round of 8 to 10 questions for a given world
 */
export function generateRoundForWorld(world: WorldType, targetCount = 8): Question[] {
  const generatedList: Question[] = [];

  if (world === 'numbers') {
    // Generate fresh programmatic math questions
    while (generatedList.length < targetCount) {
      let q: Question;
      const r = Math.random();
      if (r < 0.35) {
        q = generateAdditionQuestion();
      } else if (r < 0.65) {
        q = generateSubtractionQuestion();
      } else if (r < 0.85) {
        q = generateCountQuestion();
      } else {
        q = generateComparisonQuestion();
      }

      if (validateQuestion(q)) {
        generatedList.push(q);
      }
    }
  } else {
    let sourcePool: Omit<Question, 'id'>[] = [];
    if (world === 'letters') sourcePool = LETTERS_POOL;
    else if (world === 'reading') sourcePool = READING_POOL;
    else if (world === 'thinking') sourcePool = THINKING_POOL;

    const shuffledBase = shuffleArray(sourcePool);

    shuffledBase.forEach((raw, idx) => {
      // Re-shuffle options for each round so correct answer is randomly positioned
      const shuffledOptions = shuffleArray(raw.options);
      const correctOpt = shuffledOptions.find(o => o.isCorrect);

      const q: Question = {
        ...raw,
        id: `${world}_q_${idx}_${Date.now()}`,
        options: shuffledOptions,
        correctAnswer: correctOpt ? correctOpt.id : raw.correctAnswer,
      };

      if (validateQuestion(q)) {
        generatedList.push(q);
      }
    });

    // If needed, repeat with different randomized option order to reach targetCount
    if (generatedList.length < targetCount) {
      const extra = shuffleArray(generatedList);
      for (const item of extra) {
        if (generatedList.length >= targetCount) break;
        const newOptions = shuffleArray(item.options);
        const correct = newOptions.find(o => o.isCorrect);
        generatedList.push({
          ...item,
          id: `${item.id}_dup_${Math.random()}`,
          options: newOptions,
          correctAnswer: correct ? correct.id : item.correctAnswer,
        });
      }
    }
  }

  return generatedList.slice(0, targetCount);
}
