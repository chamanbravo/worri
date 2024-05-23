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
import { useParams } from "react-router";
import { Link } from "react-router-dom";

const { GET } = client;

export default function MembersTable() {
  const { workspace } = useParams();
  const user = useUserStore((state) => state.user);
  const [websites, setWebsites] = useState<
    components["schemas"]["WorkspaceMemberOut"][]
  >([]);

  const fetchWebsites = async (signal: AbortSignal) => {
    try {
      if (!workspace) return;
      const { response, data } = await GET("/api/workspaces/{name}/members/", {
        signal,
        params: {
          path: {
            name: workspace,
          },
        },
      });

      if (response.ok && data) {
        setWebsites(data?.members);
      }
    } catch {
      //
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchWebsites(signal);
    return () => controller.abort();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Username</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Date Joined</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {websites?.map((w, i) => {
          return (
            <TableRow key={i} className="hover:bg-transparent">
              <TableCell className="font-medium">{w.username}</TableCell>
              <TableCell>{w.role}</TableCell>
              <TableCell>
                {w.date_joined && new Date(w.date_joined).toDateString()}
              </TableCell>
              <TableCell className="flex items-center justify-end gap-2">
                {w.username === user.username ? (
                  <Button variant="secondary" disabled>
                    Edit
                  </Button>
                ) : (
                  <Button variant="secondary" asChild>
                    <Link
                      to={`/app/${workspace}/settings/members/${w.username}/`}
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
  );
}
