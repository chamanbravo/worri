"use client";

import { cn } from "@/lib/utils";
import { WorkspaceDropdown } from "./workspace-dropdown";
import { UserDropdown } from "./user-dropdown";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { components } from "@/lib/api/types";
import useUserStore from "@/store/userStore";
import { useEffect } from "react";

const active = "text-sm font-medium hover:text-foreground";
const inactive = cn(active, "text-muted-foreground");

interface Props {
  user: components["schemas"]["UserOut"] | null;
  workspaces: string[] | null;
}

export default function Navbar({ user, workspaces }: Props) {
  const pathname = usePathname();
  const setUser = useUserStore((state) => state.setUser);
  const pathnameRegex = /^\/app\/.+$/;

  useEffect(() => {
    if (pathnameRegex.test(pathname) && !workspaces?.length) {
      redirect("/app/");
    }

    setUser(
      user?.username || "",
      user?.first_name || "",
      user?.last_name || "",
      user?.role || "",
      workspaces || []
    );
  }, [user, workspaces]);

  return (
    <div className="border-b">
      <div className="max-w-[1280px] m-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          <p className="font-medium">logo</p>
          <nav className={"flex items-center space-x-4 mx-6"}>
            <Link
              href={"/app/"}
              className={pathname.includes("dashboard") ? active : inactive}
            >
              Dashboard
            </Link>
            <Link href={"/app/"} className={inactive}>
              Websites
            </Link>
            <Link
              href={"/app/"}
              className={pathname.includes("/settings/") ? active : inactive}
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {workspaces?.length ? (
            <WorkspaceDropdown workspaces={workspaces} />
          ) : null}
          <UserDropdown user={user} />
        </div>
      </div>
    </div>
  );
}
