import { client } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const { GET } = client;

export function useMemberInfo(username: string | undefined) {
  return useQuery({
    queryKey: ["memberInfo"],
    queryFn: async () => {
      if (!username) return;
      const { response, data } = await GET("/api/users/{username}/", {
        params: {
          path: {
            username: username,
          },
        },
      });

      if (response.ok && data) {
        return data;
      }
    },
  });
}
