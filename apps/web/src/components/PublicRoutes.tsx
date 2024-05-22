import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
import { client } from "@/lib/utils";

const { GET } = client;

export default function PublicRoutes() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (signal: AbortSignal) => {
    const { response, data } = await GET("/api/users/current/", { signal });
    if (response.ok && data) {
      setUser(
        data.username,
        data.first_name || "",
        data.last_name || "",
        data.role,
        data.workspace
      );
      //
    }
    setLoading(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (!user.username) {
      fetchCurrentUser(signal);
    } else {
      setLoading(false);
    }
    return () => controller.abort();
  }, []);

  if (loading) {
    return null;
  }

  if (user?.username) {
    return <Navigate to="app/cool-space/dashboard/" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
