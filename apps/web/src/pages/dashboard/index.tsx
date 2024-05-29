/* eslint-disable react-hooks/rules-of-hooks */
import useUserStore from "@/store/userStore";
import { CreateWorkspaceDialog } from "../settings/workspaces/CreateWorkspace";
import { JoinWorkspaceDialog } from "../settings/workspaces/JoinWorkspace";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { client } from "@/lib/utils";
import { components } from "@/lib/api/v1";
import { Button } from "@ui/index";
import { Link } from "react-router-dom";

const { GET } = client;

export default function index() {
  const { workspace } = useParams();
  const user = useUserStore((state) => state.user);
  const [websites, setWebsites] = useState<
    components["schemas"]["WebsiteOut"][]
  >([]);

  const fetchWebsites = async (signal: AbortSignal) => {
    try {
      if (!workspace) return;
      const { response, data } = await GET("/api/workspaces/{name}/websites/", {
        signal,
        params: {
          path: {
            name: workspace,
          },
        },
      });

      if (response.ok && data) {
        setWebsites(data?.websites);
      }
    } catch {
      //
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchWebsites(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <div className="p-10 px-4 pb-16 space-y-6 md:block max-w-[1280px] mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>

      {!user.workspace.length && (
        <div className="flex flex-col items-center justify-center gap-3 h-[calc(100vh-25rem)]">
          <span className="pt-4 text-sm text-muted-foreground">
            You do not have any workspace configured
          </span>
          <div className="flex gap-3">
            <JoinWorkspaceDialog />
            {user.role === "ADMIN" && <CreateWorkspaceDialog />}
          </div>
        </div>
      )}

      {!user.workspace.length && (
        <div className="flex flex-col items-center justify-center gap-3 h-[calc(100vh-25rem)]">
          <span className="pt-4 text-sm text-muted-foreground">
            You do not have any workspace configured
          </span>
          <div className="flex gap-3">
            <JoinWorkspaceDialog />
            {user.role === "ADMIN" && <CreateWorkspaceDialog />}
          </div>
        </div>
      )}

      {!websites?.length && (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-25rem)] gap-2 text-center">
          <span className="pt-4 text-sm text-muted-foreground">
            You do not have any websites configured
          </span>
          <Button variant="secondary" asChild>
            <Link to={`/app/${workspace}/settings/websites/`}>
              Go to settings
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
