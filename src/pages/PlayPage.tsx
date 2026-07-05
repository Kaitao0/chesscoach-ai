import { Chess, type Move, type PieceSymbol, type Square } from "chess.js";
import { BarChart3, Lightbulb, RotateCcw, Search, TimerReset } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Navigate } from "../App";
import { ChessBoard } from "../components/ChessBoard";
import { CoachPanel } from "../components/CoachPanel";
import { DifficultySelector } from "../components/DifficultySelector";
import { EvaluationBar } from "../components/EvaluationBar";
import { MoveList } from "../components/MoveList";
import { OpeningPanel } from "../components/OpeningPanel";
import { PromotionDialog } from "../components/PromotionDialog";
import { formatEvaluation, isPromotionMove, resultFromGame, sideFromTurn } from "../lib/chessUtils";
import { engineService } from "../lib/engineService";
import { buildGameFromReviews } from "../lib/gameReview";
import { classifyMove } from "../lib/moveClassifier";
import { detectOpening, isBookMove } from "../lib/openings";
import { saveGame } from "../lib/storage";
import type { BotDifficulty, EngineEvaluation, MoveReview, Side } from "../types";

type ColorChoice = "w" | "b" | "random";

export function PlayPage({ navigate }: { navigate: Navigate }) {
  const gameRef = useRef(new Chess());
  const reviewsRef = useRef<MoveReview[]>([]);
  const busyRef = useRef(false);
  const [fen, setFen] = useState(gameRef.current.fen());
  const [reviews, setReviews] = useState<MoveReview[]>([]);
  const [difficulty, setDifficulty] = useState<BotDifficulty>("medium");
  const [colorChoice, setColorChoice] = useState<ColorChoice>("w");
  const [userColor, setUserColor] = useState<Side>("w");
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [evaluation, setEvaluation] = useState<EngineEvaluation>({ cp: 0, depth: 0 });
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | undefined>();
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [manualHint, setManualHint] = useState<string | null>(null);

  useEffect(() => {
    reviewsRef.current = reviews;
  }, [reviews]);

  const currentGame = useMemo(() => new Chess(fen), [fen]);
  const currentOpening = detectOpening(reviews.map((review) => review.san));
  const latestReview = reviews.at(-1);
  const userToMove = currentGame.turn() === userColor && !currentGame.isGameOver();

  async function classifyAndStoreMove(move: Move, fenBefore: string, historyBefore: string[]) {
    const beforeAnalysis = await engineService.analyze(fenBefore, 2, 4);
    const fenAfter = gameRef.current.fen();
    const afterAnalysis = await engineService.analyze(fenAfter, 2, 4);
    const opening = detectOpening([...historyBefore, move.san]);
    const book = isBookMove(historyBefore, move.san);
    const classified = classifyMove({
      fenBefore,
      fenAfter,
      playedMove: move,
      beforeAnalysis,
      afterAnalysis,
      opening,
      isBookMove: book,
    });
    const review: MoveReview = {
      id: `${reviewsRef.current.length + 1}-${move.color}-${move.from}-${move.to}-${Date.now()}`,
      moveNumber: Math.ceil(gameRef.current.history().length / 2),
      color: move.color as Side,
      san: move.san,
      from: move.from,
      to: move.to,
      promotion: move.promotion,
      fenBefore,
      fenAfter,
      classification: classified.classification,
      evalBefore: beforeAnalysis.evaluation,
      evalAfter: afterAnalysis.evaluation,
      bestMove: beforeAnalysis.bestMove,
      explanation: classified.explanation,
      coachTip: classified.coachTip,
      isBook: book,
      openingName: opening?.name,
      isMistakeRetryAvailable: ["Mistake", "Blunder", "Miss"].includes(classified.classification),
      cpLoss: classified.cpLoss,
      winProbabilityBefore: classified.winProbabilityBefore,
      winProbabilityAfter: classified.winProbabilityAfter,
      principalVariation: beforeAnalysis.bestMove?.line,
    };
    setReviews((previous) => [...previous, review]);
    setEvaluation(afterAnalysis.evaluation);
    return review;
  }

  async function applyMove(from: Square, to: Square, promotion: PieceSymbol = "q") {
    if (busyRef.current) return null;
    busyRef.current = true;
    setThinking(true);
    setManualHint(null);

    try {
      const game = gameRef.current;
      const fenBefore = game.fen();
      const historyBefore = reviewsRef.current.map((review) => review.san);
      const move = game.move({ from, to, promotion });
      setFen(game.fen());
      setLastMove({ from: move.from, to: move.to });
      await classifyAndStoreMove(move, fenBefore, historyBefore);
      return move;
    } catch {
      return null;
    } finally {
      setThinking(false);
      busyRef.current = false;
    }
  }

  async function makeBotMove() {
    if (gameRef.current.isGameOver()) return;
    setThinking(true);
    const botMove = await engineService.getBotMove(gameRef.current.fen(), difficulty);
    setThinking(false);
    if (!botMove || gameRef.current.isGameOver()) return;
    await applyMove(botMove.from as Square, botMove.to as Square, (botMove.promotion as PieceSymbol) ?? "q");
  }

  async function handleUserMove(from: Square, to: Square, promotion?: PieceSymbol) {
    if (!userToMove || thinking) return;
    const move = await applyMove(from, to, promotion ?? "q");
    if (move && !gameRef.current.isGameOver()) await makeBotMove();
  }

  function startNewGame(choice = colorChoice) {
    const resolvedColor: Side = choice === "random" ? (Math.random() > 0.5 ? "w" : "b") : choice;
    gameRef.current = new Chess();
    reviewsRef.current = [];
    busyRef.current = false;
    setUserColor(resolvedColor);
    setFen(gameRef.current.fen());
    setReviews([]);
    setLastMove(undefined);
    setEvaluation({ cp: 0, depth: 0 });
    setManualHint(null);
    if (resolvedColor === "b") {
      window.setTimeout(() => void makeBotMove(), 120);
    }
  }

  function undoTrainingMove() {
    const game = gameRef.current;
    if (thinking || game.history().length === 0) return;
    game.undo();
    if (game.history().length > 0 && game.turn() !== userColor) game.undo();
    setFen(game.fen());
    setLastMove(undefined);
    setReviews((previous) => previous.slice(0, Math.max(0, previous.length - 2)));
  }

  async function requestHint() {
    const bestMove = await engineService.getBestMove(gameRef.current.fen(), 2);
    setManualHint(bestMove ? `Suggerimento: considera ${bestMove.san}.` : "Non ho trovato una mossa utile in questa posizione.");
  }

  async function analyzePosition() {
    setThinking(true);
    const analysis = await engineService.analyze(gameRef.current.fen(), 3, 4);
    setEvaluation(analysis.evaluation);
    setManualHint(`Valutazione ${formatEvaluation(analysis.evaluation)}. Linea principale: ${analysis.bestMove?.san ?? "nessuna"}.`);
    setThinking(false);
  }

  function openReview() {
    const game = buildGameFromReviews({
      reviews,
      pgn: gameRef.current.pgn(),
      finalFen: gameRef.current.fen(),
      userColor,
      difficulty,
      result: resultFromGame(gameRef.current),
    });
    saveGame(game);
    navigate(`/review/${game.id}`);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="kicker">Partita training</span>
          <h1 className="page-title">Gioca contro il bot</h1>
        </div>
        <div className="row">
          <span className="badge badge-Good">{resultFromGame(currentGame)}</span>
          <span className="badge badge-Theory">Turno: {sideFromTurn(currentGame.turn()) === "w" ? "Bianco" : "Nero"}</span>
        </div>
      </div>

      <section className="panel stack">
        <div className="row">
          <label className="stack">
            <span className="muted">Colore</span>
            <div className="segmented">
              {[
                ["w", "Bianco"],
                ["b", "Nero"],
                ["random", "Casuale"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={colorChoice === value ? "active" : ""}
                  onClick={() => setColorChoice(value as ColorChoice)}
                >
                  {label}
                </button>
              ))}
            </div>
          </label>
          <DifficultySelector value={difficulty} onChange={setDifficulty} />
          <label className="row">
            <input type="checkbox" checked={timerEnabled} onChange={(event) => setTimerEnabled(event.target.checked)} />
            <TimerReset size={16} /> Timer opzionale {timerEnabled ? "attivo" : "disattivato"}
          </label>
          <button className="primary-button" onClick={() => startNewGame()}>
            Nuova partita
          </button>
          <button className="ghost-button" onClick={undoTrainingMove} disabled={thinking || reviews.length === 0}>
            <RotateCcw size={16} /> Annulla
          </button>
          <button className="soft-button" onClick={requestHint} disabled={thinking || currentGame.isGameOver()}>
            <Lightbulb size={16} /> Suggerimento
          </button>
          <button className="soft-button" onClick={analyzePosition} disabled={thinking}>
            <Search size={16} /> Analizza posizione
          </button>
          <button className="ghost-button" onClick={openReview} disabled={reviews.length === 0}>
            <BarChart3 size={16} /> Analizza partita
          </button>
        </div>
        {manualHint ? <div className="notice">{manualHint}</div> : null}
      </section>

      <div className="play-grid grid">
        <section className="panel">
          <div className="row" style={{ alignItems: "flex-start" }}>
            <EvaluationBar evaluation={evaluation} />
            <ChessBoard
              fen={fen}
              orientation={userColor}
              allowMoves={userToMove && !thinking}
              activeSide={userColor}
              lastMove={lastMove}
              onMove={({ from, to }) => {
                if (isPromotionMove(fen, from, to)) setPendingPromotion({ from, to });
                else void handleUserMove(from, to);
              }}
            />
          </div>
        </section>
        <div className="stack">
          <CoachPanel
            evaluation={evaluation}
            latestReview={latestReview}
            openingName={currentOpening?.name ?? latestReview?.openingName}
            inCheck={currentGame.isCheck()}
            thinking={thinking}
          />
          <MoveList reviews={reviews} />
          <OpeningPanel opening={currentOpening} moves={reviews.map((review) => review.san)} />
        </div>
      </div>

      <PromotionDialog
        open={Boolean(pendingPromotion)}
        onCancel={() => setPendingPromotion(null)}
        onChoose={(piece) => {
          if (pendingPromotion) void handleUserMove(pendingPromotion.from, pendingPromotion.to, piece);
          setPendingPromotion(null);
        }}
      />
    </div>
  );
}
