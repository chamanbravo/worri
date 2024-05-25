import { components } from "@/lib/api/v1";
import { client } from "@/lib/utils";
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
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const { GET } = client;

export default function WorkspaceTable() {
  const { workspace } = useParams();
  const user = useUserStore((state) => state.user);
  const [workspaces, setWorkspaces] = useState<
    components["schemas"]["WorkspacesOut"][]
  >([]);

  const fetchWorkspaces = async (signal: AbortSignal) => {
    try {
      const { response, data } = await GET("/api/users/workspaces/", {
        signal,
      });

      if (response.ok && data) {
        setWorkspaces(data?.workspaces);
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
  }, []);

  return (
    <>
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
