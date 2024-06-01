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
import { CreateWebsiteDialog } from "./CreateWebsiteDialog";
import { useWebsites } from "@/hooks/queries/useWebsites";

export default function WebsitesTable() {
  const { workspace } = useParams();
  const { data, refetch } = useWebsites(workspace);

  return (
    <>
      <div className="flex justify-end w-full">
        <div className="inline-flex gap-2">
          <CreateWebsiteDialog refetch={refetch} />
        </div>
      </div>
      {data?.length ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((w, i) => {
              return (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell>{w.domain}</TableCell>
                  <TableCell>{w.created_by}</TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <Button variant="secondary" asChild>
                      <Link to={`/app/${workspace}/settings/websites/${w.id}/`}>
                        Edit
                      </Link>
                    </Button>
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
