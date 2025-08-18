import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface IUser {
    id: string
    name: string
    email: string
    password: string
    profileImage: string | null
    phoneNumber: string
    isAdmin: boolean
    status: 'ACTIVE' | 'BLOCKED'
    isVerified: boolean
    createdAt: Date
    updatedAt: Date
}

interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  updateUser: (user: Partial<IUser>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user: IUser) => set({ user }),

      updateUser: (updated: Partial<IUser>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updated } : null,
        })),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", 
      storage: createJSONStorage(() => localStorage)
    }
  )
);
