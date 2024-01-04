import { create } from "zustand";

export const useUserLogin = create<{
  userLogin: string | null;
  setUserLogin: (login: string | null) => void;
}>((set) => ({
  userLogin: localStorage.getItem("login") ?? null,
  setUserLogin: (userLogin) => set({ userLogin }),
}));
