import type { Game, UserProfile, UserProgress } from "../types";

const profileKey = "chesscoach.profile";
const progressKey = "chesscoach.progress";
const gamesKey = "chesscoach.games";

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUserProfile(): UserProfile {
  const existing = readJson<UserProfile | null>(profileKey, null);
  if (existing) return existing;

  const profile: UserProfile = {
    id: createId("user"),
    username: "Studente",
    createdAt: new Date().toISOString(),
    estimatedRating: 850,
    totalGames: 0,
    puzzleRating: 900,
    preferredColor: "white",
  };
  writeJson(profileKey, profile);
  return profile;
}

export function saveUserProfile(profile: UserProfile) {
  writeJson(profileKey, profile);
}

export function getUserProgress(): UserProgress {
  const profile = getUserProfile();
  const existing = readJson<UserProgress | null>(progressKey, null);
  if (existing) return existing;

  const progress: UserProgress = {
    userId: profile.id,
    completedLessons: [],
    solvedPuzzles: [],
    failedPuzzles: [],
    commonMistakes: {},
    openingStats: {},
    retryMistakesCompleted: [],
  };
  writeJson(progressKey, progress);
  return progress;
}

export function saveUserProgress(progress: UserProgress) {
  writeJson(progressKey, progress);
}

export function getGames(): Game[] {
  return readJson<Game[]>(gamesKey, []);
}

export function getGameById(gameId: string): Game | undefined {
  if (gameId === "latest") return getGames()[0];
  return getGames().find((game) => game.id === gameId);
}

export function saveGame(game: Game) {
  const games = getGames();
  const nextGames = [game, ...games.filter((item) => item.id !== game.id)].slice(0, 30);
  writeJson(gamesKey, nextGames);

  const profile = getUserProfile();
  saveUserProfile({
    ...profile,
    totalGames: nextGames.length,
    estimatedRating: Math.max(400, profile.estimatedRating + (game.result.includes("1-0") ? 8 : game.result.includes("0-1") ? -5 : 1)),
  });

  const progress = getUserProgress();
  const nextMistakes = { ...progress.commonMistakes };
  for (const review of game.moveReview) {
    if (["Mistake", "Blunder", "Miss"].includes(review.classification)) {
      nextMistakes[review.classification] = (nextMistakes[review.classification] ?? 0) + 1;
    }
  }
  const openingStats = { ...progress.openingStats };
  if (game.openingName) openingStats[game.openingName] = (openingStats[game.openingName] ?? 0) + 1;
  saveUserProgress({ ...progress, commonMistakes: nextMistakes, openingStats });
}

export function markPuzzleSolved(puzzleId: string, solved: boolean) {
  const progress = getUserProgress();
  const solvedPuzzles = new Set(progress.solvedPuzzles);
  const failedPuzzles = new Set(progress.failedPuzzles);
  if (solved) {
    solvedPuzzles.add(puzzleId);
    failedPuzzles.delete(puzzleId);
  } else {
    failedPuzzles.add(puzzleId);
  }
  saveUserProgress({ ...progress, solvedPuzzles: [...solvedPuzzles], failedPuzzles: [...failedPuzzles] });
}

export function markLessonCompleted(lessonId: string) {
  const progress = getUserProgress();
  if (progress.completedLessons.includes(lessonId)) return;
  saveUserProgress({ ...progress, completedLessons: [...progress.completedLessons, lessonId] });
}

export function markRetryCompleted(reviewId: string) {
  const progress = getUserProgress();
  if (progress.retryMistakesCompleted.includes(reviewId)) return;
  saveUserProgress({
    ...progress,
    retryMistakesCompleted: [...progress.retryMistakesCompleted, reviewId],
  });
}

export function newGameId(): string {
  return createId("game");
}
