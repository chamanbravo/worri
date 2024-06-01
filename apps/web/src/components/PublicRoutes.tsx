import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUser } from "@/hooks/queries/useCurrentUser";

export default function PublicRoutes() {
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return null;
  }

  if (data?.username && !data?.workspace?.length) {
    return <Navigate to={`app/`} replace />;
  }

  if (data?.username && data?.workspace?.length) {
    return <Navigate to={`app/${data.workspace[0]}/dashboard/`} replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
