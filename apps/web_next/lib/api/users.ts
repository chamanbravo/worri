import { API_HOST } from "../constants";
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
