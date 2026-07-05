import type { PieceSymbol } from "chess.js";

const choices: Array<{ piece: PieceSymbol; label: string; glyph: string }> = [
  { piece: "q", label: "Donna", glyph: "♕" },
  { piece: "r", label: "Torre", glyph: "♖" },
  { piece: "b", label: "Alfiere", glyph: "♗" },
  { piece: "n", label: "Cavallo", glyph: "♘" },
];

export function PromotionDialog({
  open,
  onChoose,
  onCancel,
}: {
  open: boolean;
  onChoose: (piece: PieceSymbol) => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Promozione pedone">
      <div className="modal stack">
        <div className="split">
          <h2 className="section-title">Promozione</h2>
          <button className="icon-button" onClick={onCancel} title="Chiudi">
            ×
          </button>
        </div>
        <div className="promotion-grid">
          {choices.map((choice) => (
            <button key={choice.piece} onClick={() => onChoose(choice.piece)} title={choice.label}>
              {choice.glyph}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
