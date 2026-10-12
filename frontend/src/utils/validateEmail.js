// Catches the common case a plain regex misses: an email that's shaped correctly but has a
// typo'd domain (zubairxcoder@gmal.com, @gamil.com, @yaho.com, ...). We compare the domain
// against a short list of popular providers using edit distance and suggest the fix instead of
// silently accepting a message that will bounce.
const COMMON_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'live.com',
  'aol.com',
];

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Returns a suggested correction (e.g. "gmail.com") if the given domain looks like a near-miss
// typo of a common provider, otherwise null.
export function suggestDomainFix(email) {
  const at = email.lastIndexOf('@');
  if (at === -1) return null;
  const domain = email.slice(at + 1).toLowerCase();
  if (!domain || COMMON_DOMAINS.includes(domain)) return null;

  for (const known of COMMON_DOMAINS) {
    const distance = levenshtein(domain, known);
    if (distance > 0 && distance <= 2) return known;
  }
  return null;
}
