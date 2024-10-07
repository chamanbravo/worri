import { serverFetch } from "./api";
import { components } from "./types";

export const fetchUsersInWorkspace = async (
  workspace: string
): Promise<components["schemas"]["UserOut"][] | null> => {
  try {
    const response = await serverFetch(`/api/workspaces/${workspace}/users`);
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
