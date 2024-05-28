import { create } from "zustand";

interface UserState {
  user: {
    username: string;
    firstname: string;
    lastname: string;
    role: string;
    workspace: readonly string[];
  };
  setUser: (
    username: string,
    firstname: string,
    lastname: string,
    role: string,
    workspace: readonly string[]
  ) => void;
  clearUser: () => void;
  updateWorkspace: (workspace: readonly string[]) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: {
    username: "",
    firstname: "",
    lastname: "",
    role: "",
    workspace: [],
  },
  setUser: (
    username: string,
    firstname: string,
    lastname: string,
    role: string,
    workspace: readonly string[]
  ) => set({ user: { username, firstname, lastname, role, workspace } }),
  clearUser: () =>
    set({
      user: {
        username: "",
        firstname: "",
        lastname: "",
        role: "",
        workspace: [],
      },
    }),
  updateWorkspace: (workspace: readonly string[]) =>
    set((state) => ({ user: { ...state.user, workspace: workspace } })),
}));

export default useUserStore;
