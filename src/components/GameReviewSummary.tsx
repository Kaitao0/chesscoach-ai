import { Medal, RotateCcw, Save, Share } from "lucide-react";
import type { Game } from "../types";
import { countClassifications, keyMoments, studySuggestions } from "../lib/gameReview";
import { MoveClassificationBadge } from "./MoveClassificationBadge";

export function GameReviewSummary({
  game,
  onExport,
  onRetry,
  onSave,
}: {
  game: Game;
  onExport: () => void;
  onRetry: () => void;
  onSave: () => void;
}) {
  const counts = countClassifications(game.moveReview);
  const moments = keyMoments(game.moveReview);
  const suggestions = studySuggestions(game.moveReview, game.openingName);

  return (
    <section className="panel stack">
      <div className="split">
        <h2 className="section-title row">
          <Medal size={18} /> Game Review
        </h2>
        <span className="badge badge-Good">{game.result}</span>
      </div>
      <div className="metric-grid">
        <div className="metric">
          <span className="muted">Accuratezza Bianco</span>
          <strong className="metric-value">{game.whiteAccuracy}%</strong>
        </div>
        <div className="metric">
          <span className="muted">Accuratezza Nero</span>
          <strong className="metric-value">{game.blackAccuracy}%</strong>
        </div>
        <div className="metric">
          <span className="muted">Apertura</span>
          <strong className="metric-value" style={{ fontSize: "1rem" }}>{game.openingName ?? "Non rilevata"}</strong>
        </div>
      </div>
      <div className="row">
        {(Object.keys(counts) as Array<keyof typeof counts>).map((classification) => (
          <span className="row" key={classification}>
            <MoveClassificationBadge classification={classification} /> {counts[classification]}
          </span>
        ))}
      </div>
      <div className="table-like">
        <div className="table-row">
          <strong>Peggior errore</strong>
          <span>{moments.worst ? `${moments.worst.moveNumber}. ${moments.worst.san} (${moments.worst.cpLoss}cp)` : "Nessuno"}</span>
          <span />
        </div>
        <div className="table-row">
          <strong>Migliore mossa</strong>
          <span>{moments.best ? `${moments.best.moveNumber}. ${moments.best.san}` : "Non ancora emersa"}</span>
          <span />
        </div>
        <div className="table-row">
          <strong>Mossa mancata</strong>
          <span>{moments.missed ? `${moments.missed.moveNumber}. ${moments.missed.san}` : "Nessuna"}</span>
          <span />
        </div>
      </div>
      <div className="notice">
        {suggestions.map((suggestion) => (
          <div key={suggestion}>{suggestion}</div>
        ))}
      </div>
      <div className="row">
        <button className="primary-button" onClick={onRetry}>
          <RotateCcw size={16} /> Riprova errori
        </button>
        <button className="soft-button" onClick={onExport}>
          <Share size={16} /> Esporta PGN
        </button>
        <button className="ghost-button" onClick={onSave}>
          <Save size={16} /> Salva partita
        </button>
      </div>
    </section>
  );
}
