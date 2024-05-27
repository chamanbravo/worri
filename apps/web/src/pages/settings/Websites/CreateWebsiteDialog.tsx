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
import { useParams } from "react-router";

const { POST } = client;

export function CreateWebsiteDialog({ refetch }: { refetch: () => void }) {
  const { workspace } = useParams();
  const [name, setName] = useState<string>("");
  const [domain, setDomain] = useState<string>("");

  const onSubmit = async () => {
    try {
      if (!workspace) return;
      const { response, error } = await POST("/api/websites/create/", {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
        body: {
          workspace: workspace,
          name: name,
          domain: domain,
        },
      });

      if (response.ok) {
        toast({
          title: "Workspace created successfully.",
        });
        refetch();
      }
      if (!response.ok) {
        toast({
          title: error?.detail,
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Website</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Website</DialogTitle>
          <DialogDescription>Add website to monitor.</DialogDescription>
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
