import type { EngineEvaluation } from "../types";
import { formatEvaluation } from "../lib/chessUtils";

export function EvaluationBar({ evaluation }: { evaluation?: EngineEvaluation }) {
  const cp = evaluation?.cp ?? 0;
  const percentage =
    typeof evaluation?.mate === "number"
      ? evaluation.mate > 0
        ? 96
        : 4
      : Math.max(4, Math.min(96, 50 + cp / 18));

  return (
    <div className="stack" aria-label="Valutazione posizione">
      <span className="eval-label">Bianco</span>
      <div className="eval-shell">
        <div className="eval-fill" style={{ height: `${percentage}%` }} />
      </div>
      <span className="eval-label">{formatEvaluation(evaluation)}</span>
      <span className="eval-label">Nero</span>
    </div>
  );
}
