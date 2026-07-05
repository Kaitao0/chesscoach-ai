import { Chess, type Move } from "chess.js";
import type { BotDifficulty, Game, MoveClassification, MoveReview, Side } from "../types";
import { resultFromGame } from "./chessUtils";
import { detectOpening } from "./openings";
import { getUserProfile, newGameId } from "./storage";

const reviewWeights: Record<MoveClassification, number> = {
  Theory: 0,
  Best: 0,
  Excellent: 3,
  Great: 2,
  Good: 8,
  Inaccuracy: 18,
  Mistake: 42,
  Blunder: 82,
  Miss: 64,
  Brilliant: -5,
};

export function estimateAccuracy(reviews: MoveReview[], side: Side): number {
  const sideReviews = reviews.filter((review) => review.color === side);
  if (sideReviews.length === 0) return 100;
  const penalty = sideReviews.reduce((sum, review) => {
    const cpPenalty = Math.min(35, review.cpLoss / 16);
    return sum + reviewWeights[review.classification] + cpPenalty;
  }, 0);
  return Math.max(1, Math.min(100, Math.round(100 - penalty / sideReviews.length)));
}

export function countClassifications(reviews: MoveReview[]): Record<MoveClassification, number> {
  return reviews.reduce(
    (acc, review) => {
      acc[review.classification] += 1;
      return acc;
    },
    {
      Theory: 0,
      Best: 0,
      Excellent: 0,
      Great: 0,
      Good: 0,
      Inaccuracy: 0,
      Mistake: 0,
      Blunder: 0,
      Miss: 0,
      Brilliant: 0,
    } satisfies Record<MoveClassification, number>,
  );
}

export function keyMoments(reviews: MoveReview[]) {
  const mistakes = reviews.filter((review) => ["Mistake", "Blunder", "Miss"].includes(review.classification));
  const worst = [...mistakes].sort((a, b) => b.cpLoss - a.cpLoss)[0];
  const best = reviews.find((review) => review.classification === "Brilliant") ?? reviews.find((review) => review.classification === "Best");
  const missed = reviews.find((review) => review.classification === "Miss");
  return { mistakes, worst, best, missed };
}

export function studySuggestions(reviews: MoveReview[], openingName?: string): string[] {
  const counts = countClassifications(reviews);
  const suggestions = [];
  if (counts.Blunder + counts.Mistake > 1) suggestions.push("Allenati con il controllo dei pezzi indifesi prima di ogni mossa.");
  if (counts.Miss > 0) suggestions.push("Dedica 10 minuti a pattern forzanti: scacchi, catture e minacce.");
  if (openingName) suggestions.push(`Rivedi il piano tipico di ${openingName}, non solo le prime mosse.`);
  if (counts.Inaccuracy > counts.Mistake + counts.Blunder) suggestions.push("Lavora su sviluppo, centro e sicurezza del re per ridurre piccole imprecisioni.");
  return suggestions.length ? suggestions : ["Continua con puzzle brevi e una review dopo ogni partita."];
}

export function buildGameFromReviews(args: {
  reviews: MoveReview[];
  pgn: string;
  finalFen: string;
  userColor: Side;
  difficulty: BotDifficulty;
  result?: string;
}): Game {
  const profile = getUserProfile();
  const opening = detectOpening(args.reviews.map((review) => review.san));
  return {
    id: newGameId(),
    userId: profile.id,
    date: new Date().toISOString(),
    result: args.result ?? "In corso",
    pgn: args.pgn,
    finalFen: args.finalFen,
    color: args.userColor,
    botDifficulty: args.difficulty,
    whiteAccuracy: estimateAccuracy(args.reviews, "w"),
    blackAccuracy: estimateAccuracy(args.reviews, "b"),
    openingName: opening?.name,
    moveReview: args.reviews,
  };
}

export function buildImportedGame(pgn: string): Game | null {
  const game = new Chess();
  try {
    game.loadPgn(pgn);
  } catch {
    return null;
  }

  const replay = new Chess();
  const reviews: MoveReview[] = [];
  const moves = game.history({ verbose: true }) as Move[];
  for (const move of moves) {
    const fenBefore = replay.fen();
    const applied = replay.move({ from: move.from, to: move.to, promotion: move.promotion ?? "q" });
    const fenAfter = replay.fen();
    reviews.push({
      id: `${reviews.length}-${move.from}-${move.to}`,
      moveNumber: Math.ceil((reviews.length + 1) / 2),
      color: move.color as Side,
      san: applied.san,
      from: move.from,
      to: move.to,
      promotion: move.promotion,
      fenBefore,
      fenAfter,
      classification: "Good",
      evalBefore: { cp: 0, depth: 0 },
      evalAfter: { cp: 0, depth: 0 },
      explanation: "Review importata: usa Analizza partita in una versione futura per ricalcolare il motore su ogni mossa.",
      coachTip: "La struttura è pronta per un'analisi più profonda via engine adapter.",
      isBook: false,
      isMistakeRetryAvailable: false,
      cpLoss: 0,
      winProbabilityBefore: 0.5,
      winProbabilityAfter: 0.5,
    });
  }

  return buildGameFromReviews({
    reviews,
    pgn,
    finalFen: game.fen(),
    userColor: "w",
    difficulty: "medium",
    result: resultFromGame(game),
  });
}
