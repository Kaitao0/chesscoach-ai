import { Activity, BookCheck, Puzzle, TrendingUp } from "lucide-react";
import type { Game, UserProfile, UserProgress } from "../types";

export function ProgressDashboard({
  profile,
  progress,
  games,
}: {
  profile: UserProfile;
  progress: UserProgress;
  games: Game[];
}) {
  const mostCommonMistake = Object.entries(progress.commonMistakes).sort((a, b) => b[1] - a[1])[0];

  return (
    <section className="panel stack">
      <div className="split">
        <h2 className="section-title row">
          <TrendingUp size={18} /> Progresso
        </h2>
        <span className="badge badge-Good">{profile.username}</span>
      </div>
      <div className="metric-grid">
        <div className="metric">
          <span className="row muted">
            <Activity size={16} /> Rating stimato
          </span>
          <strong className="metric-value">{profile.estimatedRating}</strong>
        </div>
        <div className="metric">
          <span className="row muted">
            <Puzzle size={16} /> Puzzle
          </span>
          <strong className="metric-value">{progress.solvedPuzzles.length}</strong>
        </div>
        <div className="metric">
          <span className="row muted">
            <BookCheck size={16} /> Lezioni
          </span>
          <strong className="metric-value">{progress.completedLessons.length}</strong>
        </div>
      </div>
      <div className="table-like">
        <div className="table-row">
          <strong>Ultima partita</strong>
          <span>{games[0] ? `${games[0].result} · ${new Date(games[0].date).toLocaleDateString("it-IT")}` : "Nessuna partita salvata"}</span>
          <span />
        </div>
        <div className="table-row">
          <strong>Errore frequente</strong>
          <span>{mostCommonMistake ? `${mostCommonMistake[0]} (${mostCommonMistake[1]})` : "Ancora nessuno schema ricorrente"}</span>
          <span />
        </div>
      </div>
    </section>
  );
}
