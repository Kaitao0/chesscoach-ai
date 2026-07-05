import { PuzzleTrainer } from "../components/PuzzleTrainer";
import { puzzles } from "../lib/puzzles";

export function PuzzlesPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="kicker">Allenamento tattico</span>
          <h1 className="page-title">Puzzle</h1>
        </div>
      </div>
      <PuzzleTrainer puzzles={puzzles} />
    </div>
  );
}
