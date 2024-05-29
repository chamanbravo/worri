import { cn } from "@ui/lib/utils";
import { Link, useLocation, useParams } from "react-router-dom";
import { WorkspaceDropdown } from "./WorkspaceDropdown";
import { UserDropdown } from "./UserDropdown";
import useUserStore from "@/store/userStore";

const active = "text-sm font-medium hover:text-foreground";
const inactive = cn(active, "text-muted-foreground");

export default function Navbar() {
  const { pathname } = useLocation();
  const { workspace } = useParams();
  const user = useUserStore((state) => state.user);

  return (
    <div className="border-b">
      <div className="max-w-[1280px] m-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          <p className="font-medium">logo</p>
          <nav className={"flex items-center space-x-4 mx-6"}>
            <Link
              to={
                user?.workspace?.length
                  ? `/app/${workspace}/dashboard/`
                  : "/app/"
              }
              className={
                pathname.includes("dashboard" || "app") ? active : inactive
              }
            >
              Dashboard
            </Link>
            <Link
              to={
                user?.workspace?.length
                  ? `/app/${workspace}/websites/`
                  : "/app/"
              }
              className={
                pathname.includes(`/${workspace}/websites/`) ? active : inactive
              }
            >
              Websites
            </Link>
            <Link
              to={
                user?.workspace?.length
                  ? `/app/${workspace}/settings/workspaces/`
                  : "/app/"
              }
              className={pathname.includes("/settings/") ? active : inactive}
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {user.workspace.length ? <WorkspaceDropdown /> : null}
          <UserDropdown />
        </div>
      </div>
    </div>
  );
}
