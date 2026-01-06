import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type UserType = {
  id?: string;
  username: string;
  email: string;
  avatarUrl: string;
};

type State = {
  user: UserType | null;
  isLoading: boolean;
  error: null | Error;
};

type Action = {
  getUser: (user: UserType) => void;
};

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const useUserStore = create<State & Action>()(
  persist(
    (set) => ({
      ...initialState,
      getUser: (user: UserType) => {
        set(() => ({
          user: user,
          isLoading: false,
          error: null,
        }));
      },
      clearUser: () => set(() => initialState),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
