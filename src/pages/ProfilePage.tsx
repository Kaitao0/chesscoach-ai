import { ProgressDashboard } from "../components/ProgressDashboard";
import { getGames, getUserProfile, getUserProgress } from "../lib/storage";

export function ProfilePage() {
  const profile = getUserProfile();
  const progress = getUserProgress();
  const games = getGames();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="kicker">Storico e progressi</span>
          <h1 className="page-title">Profilo</h1>
        </div>
      </div>
      <div className="profile-grid grid">
        <ProgressDashboard profile={profile} progress={progress} games={games} />
        <section className="panel stack">
          <h2 className="section-title">Dati locali</h2>
          <div className="table-like">
            <div className="table-row"><strong>Utente</strong><span>{profile.id}</span><span /></div>
            <div className="table-row"><strong>Partite</strong><span>{games.length}</span><span /></div>
            <div className="table-row"><strong>Puzzle sbagliati</strong><span>{progress.failedPuzzles.length}</span><span /></div>
            <div className="table-row"><strong>Retry completati</strong><span>{progress.retryMistakesCompleted.length}</span><span /></div>
          </div>
          <div className="notice">Lo storage usa localStorage con modelli pensati per migrare verso Supabase.</div>
        </section>
      </div>
    </div>
  );
}
