import { components } from "@/lib/api/v1";
import { useEffect, useState } from "react";
import { Separator } from "@ui/index";
import { useParams } from "react-router";
import WorkspaceEditForm from "./WorkspaceEditForm";
import WorkspaceTable from "./WorkspaceTable";
import { client } from "@/lib/utils";
import useUserStore from "@/store/userStore";

const { GET } = client;

export default function Workspaces() {
  const { editWorkspaceName } = useParams();
  const updateWorkspaceList = useUserStore((state) => state.updateWorkspace);
  const [workspaces, setWorkspaces] = useState<
    components["schemas"]["WorkspacesOut"][]
  >([]);
  const [refetch, setRefetch] = useState<boolean>(false);

  const fetchWorkspaces = async (signal: AbortSignal) => {
    try {
      const { response, data } = await GET("/api/users/workspaces/", {
        signal,
      });

      if (response.ok && data) {
        setWorkspaces(data?.workspaces);
        updateWorkspaceList(data?.workspaces.map((i) => i.name));
      }
    } catch {
      //
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchWorkspaces(signal);
    return () => controller.abort();
  }, [refetch]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {editWorkspaceName || "Workspaces"}
        </h3>
        <p className="text-sm text-muted-foreground">
          Update the workspace setting
        </p>
      </div>
      <Separator />

      {editWorkspaceName ? (
        <WorkspaceEditForm refetch={() => setRefetch((prev) => !prev)} />
      ) : (
        <WorkspaceTable
          refetch={() => setRefetch((prev) => !prev)}
          workspaces={workspaces}
        />
      )}
    </div>
  );
}
