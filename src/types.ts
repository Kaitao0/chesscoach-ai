export type Side = "w" | "b";

export type BotDifficulty = "beginner" | "easy" | "medium" | "hard" | "expert";

export type MoveClassification =
  | "Theory"
  | "Best"
  | "Excellent"
  | "Great"
  | "Good"
  | "Inaccuracy"
  | "Mistake"
  | "Blunder"
  | "Miss"
  | "Brilliant";

export interface EngineEvaluation {
  cp: number;
  mate?: number;
  depth: number;
}

export interface EngineMove {
  move: string;
  san: string;
  from: string;
  to: string;
  promotion?: string;
  evaluation: EngineEvaluation;
  line?: string[];
}

export interface EngineAnalysis {
  fen: string;
  evaluation: EngineEvaluation;
  bestMove?: EngineMove;
  topMoves: EngineMove[];
}

export interface MoveReview {
  id: string;
  moveNumber: number;
  color: Side;
  san: string;
  from: string;
  to: string;
  promotion?: string;
  fenBefore: string;
  fenAfter: string;
  classification: MoveClassification;
  evalBefore: EngineEvaluation;
  evalAfter: EngineEvaluation;
  bestMove?: EngineMove;
  explanation: string;
  coachTip: string;
  isBook: boolean;
  openingName?: string;
  isMistakeRetryAvailable: boolean;
  cpLoss: number;
  winProbabilityBefore: number;
  winProbabilityAfter: number;
  principalVariation?: string[];
}

export interface Game {
  id: string;
  userId: string;
  date: string;
  result: string;
  pgn: string;
  finalFen: string;
  color: Side;
  botDifficulty: BotDifficulty;
  whiteAccuracy: number;
  blackAccuracy: number;
  openingName?: string;
  moveReview: MoveReview[];
}

export interface UserProfile {
  id: string;
  username: string;
  createdAt: string;
  estimatedRating: number;
  totalGames: number;
  puzzleRating: number;
  preferredColor: "white" | "black" | "random";
}

export interface UserProgress {
  userId: string;
  completedLessons: string[];
  solvedPuzzles: string[];
  failedPuzzles: string[];
  commonMistakes: Record<string, number>;
  openingStats: Record<string, number>;
  retryMistakesCompleted: string[];
}

export interface Opening {
  eco: string;
  name: string;
  pgn: string;
  fen?: string;
  moves: string[];
  ideaWhite: string;
  ideaBlack: string;
  commonMistakes: string[];
  typicalPlan: string;
}

export interface Puzzle {
  id: string;
  fen: string;
  sideToMove: Side;
  solution: string[];
  theme: string;
  difficulty: "base" | "intermedio" | "avanzato";
  explanation: string;
  hint: string;
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  fen: string;
  focusSquares: string[];
  quiz: {
    question: string;
    answers: string[];
    correctIndex: number;
  };
}
