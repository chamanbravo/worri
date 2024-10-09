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
import { useRouter } from "next/navigation";
import { useState } from "react";

export function JoinWorkspaceDialog() {
  const router = useRouter();
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState<string>("");

  const onSubmit = async () => {
    const response = await clientFetch("/api/workspaces/join", {
      method: "POST",
      body: JSON.stringify({
        access_code: accessCode,
      }),
    });

    if (response.ok) {
      toast({
        title: "Workspace joined successfully.",
      });
      router.refresh();
    }
    if (!response.ok) {
      toast({
        title: "Invalid access code.",
      });
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
