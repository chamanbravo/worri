import { client } from "@/lib/utils";
import { Button, Separator, toast } from "@ui/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/index";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@ui/index";
import { Input } from "@ui/index";
import { Label } from "@ui/index";
import { useState } from "react";
import Cookies from "js-cookie";
import { useParams } from "react-router";
import { components } from "@/lib/api/v1";
import { useMutation } from "@tanstack/react-query";

const { POST } = client;

type TypeRole = components["schemas"]["RoleEnum"];

export function CreateMemberDialog({ refetch }: { refetch: () => void }) {
  const { workspace } = useParams();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<TypeRole>("VIEWER");

  const { mutate } = useMutation({
    mutationFn: async (workspace: string) => {
      const { response, error } = await POST("/api/users/create/", {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
        body: {
          username: name,
          password: password,
          role: role,
          workspace: workspace,
        },
      });

      if (response.ok) {
        toast({
          title: "Member created successfully.",
        });
        refetch();
      }
      if (!response.ok) {
        if (error?.username) {
          toast({
            title: error?.username[0],
          });
        }
        if (error?.detail) {
          toast({
            title: error?.detail,
          });
        }
      }
    },
  });

  const onSubmit = async () => {
    if (!workspace) return;
    mutate(workspace);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Member</DialogTitle>
          <DialogDescription>
            The created user will be member of this workspace by default.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
          </div>
          <Select onValueChange={(v) => setRole(v as TypeRole)} value={role}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Role</SelectLabel>
                <Separator className="my-1" />
                <SelectItem value="VIEWER">VIEWER</SelectItem>
                <SelectItem value="EDITOR">EDITOR</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
