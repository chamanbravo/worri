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

export function CreateWorkspaceDialog() {
  const [name, setName] = useState<string>("");
  const updateWorkspace = useUserStore((state) => state.updateWorkspace);

  //     async () => {
  //       const { response, error } = await POST("/api/workspaces/create/", {
  //         headers: {
  //           "Content-Type": "application/json",
  //           "x-csrftoken": Cookies.get("csrftoken") || "",
  //         },
  //         body: {
  //           name: name,
  //         },
  //       });

  //       if (response.ok) {
  //         toast({
  //           title: "Workspace created successfully.",
  //         });
  //         refetch();
  //         updateWorkspace();
  //       }
  //       if (!response.ok && error) {
  //         if ("detail" in error) {
  //           toast({
  //             title: error.detail,
  //           });
  //         } else if ("name" in error) {
  //           toast({
  //             title: error["name"][0],
  //           });
  //         } else {
  //           toast({
  //             title: "Something went wrong!",
  //           });
  //         }
  //       }
  //     }

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
          <Button type="submit" onClick={() => {}}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
