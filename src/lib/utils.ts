import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function avatarUrl(name: string, bg = "111827", color = "ffffff") {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=${color}&bold=true&format=svg`;
}

export function percent(value: number) {
  return `${Math.round(value)}%`;
}

export function ms(value: number) {
  return `${(value / 1000).toFixed(1)}s`;
}

export function closeNameMatch(expected: string, answer: string) {
  const a = expected.toLowerCase().trim();
  const b = answer.toLowerCase().trim();
  if (!b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;
  const distance = levenshtein(a, b);
  return distance <= Math.max(1, Math.floor(a.length * 0.18));
}

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

export function scoreAnswer(correct: boolean, responseTimeMs: number, streak: number, level: number) {
  if (!correct) return Math.max(0, 8 - level);
  const base = 100 + level * 15;
  const speedBonus = Math.max(0, 80 - Math.floor(responseTimeMs / 75));
  const streakMultiplier = 1 + Math.min(streak, 10) * 0.04;
  const masteryBonus = level === 8 ? 150 : 0;
  // Score = correct-answer base + speed bonus, multiplied by streak momentum.
  // Mastery exams add bonus XP. Competition screens weight accuracy above this raw speed score.
  return Math.round((base + speedBonus + masteryBonus) * streakMultiplier);
}

export function nextReviewInterval(correct: boolean, responseTimeMs: number, currentMastery: number) {
  if (!correct) return 1;
  if (responseTimeMs > 5000) return Math.max(1, currentMastery + 1);
  return [1, 2, 4, 7, 14, 30, 60][Math.min(currentMastery, 6)];
}
