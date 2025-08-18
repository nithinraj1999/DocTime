import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IDoctor } from "@/types/patients";
interface DoctorState {
  user: IDoctor | null;
  setUser: (user: IDoctor) => void;
  updateUser: (user: Partial<IDoctor>) => void;
  clearUser: () => void;
}

export const useDoctorStore = create<DoctorState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user: IDoctor) => set({ user }),

      updateUser: (updated: Partial<IDoctor>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updated } : null,
        })),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "doctor-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
