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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { clientFetch } from "@/lib/api/clientFetch";
import { components } from "@/lib/api/types";
import useUserStore from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  defaultValues?: components["schemas"]["WebsiteOut"];
}

export function WebsiteDialog({ defaultValues }: Props) {
  const { workspace } = useParams();
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const [domain, setDomain] = useState<string>("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const onSubmit = async () => {
    if (!workspace) return;
    const response = await clientFetch(
      defaultValues ? `/api/websites/${defaultValues?.id}` : "/api/websites",
      {
        method: defaultValues ? "PATCH" : "POST",
        body: JSON.stringify({
          workspace: workspace,
          name: name,
          domain: domain,
        }),
      }
    );

    if (response.ok) {
      toast({
        title: defaultValues
          ? "Workspace updated successfully."
          : "Workspace created successfully.",
      });
      setOpen(false);
      router.refresh();
    }
  };

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name);
      setDomain(defaultValues.domain);
    }
  }, [defaultValues]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {!defaultValues ? (
          <Button disabled={user.role !== "ADMIN"}>Add Website</Button>
        ) : (
          <Button variant="outline" disabled={user.role !== "ADMIN"}>
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Website</DialogTitle>
          <DialogDescription>Enter the details below.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full"
            />
          </div>
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
