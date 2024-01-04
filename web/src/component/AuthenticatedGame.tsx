import { useAuth } from "../hooks/useAuth.ts";
import { useGame } from "../hooks/useGame.ts";
import { useGames } from "../hooks/useGames.ts";
import { TicTacToe } from "./TicTactToe.tsx";
import { GamesList } from "./GamesList.tsx";

export const AuthenticatedGame = () => {
  const { logout, userLogin } = useAuth();
  const { joinGame, createGame, game } = useGame();
  const { games } = useGames();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-10">
        <div className="flex flex-col gap-5">
          <div className="font-bold text-purple-400">{userLogin}</div>
          <GamesList games={games} joinGame={joinGame} />
          <div className="flex flex-col gap-1">
            <button onClick={createGame}>New game</button>
            <button onClick={() => joinGame()}>Join game</button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
        <div>
          {game?.id ? <span>Game #{game?.id}</span> : null}
          <TicTacToe />
        </div>
      </div>
    </div>
  );
};
