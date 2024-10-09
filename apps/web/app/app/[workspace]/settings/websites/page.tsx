import WebsitesTable from "@/components/settings/websites/websites-table";
import { Separator } from "@/components/ui/separator";
import { fetchWebsites } from "@/lib/api/websites";

interface Props {
  params: {
    workspace: string;
  };
}

export default async function page({ params }: Props) {
  const { workspace } = params;
  const websites = await fetchWebsites(workspace);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Websites</h3>
        <p className="text-sm text-muted-foreground">
          Update the websites setting
        </p>
      </div>
      <Separator />
      <WebsitesTable data={websites || []} currentWorkspace={workspace} />
    </div>
  );
}
