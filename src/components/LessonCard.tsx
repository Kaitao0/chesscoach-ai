import { Check, Circle } from "lucide-react";
import { useState } from "react";
import { Chess } from "chess.js";
import type { Lesson } from "../types";
import { getBoardSquares, pieceToGlyph, squareTone } from "../lib/chessUtils";

export function LessonCard({
  lesson,
  completed,
  onComplete,
}: {
  lesson: Lesson;
  completed: boolean;
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const correct = selected === lesson.quiz.correctIndex;
  const game = new Chess(lesson.fen);
  const squares = getBoardSquares("w");

  return (
    <article className="lesson-card">
      <div className="split">
        <h2 className="section-title">{lesson.title}</h2>
        {completed ? <Check size={18} color="var(--green)" /> : <Circle size={18} color="var(--muted)" />}
      </div>
      <div className="row" style={{ alignItems: "flex-start" }}>
        <div className="mini-board" aria-hidden="true">
          {squares.map((square) => {
            const piece = game.get(square);
            return (
              <span
                key={square}
                className={`${squareTone(square)} ${lesson.focusSquares.includes(square) ? "focus" : ""}`}
                style={{ background: squareTone(square) === "light" ? "var(--square-light)" : "var(--square-dark)" }}
              >
                {pieceToGlyph(piece)}
              </span>
            );
          })}
        </div>
        <p className="muted" style={{ flex: 1, minWidth: "12rem" }}>{lesson.summary}</p>
      </div>
      <div className="stack">
        <strong>{lesson.quiz.question}</strong>
        <div className="row">
          {lesson.quiz.answers.map((answer, index) => (
            <button
              key={answer}
              className={selected === index ? "primary-button" : "soft-button"}
              onClick={() => {
                setSelected(index);
                if (index === lesson.quiz.correctIndex) onComplete();
              }}
            >
              {answer}
            </button>
          ))}
        </div>
        {selected !== null ? (
          <div className={`notice ${correct ? "success" : "danger"}`}>
            {correct ? "Risposta corretta. Lezione segnata come completata." : "Non ancora: rileggi l'esempio sulla scacchiera."}
          </div>
        ) : null}
      </div>
    </article>
  );
}
