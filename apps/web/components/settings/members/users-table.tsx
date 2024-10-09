import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserDialog } from "./users-dialog";
import { components } from "@/lib/api/types";

interface Props {
  data: components["schemas"]["UserOut"][];
  currentWorkspace: string;
}

export default function UsersTable({ data }: Props) {
  return (
    <>
      <div className="flex justify-end w-full">
        <div className="inline-flex gap-2">
          <UserDialog />
        </div>
      </div>
      {data?.length ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((user, i) => {
              return (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <UserDialog defaultValues={user} />
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
