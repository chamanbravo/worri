import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@ui/index";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/index";
import { Input } from "@ui/index";
import { client } from "@/lib/utils";
import Cookies from "js-cookie";
import { toast } from "@ui/index";
import { useNavigate } from "react-router";
import useUserStore from "@/store/userStore";

const { POST } = client;

const accountFormSchema = z.object({
  currentPassword: z.string().min(2, {
    message: "Current Password is required",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function PasswordSecurity() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const clearUser = useUserStore((state) => state.clearUser);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(formData: AccountFormValues) {
    const { currentPassword, newPassword, confirmPassword } = formData;
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match.",
      });
      return;
    }

    try {
      const { response, error } = await POST("/api/users/change-password/", {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: {
          new_password: newPassword,
          current_password: currentPassword,
        },
      });

      if (response.ok) {
        // after password change, session expires
        // therefore navigate to login page
        toast({
          title: "Password Updated",
        });
        navigate("/");
        clearUser();
      } else if (error) {
        const errorRes = Object.values(error);
        toast({
          title: errorRes[0].toString(),
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Keep your password secure and up to date.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="current-password"
                    type="password"
                    placeholder="Current Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="New Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
