type Language = 'ru' | 'en';

export interface Duration {
  years: number;
  months: number;
}

// Russian pluralization rules
function pluralizeRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} ${many}`;
  if (mod10 === 1) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} ${few}`;
  return `${n} ${many}`;
}

/**
 * Calculates the duration between two dates.
 * If endDate is omitted, uses the current date.
 */
export function calculateDuration(startDate: string, endDate?: string): Duration {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months };
}

/**
 * Returns a human-readable duration string.
 * Examples:
 *   ru: "2 года 4 месяца", "1 год", "6 месяцев", "менее месяца"
 *   en: "2 years 4 months", "1 year", "6 months", "less than a month"
 */
export function formatDuration(
  startDate: string,
  endDate: string | undefined,
  language: Language
): string {
  const { years, months } = calculateDuration(startDate, endDate);

  if (language === 'ru') {
    const yearsPart = years > 0 ? pluralizeRu(years, 'год', 'года', 'лет') : '';
    const monthsPart = months > 0 ? pluralizeRu(months, 'месяц', 'месяца', 'месяцев') : '';

    if (yearsPart && monthsPart) return `${yearsPart} ${monthsPart}`;
    if (yearsPart) return yearsPart;
    if (monthsPart) return monthsPart;
    return 'менее месяца';
  }

  // English
  const yearsPart = years > 0 ? `${years} ${years === 1 ? 'year' : 'years'}` : '';
  const monthsPart = months > 0 ? `${months} ${months === 1 ? 'month' : 'months'}` : '';

  if (yearsPart && monthsPart) return `${yearsPart} ${monthsPart}`;
  if (yearsPart) return yearsPart;
  if (monthsPart) return monthsPart;
  return 'less than a month';
}

const MONTHS_RU = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function formatMonthYear(date: Date, language: Language): string {
  const month = language === 'ru' ? MONTHS_RU[date.getMonth()] : MONTHS_EN[date.getMonth()];
  return `${month} ${date.getFullYear()}`;
}

/**
 * Returns a formatted date range string.
 * Examples:
 *   ru: "Март 2024 — Настоящее время"
 *   en: "March 2024 — Present"
 */
export function formatPeriod(
  startDate: string,
  endDate: string | undefined,
  language: Language
): string {
  const start = new Date(startDate);
  const startStr = formatMonthYear(start, language);
  const endStr = endDate
    ? formatMonthYear(new Date(endDate), language)
    : language === 'ru'
      ? 'Настоящее время'
      : 'Present';

  return `${startStr} — ${endStr}`;
}

/**
 * Calculates total experience from the earliest start date across all entries.
 * Useful for the Hero section summary.
 */
export function getTotalExperience(
  experiences: { startDate: string; endDate?: string }[],
  language: Language
): string {
  if (!experiences.length) return '';
  const earliest = experiences.reduce(
    (min, exp) => (exp.startDate < min ? exp.startDate : min),
    experiences[0].startDate
  );
  return formatDuration(earliest, undefined, language);
}
