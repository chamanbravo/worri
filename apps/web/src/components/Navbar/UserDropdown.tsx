import { client } from "@/lib/utils";
import useUserStore from "@/store/userStore";
import { Button, toast } from "@ui/index";
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
import { useNavigate, useParams } from "react-router";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const { POST } = client;

export function UserDropdown() {
  const { workspace } = useParams();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const { response } = await POST(`/api/users/logout/`, {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
      });

      if (response.ok) {
        clearUser();
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Something went wrong!",
      });
    }
  };

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
          <DropdownMenuItem asChild>
            <Link
              to={`/app/${workspace}/profile/`}
              className="flex items-center gap-2"
            >
              <User size={16} /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={logout}
          >
            <LogOut size={16} /> Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
