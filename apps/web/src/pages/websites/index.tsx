/* eslint-disable react-hooks/rules-of-hooks */
import { useWebsites } from "@/hooks/queries/useWebsites";
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

export default function index() {
  const { workspace } = useParams();
  const { data } = useWebsites(workspace);

  return (
    <div className="p-10 px-4 pb-16 space-y-6 md:block max-w-[1280px] mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">Websites</h2>

      {data?.length ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((w, i) => {
              return (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell className="font-medium">{w.name}</TableCell>
                  <TableCell>{w.domain}</TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <Button variant="secondary" asChild>
                      <Link to={`/app/${workspace}/websites/${w.id}/`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
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
