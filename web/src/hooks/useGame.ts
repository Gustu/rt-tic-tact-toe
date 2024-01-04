import { useQuery } from "react-query";
import { api } from "../common/axios.ts";
import { Game } from "../types.ts";
import { useGameId } from "../store/useGameId.ts";

export const useGame = (): {
  isGameLoading: boolean;
  game: Game | null;
  joinedGame: boolean;
  joinGame: (gameId?: number) => Promise<void>;
  playMove: (row: number, column: number) => Promise<void>;
  createGame: () => Promise<void>;
} => {
  const { gameId, setGameId } = useGameId();
  const gameQuery = useQuery<Game | null>(
    ["game", gameId],
    async () => {
      const { data } = await api.get<Game>(`/games/${gameId}`);
      return data;
    },
    { enabled: !!gameId, refetchInterval: 500 },
  );

  const joinGame = async (gameId?: number) => {
    const { data } = await api.post<Game>(
      `/games/join${gameId ? `?gameId=${gameId}` : ""}`,
    );
    setGameId(data.id);
  };

  const createGame = async () => {
    const { data } = await api.post<Game>(`/games`);
    setGameId(data.id);
  };

  const playMove = async (row: number, column: number) => {
    await api.post<Game>(`/games/${gameId}/play`, {
      row,
      column,
    });
    await gameQuery.refetch();
  };

  return {
    isGameLoading: gameQuery.isLoading,
    game: gameQuery?.data ?? null,
    joinedGame: gameId !== null,
    joinGame,
    playMove,
    createGame,
  };
};
