import { client } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const { GET } = client;

export function useWorkspaceInfo(workspace: string | undefined) {
  return useQuery({
    queryKey: ["workspaceInfo"],
    queryFn: async () => {
      if (!workspace) return;
      const { response, data } = await GET("/api/workspaces/{name}/", {
        params: {
          path: {
            name: workspace,
          },
        },
      });

      if (response.ok && data) {
        return data;
      }
    },
  });
}
