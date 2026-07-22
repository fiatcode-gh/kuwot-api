export interface RawQuote {
  quote: string;
  author: string;
}

export interface CleanQuote {
  q: string;
  a: string;
}

export function normalizeText(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function hasAuthor(author: string): boolean {
  return author.trim().length > 0;
}

export function isValidLength(text: string, min = 20, max = 150): boolean {
  return text.length >= min && text.length <= max;
}

export function dedupeKey(text: string): string {
  return normalizeText(text).toLowerCase();
}

export function prefilter(
  rows: RawQuote[],
  opts: { minLen?: number; maxLen?: number; perAuthorCap?: number } = {}
): CleanQuote[] {
  const { minLen = 20, maxLen = 150, perAuthorCap = 50 } = opts;
  const seen = new Set<string>();
  const perAuthor = new Map<string, number>();
  const out: CleanQuote[] = [];

  for (const row of rows) {
    const q = normalizeText(row.quote ?? '');
    const a = normalizeText(row.author ?? '');
    if (!hasAuthor(a)) continue;
    if (!isValidLength(q, minLen, maxLen)) continue;

    const key = dedupeKey(q);
    if (seen.has(key)) continue;

    const authorKey = a.toLowerCase();
    const count = perAuthor.get(authorKey) ?? 0;
    if (count >= perAuthorCap) continue;

    seen.add(key);
    perAuthor.set(authorKey, count + 1);
    out.push({ q, a });
  }

  return out;
}
