import type { MoveClassification } from "../types";

const labels: Record<MoveClassification, string> = {
  Theory: "Teoria",
  Best: "Migliore",
  Excellent: "Eccellente",
  Great: "Grande",
  Good: "Buona",
  Inaccuracy: "Imprecisione",
  Mistake: "Errore",
  Blunder: "Grave errore",
  Miss: "Mancata",
  Brilliant: "Brillante",
};

export function MoveClassificationBadge({ classification }: { classification: MoveClassification }) {
  return <span className={`badge badge-${classification}`}>{labels[classification]}</span>;
}
