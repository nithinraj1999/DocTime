import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AuthState = {
  email: string;
  setEmail: (email: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: "",
      setEmail: (email) => set({ email }),
    }),
    {
      name: "auth-storage", 
      storage: createJSONStorage(() => localStorage),
    }
  )
);
