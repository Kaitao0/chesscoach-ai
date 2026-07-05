import {
  evaluateFen,
  getAnalysisForFen,
  getBestMoveForFen,
  getBotMoveForFen,
  getTopMovesForFen,
} from "../lib/engineHeuristics";
import type { BotDifficulty } from "../types";

type EngineCommand =
  | { id: number; method: "getBestMove"; fen: string; depth: number }
  | { id: number; method: "evaluatePosition"; fen: string; depth: number }
  | { id: number; method: "getTopMoves"; fen: string; depth: number; multipv: number }
  | { id: number; method: "getBotMove"; fen: string; difficulty: BotDifficulty }
  | { id: number; method: "analyze"; fen: string; depth: number; multipv: number };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = (event: MessageEvent<EngineCommand>) => {
  const message = event.data;
  try {
    const result = (() => {
      switch (message.method) {
        case "getBestMove":
          return getBestMoveForFen(message.fen, message.depth);
        case "evaluatePosition":
          return evaluateFen(message.fen, message.depth);
        case "getTopMoves":
          return getTopMovesForFen(message.fen, message.depth, message.multipv);
        case "getBotMove":
          return getBotMoveForFen(message.fen, message.difficulty);
        case "analyze":
          return getAnalysisForFen(message.fen, message.depth, message.multipv);
      }
    })();

    ctx.postMessage({ id: message.id, result });
  } catch (error) {
    ctx.postMessage({
      id: message.id,
      error: error instanceof Error ? error.message : "Errore motore sconosciuto",
    });
  }
};
