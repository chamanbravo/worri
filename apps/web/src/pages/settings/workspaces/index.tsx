import { Separator } from "@ui/index";
import { useParams } from "react-router";
import WorkspaceEditForm from "./WorkspaceEditForm";
import WorkspaceTable from "./WorkspaceTable";

export default function Workspaces() {
  const { editWorkspaceName } = useParams();

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

      {editWorkspaceName ? <WorkspaceEditForm /> : <WorkspaceTable />}
    </div>
  );
}
