import { useMemo, useState } from "react";
import { Chess, type Square } from "chess.js";
import type { Side } from "../types";
import {
  findKingSquare,
  getBoardSquares,
  getFileLabels,
  getRankLabels,
  pieceToGlyph,
  squareTone,
} from "../lib/chessUtils";

export interface BoardMove {
  from: Square;
  to: Square;
}

export function ChessBoard({
  fen,
  orientation = "w",
  allowMoves = false,
  activeSide,
  lastMove,
  onMove,
  focusSquares = [],
}: {
  fen: string;
  orientation?: Side;
  allowMoves?: boolean;
  activeSide?: Side;
  lastMove?: { from: string; to: string };
  onMove?: (move: BoardMove) => void;
  focusSquares?: string[];
}) {
  const [selected, setSelected] = useState<Square | null>(null);
  const game = useMemo(() => new Chess(fen), [fen]);
  const squares = useMemo(() => getBoardSquares(orientation), [orientation]);
  const fileLabels = useMemo(() => getFileLabels(orientation), [orientation]);
  const rankLabels = useMemo(() => getRankLabels(orientation), [orientation]);
  const legalMoves = useMemo(
    () => (selected ? game.moves({ square: selected, verbose: true }) : []),
    [game, selected],
  );
  const legalTargets = new Set(legalMoves.map((move) => move.to));
  const captureTargets = new Set(legalMoves.filter((move) => move.captured).map((move) => move.to));
  const checkSquare = game.isCheck() ? findKingSquare(fen, game.turn() as Side) : undefined;

  function handleSquareClick(square: Square) {
    if (!allowMoves || !onMove) return;
    const piece = game.get(square);
    const turn = game.turn() as Side;
    const canSelectPiece = piece && piece.color === turn && (!activeSide || activeSide === piece.color);

    if (selected && legalTargets.has(square)) {
      onMove({ from: selected, to: square });
      setSelected(null);
      return;
    }

    if (canSelectPiece) {
      setSelected(square);
      return;
    }

    setSelected(null);
  }

  return (
    <div className="chess-area">
      <div className="rank-labels" aria-hidden="true">
        {rankLabels.map((rank) => (
          <span key={rank}>{rank}</span>
        ))}
      </div>
      <div className="board-wrap">
        <div className="chess-board" role="grid" aria-label="Scacchiera">
          {squares.map((square) => {
            const piece = game.get(square);
            const classes = [
              "square",
              squareTone(square),
              selected === square ? "selected" : "",
              lastMove?.from === square || lastMove?.to === square ? "last" : "",
              legalTargets.has(square) ? "legal" : "",
              captureTargets.has(square) ? "capture" : "",
              checkSquare === square ? "check" : "",
              focusSquares.includes(square) ? "selected" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={square}
                className={classes}
                onClick={() => handleSquareClick(square)}
                role="gridcell"
                aria-label={`${square}${piece ? ` ${piece.color === "w" ? "bianco" : "nero"} ${piece.type}` : ""}`}
              >
                {piece ? <span className={`piece ${piece.color === "w" ? "white" : "black"}`}>{pieceToGlyph(piece)}</span> : null}
              </button>
            );
          })}
        </div>
        <div className="file-labels" aria-hidden="true">
          {fileLabels.map((file) => (
            <span key={file}>{file}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
