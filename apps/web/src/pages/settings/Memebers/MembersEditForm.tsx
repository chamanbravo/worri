import { toast } from "@ui/index";
import { useParams } from "react-router";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/index";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { client } from "@/lib/utils";
import Cookies from "js-cookie";

const { GET, PATCH } = client;

const websiteFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters",
    })
    .max(30, {
      message: "Name must be less than 30 characters",
    }),
  password: z.string().max(30, {
    message: "Password must be less than 30 characters",
  }),
  role: z.enum(["ADMIN", "VIEWER", "EDITOR"]),
});

type WebsiteFormValues = z.infer<typeof websiteFormSchema>;

export default function MembersEditForm() {
  const { username } = useParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<WebsiteFormValues>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (formData: WebsiteFormValues) => {
    try {
      if (!username) return;
      setLoading(true);
      const { response } = await PATCH("/api/users/{username}/", {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
        params: {
          path: {
            username: username,
          },
        },
        body: {
          role: formData.role,
        },
      });
      if (response.ok) {
        toast({ title: "Member updated successfully." });
      }
      setLoading(false);
    } catch {
      //
    }
  };

  const fetchWebsiteInfo = async (signal: AbortSignal) => {
    try {
      if (!username) return;
      const { response, data } = await GET("/api/users/{username}/", {
        signal,
        params: {
          path: {
            username: username,
          },
        },
      });

      if (response.ok && data) {
        form.setValue("username", data?.username);
        form.setValue("role", data?.role);
      }
    } catch {
      //
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchWebsiteInfo(signal);
    return () => controller.abort();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  autoComplete="given-name"
                  placeholder="Username"
                  {...field}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input autoComplete="given-name" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={field.value} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}