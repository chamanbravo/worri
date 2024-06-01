import { toast } from "@ui/index";
import { useNavigate, useParams } from "react-router";
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
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { useMemberInfo } from "@/hooks/queries/useMemberInfo";

const { PATCH, DELETE } = client;

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
  const navigate = useNavigate();
  const { workspace } = useParams();
  const { data } = useMemberInfo(username);

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
      const { response } = await PATCH("/api/users/update/", {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
        params: {
          query: {
            username: username,
          },
        },
        body: {
          role: formData.role,
          password: formData.password,
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

  const deleteMember = async () => {
    try {
      if (!username) return;
      const { response, data } = await DELETE("/api/users/{username}/", {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
        params: {
          path: {
            username: username,
          },
        },
      });

      if (response.ok && data) {
        navigate(`/app/${workspace}/settings/members/`);
      }
    } catch {
      //
    }
  };

  useEffect(() => {
    if (data) {
      form.reset({
        username: data.username,
        password: "",
        role: data.role,
      });
    }
  }, [data]);

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
                <Input
                  type="password"
                  autoComplete="given-name"
                  placeholder=""
                  {...field}
                />
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
        <div className="inline-flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
          <DeleteConfirmation onDelete={deleteMember} buttonTitle="Delete" />
        </div>
      </form>
    </Form>
  );
}
