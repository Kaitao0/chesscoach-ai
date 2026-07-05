import type { Opening } from "../types";

export const openings: Opening[] = [
  {
    eco: "C50",
    name: "Partita Italiana",
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    ideaWhite: "Sviluppare rapidamente i pezzi e puntare su f7.",
    ideaBlack: "Controllare il centro, sviluppare il cavallo in c6 e preparare l'arrocco.",
    commonMistakes: ["Muovere troppe volte la donna", "Ignorare la pressione su f7", "Ritardare l'arrocco"],
    typicalPlan: "c3, d4, arrocco e pressione centrale.",
  },
  {
    eco: "C60",
    name: "Spagnola / Ruy Lopez",
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bb5",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    ideaWhite: "Mettere pressione sul cavallo c6 che difende il pedone e5.",
    ideaBlack: "Sviluppare con ...a6, ...Nf6 e scegliere una struttura solida.",
    commonMistakes: ["Cambiare in c6 senza piano", "Lasciare il centro senza controllo"],
    typicalPlan: "Arrocco, Re1, c3 e d4 al momento giusto.",
  },
  {
    eco: "B20",
    name: "Difesa Siciliana",
    pgn: "1. e4 c5",
    moves: ["e4", "c5"],
    ideaWhite: "Ottenere sviluppo e spazio centrale prima che il Nero crei controgioco.",
    ideaBlack: "Sbilanciare subito il centro e giocare sulle colonne semiaperte.",
    commonMistakes: ["Spingere pedoni senza completare lo sviluppo", "Sottovalutare la colonna c"],
    typicalPlan: "Nf3, d4, sviluppo rapido e attenzione al re.",
  },
  {
    eco: "C00",
    name: "Difesa Francese",
    pgn: "1. e4 e6 2. d4 d5",
    moves: ["e4", "e6", "d4", "d5"],
    ideaWhite: "Usare lo spazio centrale e limitare l'alfiere c8.",
    ideaBlack: "Attaccare il centro bianco con ...c5 e ...f6 quando possibile.",
    commonMistakes: ["Chiudere il centro senza piano", "Lasciare debole e5"],
    typicalPlan: "Sviluppo dietro la catena pedonale e pressione su d4/e5.",
  },
  {
    eco: "B10",
    name: "Difesa Caro-Kann",
    pgn: "1. e4 c6 2. d4 d5",
    moves: ["e4", "c6", "d4", "d5"],
    ideaWhite: "Sviluppare con spazio e cercare iniziativa.",
    ideaBlack: "Costruire una struttura solida senza chiudere l'alfiere c8.",
    commonMistakes: ["Cambiare troppo presto senza sviluppo", "Spingere l'ala di re senza sicurezza"],
    typicalPlan: "Sviluppo armonioso, pressione sul centro e finale solido.",
  },
  {
    eco: "D06",
    name: "Gambetto di Donna",
    pgn: "1. d4 d5 2. c4",
    moves: ["d4", "d5", "c4"],
    ideaWhite: "Mettere pressione sul centro nero e aprire linee per i pezzi.",
    ideaBlack: "Scegliere se accettare il pedone o sostenere il centro.",
    commonMistakes: ["Difendere c4 a tutti i costi", "Bloccare l'alfiere camposcuro"],
    typicalPlan: "Nc3, Nf3, sviluppo degli alfieri e controllo di e4.",
  },
  {
    eco: "E60",
    name: "Difesa Indiana di Re",
    pgn: "1. d4 Nf6 2. c4 g6",
    moves: ["d4", "Nf6", "c4", "g6"],
    ideaWhite: "Occupare il centro e preparare espansione sul lato di donna.",
    ideaBlack: "Lasciare spazio iniziale e poi attaccare il centro con ...e5 o ...c5.",
    commonMistakes: ["Chiudere il centro senza sapere dove attaccare", "Ritardare lo sviluppo dell'ala di re"],
    typicalPlan: "Fianchetto, arrocco e rottura centrale.",
  },
  {
    eco: "D02",
    name: "Sistema Londra",
    pgn: "1. d4 d5 2. Bf4",
    moves: ["d4", "d5", "Bf4"],
    ideaWhite: "Sviluppo stabile con alfiere fuori dalla catena pedonale.",
    ideaBlack: "Colpire il centro e non concedere attacchi automatici su h7.",
    commonMistakes: ["Ripetere lo schema senza guardare minacce", "Dimenticare c4 o e4 quando serve"],
    typicalPlan: "e3, Nf3, Bd3, c3 e arrocco.",
  },
  {
    eco: "A10",
    name: "Apertura Inglese",
    pgn: "1. c4",
    moves: ["c4"],
    ideaWhite: "Controllare d5 da lato e scegliere una struttura flessibile.",
    ideaBlack: "Controbilanciare il centro con ...e5, ...c5 o ...Nf6.",
    commonMistakes: ["Ritardare troppo lo sviluppo", "Non decidere un piano centrale"],
    typicalPlan: "Nc3, g3, Bg2 e pressione su d5.",
  },
  {
    eco: "B01",
    name: "Difesa Scandinava",
    pgn: "1. e4 d5",
    moves: ["e4", "d5"],
    ideaWhite: "Guadagnare tempi attaccando la donna se il Nero riprende in d5.",
    ideaBlack: "Semplificare il centro e sviluppare pezzi su case naturali.",
    commonMistakes: ["Esporre troppo la donna", "Dimenticare lo sviluppo"],
    typicalPlan: "exd5, Nc3 e sviluppo rapido.",
  },
  {
    eco: "B07",
    name: "Difesa Pirc",
    pgn: "1. e4 d6 2. d4 Nf6",
    moves: ["e4", "d6", "d4", "Nf6"],
    ideaWhite: "Usare lo spazio e scegliere un piano aggressivo o posizionale.",
    ideaBlack: "Lasciare il centro al Bianco e colpirlo più tardi.",
    commonMistakes: ["Non reagire al centro bianco", "Arroccare in attacco senza calcolo"],
    typicalPlan: "g6, Bg7, arrocco e rottura ...e5 o ...c5.",
  },
  {
    eco: "B06",
    name: "Difesa Moderna",
    pgn: "1. e4 g6",
    moves: ["e4", "g6"],
    ideaWhite: "Costruire un centro forte senza diventare lento.",
    ideaBlack: "Fianchettare e provocare avanzate centrali da colpire.",
    commonMistakes: ["Concedere troppo spazio senza controgioco", "Muovere lo stesso pezzo più volte"],
    typicalPlan: "Bg7, d6 e pressione sul centro.",
  },
  {
    eco: "D10",
    name: "Slava",
    pgn: "1. d4 d5 2. c4 c6",
    moves: ["d4", "d5", "c4", "c6"],
    ideaWhite: "Mettere pressione sul centro e sviluppare pezzi attivi.",
    ideaBlack: "Sostenere d5 e liberare l'alfiere c8.",
    commonMistakes: ["Chiudere l'alfiere c8", "Spingere c5 senza preparazione"],
    typicalPlan: "Nf3, Nc3, e3/e4 e sviluppo naturale.",
  },
  {
    eco: "D43",
    name: "Semi-Slava",
    pgn: "1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6",
    moves: ["d4", "d5", "c4", "c6", "Nf3", "Nf6", "Nc3", "e6"],
    ideaWhite: "Scegliere tra gioco posizionale e linee tattiche al centro.",
    ideaBlack: "Tenere una struttura compatta e preparare rotture ...c5 o ...e5.",
    commonMistakes: ["Aprire il centro col re fermo", "Non completare lo sviluppo"],
    typicalPlan: "e3, Bd3, arrocco e pressione centrale.",
  },
  {
    eco: "E20",
    name: "Nimzo-Indiana",
    pgn: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4",
    moves: ["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"],
    ideaWhite: "Usare il centro e valutare se accettare doppi pedoni.",
    ideaBlack: "Pressare c3 e controllare e4.",
    commonMistakes: ["Lasciare e4 debole", "Cambiare struttura senza compenso"],
    typicalPlan: "Sviluppo flessibile, pressione centrale e gioco sulle case scure.",
  },
];

function normalizeSan(move: string): string {
  return move.replace(/[+#?!]/g, "");
}

export function getOpeningByMoves(moves: string[]): Opening | null {
  const normalized = moves.map(normalizeSan);
  const candidates = openings
    .filter((opening) => opening.moves.every((move, index) => normalized[index] === normalizeSan(move)))
    .sort((a, b) => b.moves.length - a.moves.length);
  return candidates[0] ?? null;
}

export function detectOpening(moves: string[]): Opening | null {
  return getOpeningByMoves(moves);
}

export function getNextBookMoves(moves: string[]): string[] {
  const normalized = moves.map(normalizeSan);
  const next = new Set<string>();
  for (const opening of openings) {
    const matches = normalized.every((move, index) => normalizeSan(opening.moves[index] ?? "") === move);
    if (matches && opening.moves[normalized.length]) next.add(opening.moves[normalized.length]);
  }
  return [...next];
}

export function isBookMove(moveHistoryBefore: string[], moveSan: string): boolean {
  const candidate = [...moveHistoryBefore.map(normalizeSan), normalizeSan(moveSan)];
  return openings.some((opening) =>
    candidate.every((move, index) => normalizeSan(opening.moves[index] ?? "") === move),
  );
}
