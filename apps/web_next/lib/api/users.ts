import { API_HOST } from "../constants";
import { serverFetch } from "./api";
import { components } from "./types";

export const fetchNeedSetup = async (): Promise<
  components["schemas"]["NeedSetup"] | null
> => {
  try {
    const response = await fetch(API_HOST + "/api/users/need-setup", {
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
};

export const fetchCurrentUser = async (): Promise<
  components["schemas"]["UserOut"] | null
> => {
  try {
    const response = await serverFetch("/api/users/me");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
};

export const fetchCurrentUserWorkspaces = async (): Promise<
  components["schemas"]["WorkspaceListOut"]["workspaces"] | null
> => {
  try {
    const response = await serverFetch("/api/users/me/workspaces");
    if (response.ok) {
      const data = await response.json();
      return data.workspaces;
    }
    return null;
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
};
