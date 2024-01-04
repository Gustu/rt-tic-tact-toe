import { useQuery } from "react-query";
import { api } from "../common/axios.ts";
import { Game } from "../types.ts";

export const useGames = (): {
  games: Game[];
} => {
  const gameQuery = useQuery<Game[]>(
    ["games"],
    async () => {
      const { data } = await api.get<Game[]>(`/games`);
      return data;
    },
    { refetchInterval: 2000 },
  );

  return {
    games: gameQuery?.data ?? [],
  };
};
