import { client } from "@/lib/utils";
import useUserStore from "@/store/userStore";
import { useQuery } from "@tanstack/react-query";

const { GET } = client;

export function useCurrentUser() {
  const setUser = useUserStore((state) => state.setUser);
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const { data } = await GET("/api/users/current/");
      if (data) {
        setUser(
          data.username,
          data.first_name || "",
          data.last_name || "",
          data.role,
          data.workspace
        );
        return data;
      }
      return null;
    },
  });
}
