// Tipos de variáveis
export type Level = {
  id: string;
  text: string;
};

export type LevelsData = {
  easy: Level[];
  medium: Level[];
  hard: Level[];
};

export type Difficulty = "easy" | "medium" | "hard";
