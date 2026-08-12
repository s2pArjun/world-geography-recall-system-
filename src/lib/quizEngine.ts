import type { CountryFeature, CountryStats, QuizQuestionType } from '../types';

/**
 * Weight a country for random quiz selection. Unseen countries get a solid
 * default weight (so the quiz naturally covers new ground); countries the
 * learner keeps getting wrong get weighted up sharply; mastered countries
 * are weighted down but never to zero, so they still resurface occasionally.
 *
 * Example from spec: India (5/5 correct) should appear far less often than
 * Lesotho (1 correct, 4 wrong).
 */
export function weaknessWeight(stats?: CountryStats): number {
  if (!stats || stats.attempts === 0) return 3;
  const accuracy = stats.correct / stats.attempts;
  const base = 1 + (1 - accuracy) * 6; // 1 (perfect) .. 7 (always wrong)
  // Small recency nudge: don't immediately re-ask the country just answered.
  const secondsSinceSeen = (Date.now() - stats.lastSeen) / 1000;
  const recencyDamp = secondsSinceSeen < 20 ? 0.15 : 1;
  return Math.max(0.4, base) * recencyDamp;
}

export function weightedPick<T>(items: T[], weightFn: (item: T) => number): T | null {
  if (items.length === 0) return null;
  const weights = items.map(weightFn);
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return items[Math.floor(Math.random() * items.length)];
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function pickQuizCountry(
  pool: CountryFeature[],
  statsById: Record<string, CountryStats>
): CountryFeature | null {
  return weightedPick(pool, (f) => weaknessWeight(statsById[f.properties.id]));
}

export function pickQuestionType(): QuizQuestionType {
  const r = Math.random();
  if (r < 0.38) return 'capital';
  if (r < 0.72) return 'continent';
  return 'find';
}

/** Ranks countries by weakness for the "Revise Weak Countries" list — attempted at least once, more wrong than mastery. */
export function weakestCountries(
  pool: CountryFeature[],
  statsById: Record<string, CountryStats>,
  limit = 15
): { feature: CountryFeature; stats: CountryStats }[] {
  return pool
    .map((f) => ({ feature: f, stats: statsById[f.properties.id] }))
    .filter((x): x is { feature: CountryFeature; stats: CountryStats } => !!x.stats && x.stats.attempts > 0)
    .filter((x) => x.stats.wrong > 0)
    .sort((a, b) => weaknessWeight(b.stats) - weaknessWeight(a.stats))
    .slice(0, limit);
}
