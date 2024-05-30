import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@repo/ui";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import CheckWorkspacesRoutes from "./components/CheckWorkspacesRoutes";

const Auth = lazy(() => import("@/pages/auth"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Websites = lazy(() => import("@/pages/websites"));
const Settings = lazy(() => import("@/pages/settings"));
const Profile = lazy(() => import("@/pages/profile"));

const router = createBrowserRouter([
  {
    element: <PublicRoutes />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<p></p>}>
            <Auth />
          </Suspense>
        ),
      },
    ],
  },

  {
    element: <CheckWorkspacesRoutes />,
    children: [
      {
        path: "app/",
        element: (
          <Suspense fallback={<p></p>}>
            <Dashboard />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "app/:workspace/dashboard/",
        element: (
          <Suspense fallback={<p></p>}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "app/:workspace/websites/",
        element: (
          <Suspense fallback={<p></p>}>
            <Websites />
          </Suspense>
        ),
      },
      {
        path: "app/:workspace/settings/workspaces/",
        element: (
          <Suspense fallback={<p></p>}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "app/:workspace/settings/workspaces/:editWorkspaceName/",
        element: (
          <Suspense fallback={<p></p>}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "app/:workspace/settings/websites/",
        element: (
          <Suspense fallback={<p></p>}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "app/:workspace/settings/websites/:id/",
        element: (
          <Suspense fallback={<p></p>}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "app/:workspace/settings/members/",
        element: (
          <Suspense fallback={<p></p>}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "app/:workspace/settings/members/:username/",
        element: (
          <Suspense fallback={<p></p>}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: "app/:workspace/profile/",
        element: (
          <Suspense fallback={<p></p>}>
            <Profile />
          </Suspense>
        ),
      },
      {
        path: "app/:workspace/profile/password-security",
        element: (
          <Suspense fallback={<p></p>}>
            <Profile />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <p>404 Error - Nothing here...</p>,
  },
]);

function App() {
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
