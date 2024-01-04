import { Game } from "../types.ts";
import toast from "react-hot-toast";

export const GamesList = ({
  games,
  joinGame,
}: {
  games: Game[];
  joinGame: (gameId?: number) => Promise<void>;
}) => (
  <div>
    {games
      .filter((game) => !game.state.gameResult)
      .map((game) => (
        <div
          className="hover:font-bold cursor-pointer"
          onClick={() => {
            joinGame(game.id).catch((e) => {
              const responseMessage = e.response?.data?.message;
              toast.error(responseMessage ?? e.message);
            });
          }}
          key={game.id}
        >
          <div>
            {game.counterPartyPlayer ? "🤝" : "🟩"} {game.initiatorPlayer}
            's room (#{game.id})
          </div>
        </div>
      ))}
  </div>
);
