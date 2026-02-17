export function calculateScore(difficulty: number, streak: number) {
  const base = difficulty * 10;
  const multiplier = Math.min(1 + streak * 0.1, 2);
  return Math.floor(base * multiplier);
}
