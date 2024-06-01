import { client } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const { GET } = client;

export function useWebsiteInfo(id: string | undefined) {
  return useQuery({
    queryKey: ["websiteInfo"],
    queryFn: async () => {
      if (!id) return;
      const { response, data } = await GET("/api/websites/{id}/", {
        params: {
          path: {
            id: +id,
          },
        },
      });

      if (response.ok && data) {
        return data;
      }
    },
  });
}
