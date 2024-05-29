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

export function JoinWorkspaceDialog() {
  const [accessCode, setAccessCode] = useState<string>("");
  const updateWorkspace = useUserStore((state) => state.updateWorkspace);

  const onSubmit = async () => {
    try {
      const { response } = await POST("/api/workspaces/join/", {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
        body: {
          access_code: accessCode,
        },
      });

      if (response.ok) {
        toast({
          title: "Workspace joined successfully.",
        });
        updateWorkspace();
      }
      if (!response.ok) {
        toast({
          title: "Invalid access code.",
        });
      }
    } catch (error) {
      //
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Join Workspace</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Workspace</DialogTitle>
          <DialogDescription>Enter the access code.</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex flex-col w-full gap-2">
            <Label htmlFor="access_code">Access Code</Label>
            <Input
              id="access_code"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
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
