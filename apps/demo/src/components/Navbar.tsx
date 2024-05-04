import { Button } from "@ui/index";
import { cn } from "@ui/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { CircleUserRound } from "lucide-react";

const active = "text-sm font-medium hover:text-primary";
const inactive = cn(active, "text-muted-foreground");

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <div className="border-b">
      <div className="max-w-[1280px] m-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-8">
          <p className="font-medium">logo</p>
          <nav className={"flex items-center space-x-4 mx-6"}>
            <Link to="/" className={pathname === "/" ? active : inactive}>
              Dashboard
            </Link>
            <Link
              to="#"
              className={pathname === "/websites/" ? active : inactive}
            >
              Websites
            </Link>
            <Link
              to="#"
              className={pathname === "/settings/" ? active : inactive}
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="flex items-center ml-auto">
          <Button variant="ghost" className="px-0 w-9">
            <CircleUserRound size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
