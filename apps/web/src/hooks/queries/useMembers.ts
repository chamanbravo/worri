import { client } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const { GET } = client;

export function useMembers(workspace: string | undefined) {
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      if (!workspace) return;
      const { response, data } = await GET("/api/workspaces/{name}/members/", {
        params: {
          path: {
            name: workspace,
          },
        },
      });

      if (response.ok && data) {
        return data?.members;
      }
    },
  });
}
