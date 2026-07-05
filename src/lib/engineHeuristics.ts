import { Chess, type Move } from "chess.js";
import type { BotDifficulty, EngineAnalysis, EngineEvaluation, EngineMove } from "../types";
import { moveToUci, pieceValues } from "./chessUtils";

const centerSquares = new Set(["d4", "e4", "d5", "e5"]);
const extendedCenter = new Set(["c3", "d3", "e3", "f3", "c4", "f4", "c5", "f5", "c6", "d6", "e6", "f6"]);

const difficultyConfig: Record<BotDifficulty, { depth: number; noise: number; candidates: number }> = {
  beginner: { depth: 1, noise: 190, candidates: 5 },
  easy: { depth: 2, noise: 95, candidates: 4 },
  medium: { depth: 3, noise: 42, candidates: 3 },
  hard: { depth: 4, noise: 18, candidates: 2 },
  expert: { depth: 5, noise: 4, candidates: 1 },
};

export function depthForDifficulty(difficulty: BotDifficulty): number {
  return difficultyConfig[difficulty].depth;
}

export function evaluateFen(fen: string, depth = 1): EngineEvaluation {
  const game = new Chess(fen);

  if (game.isCheckmate()) {
    return {
      cp: game.turn() === "w" ? -100000 : 100000,
      mate: game.turn() === "w" ? -1 : 1,
      depth,
    };
  }

  let score = 0;
  for (const row of game.board()) {
    for (const piece of row) {
      if (!piece) continue;
      score += piece.color === "w" ? pieceValues[piece.type] : -pieceValues[piece.type];
    }
  }

  const legalMoves = game.moves({ verbose: true });
  const mobility = legalMoves.length * (game.turn() === "w" ? 2 : -2);
  score += mobility;

  for (const move of legalMoves) {
    const direction = game.turn() === "w" ? 1 : -1;
    if (centerSquares.has(move.to)) score += 9 * direction;
    if (extendedCenter.has(move.to)) score += 4 * direction;
    if (move.captured) score += (pieceValues[move.captured] / 12) * direction;
    if (move.san.includes("+")) score += 16 * direction;
  }

  if (game.isCheck()) {
    score += game.turn() === "w" ? -35 : 35;
  }

  return { cp: Math.round(score), depth };
}

function moveAfterEvaluation(fen: string, move: Move, depth: number): EngineMove {
  const game = new Chess(fen);
  game.move({ from: move.from, to: move.to, promotion: move.promotion ?? "q" });
  return {
    move: moveToUci(move),
    san: move.san,
    from: move.from,
    to: move.to,
    promotion: move.promotion,
    evaluation: evaluateFen(game.fen(), depth),
    line: [move.san],
  };
}

export function getTopMovesForFen(fen: string, depth = 2, multipv = 3): EngineMove[] {
  const game = new Chess(fen);
  const side = game.turn();
  return game
    .moves({ verbose: true })
    .map((move) => moveAfterEvaluation(fen, move, depth))
    .sort((a, b) => {
      const aScore = side === "w" ? a.evaluation.cp : -a.evaluation.cp;
      const bScore = side === "w" ? b.evaluation.cp : -b.evaluation.cp;
      return bScore - aScore;
    })
    .slice(0, multipv);
}

export function getBestMoveForFen(fen: string, depth = 2): EngineMove | undefined {
  return getTopMovesForFen(fen, depth, 1)[0];
}

export function getAnalysisForFen(fen: string, depth = 2, multipv = 3): EngineAnalysis {
  const topMoves = getTopMovesForFen(fen, depth, multipv);
  return {
    fen,
    evaluation: evaluateFen(fen, depth),
    bestMove: topMoves[0],
    topMoves,
  };
}

export function getBotMoveForFen(fen: string, difficulty: BotDifficulty): EngineMove | undefined {
  const config = difficultyConfig[difficulty];
  const game = new Chess(fen);
  const side = game.turn();
  const topMoves = getTopMovesForFen(fen, config.depth, Math.max(config.candidates, 1));
  if (topMoves.length === 0) return undefined;

  if (config.candidates === 1) return topMoves[0];

  const scored = topMoves.map((move) => {
    const perspectiveScore = side === "w" ? move.evaluation.cp : -move.evaluation.cp;
    return {
      move,
      score: perspectiveScore + (Math.random() * config.noise - config.noise / 2),
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].move;
}
