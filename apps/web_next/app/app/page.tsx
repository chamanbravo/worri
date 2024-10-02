import NoWorkspacesState from "@/components/workspace/no-workspaces-state";
import { fetchUserWorkspaces } from "@/lib/api/users";

export default async function page() {
  const workspaces = await fetchUserWorkspaces();

  return (
    <div className="pb-16 space-y-6 md:block max-w-[1280px] mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      {!workspaces?.length && <NoWorkspacesState />}
    </div>
  );
}
