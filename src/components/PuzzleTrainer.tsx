import { Chess, type PieceSymbol, type Square } from "chess.js";
import { Filter, Lightbulb, RotateCcw, SkipForward } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Puzzle as PuzzleType } from "../types";
import { isPromotionMove, moveToUci } from "../lib/chessUtils";
import { markPuzzleSolved } from "../lib/storage";
import { ChessBoard } from "./ChessBoard";
import { PromotionDialog } from "./PromotionDialog";

export function PuzzleTrainer({ puzzles }: { puzzles: PuzzleType[] }) {
  const [theme, setTheme] = useState("tutti");
  const [difficulty, setDifficulty] = useState("tutte");
  const filtered = useMemo(
    () =>
      puzzles.filter(
        (puzzle) =>
          (theme === "tutti" || puzzle.theme === theme) &&
          (difficulty === "tutte" || puzzle.difficulty === difficulty),
      ),
    [difficulty, puzzles, theme],
  );
  const [index, setIndex] = useState(0);
  const puzzle = filtered[index % Math.max(1, filtered.length)] ?? puzzles[0]!;
  const [fen, setFen] = useState(puzzle.fen);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const themes = [...new Set(puzzles.map((item) => item.theme))];
  const difficulties = [...new Set(puzzles.map((item) => item.difficulty))];

  useEffect(() => {
    reset(puzzle);
  }, [puzzle.id]);

  function reset(nextPuzzle = puzzle) {
    setFen(nextPuzzle.fen);
    setFeedback(null);
    setPendingPromotion(null);
  }

  function goNext() {
    const nextIndex = (index + 1) % Math.max(1, filtered.length);
    setIndex(nextIndex);
    reset(filtered[nextIndex] ?? puzzles[0]);
  }

  function applyMove(from: Square, to: Square, promotion?: PieceSymbol) {
    const game = new Chess(fen);
    try {
      const move = game.move({ from, to, promotion: promotion ?? "q" });
      const uci = moveToUci(move);
      const expected = puzzle.solution[0];
      if (uci === expected) {
        setFen(game.fen());
        setFeedback(`Corretto: ${puzzle.explanation}`);
        markPuzzleSolved(puzzle.id, true);
      } else {
        setFeedback(`Non è la soluzione più precisa. ${puzzle.explanation}`);
        markPuzzleSolved(puzzle.id, false);
      }
    } catch {
      setFeedback("Mossa non legale in questa posizione.");
    }
  }

  return (
    <section className="puzzle-panel panel stack">
      <div className="split">
        <h2 className="section-title">Puzzle trainer</h2>
        <span className="badge badge-Theory">{puzzle.theme}</span>
      </div>
      <div className="row">
        <label className="row">
          <Filter size={16} />
          <select
            className="form-control"
            value={theme}
            onChange={(event) => {
              setTheme(event.target.value);
              setIndex(0);
            }}
          >
            <option value="tutti">Tutti i temi</option>
            {themes.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <select
          className="form-control"
          value={difficulty}
          onChange={(event) => {
            setDifficulty(event.target.value);
            setIndex(0);
          }}
        >
          <option value="tutte">Tutte le difficoltà</option>
          {difficulties.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="play-grid">
        <ChessBoard
          fen={fen}
          orientation={puzzle.sideToMove}
          allowMoves
          activeSide={new Chess(fen).turn() as "w" | "b"}
          onMove={({ from, to }) => {
            if (isPromotionMove(fen, from, to)) setPendingPromotion({ from, to });
            else applyMove(from, to);
          }}
        />
        <div className="stack">
          <div className="notice row">
            <Lightbulb size={16} /> {puzzle.hint}
          </div>
          {feedback ? <div className={`notice ${feedback.startsWith("Corretto") ? "success" : "danger"}`}>{feedback}</div> : null}
          <div className="row">
            <button className="soft-button" onClick={() => reset()}>
              <RotateCcw size={16} /> Reset
            </button>
            <button className="primary-button" onClick={goNext}>
              <SkipForward size={16} /> Prossimo
            </button>
          </div>
        </div>
      </div>
      <PromotionDialog
        open={Boolean(pendingPromotion)}
        onCancel={() => setPendingPromotion(null)}
        onChoose={(piece) => {
          if (pendingPromotion) applyMove(pendingPromotion.from, pendingPromotion.to, piece);
          setPendingPromotion(null);
        }}
      />
    </section>
  );
}
