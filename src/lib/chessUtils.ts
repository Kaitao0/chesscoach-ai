import { Chess, type Color, type PieceSymbol, type Square } from "chess.js";
import type { EngineEvaluation, Side } from "../types";

export const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
export const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;

const pieceGlyphs: Record<Color, Record<PieceSymbol, string>> = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
};

export const pieceNames: Record<PieceSymbol, string> = {
  k: "re",
  q: "donna",
  r: "torre",
  b: "alfiere",
  n: "cavallo",
  p: "pedone",
};

export const pieceValues: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0,
};

export function getBoardSquares(orientation: Side): Square[] {
  const rankOrder = orientation === "w" ? [...ranks].reverse() : [...ranks];
  const fileOrder = orientation === "w" ? [...files] : [...files].reverse();

  return rankOrder.flatMap((rank) => fileOrder.map((file) => `${file}${rank}` as Square));
}

export function getFileLabels(orientation: Side): string[] {
  return orientation === "w" ? [...files] : [...files].reverse();
}

export function getRankLabels(orientation: Side): string[] {
  return orientation === "w" ? [...ranks].reverse() : [...ranks];
}

export function pieceToGlyph(piece?: { type: PieceSymbol; color: Color } | null): string {
  if (!piece) return "";
  return pieceGlyphs[piece.color][piece.type];
}

export function squareTone(square: string): "light" | "dark" {
  const fileIndex = files.indexOf(square[0] as (typeof files)[number]);
  const rankIndex = Number(square[1]) - 1;
  return (fileIndex + rankIndex) % 2 === 0 ? "dark" : "light";
}

export function findKingSquare(fen: string, color: Side): Square | undefined {
  const game = new Chess(fen);
  const board = game.board();
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const piece = board[row][col];
      if (piece?.type === "k" && piece.color === color) {
        const file = files[col];
        const rank = String(8 - row);
        return `${file}${rank}` as Square;
      }
    }
  }
  return undefined;
}

export function getLegalTargets(fen: string, square: Square): Square[] {
  const game = new Chess(fen);
  return game.moves({ square, verbose: true }).map((move) => move.to as Square);
}

export function isPromotionMove(fen: string, from: Square, to: Square): boolean {
  const game = new Chess(fen);
  const piece = game.get(from);
  if (!piece || piece.type !== "p") return false;
  const targetRank = to[1];
  return (piece.color === "w" && targetRank === "8") || (piece.color === "b" && targetRank === "1");
}

export function tryMove(fen: string, from: Square, to: Square, promotion = "q") {
  const game = new Chess(fen);
  try {
    return game.move({ from, to, promotion });
  } catch {
    return null;
  }
}

export function materialBalance(fen: string): number {
  const game = new Chess(fen);
  return game
    .board()
    .flat()
    .reduce((score, piece) => {
      if (!piece) return score;
      const value = pieceValues[piece.type];
      return score + (piece.color === "w" ? value : -value);
    }, 0);
}

export function moveToUci(move: { from: string; to: string; promotion?: string }): string {
  return `${move.from}${move.to}${move.promotion ?? ""}`;
}

export function sideName(side: Side): "Bianco" | "Nero" {
  return side === "w" ? "Bianco" : "Nero";
}

export function sideFromTurn(turn: string): Side {
  return turn === "b" ? "b" : "w";
}

export function formatEvaluation(evaluation?: EngineEvaluation): string {
  if (!evaluation) return "0.0";
  if (typeof evaluation.mate === "number") {
    const sign = evaluation.mate > 0 ? "+" : "-";
    return `${sign}M${Math.abs(evaluation.mate)}`;
  }
  const pawns = evaluation.cp / 100;
  return `${pawns > 0 ? "+" : ""}${pawns.toFixed(1)}`;
}

export function resultFromGame(game: Chess): string {
  if (!game.isGameOver()) return "In corso";
  if (game.isCheckmate()) {
    return game.turn() === "w" ? "0-1, matto" : "1-0, matto";
  }
  if (game.isStalemate()) return "1/2-1/2, stallo";
  if (game.isInsufficientMaterial()) return "1/2-1/2, materiale insufficiente";
  if (game.isThreefoldRepetition()) return "1/2-1/2, ripetizione";
  if (game.isDraw()) return "1/2-1/2, patta";
  return "Terminata";
}

export function safeFen(fen?: string): string {
  try {
    return new Chess(fen).fen();
  } catch {
    return new Chess().fen();
  }
}
