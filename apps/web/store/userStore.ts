import { components } from "@/lib/api/types";
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
  updateWorkspace: () => void;
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
  updateWorkspace: async () => {
    const response = await fetch("/api/users/me/workspaces/");
    const data: components["schemas"]["WorkspaceListOut"] =
      await response.json();
    set((state) => ({
      user: { ...state.user, workspace: data?.workspaces },
    }));
  },
}));

export default useUserStore;
