import UsersTable from "@/components/settings/members/users-table";
import { Separator } from "@/components/ui/separator";
import { fetchUsersInWorkspace } from "@/lib/api/workspace";

interface Props {
  params: {
    workspace: string;
  };
}

export default async function page({ params }: Props) {
  const { workspace } = params;
  const members = await fetchUsersInWorkspace(workspace);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Members</h3>
        <p className="text-sm text-muted-foreground">
          Update the members setting
        </p>
      </div>
      <Separator />
      <UsersTable data={members || []} currentWorkspace={""} />
    </div>
  );
}
