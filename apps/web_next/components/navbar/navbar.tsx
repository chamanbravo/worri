"use client";

import { cn } from "@/lib/utils";
import { WorkspaceDropdown } from "./workspace-dropdown";
import { UserDropdown } from "./user-dropdown";
import Link from "next/link";
import { usePathname } from "next/navigation";

const active = "text-sm font-medium hover:text-foreground";
const inactive = cn(active, "text-muted-foreground");

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="border-b">
      <div className="max-w-[1280px] m-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          <p className="font-medium">logo</p>
          <nav className={"flex items-center space-x-4 mx-6"}>
            <Link
              href={"/app/"}
              className={
                pathname.includes("dashboard" || "app") ? active : inactive
              }
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
          <WorkspaceDropdown />
          <UserDropdown />
        </div>
      </div>
    </div>
  );
}
