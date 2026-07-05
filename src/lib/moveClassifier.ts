import { Chess, type Move } from "chess.js";
import type { EngineAnalysis, EngineEvaluation, MoveClassification, Opening, Side } from "../types";
import { formatEvaluation, materialBalance, moveToUci, pieceNames, pieceValues } from "./chessUtils";

export interface MoveClassifierInput {
  fenBefore: string;
  fenAfter: string;
  playedMove: Move;
  beforeAnalysis: EngineAnalysis;
  afterAnalysis: EngineAnalysis;
  opening?: Opening | null;
  isBookMove?: boolean;
}

export interface ClassifiedMove {
  classification: MoveClassification;
  explanation: string;
  coachTip: string;
  cpLoss: number;
  winProbabilityBefore: number;
  winProbabilityAfter: number;
}

export function centipawnToWinProbability(cp: number): number {
  const normalized = Math.max(-1200, Math.min(1200, cp));
  return 1 / (1 + Math.exp(-normalized / 260));
}

function probabilityForSide(cp: number, side: Side): number {
  const whiteProbability = centipawnToWinProbability(cp);
  return side === "w" ? whiteProbability : 1 - whiteProbability;
}

function mateIsGoodForSide(evaluation: EngineEvaluation, side: Side): boolean {
  if (typeof evaluation.mate !== "number") return false;
  return side === "w" ? evaluation.mate > 0 : evaluation.mate < 0;
}

export function detectMissedMate(beforeAnalysis: EngineAnalysis, playedMove: Move): boolean {
  const bestMove = beforeAnalysis.bestMove;
  if (!bestMove || !mateIsGoodForSide(bestMove.evaluation, playedMove.color as Side)) return false;
  return bestMove.move !== moveToUci(playedMove);
}

export function detectBlunder(beforeEval: EngineEvaluation, afterEval: EngineEvaluation, side: Side): boolean {
  const beforeProbability = probabilityForSide(beforeEval.cp, side);
  const afterProbability = probabilityForSide(afterEval.cp, side);
  const probabilityDrop = beforeProbability - afterProbability;
  const cpDrop = side === "w" ? beforeEval.cp - afterEval.cp : afterEval.cp - beforeEval.cp;
  return cpDrop > 320 || probabilityDrop > 0.24;
}

function movedPieceCanBeCaptured(fenAfter: string, playedMove: Move): boolean {
  const game = new Chess(fenAfter);
  const movedPieceValue = pieceValues[playedMove.piece];
  if (movedPieceValue < 320) return false;
  return game.moves({ verbose: true }).some((reply) => {
    if (reply.to !== playedMove.to || reply.captured !== playedMove.piece) return false;
    const attackerValue = pieceValues[reply.piece];
    return attackerValue <= movedPieceValue;
  });
}

export function detectBrilliantMove(position: string, move: Move, analysis: EngineAnalysis): boolean {
  const beforeMaterial = materialBalance(position);
  const game = new Chess(position);
  const movedPiece = game.get(move.from);
  const sacrifice =
    Boolean(movedPiece) &&
    ((move.captured && pieceValues[movedPiece!.type] > pieceValues[move.captured] + 150) ||
      movedPieceCanBeCaptured(move.after, move));
  const afterMaterial = materialBalance(move.after);
  const materialShiftForMover = move.color === "w" ? afterMaterial - beforeMaterial : beforeMaterial - afterMaterial;
  const moveMatchesTopLine = analysis.bestMove?.move === moveToUci(move);
  const keepsOrImproves = move.color === "w" ? analysis.evaluation.cp >= -80 : analysis.evaluation.cp <= 80;
  return Boolean(sacrifice && materialShiftForMover <= 150 && moveMatchesTopLine && keepsOrImproves);
}

function phaseMultiplier(fen: string): number {
  const game = new Chess(fen);
  const pieces = game
    .board()
    .flat()
    .filter(Boolean);
  const queens = pieces.filter((piece) => piece?.type === "q").length;
  if (pieces.length <= 10) return 0.82;
  if (queens === 0) return 0.9;
  if (pieces.length >= 26) return 1.08;
  return 1;
}

function resultStateMultiplier(beforeCp: number, side: Side): number {
  const sideCp = side === "w" ? beforeCp : -beforeCp;
  if (sideCp > 850 || sideCp < -850) return 0.72;
  if (Math.abs(sideCp) < 160) return 1.15;
  return 1;
}

function tacticalSignal(move: Move): boolean {
  return move.san.includes("+") || move.san.includes("#") || move.captured === "q" || move.captured === "r";
}

function getCoachTip(classification: MoveClassification, move: Move): string {
  if (classification === "Blunder") return "Prima di muovere, controlla cosa può catturare l'avversario alla mossa successiva.";
  if (classification === "Mistake") return "Riparti da minacce, pezzi indifesi e sicurezza del re.";
  if (classification === "Miss") return "Quando hai iniziativa, cerca prima scacchi, catture e minacce forzanti.";
  if (classification === "Theory") return "Se conosci il piano dell'apertura, non limitarti a memorizzare la sequenza.";
  if (classification === "Brilliant") return "Bella idea: ora verifica sempre che la continuazione resti forzata.";
  if (move.piece === "n" || move.piece === "b") return "Sviluppare pezzi leggeri verso il centro rende più facili le prossime decisioni.";
  return "Valuta sempre se la mossa migliora attività, sicurezza del re o struttura pedonale.";
}

export function generateMoveExplanation(
  classification: MoveClassification,
  context: {
    move: Move;
    bestMove?: string;
    evalBefore: EngineEvaluation;
    evalAfter: EngineEvaluation;
    cpLoss: number;
    openingName?: string;
    leftPieceInDanger?: boolean;
    missedMate?: boolean;
  },
): string {
  const piece = pieceNames[context.move.piece];
  const side = context.move.color === "w" ? "Bianco" : "Nero";
  const best = context.bestMove ? ` L'alternativa più forte era ${context.bestMove}.` : "";
  const evalText = `La valutazione passa da ${formatEvaluation(context.evalBefore)} a ${formatEvaluation(context.evalAfter)}.`;

  if (classification === "Theory" && context.openingName) {
    return `Mossa teorica: ${side} resta nella linea ${context.openingName}. ${piece} da ${context.move.from} a ${context.move.to} segue un piano noto.${best}`;
  }

  if (context.missedMate) {
    return `Mossa mancata: c'era una sequenza di matto o quasi forzata prima di questa scelta.${best}`;
  }

  if (context.leftPieceInDanger) {
    return `Qui c'è stato un problema concreto: il ${piece} arrivato in ${context.move.to} può essere preso con buon risultato dall'avversario. ${evalText}${best}`;
  }

  switch (classification) {
    case "Best":
      return `Migliore mossa: ${piece} in ${context.move.to} mantiene la posizione al massimo secondo l'analisi. ${evalText}`;
    case "Excellent":
      return `Mossa eccellente: non è necessariamente l'unica, ma rispetta le esigenze della posizione. ${evalText}${best}`;
    case "Great":
      return `Grande mossa: crea una minaccia utile o risolve un problema tattico immediato. ${evalText}${best}`;
    case "Good":
      return `Buona mossa: ${piece} da ${context.move.from} a ${context.move.to} è sana e non concede molto. ${evalText}${best}`;
    case "Inaccuracy":
      return `Piccola imprecisione: la posizione resta giocabile, ma c'era un modo più preciso per aumentare attività o sicurezza. ${evalText}${best}`;
    case "Mistake":
      return `Errore: questa scelta peggiora in modo visibile la posizione e concede più gioco all'avversario. ${evalText}${best}`;
    case "Blunder":
      return `Grave errore: la mossa cambia nettamente il bilancio della posizione. ${evalText}${best}`;
    case "Miss":
      return `Occasione mancata: avevi una risorsa più forte, probabilmente uno scacco, una cattura o una minaccia diretta.${best}`;
    case "Brilliant":
      return `Brillante: l'idea sembra rischiosa, ma l'analisi la considera concreta e vantaggiosa. ${evalText}${best}`;
    case "Theory":
      return `Mossa di apertura: resta coerente con una linea teorica nota.${best}`;
  }
}

export function classifyMove(input: MoveClassifierInput): ClassifiedMove {
  const side = input.playedMove.color as Side;
  const bestMove = input.beforeAnalysis.bestMove;
  const actualEval = input.afterAnalysis.evaluation;
  const bestEval = bestMove?.evaluation ?? actualEval;
  const rawLoss = side === "w" ? bestEval.cp - actualEval.cp : actualEval.cp - bestEval.cp;
  const cpLoss = Math.max(0, Math.round(rawLoss));
  const beforeProbability = probabilityForSide(bestEval.cp, side);
  const afterProbability = probabilityForSide(actualEval.cp, side);
  const probabilityDrop = Math.max(0, beforeProbability - afterProbability);
  const adjustedLoss = cpLoss * phaseMultiplier(input.fenBefore) * resultStateMultiplier(bestEval.cp, side);
  const missedMate = detectMissedMate(input.beforeAnalysis, input.playedMove);
  const leftPieceInDanger = movedPieceCanBeCaptured(input.fenAfter, input.playedMove);
  const materialBefore = materialBalance(input.fenBefore);
  const materialAfter = materialBalance(input.fenAfter);
  const materialDeltaForMover = side === "w" ? materialAfter - materialBefore : materialBefore - materialAfter;
  const playedUci = moveToUci(input.playedMove);
  const isBest = bestMove?.move === playedUci || adjustedLoss <= 10;
  const isBrilliant = detectBrilliantMove(input.fenBefore, input.playedMove, input.afterAnalysis);

  let classification: MoveClassification;
  if (input.isBookMove) classification = "Theory";
  else if (missedMate || (probabilityDrop > 0.28 && bestMove?.evaluation.mate)) classification = "Miss";
  else if (isBrilliant) classification = "Brilliant";
  else if (isBest) classification = "Best";
  else if (tacticalSignal(input.playedMove) && adjustedLoss <= 65) classification = "Great";
  else if (adjustedLoss <= 30) classification = "Excellent";
  else if (adjustedLoss <= 80) classification = "Good";
  else if (adjustedLoss <= 160) classification = "Inaccuracy";
  else if (
    adjustedLoss > 330 ||
    probabilityDrop > 0.24 ||
    leftPieceInDanger ||
    materialDeltaForMover < -450 ||
    detectBlunder(bestEval, actualEval, side)
  )
    classification = "Blunder";
  else classification = "Mistake";

  const explanation = generateMoveExplanation(classification, {
    move: input.playedMove,
    bestMove: bestMove?.san,
    evalBefore: input.beforeAnalysis.evaluation,
    evalAfter: actualEval,
    cpLoss,
    openingName: input.opening?.name,
    leftPieceInDanger,
    missedMate,
  });

  return {
    classification,
    explanation,
    coachTip: getCoachTip(classification, input.playedMove),
    cpLoss,
    winProbabilityBefore: beforeProbability,
    winProbabilityAfter: afterProbability,
  };
}
