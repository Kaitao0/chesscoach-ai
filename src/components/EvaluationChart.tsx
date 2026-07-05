import type { MoveReview } from "../types";

export function EvaluationChart({
  reviews,
  activeId,
  onSelect,
}: {
  reviews: MoveReview[];
  activeId?: string;
  onSelect?: (review: MoveReview) => void;
}) {
  const width = 720;
  const height = 220;
  const padding = 28;
  const points = reviews.map((review, index) => {
    const x = padding + (index / Math.max(1, reviews.length - 1)) * (width - padding * 2);
    const clipped = Math.max(-900, Math.min(900, review.evalAfter.cp));
    const y = height / 2 - (clipped / 900) * (height / 2 - padding);
    return { x, y, review };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Grafico valutazione">
      <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="var(--line)" strokeWidth="2" />
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--line)" strokeWidth="2" />
      <path d={path} fill="none" stroke="var(--blue)" strokeWidth="3" />
      {points.map(({ x, y, review }) => {
        const danger = ["Blunder", "Mistake", "Miss"].includes(review.classification);
        return (
          <circle
            key={review.id}
            className="chart-point"
            cx={x}
            cy={y}
            r={activeId === review.id ? 7 : danger ? 5.5 : 4}
            fill={danger ? "var(--red)" : review.classification === "Brilliant" ? "var(--green)" : "var(--violet)"}
            onClick={() => onSelect?.(review)}
          />
        );
      })}
      <text x={padding + 4} y={padding - 8} fill="var(--muted)" fontSize="13">
        +Bianco
      </text>
      <text x={padding + 4} y={height - 8} fill="var(--muted)" fontSize="13">
        +Nero
      </text>
    </svg>
  );
}
