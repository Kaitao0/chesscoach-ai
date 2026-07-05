import { AlertTriangle, Brain, Info, Lightbulb, Target } from "lucide-react";
import { useState } from "react";
import type { EngineEvaluation, MoveReview } from "../types";
import { formatEvaluation } from "../lib/chessUtils";
import { MoveClassificationBadge } from "./MoveClassificationBadge";

export function CoachPanel({
  evaluation,
  latestReview,
  openingName,
  inCheck,
  thinking,
}: {
  evaluation?: EngineEvaluation;
  latestReview?: MoveReview;
  openingName?: string;
  inCheck?: boolean;
  thinking?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="coach-panel stack">
      <div className="split">
        <h2 className="section-title row">
          <Brain size={18} /> Coach
        </h2>
        <span className="badge badge-Good">{thinking ? "Analisi..." : formatEvaluation(evaluation)}</span>
      </div>

      {inCheck ? (
        <div className="notice danger row">
          <AlertTriangle size={18} /> Il re è sotto scacco: prima risolvi la minaccia.
        </div>
      ) : null}

      {latestReview ? (
        <div className="coach-main stack">
          <MoveClassificationBadge classification={latestReview.classification} />
          <p>{latestReview.explanation}</p>
          <div className="row muted">
            <Target size={16} />
            Alternativa: {latestReview.bestMove?.san ?? "nessuna linea chiara"}
          </div>
          <div className="row muted">
            <Lightbulb size={16} />
            {latestReview.coachTip}
          </div>
          {openingName ? <div className="notice">Apertura: {openingName}</div> : null}
          <button className="ghost-button" onClick={() => setExpanded((value) => !value)}>
            <Info size={16} /> Perché?
          </button>
          {expanded ? (
            <div className="notice">
              Per questa valutazione uso FEN, mossa giocata, migliore alternativa, valutazioni del motore fallback e materiale. Se il motivo tattico
              non è dimostrabile con questi dati, il coach resta prudente invece di inventare.
            </div>
          ) : null}
        </div>
      ) : (
        <div className="notice">Gioca una mossa: qui compariranno classificazione, alternativa e consiglio pratico.</div>
      )}
    </aside>
  );
}
