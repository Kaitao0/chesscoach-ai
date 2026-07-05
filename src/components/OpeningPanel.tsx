import { BookOpen } from "lucide-react";
import type { Opening } from "../types";
import { getNextBookMoves } from "../lib/openings";

export function OpeningPanel({ opening, moves }: { opening?: Opening | null; moves: string[] }) {
  const nextMoves = getNextBookMoves(moves);

  return (
    <section className="panel stack">
      <div className="split">
        <h2 className="section-title row">
          <BookOpen size={18} /> Apertura
        </h2>
        {opening ? <span className="badge badge-Theory">{opening.eco}</span> : <span className="badge badge-Inaccuracy">Fuori teoria</span>}
      </div>
      {opening ? (
        <>
          <h3 style={{ margin: 0 }}>{opening.name}</h3>
          <p className="muted">{opening.pgn}</p>
          <div className="table-like">
            <div className="table-row">
              <strong>Idea Bianco</strong>
              <span>{opening.ideaWhite}</span>
              <span />
            </div>
            <div className="table-row">
              <strong>Idea Nero</strong>
              <span>{opening.ideaBlack}</span>
              <span />
            </div>
            <div className="table-row">
              <strong>Piano</strong>
              <span>{opening.typicalPlan}</span>
              <span />
            </div>
          </div>
          <div className="row">
            {nextMoves.length ? nextMoves.map((move) => <span className="badge badge-Theory" key={move}>{move}</span>) : <span className="muted">Linea completata o ramo non presente nel dataset.</span>}
          </div>
        </>
      ) : (
        <p className="muted">Nessuna linea del dataset ridotto coincide con la sequenza corrente.</p>
      )}
    </section>
  );
}
