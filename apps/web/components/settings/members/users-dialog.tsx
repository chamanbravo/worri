"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { clientFetch } from "@/lib/api/clientFetch";
import { components } from "@/lib/api/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import useUserStore from "@/store/userStore";

interface Props {
  defaultValues?: components["schemas"]["UserOut"];
}

type RoleEnum = components["schemas"]["RoleEnum"];

export function UserDialog({ defaultValues }: Props) {
  const { workspace } = useParams();
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<RoleEnum>("VIEWER");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const onSubmit = async () => {
    if (!workspace) return;
    const response = await clientFetch(
      defaultValues ? `/api/users/${defaultValues?.username}` : "/api/users",
      {
        method: defaultValues ? "PATCH" : "POST",
        body: JSON.stringify({
          username: name,
          password: password,
          role: role,
        }),
      }
    );

    if (response.ok) {
      toast({
        title: defaultValues
          ? "Member updated successfully."
          : "Member created successfully.",
      });
      setOpen(false);
      router.refresh();
    } else {
      toast({
        title: "Please fill the form with valid details.",
      });
    }
  };

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.username);
      setRole(defaultValues.role as RoleEnum);
    }
  }, [defaultValues]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {!defaultValues ? (
          <Button disabled={user.role !== "ADMIN"}>Add User</Button>
        ) : (
          <Button variant="outline" disabled={user.role !== "ADMIN"}>
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Member details</DialogTitle>
          <DialogDescription>Enter the details below.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              disabled={!!defaultValues}
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
          <Select onValueChange={(v) => setRole(v as RoleEnum)} value={role}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Role</SelectLabel>
                <Separator className="my-1" />
                <SelectItem value="VIEWER">VIEWER</SelectItem>
                {/* <SelectItem value="EDITOR">EDITOR</SelectItem> */}
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
