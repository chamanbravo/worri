import { buttonVariants, cn } from "@ui/index";
import { Separator } from "@ui/index";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: SettingsLayoutProps) {
  const { pathname } = useLocation();
  const { workspace } = useParams();

  const sidebarNavItems = useMemo(() => {
    return [
      {
        title: "Profile",
        href: `/app/${workspace}/profile/`,
      },
      {
        title: "Password & Security",
        href: `/app/${workspace}/profile/password-security/`,
      },
    ];
  }, []);

  return (
    <>
      <div className="p-10 px-4 pb-16 space-y-6 md:block max-w-[1280px] mx-auto">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <nav
              className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1"
              )}
            >
              {sidebarNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    pathname === item.href
                      ? "bg-muted hover:bg-muted"
                      : "hover:bg-transparent hover:underline",
                    "justify-start"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="flex-1 lg:max-w-3xl">{children}</div>
        </div>
      </div>
    </>
  );
}
