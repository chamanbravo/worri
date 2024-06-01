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
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { CreateMemberDialog } from "./CreateMemberDialog";
import { useMembers } from "@/hooks/queries/useMembers";

export default function MembersTable() {
  const { workspace } = useParams();
  const user = useUserStore((state) => state.user);
  const { data, refetch } = useMembers(workspace);

  return (
    <>
      <div className="flex justify-end w-full">
        <div className="inline-flex gap-2">
          <CreateMemberDialog refetch={refetch} />
        </div>
      </div>
      {data?.length ? (
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
            {data?.map((w, i) => {
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
