import { create } from "zustand";

export const useIsAuthenticated = create<{
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}>((set) => ({
  isAuthenticated: !!localStorage.getItem("token"),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
}));
