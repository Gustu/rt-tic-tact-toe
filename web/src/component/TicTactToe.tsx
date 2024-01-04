import { useGame } from "../hooks/useGame.ts";
import toast from "react-hot-toast";
import { GameState } from "../types.ts";

const Board = ({
  board,
  onClick,
}: {
  onClick: (index: number) => void;
  board: GameState["board"];
}) => {
  const renderSquare = (index: number) => (
    <button
      className="h-24 w-24 border border-gray-400 flex items-center justify-center text-2xl"
      onClick={() => onClick(index)}
    >
      {board[index]}
    </button>
  );

  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((_, index) => renderSquare(index))}
    </div>
  );
};

export const TicTacToe = () => {
  const { isGameLoading, game, playMove } = useGame();

  const board = game?.state?.board.flat() ?? Array(9).fill(null);
  const xIsNext = game?.state.currentPlayer === "X";

  const handleClick = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    playMove(row, col).catch((e) => {
      const responseMessage = e.response?.data?.message;
      toast.error(responseMessage ?? e.message);
    });
  };

  const result = game?.state?.gameResult;
  const status = result
    ? `Winner: ${result}`
    : `Next player: ${xIsNext ? "X" : "O"}`;

  if (isGameLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-5">
      {game && (
        <div className="flex flex-col items-center gap-4 mt-3">
          <div className="">{status}</div>
          <div className="flex gap-2">
            <div>❌: {game.initiatorPlayer}</div>
            <div>⭕️: {game.counterPartyPlayer ?? "-"}</div>
          </div>
          <Board board={board} onClick={handleClick} />
        </div>
      )}
    </div>
  );
};
