export const EmptyCell = " " as const;
export type Player = "X" | "O";
export type Cell = typeof EmptyCell | Player;
export type Board = Cell[][];
export type GameResult = Player | "Draw" | null;
export type PlayerMove = [number, number];

export type GameState = {
    board: Board;
    currentPlayer: Player;
    currentPlayerId: number;
    gameResult: GameResult;
};