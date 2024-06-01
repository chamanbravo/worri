import { client } from "@/lib/utils";
import useUserStore from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";

const { GET } = client;

export function useWorkspaces() {
  const updateWorkspaceList = useUserStore((state) => state.updateWorkspace);

  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const { response, data } = await GET("/api/users/workspaces/");
      if (response.ok && data?.workspaces?.length) {
        updateWorkspaceList();
        return data.workspaces;
      }
    },
  });
}
