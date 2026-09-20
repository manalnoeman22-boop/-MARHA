/**
 * Arabic Numbers to Words Converter for Child-Friendly TTS
 * Converts numbers and expressions to natural, spoken Arabic.
 */

const ONES: Record<number, string> = {
  0: 'صفر',
  1: 'واحد',
  2: 'اثنان',
  3: 'ثلاثة',
  4: 'أربعة',
  5: 'خمسة',
  6: 'ستة',
  7: 'سبعة',
  8: 'ثمانية',
  9: 'تسعة',
  10: 'عشرة',
  11: 'أحد عشر',
  12: 'اثنا عشر',
  13: 'ثلاثة عشر',
  14: 'أربعة عشر',
  15: 'خمسة عشر',
  16: 'ستة عشر',
  17: 'سبعة عشر',
  18: 'ثمانية عشر',
  19: 'تسعة عشر',
};

const TENS: Record<number, string> = {
  20: 'عشرون',
  30: 'ثلاثون',
  40: 'أربعون',
  50: 'خمسون',
  60: 'ستون',
  70: 'سبعون',
  80: 'ثمانون',
  90: 'تسعون',
};

const ORDINALS: Record<number, string> = {
  1: 'الأول',
  2: 'الثاني',
  3: 'الثالث',
  4: 'الرابع',
  5: 'الخامس',
  6: 'السادس',
  7: 'السابع',
  8: 'الثامن',
  9: 'التاسع',
  10: 'العاشر',
  11: 'الحادي عشر',
  12: 'الثاني عشر',
  13: 'الثالث عشر',
  14: 'الرابع عشر',
  15: 'الخامس عشر',
};

/**
 * Convert number (0 - 999) to cardinal Arabic word
 */
export function numberToCardinalArabic(n: number): string {
  if (n < 0) return `سالب ${numberToCardinalArabic(Math.abs(n))}`;
  if (n in ONES) return ONES[n];
  if (n in TENS) return TENS[n];

  if (n < 100) {
    const tens = Math.floor(n / 10) * 10;
    const rem = n % 10;
    if (rem === 0) return TENS[tens] || `${n}`;
    return `${ONES[rem]} و${TENS[tens]}`;
  }

  if (n === 100) return 'مئة';
  if (n < 200) {
    const rem = n % 100;
    return `مئة و${numberToCardinalArabic(rem)}`;
  }
  if (n === 200) return 'مئتان';
  if (n < 300) {
    const rem = n % 100;
    return `مئتان و${numberToCardinalArabic(rem)}`;
  }

  if (n < 1000) {
    const hundreds = Math.floor(n / 100);
    const rem = n % 100;
    const hundredWord = `${ONES[hundreds].replace(/ة$/, '')}مئة`;
    if (rem === 0) return hundredWord;
    return `${hundredWord} و${numberToCardinalArabic(rem)}`;
  }

  return `${n}`;
}

/**
 * Convert number to ordinal Arabic (e.g. 1 -> الأول, 2 -> الثاني)
 */
export function numberToOrdinalArabic(n: number): string {
  if (n in ORDINALS) return ORDINALS[n];
  return `رقم ${numberToCardinalArabic(n)}`;
}

/**
 * Format stars naturally in Arabic
 * 1 -> نجمة واحدة
 * 2 -> نجمتان
 * 3-10 -> ثلاثة نجوم
 * 11+ -> خمسة عشر نجمة
 */
export function formatStarsSpeech(count: number): string {
  if (count <= 0) return 'صفر من النجوم';
  if (count === 1) return 'نجمة واحدة';
  if (count === 2) return 'نجمتان';
  if (count >= 3 && count <= 10) {
    return `${ONES[count]} نجوم`;
  }
  return `${numberToCardinalArabic(count)} نجمة`;
}

/**
 * Format badges naturally in Arabic
 */
export function formatBadgesSpeech(count: number): string {
  if (count <= 0) return 'لا توجد شارات بعد';
  if (count === 1) return 'شارة واحدة';
  if (count === 2) return 'شارتان';
  if (count >= 3 && count <= 10) {
    return `${ONES[count]} شارات`;
  }
  return `${numberToCardinalArabic(count)} شارة`;
}

/**
 * Replace numerals in Arabic text with natural words for TTS
 */
export function naturalizeArabicNumbers(text: string): string {
  if (!text) return '';

  let result = text;

  // Replace "المستوى X" with ordinal
  result = result.replace(/المستوى\s*(\d+)/g, (_, numStr) => {
    const num = parseInt(numStr, 10);
    return `المستوى ${numberToOrdinalArabic(num)}`;
  });

  // Replace "X نجوم" or "X نجمة"
  result = result.replace(/(\d+)\s*نجوم?/g, (_, numStr) => {
    const num = parseInt(numStr, 10);
    return formatStarsSpeech(num);
  });

  // Replace "X نقطة خبرة" or "X XP"
  result = result.replace(/(\d+)\s*(نقطة خبرة|XP|نقطة)/gi, (_, numStr) => {
    const num = parseInt(numStr, 10);
    return `${numberToCardinalArabic(num)} نقطة خبرة`;
  });

  // Replace standalone numbers with cardinal words (e.g., in math questions like "كم مجموع 3 زائد 2؟")
  result = result.replace(/\b(\d+)\b/g, (_, numStr) => {
    const num = parseInt(numStr, 10);
    return numberToCardinalArabic(num);
  });

  return result;
}
