import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";

export const SignUpStatus = {
  otp: "otp",
  verify: "verify",
  confirmPassword: "confirm-password",
  userProfile:"userProfile",
  reset: "reset",
  none: "none",
} as const;

export type SignUpStatus = (typeof SignUpStatus)[keyof typeof SignUpStatus];

type State = {
  email: string | null;
  token: string | null;
  status: SignUpStatus;
};

type Actions = {
  setAuth: (email: string, token: string, status: SignUpStatus) => void;
  clearAuth: () => void;
};

const initialState: State = {
  email: null,
  token: null,
  status: "none",
};

const useAuthStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      ...initialState,
      setAuth: (email, token, status) =>
        set((state) => {
          state.email = email;
          state.token = token;
          state.status = status;
        }),
      clearAuth: () => set(initialState),
    })),
    {
      name: "auth",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
