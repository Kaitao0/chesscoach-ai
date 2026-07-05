# ChessCoach AI

Web app originale per imparare a giocare a scacchi con partita contro bot, feedback live, Game Review, retry degli errori, puzzle, aperture e lezioni.

## Avvio

```bash
npm install
npm run dev
```

Build di produzione:

```bash
npm run build
```

Se npm resta fermo durante la risoluzione dei pacchetti su Windows, prova:

```bash
npm install --legacy-peer-deps --no-audit --no-fund
```

## Librerie usate

- React + TypeScript per UI e architettura.
- Vite per sviluppo e build.
- chess.js per legalità delle mosse, FEN, PGN, scacco, matto, stallo, arrocco, en passant e promozione.
- lucide-react per le icone.

La scacchiera è un componente custom (`src/components/ChessBoard.tsx`) che usa `chess.js` come fonte unica di verità.

## Motore

Il servizio motore vive in `src/lib/engineService.ts`.

Interfaccia già pronta:

- `getBestMove(fen, depth)`
- `evaluatePosition(fen, depth)`
- `getTopMoves(fen, depth, multipv)`
- `getBotMove(fen, difficulty)`
- `stopAnalysis()`

La prima versione usa un worker (`src/workers/engineWorker.ts`) con fallback euristico modulare (`src/lib/engineHeuristics.ts`). La struttura è pronta per sostituire il fallback con Stockfish WASM/Web Worker senza cambiare le pagine.

## Classificazione Mosse

La logica è in `src/lib/moveClassifier.ts`.

Combina:

- differenza in centipawn rispetto alla migliore alternativa;
- variazione stimata di probabilità di vittoria;
- fase della partita;
- matto mancato;
- pezzi lasciati in presa;
- segnali tattici;
- mossa di libro.

Le categorie sono: Theory, Best, Excellent, Great, Good, Inaccuracy, Mistake, Blunder, Miss, Brilliant.

Le spiegazioni sono in italiano e restano prudenti quando i dati non bastano.

## Aperture

Il dataset demo è in `src/lib/openings.ts` e segue il modello:

```ts
Opening {
  eco: string
  name: string
  pgn: string
  fen?: string
  moves: string[]
}
```

Per aggiungere aperture, inserisci nuove voci con sequenza SAN in `moves`. Il riconoscimento usa il prefisso più lungo della partita.

## Puzzle

I 10 puzzle demo sono in `src/lib/puzzles.ts`.

Ogni puzzle contiene FEN, lato al tratto, soluzione UCI, tema, difficoltà, hint e spiegazione. Per aggiungerne uno, inserisci una nuova voce nello stesso array.

## Storage

La prima versione usa localStorage tramite `src/lib/storage.ts`.

I modelli sono compatibili con una futura migrazione a Supabase:

- UserProfile
- Game
- MoveReview
- UserProgress

## Roadmap

- Integrare Stockfish WASM reale come engine principale.
- Aggiungere autenticazione e Supabase.
- Import PGN con analisi profonda automatica.
- Dataset aperture ECO completo.
- Database puzzle esteso con rating dinamico.
- Coach AI con LLM vincolato a FEN, analisi motore e legal moves.
- Timer completo e modalità tempo.
