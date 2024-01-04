export type GameState = {
  board: string[][];
  currentPlayer: string;
  currentPlayerId: number;
  gameResult: "X" | "O" | "Draw" | null;
};
export type Game = {
  id: number;
  state: GameState;
  initiatorPlayer: string;
  counterPartyPlayer: string;
};
