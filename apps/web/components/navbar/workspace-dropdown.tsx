"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  workspaces: string[];
}

export function WorkspaceDropdown({ workspaces }: Props) {
  const router = useRouter();
  const workspace = "chad";

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
            router.push(`/app/${ws}/dashboard/`);
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
