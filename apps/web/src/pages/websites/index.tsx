/* eslint-disable react-hooks/rules-of-hooks */
import { components } from "@/lib/api/v1";
import { client } from "@/lib/utils";
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

export default function index() {
  const { workspace } = useParams();
  const [websites, setWebsites] = useState<
    components["schemas"]["WebsiteOut"][]
  >([]);

  const fetchWebsites = async (signal: AbortSignal) => {
    try {
      if (!workspace) return;
      const { response, data } = await GET("/api/workspaces/{name}/websites/", {
        signal,
        params: {
          path: {
            name: workspace,
          },
        },
      });

      if (response.ok && data) {
        setWebsites(data?.websites);
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
    <div className="p-10 px-4 pb-16 space-y-6 md:block max-w-[1280px] mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">Websites</h2>

      {websites?.length ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websites?.map((w, i) => {
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