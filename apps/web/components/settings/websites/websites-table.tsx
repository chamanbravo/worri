import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WebsiteDialog } from "./website-dialog";
import { components } from "@/lib/api/types";

interface Props {
  data: components["schemas"]["WebsiteOut"][];
  currentWorkspace: string;
}

export default function WebsitesTable({ data }: Props) {
  return (
    <>
      <div className="flex justify-end w-full">
        <div className="inline-flex gap-2">
          <WebsiteDialog />
        </div>
      </div>
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
                    <WebsiteDialog defaultValues={w} />
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
