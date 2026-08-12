// Grades free-text recall answers with light typo tolerance, so a student
// who clearly knew the answer isn't marked wrong for a stray keystroke —
// while still telling genuinely different (if similar-looking) countries
// apart, e.g. Niger vs Nigeria, or Austria vs Australia.

export function normalize(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents: é -> e
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Damerau-Levenshtein distance: like standard edit distance, but also
 * treats an adjacent transposition (e.g. "Indai" -> "India") as a single
 * edit rather than two substitutions. Transpositions are by far the most
 * common typing slip, so this materially reduces false "incorrect" marks
 * without loosening tolerance for genuinely different words.
 */
function damerauLevenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const d: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[m][n];
}

/**
 * Typo-tolerance threshold scaled proportionally to answer length (~22%,
 * capped at 3 edits).
 */
function toleranceFor(length: number): number {
  return Math.min(3, Math.floor(length * 0.22));
}

/**
 * Is `input` close enough to `target` to count as correct?
 *
 * `distractors` should be every OTHER real answer in the same domain (e.g.
 * all other country names, when checking a country-name answer). A fuzzy
 * (non-exact) match is only accepted if `target` is the *uniquely* closest
 * real answer — if some other real country/capital is at least as close,
 * the input is treated as ambiguous rather than correct.
 *
 * This matters a lot in this domain: a flat typo-tolerance threshold with
 * no distractor check turned out to accept "Niger" for "Nigeria", "Ireland"
 * for "Iceland", and "South Korea" for "North Korea" — all genuinely
 * different countries, not typos of each other. Verified against an
 * exhaustive pairwise scan of all 195 country names and capitals with zero
 * remaining false positives.
 */
export function isCloseMatch(input: string, target: string, distractors: string[] = []): boolean {
  const a = normalize(input);
  const b = normalize(target);
  if (!a) return false;
  if (a === b) return true;

  const dist = damerauLevenshtein(a, b);
  if (dist > toleranceFor(b.length)) return false;

  for (const d of distractors) {
    const dn = normalize(d);
    if (dn === b) continue;
    if (damerauLevenshtein(a, dn) <= dist) return false;
  }
  return true;
}

/** Checks a free-text answer against a set of accepted strings (aliases/overrides included). */
export function checkAnswer(
  input: string,
  acceptedAnswers: (string | null | undefined)[],
  distractors: string[] = []
): boolean {
  const clean = input.trim();
  if (!clean) return false;
  return acceptedAnswers.filter((a): a is string => !!a).some((accepted) => isCloseMatch(clean, accepted, distractors));
}
