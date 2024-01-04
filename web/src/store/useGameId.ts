import { create } from "zustand";

export const useGameId = create<{
  gameId: number | null;
  setGameId: (gameId: number | null) => void;
}>((set) => ({
  gameId: null,
  setGameId: (gameId) => set({ gameId }),
}));
