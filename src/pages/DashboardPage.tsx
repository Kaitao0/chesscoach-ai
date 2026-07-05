import { BarChart3, BookOpen, FileInput, Puzzle, Swords } from "lucide-react";
import { useMemo, useState } from "react";
import type { Navigate } from "../App";
import { ProgressDashboard } from "../components/ProgressDashboard";
import { buildImportedGame } from "../lib/gameReview";
import { getGames, getUserProfile, getUserProgress, saveGame } from "../lib/storage";

export function DashboardPage({ navigate }: { navigate: Navigate }) {
  const [pgn, setPgn] = useState("");
  const [importError, setImportError] = useState<string | null>(null);
  const profile = useMemo(() => getUserProfile(), []);
  const progress = useMemo(() => getUserProgress(), []);
  const games = useMemo(() => getGames(), []);
  const frequent = Object.entries(progress.commonMistakes).sort((a, b) => b[1] - a[1]);

  function importPgn() {
    const imported = buildImportedGame(pgn);
    if (!imported) {
      setImportError("PGN non leggibile. Controlla il formato e riprova.");
      return;
    }
    saveGame(imported);
    navigate(`/review/${imported.id}`);
  }

  return (
    <div className="page">
      <section className="panel hero-panel">
        <div className="hero-board" aria-hidden="true">
          {Array.from({ length: 64 }).map((_, index) => (
            <span key={index} />
          ))}
        </div>
        <div className="hero-copy">
          <span className="kicker">Coach personale, partita dopo partita</span>
          <h1 className="page-title">ChessCoach AI</h1>
          <p>Gioca, ricevi feedback immediato, rivedi gli errori e trasformali in esercizi mirati.</p>
        </div>
        <div className="action-grid grid">
          <button className="primary-button" onClick={() => navigate("/play")}>
            <Swords size={17} /> Gioca contro il bot
          </button>
          <button className="soft-button" onClick={() => navigate("/review/latest")}>
            <BarChart3 size={17} /> Rivedi una partita
          </button>
          <button className="soft-button" onClick={() => navigate("/puzzles")}>
            <Puzzle size={17} /> Allenati con i puzzle
          </button>
          <button className="soft-button" onClick={() => navigate("/openings")}>
            <BookOpen size={17} /> Studia le aperture
          </button>
        </div>
      </section>

      <div className="dashboard-grid grid">
        <div className="stack">
          <ProgressDashboard profile={profile} progress={progress} games={games} />
          <section className="panel stack">
            <div className="split">
              <h2 className="section-title">Ultime partite</h2>
              <span className="muted">{games.length} salvate</span>
            </div>
            <div className="table-like">
              {games.slice(0, 5).map((game) => (
                <button className="table-row" key={game.id} onClick={() => navigate(`/review/${game.id}`)}>
                  <strong>{game.result}</strong>
                  <span>{game.openingName ?? "Apertura non rilevata"} · {game.botDifficulty}</span>
                  <span className="badge badge-Good">{game.whiteAccuracy}/{game.blackAccuracy}</span>
                </button>
              ))}
              {games.length === 0 ? <div className="table-row"><strong>Nessuna partita</strong><span>Inizia dalla modalità Gioca.</span><span /></div> : null}
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="panel stack">
            <h2 className="section-title">Errori frequenti</h2>
            {frequent.length ? (
              frequent.map(([name, count]) => (
                <div className="split" key={name}>
                  <span>{name}</span>
                  <span className="badge badge-Mistake">{count}</span>
                </div>
              ))
            ) : (
              <p className="muted">Gioca una partita e la review inizierà a tracciare gli schemi ricorrenti.</p>
            )}
          </section>
          <section className="panel stack">
            <h2 className="section-title">Suggerimento del giorno</h2>
            <p className="muted">Prima di una mossa candidata, chiediti: il mio ultimo pezzo mosso sarà attaccabile gratis?</p>
          </section>
          <section className="panel stack">
            <h2 className="section-title row">
              <FileInput size={18} /> Import PGN
            </h2>
            <textarea className="textarea" value={pgn} onChange={(event) => setPgn(event.target.value)} placeholder="Incolla qui un PGN..." />
            {importError ? <div className="notice danger">{importError}</div> : null}
            <button className="ghost-button" onClick={importPgn} disabled={!pgn.trim()}>
              Importa e apri review
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
