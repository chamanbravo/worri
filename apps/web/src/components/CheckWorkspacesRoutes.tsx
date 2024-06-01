import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";

export default function CheckWorkspacesRoutes() {
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return null;
  }

  if (!data?.username) {
    return <Navigate to="/" replace />;
  }

  if (data?.username && data?.workspace?.length) {
    return <Navigate to={`app/${data?.workspace[0]}/dashboard/`} replace />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
