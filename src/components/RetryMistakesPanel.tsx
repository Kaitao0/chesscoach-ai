import { Chess, type PieceSymbol, type Square } from "chess.js";
import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { MoveReview } from "../types";
import { isPromotionMove, moveToUci } from "../lib/chessUtils";
import { markRetryCompleted } from "../lib/storage";
import { ChessBoard } from "./ChessBoard";
import { PromotionDialog } from "./PromotionDialog";

export function RetryMistakesPanel({ reviews }: { reviews: MoveReview[] }) {
  const mistakes = useMemo(
    () => reviews.filter((review) => ["Mistake", "Blunder", "Miss"].includes(review.classification)),
    [reviews],
  );
  const [index, setIndex] = useState(0);
  const current = mistakes[index];
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  if (!current) {
    return <div className="notice success">Nessun errore critico da riprovare in questa partita.</div>;
  }

  function tryMove(from: Square, to: Square, promotion?: PieceSymbol) {
    if (!current) return;
    const game = new Chess(current.fenBefore);
    try {
      const move = game.move({ from, to, promotion: promotion ?? "q" });
      const played = moveToUci(move);
      const best = current.bestMove?.move;
      if (best && played === best) {
        setFeedback("Ottimo: hai trovato la migliore alternativa indicata dalla review.");
        markRetryCompleted(current.id);
      } else if (current.bestMove && Math.abs((current.bestMove.evaluation.cp ?? 0) - current.evalAfter.cp) <= 90) {
        setFeedback("Mossa accettabile, ma la review preferiva un'altra continuazione.");
      } else {
        setFeedback(`Non ancora. La review suggeriva ${current.bestMove?.san ?? "una mossa più precisa"}.`);
      }
    } catch {
      setFeedback("Mossa non legale in questa posizione.");
    }
  }

  return (
    <section className="panel stack">
      <div className="split">
        <h2 className="section-title row">
          <RotateCcw size={18} /> Riprova errori
        </h2>
        <span className="badge badge-Mistake">
          {index + 1}/{mistakes.length}
        </span>
      </div>
      <div className="review-grid">
        <ChessBoard
          fen={current.fenBefore}
          orientation={current.color}
          allowMoves
          activeSide={current.color}
          onMove={({ from, to }) => {
            if (isPromotionMove(current.fenBefore, from, to)) setPendingPromotion({ from, to });
            else tryMove(from, to);
          }}
        />
        <div className="stack">
          <div className="notice danger">Posizione prima di {current.san}. Trova una scelta migliore.</div>
          {feedback ? <div className={`notice ${feedback.startsWith("Ottimo") ? "success" : ""}`}>{feedback}</div> : null}
          <button
            className="primary-button"
            onClick={() => {
              setIndex((value) => (value + 1) % mistakes.length);
              setFeedback(null);
            }}
          >
            Prossimo errore
          </button>
        </div>
      </div>
      <PromotionDialog
        open={Boolean(pendingPromotion)}
        onCancel={() => setPendingPromotion(null)}
        onChoose={(piece) => {
          if (pendingPromotion) tryMove(pendingPromotion.from, pendingPromotion.to, piece);
          setPendingPromotion(null);
        }}
      />
    </section>
  );
}
