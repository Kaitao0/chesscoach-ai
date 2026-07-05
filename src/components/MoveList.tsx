import type { MoveReview } from "../types";
import { MoveClassificationBadge } from "./MoveClassificationBadge";

export function MoveList({
  reviews,
  activeId,
  onSelect,
}: {
  reviews: MoveReview[];
  activeId?: string;
  onSelect?: (review: MoveReview) => void;
}) {
  const rows: Array<{ moveNumber: number; white?: MoveReview; black?: MoveReview }> = [];
  for (const review of reviews) {
    const row = rows.find((item) => item.moveNumber === review.moveNumber);
    if (row) row[review.color === "w" ? "white" : "black"] = review;
    else {
      const nextRow: { moveNumber: number; white?: MoveReview; black?: MoveReview } = { moveNumber: review.moveNumber };
      nextRow[review.color === "w" ? "white" : "black"] = review;
      rows.push(nextRow);
    }
  }

  return (
    <div className="move-list">
      <div className="panel-header" style={{ padding: "1rem", marginBottom: 0 }}>
        <h2 className="section-title">Mosse</h2>
        <span className="muted">{reviews.length}</span>
      </div>
      <div className="move-list-scroll">
        {rows.map((row) => (
          <div className="move-row" key={row.moveNumber}>
            <span className="move-number">{row.moveNumber}.</span>
            <MoveButton review={row.white} activeId={activeId} onSelect={onSelect} />
            <MoveButton review={row.black} activeId={activeId} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MoveButton({
  review,
  activeId,
  onSelect,
}: {
  review?: MoveReview;
  activeId?: string;
  onSelect?: (review: MoveReview) => void;
}) {
  if (!review) return <span />;
  return (
    <button className={activeId === review.id ? "active" : ""} onClick={() => onSelect?.(review)} title={review.explanation}>
      <span style={{ display: "inline-flex", gap: "0.45rem", alignItems: "center", padding: 0 }}>
        {review.san}
        <MoveClassificationBadge classification={review.classification} />
      </span>
    </button>
  );
}
