import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui";
import { Input } from "@repo/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui";
import { toast } from "@repo/ui";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { client } from "@/lib/utils";

const { POST } = client;

const registerFormSchema = z.object({
  username: z
    .string({ required_error: "This field may not be blank." })
    .min(3, { message: "Username must be at least 3 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  email: z
    .string({ required_error: "This field may not be blank." })
    .email({ message: "Please enter a valid email." }),
  password: z
    .string({ required_error: "This field may not be blank." })
    .min(8, { message: "Password must be at least 8 characters." })
    .max(30, { message: "Password must not be longer than 30 characters." }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  async function onSubmit(formData: RegisterFormValues) {
    try {
      setLoading(true);
      const { response, error } = await POST("/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
      });

      if (response.ok) {
        toast({
          title: "Account Created",
        });
        return navigate("/app/cool-space/dashboard/");
      } else if (response.status === 400) {
        if (error?.detail) {
          return toast({
            title: error?.detail,
          });
        }
        if (error?.username) {
          return toast({
            title: error?.username[0],
          });
        }
        if (error?.email) {
          return toast({
            title: error?.email[0],
          });
        }
      }
    } catch (error) {
      console.log("error:", error);
      return toast({
        title: "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full md:max-w-[350px] flex flex-col gap-8">
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-2xl font-bold text-foreground">Worri</h1>
        <span className="text-xl">Create an account.</span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#222838]"
                    autoComplete="username"
                    placeholder="johnsmith"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#222838]"
                    autoComplete="email"
                    placeholder="user@example.com"
                    {...field}
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
              <FormItem className="space-y-1">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#222838]"
                    autoComplete="new-password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
