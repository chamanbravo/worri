import { client } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const { GET } = client;

export function useNeedSetup() {
  return useQuery({
    queryKey: ["needSetup"],
    queryFn: async () => {
      const { data } = await GET("/api/users/setup/");
      if (data) {
        return data;
      }
    },
  });
}
