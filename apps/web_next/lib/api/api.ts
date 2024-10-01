import { redirect } from "next/navigation";
import { API_HOST } from "../constants";
import { headers } from "next/headers";

export const isRedirectError = (err: any) => {
  return (
    err &&
    typeof err === "object" &&
    "digest" in err &&
    typeof err.digest === "string" &&
    err.digest.startsWith("NEXT_REDIRECT")
  );
};

export const serverFetch = async (url: string, options?: RequestInit) => {
  const headerList = headers();
  const accessToken = headerList.get("x-access-token");

  const response = await fetch(API_HOST + url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    ...options,
  });
  if (response.ok) {
    return response;
  } else if (response.status === 401) {
    redirect("/auth/");
  }
  return response;
};
