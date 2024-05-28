import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@repo/ui";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";

const Auth = lazy(() => import("@/pages/auth"));
const Settings = lazy(() => import("@/pages/settings"));

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
    element: <ProtectedRoutes />,
    children: [
      {
        path: "app/:workspace/dashboard/",
        element: (
          <Suspense fallback={<p></p>}>
            <p>hello</p>
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
