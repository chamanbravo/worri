import useUserStore from "@/store/userStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/index";
import { Button } from "@ui/index";
import { Link, useParams } from "react-router-dom";
import { CreateWorkspaceDialog } from "./CreateWorkspace";
import { JoinWorkspaceDialog } from "./JoinWorkspace";
import { components } from "@/lib/api/v1";

interface Props {
  refetch: () => void;
  workspaces: components["schemas"]["WorkspacesOut"][];
}

export default function WorkspaceTable({ refetch, workspaces }: Props) {
  const { workspace } = useParams();
  const user = useUserStore((state) => state.user);

  return (
    <>
      <div className="flex justify-end w-full">
        <div className="inline-flex gap-2">
          <JoinWorkspaceDialog refetch={refetch} />
          <CreateWorkspaceDialog refetch={refetch} />
        </div>
      </div>
      {workspace?.length ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Websites</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Access Code</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces?.map((w, i) => {
              return (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell>{w.created_by}</TableCell>
                  <TableCell>{w.websites_count}</TableCell>
                  <TableCell>{w.members_count}</TableCell>
                  <TableCell>{w.access_code}</TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    {user.role !== "ADMIN" ? (
                      <Button variant="secondary" disabled>
                        Edit
                      </Button>
                    ) : (
                      <Button variant="secondary" asChild>
                        <Link
                          to={`/app/${workspace}/settings/workspaces/${w.name}/`}
                        >
                          Edit
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center h-16 text-center">
          <span className="pt-4 text-sm text-muted-foreground">
            No data available.
          </span>
        </div>
      )}
    </>
  );
}
