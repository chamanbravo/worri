import { Button } from "@ui/index";
import { Input } from "@ui/index";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/index";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { client, generateRandomString } from "@/lib/utils";
import Cookies from "js-cookie";
import { Copy } from "lucide-react";
import { toast } from "@ui/index";
import { useNavigate, useParams } from "react-router";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";

const { GET, PATCH, DELETE } = client;

const workspaceFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters",
    })
    .max(30, {
      message: "Name must be less than 30 characters",
    }),
  accessCode: z
    .string()
    .min(5, {
      message: "Access code must be at least 5 characters",
    })
    .max(30, {
      message: "Access code must be less than 30 characters",
    }),
});

type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>;

interface Props {
  refetch: () => void;
}

export default function WorkspaceEditForm({ refetch }: Props) {
  const { editWorkspaceName, workspace } = useParams();
  const [loading, setLoading] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(false);
  const navigate = useNavigate();

  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: {
      name: "",
      accessCode: "",
    },
  });

  const onSubmit = async (formData: WorkspaceFormValues) => {
    try {
      if (!editWorkspaceName) return;
      setLoading(true);
      const { response } = await PATCH("/api/workspaces/{name}/", {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
        params: {
          path: {
            name: editWorkspaceName,
          },
        },
        body: {
          name: formData.name,
          access_code: formData.accessCode,
        },
      });
      if (response.ok) {
        toast({ title: "Workspace updated successfully." });
        navigate(
          `/app/${currentWorkspace ? formData.name : workspace}/settings/workspaces/${formData.name}/`
        );
        refetch();
      }
      setLoading(false);
    } catch {
      //
    }
  };

  const fetchWorkspaceInfo = async (signal: AbortSignal) => {
    try {
      if (!editWorkspaceName) return;
      const { response, data } = await GET("/api/workspaces/{name}/", {
        signal,
        params: {
          path: {
            name: editWorkspaceName,
          },
        },
      });

      if (response.ok && data) {
        form.setValue("name", data?.name);
        form.setValue("accessCode", data?.access_code);
      }
    } catch {
      //
    }
  };

  const deleteWorkspace = async () => {
    try {
      if (!editWorkspaceName) return;
      const { response } = await DELETE("/api/workspaces/{name}/", {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
        params: {
          path: {
            name: editWorkspaceName,
          },
        },
      });
      if (response.ok) {
        if (currentWorkspace) {
          return navigate(`/`);
        }
        navigate(`/app/${workspace}/settings/workspaces/`);
        refetch();
      }
    } catch {
      //
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchWorkspaceInfo(signal);
    if (workspace === editWorkspaceName) {
      setCurrentWorkspace(true);
    }
    return () => controller.abort();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="given-name"
                  placeholder="Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accessCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Code</FormLabel>
              <div className="inline-flex w-full gap-2">
                <FormControl>
                  <Input
                    autoComplete="family-name"
                    placeholder=""
                    {...field}
                    disabled={true}
                  />
                </FormControl>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(form.getValues("accessCode"));
                    toast({
                      title: "Access code copied",
                    });
                  }}
                >
                  <Copy size={18} />
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => {
                    const code = generateRandomString(10);
                    form.setValue("accessCode", code);
                  }}
                >
                  Generate
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="inline-flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
          <DeleteConfirmation onDelete={deleteWorkspace} buttonTitle="Delete" />
        </div>
      </form>
    </Form>
  );
}
