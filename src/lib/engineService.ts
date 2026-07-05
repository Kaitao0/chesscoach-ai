import type { BotDifficulty, EngineAnalysis, EngineEvaluation, EngineMove } from "../types";
import {
  evaluateFen,
  getAnalysisForFen,
  getBestMoveForFen,
  getBotMoveForFen,
  getTopMovesForFen,
} from "./engineHeuristics";

type PendingRequest = {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
};

type WorkerPayload =
  | { method: "getBestMove"; fen: string; depth: number }
  | { method: "evaluatePosition"; fen: string; depth: number }
  | { method: "getTopMoves"; fen: string; depth: number; multipv: number }
  | { method: "getBotMove"; fen: string; difficulty: BotDifficulty }
  | { method: "analyze"; fen: string; depth: number; multipv: number };

class EngineService {
  private worker?: Worker;
  private requestId = 0;
  private pending = new Map<number, PendingRequest>();
  private analysisCache = new Map<string, EngineAnalysis>();

  constructor() {
    try {
      this.worker = new Worker(new URL("../workers/engineWorker.ts", import.meta.url), { type: "module" });
      this.worker.onmessage = (event: MessageEvent<{ id: number; result?: unknown; error?: string }>) => {
        const request = this.pending.get(event.data.id);
        if (!request) return;
        this.pending.delete(event.data.id);
        if (event.data.error) request.reject(new Error(event.data.error));
        else request.resolve(event.data.result);
      };
    } catch {
      this.worker = undefined;
    }
  }

  private async request<T>(payload: WorkerPayload, fallback: () => T): Promise<T> {
    if (!this.worker) return fallback();

    const id = ++this.requestId;
    try {
      return await new Promise<T>((resolve, reject) => {
        this.pending.set(id, {
          resolve: (value) => resolve(value as T),
          reject,
        });
        this.worker?.postMessage({ id, ...payload });
      });
    } catch {
      return fallback();
    }
  }

  async getBestMove(fen: string, depth = 2): Promise<EngineMove | undefined> {
    return this.request({ method: "getBestMove", fen, depth }, () => getBestMoveForFen(fen, depth));
  }

  async evaluatePosition(fen: string, depth = 2): Promise<EngineEvaluation> {
    return this.request({ method: "evaluatePosition", fen, depth }, () => evaluateFen(fen, depth));
  }

  async getTopMoves(fen: string, depth = 2, multipv = 3): Promise<EngineMove[]> {
    return this.request({ method: "getTopMoves", fen, depth, multipv }, () => getTopMovesForFen(fen, depth, multipv));
  }

  async analyze(fen: string, depth = 2, multipv = 3): Promise<EngineAnalysis> {
    const key = `${fen}|${depth}|${multipv}`;
    const cached = this.analysisCache.get(key);
    if (cached) return cached;

    const analysis = await this.request({ method: "analyze", fen, depth, multipv }, () =>
      getAnalysisForFen(fen, depth, multipv),
    );
    this.analysisCache.set(key, analysis);
    return analysis;
  }

  async getBotMove(fen: string, difficulty: BotDifficulty): Promise<EngineMove | undefined> {
    return this.request({ method: "getBotMove", fen, difficulty }, () => getBotMoveForFen(fen, difficulty));
  }

  stopAnalysis() {
    this.pending.forEach((request) => request.reject(new Error("Analisi interrotta")));
    this.pending.clear();
  }
}

export const engineService = new EngineService();
