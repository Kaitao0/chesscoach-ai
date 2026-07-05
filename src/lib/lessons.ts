import type { Lesson } from "../types";

export const lessons: Lesson[] = [
  {
    id: "pieces",
    title: "Come si muovono i pezzi",
    summary: "Ogni pezzo ha una geometria diversa: prima riconosci traiettorie, poi cerca catture e case sicure.",
    fen: "8/8/8/3n4/8/8/8/4K3 w - - 0 1",
    focusSquares: ["d5", "b4", "b6", "c3", "c7", "e3", "e7", "f4", "f6"],
    quiz: {
      question: "Quale pezzo si muove a L?",
      answers: ["Alfiere", "Cavallo", "Torre"],
      correctIndex: 1,
    },
  },
  {
    id: "checkmate",
    title: "Scacco, matto e stallo",
    summary: "Uno scacco è una minaccia al re; è matto solo se non esiste difesa legale.",
    fen: "7k/6Q1/6K1/8/8/8/8/8 b - - 0 1",
    focusSquares: ["h8", "g7", "g6"],
    quiz: {
      question: "Quando una posizione è stallo?",
      answers: ["Il re è sotto scacco", "Non ci sono mosse legali e il re non è sotto scacco", "Il re può catturare"],
      correctIndex: 1,
    },
  },
  {
    id: "piece-value",
    title: "Valore dei pezzi",
    summary: "Il materiale aiuta a decidere gli scambi, ma attività e sicurezza del re possono valere di più.",
    fen: "8/8/8/8/3q4/8/4R3/4K3 w - - 0 1",
    focusSquares: ["d4", "e2"],
    quiz: {
      question: "Quanto vale circa una torre?",
      answers: ["3", "5", "9"],
      correctIndex: 1,
    },
  },
  {
    id: "center",
    title: "Controllo del centro",
    summary: "Le case centrali rendono i pezzi più mobili e aumentano le opzioni future.",
    fen: "rnbqkbnr/pppppppp/8/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
    focusSquares: ["d4", "e4", "d5", "e5"],
    quiz: {
      question: "Perché il centro è importante?",
      answers: ["Aumenta mobilità e controllo", "Serve solo ai pedoni", "Non conta in apertura"],
      correctIndex: 0,
    },
  },
  {
    id: "development",
    title: "Sviluppo in apertura",
    summary: "Porta cavalli e alfieri in gioco prima di inseguire pedoni secondari.",
    fen: "r1bqkbnr/pppppppp/2n5/8/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    focusSquares: ["f3", "c6", "c4", "b5"],
    quiz: {
      question: "Quale abitudine è sana in apertura?",
      answers: ["Muovere molti pedoni", "Sviluppare pezzi e arroccare", "Uscire presto con il re"],
      correctIndex: 1,
    },
  },
  {
    id: "king-safety",
    title: "Sicurezza del re",
    summary: "Un re sicuro permette di giocare al centro senza subire tattiche immediate.",
    fen: "rnbq1rk1/pppp1ppp/5n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 w - - 4 5",
    focusSquares: ["g1", "g8", "f7", "f2"],
    quiz: {
      question: "Cosa migliora spesso la sicurezza del re?",
      answers: ["Arrocco", "Portare la donna in avanti", "Muovere il re al centro"],
      correctIndex: 0,
    },
  },
  {
    id: "castling",
    title: "Arrocco",
    summary: "L'arrocco collega le torri e mette il re dietro una barriera di pedoni.",
    fen: "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1",
    focusSquares: ["e1", "g1", "c1", "e8", "g8", "c8"],
    quiz: {
      question: "Puoi arroccare attraversando uno scacco?",
      answers: ["Sì", "No", "Solo corto"],
      correctIndex: 1,
    },
  },
  {
    id: "beginner-errors",
    title: "Errori tipici dei principianti",
    summary: "I problemi più frequenti sono pezzi indifesi, regina troppo esposta e mosse senza minaccia.",
    fen: "rnb1kbnr/pppp1ppp/8/4p2q/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 2 3",
    focusSquares: ["h5", "e1", "f7"],
    quiz: {
      question: "Prima di muovere conviene controllare...",
      answers: ["Solo la propria idea", "Scacchi, catture e minacce avversarie", "Il numero della mossa"],
      correctIndex: 1,
    },
  },
  {
    id: "tactics",
    title: "Tattiche base",
    summary: "Forchette, inchiodature e infilate nascono quando più pezzi sono allineati o sovraccarichi.",
    fen: "r3k2r/pp3ppp/8/3N4/8/8/PP3PPP/R3K2R w KQkq - 0 1",
    focusSquares: ["d5", "c7", "e8", "a8"],
    quiz: {
      question: "Una forchetta attacca...",
      answers: ["Due o più bersagli", "Solo il re", "Solo pedoni"],
      correctIndex: 0,
    },
  },
  {
    id: "endgames",
    title: "Finali base",
    summary: "Nei finali il re diventa un pezzo attivo e l'opposizione decide molte corse di pedoni.",
    fen: "8/8/8/3k4/3P4/3K4/8/8 w - - 0 1",
    focusSquares: ["d3", "d4", "d5", "c3"],
    quiz: {
      question: "Nel finale il re dovrebbe spesso...",
      answers: ["Restare lontano", "Diventare attivo", "Non muoversi mai"],
      correctIndex: 1,
    },
  },
];
