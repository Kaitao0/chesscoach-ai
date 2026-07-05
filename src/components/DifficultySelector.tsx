import type { BotDifficulty } from "../types";

const options: Array<{ value: BotDifficulty; label: string }> = [
  { value: "beginner", label: "Principiante" },
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Medio" },
  { value: "hard", label: "Difficile" },
  { value: "expert", label: "Esperto" },
];

export function DifficultySelector({
  value,
  onChange,
}: {
  value: BotDifficulty;
  onChange: (value: BotDifficulty) => void;
}) {
  return (
    <label className="stack">
      <span className="muted">Difficoltà bot</span>
      <select className="form-control" value={value} onChange={(event) => onChange(event.target.value as BotDifficulty)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
