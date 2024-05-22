import useUserStore from "@/store/userStore";
import { Button } from "@ui/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/index";
import { CircleUserRound, User, LogOut } from "lucide-react";

export function UserDropdown() {
  const user = useUserStore((state) => state.user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="px-0 w-9">
          <CircleUserRound size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center gap-2">
            <User size={16} /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center gap-2">
            <LogOut size={16} /> Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
