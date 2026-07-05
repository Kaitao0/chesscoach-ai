import { BookOpen } from "lucide-react";
import { openings } from "../lib/openings";

export function OpeningsPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="kicker">Explorer ridotto</span>
          <h1 className="page-title">Aperture</h1>
        </div>
      </div>
      <div className="openings-grid grid">
        <section className="panel stack">
          <h2 className="section-title row">
            <BookOpen size={18} /> Linee principali
          </h2>
          <div className="table-like">
            {openings.map((opening) => (
              <div className="table-row" key={`${opening.eco}-${opening.name}`}>
                <strong>{opening.eco}</strong>
                <span>
                  {opening.name}
                  <br />
                  <span className="muted">{opening.pgn}</span>
                </span>
                <span className="badge badge-Theory">{opening.moves[opening.moves.length - 1]}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="panel stack">
          <h2 className="section-title">Come espandere</h2>
          <p className="muted">
            Il modello `Opening` accetta ECO, nome, PGN, FEN opzionale e sequenza SAN. Puoi importare dataset open-source compatibili con ECO e
            sostituire il dataset demo senza cambiare i componenti.
          </p>
          <div className="notice">Il riconoscimento automatico usa il prefisso più lungo della sequenza di mosse.</div>
        </section>
      </div>
    </div>
  );
}
