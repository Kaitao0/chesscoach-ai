import { ArrowLeft, Clipboard, ListChecks } from "lucide-react";
import { useMemo, useState } from "react";
import type { Navigate } from "../App";
import { ChessBoard } from "../components/ChessBoard";
import { EvaluationChart } from "../components/EvaluationChart";
import { GameReviewSummary } from "../components/GameReviewSummary";
import { MoveClassificationBadge } from "../components/MoveClassificationBadge";
import { MoveList } from "../components/MoveList";
import { RetryMistakesPanel } from "../components/RetryMistakesPanel";
import { formatEvaluation } from "../lib/chessUtils";
import { getGameById, saveGame } from "../lib/storage";
import type { MoveReview } from "../types";

export function ReviewPage({ gameId, navigate }: { gameId: string; navigate: Navigate }) {
  const game = useMemo(() => getGameById(gameId), [gameId]);
  const [selected, setSelected] = useState<MoveReview | undefined>(game?.moveReview[game.moveReview.length - 1]);
  const [showRetry, setShowRetry] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  if (!game) {
    return (
      <div className="page">
        <section className="panel stack">
          <h1 className="page-title">Game Review</h1>
          <p className="muted">Non c'è ancora una partita salvata da rivedere.</p>
          <button className="primary-button" onClick={() => navigate("/play")}>
            Gioca una partita
          </button>
        </section>
      </div>
    );
  }

  const active = selected ?? game.moveReview[game.moveReview.length - 1];

  async function exportPgn() {
    try {
      await navigator.clipboard.writeText(game.pgn);
      setExportNotice("PGN copiato negli appunti.");
    } catch {
      setExportNotice(game.pgn || "PGN non disponibile.");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="kicker">Analisi partita</span>
          <h1 className="page-title">Game Review</h1>
        </div>
        <button className="ghost-button" onClick={() => navigate("/")}>
          <ArrowLeft size={16} /> Dashboard
        </button>
      </div>

      <GameReviewSummary
        game={game}
        onExport={() => void exportPgn()}
        onRetry={() => setShowRetry((value) => !value)}
        onSave={() => {
          saveGame(game);
          setExportNotice("Partita salvata nello storico locale.");
        }}
      />
      {exportNotice ? <div className="notice">{exportNotice}</div> : null}
      {showRetry ? <RetryMistakesPanel reviews={game.moveReview} /> : null}

      <div className="review-grid grid">
        <section className="panel stack">
          <EvaluationChart reviews={game.moveReview} activeId={active?.id} onSelect={setSelected} />
          <div className="row" style={{ alignItems: "flex-start" }}>
            <ChessBoard
              fen={active?.fenAfter ?? game.finalFen}
              orientation={game.color}
              lastMove={active ? { from: active.from, to: active.to } : undefined}
            />
          </div>
        </section>
        <div className="stack">
          <MoveList reviews={game.moveReview} activeId={active?.id} onSelect={setSelected} />
          <section className="panel stack">
            <div className="split">
              <h2 className="section-title row">
                <ListChecks size={18} /> Dettaglio mossa
              </h2>
              {active ? <MoveClassificationBadge classification={active.classification} /> : null}
            </div>
            {active ? (
              <>
                <div className="table-like">
                  <div className="table-row">
                    <strong>Mossa</strong>
                    <span>{active.moveNumber}. {active.san}</span>
                    <span />
                  </div>
                  <div className="table-row">
                    <strong>Valutazione</strong>
                    <span>{formatEvaluation(active.evalBefore)} → {formatEvaluation(active.evalAfter)}</span>
                    <span />
                  </div>
                  <div className="table-row">
                    <strong>Alternativa</strong>
                    <span>{active.bestMove?.san ?? "Non disponibile"}</span>
                    <span />
                  </div>
                  <div className="table-row">
                    <strong>Linea</strong>
                    <span>{active.principalVariation?.join(" ") ?? active.bestMove?.line?.join(" ") ?? "Non disponibile"}</span>
                    <span />
                  </div>
                </div>
                <p className="notice">{active.explanation}</p>
                <div className="notice row">
                  <Clipboard size={16} /> {active.coachTip}
                </div>
              </>
            ) : (
              <p className="muted">Seleziona una mossa dal grafico o dallo storico.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
