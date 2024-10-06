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
import { useState } from "react";
import useUserStore from "@/store/userStore";
import { useToast } from "@/hooks/use-toast";
import { clientFetch } from "@/lib/api/clientFetch";
import { useRouter } from "next/navigation";

export function CreateWorkspaceDialog() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState<string>("");
  const updateWorkspace = useUserStore((state) => state.updateWorkspace);

  const createWorkspace = async () => {
    try {
      const response = await clientFetch("/api/workspaces", {
        method: "POST",
        body: JSON.stringify({
          name: name,
        }),
      });
      if (response.ok) {
        toast({
          title: "Workspace created successfully.",
        });
        updateWorkspace();
        router.refresh();
      }
      if (!response.ok) {
        const message = await response.json();
        if (message?.detail) {
          toast({
            title: message?.detail,
          });
        }
      }
    } catch (err) {
      toast({
        title: "Something went wrong!",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Workspace</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Enter the name for the Workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              createWorkspace();
            }}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
