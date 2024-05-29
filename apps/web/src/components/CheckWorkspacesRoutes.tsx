import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import useUserStore from "@/store/userStore";
import { useEffect, useState } from "react";
import { client } from "@/lib/utils";

const { GET } = client;

export default function CheckWorkspacesRoutes() {
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

  if (!user?.username) {
    return <Navigate to="/" replace />;
  }

  if (user?.username && user?.workspace?.length) {
    return <Navigate to={`app/${user?.workspace[0]}/dashboard/`} replace />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}