import { cn } from "@ui/index";
import { buttonVariants } from "@ui/index";
import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export default function SidebarNav({ className, ...props }: SidebarNavProps) {
  const { pathname } = useLocation();
  const { workspace } = useParams();

  const sidebarNavItems = useMemo(() => {
    return [
      {
        title: "Workspaces",
        href: `/app/${workspace}/settings/workspaces/`,
      },
      {
        title: "Websites",
        href: `/app/${workspace}/settings/websites/`,
      },
      {
        title: "Members",
        href: `/app/${workspace}/settings/members/`,
      },
    ];
  }, [workspace]);

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {sidebarNavItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname.includes(item.href)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
