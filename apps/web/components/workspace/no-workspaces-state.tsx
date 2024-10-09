"use client";

import { JoinWorkspaceDialog } from "@/components/workspace/join-workspace";
import useUserStore from "@/store/userStore";
import { CreateWorkspaceDialog } from "./create-workspace";

export default function NoWorkspacesState() {
  const user = useUserStore((state) => state.user);

  return (
    <div className="flex flex-col items-center justify-center gap-3 h-[calc(100vh-25rem)]">
      <span className="pt-4 text-sm text-muted-foreground">
        You do not have any workspace configured
      </span>
      <div className="flex gap-3">
        <JoinWorkspaceDialog />
        {user.role === "ADMIN" && <CreateWorkspaceDialog />}
      </div>
    </div>
  );
}
