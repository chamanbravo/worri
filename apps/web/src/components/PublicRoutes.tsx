import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoutes() {
  const isAuthenticated = true;

  if (isAuthenticated) {
    return <Navigate to="/app/cool-space/dashboard" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
