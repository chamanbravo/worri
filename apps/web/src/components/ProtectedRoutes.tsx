import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function ProtectedRoutes() {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
