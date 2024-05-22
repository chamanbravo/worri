import useUserStore from "@/store/userStore";
import { Button } from "@ui/index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/index";
import { useNavigate, useParams } from "react-router";
import { Briefcase, ChevronDown } from "lucide-react";

export function WorkspaceDropdown() {
  const workspaces = useUserStore((state) => state.user.workspace);
  const { workspace } = useParams();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Briefcase size={16} />
          {workspace}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={workspace}
          onValueChange={(ws) => {
            navigate(`/app/${ws}/dashboard/`);
          }}
        >
          {workspaces.map((ws, i) => {
            return (
              <DropdownMenuRadioItem key={i} value={ws}>
                {ws}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
