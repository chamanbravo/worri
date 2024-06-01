import { client } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const { GET } = client;

export function useWebsites(workspace: string | undefined) {
  return useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      if (!workspace) return;
      const { response, data } = await GET("/api/workspaces/{name}/websites/", {
        params: {
          path: {
            name: workspace,
          },
        },
      });

      if (response.ok && data) {
        return data?.websites;
      }
      return [];
    },
  });
}
