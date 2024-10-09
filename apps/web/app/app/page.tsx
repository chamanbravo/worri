import NoWorkspacesState from "@/components/workspace/no-workspaces-state";
import { fetchCurrentUserWorkspaces } from "@/lib/api/users";
import { redirect } from "next/navigation";

export default async function page() {
  const workspaces = await fetchCurrentUserWorkspaces();

  if (workspaces?.length) {
    redirect(`/app/${workspaces[0]}/dashboard/`);
  }

  return (
    <div className="pb-16 space-y-6 md:block max-w-[1280px] mx-auto">
      <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
      {!workspaces?.length && <NoWorkspacesState />}
    </div>
  );
}
