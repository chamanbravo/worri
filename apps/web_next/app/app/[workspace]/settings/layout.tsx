import SettingsSidebarNav from "@/components/settings/sidebar-nav";
import { Separator } from "@/components/ui/separator";

interface Props {
  params: {
    workspace: string;
  };
  children: React.ReactNode;
}

export default async function layout({ params, children }: Props) {
  const { workspace } = params;

  const sidebarNavItems = [
    // {
    //   title: "Workspaces",
    //   href: `/app/${workspace}/settings/workspaces/`,
    // },
    {
      title: "Websites",
      href: `/app/${workspace}/settings/websites/`,
    },
    {
      title: "Members",
      href: `/app/${workspace}/settings/members/`,
    },
  ];

  return (
    <>
      <div className="space-y-6 md:block max-w-[1280px] mx-auto">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your workspace, websites and members settings and
            preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SettingsSidebarNav links={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-3xl">{children}</div>
        </div>
      </div>
    </>
  );
}
