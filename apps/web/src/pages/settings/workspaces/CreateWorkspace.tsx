import { client } from "@/lib/utils";
import { Button, toast } from "@ui/index";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/index";
import { Input } from "@ui/index";
import { Label } from "@ui/index";
import { useState } from "react";
import Cookies from "js-cookie";
import useUserStore from "@/store/userStore";

const { POST } = client;

export function CreateWorkspaceDialog() {
  const [name, setName] = useState<string>("");
  const updateWorkspace = useUserStore((state) => state.updateWorkspace);

  const onSubmit = async () => {
    try {
      const { response, error } = await POST("/api/workspaces/create/", {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
        body: {
          name: name,
        },
      });

      if (response.ok) {
        toast({
          title: "Workspace created successfully.",
        });
        updateWorkspace();
      }
      if (!response.ok) {
        toast({
          title: error?.name[0],
        });
      }
    } catch (error) {
      //
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
          <Button type="submit" onClick={onSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
