import { useNavigate } from "react-router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui";
import { Input } from "@repo/ui";
import { toast } from "@repo/ui";
import Cookies from "js-cookie";
import useUserStore from "@/store/userStore";
import { client } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

const { POST } = client;

const loginFormSchema = z.object({
  username: z
    .string({ required_error: "This field may not be blank." })
    .min(1, { message: "This field may not be blank." }),
  password: z
    .string({ required_error: "This field may not be blank." })
    .min(1, { message: "This field may not be blank." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: LoginFormValues) => {
      const { response, data, error } = await POST("/api/users/login/", {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: {
          username: formData.username,
          password: formData.password,
        },
      });

      if (response.ok && data) {
        setUser(
          data.username,
          data.first_name || "",
          data.last_name || "",
          data.role,
          data.workspace
        );
        navigate(`app/${data.workspace[0]}/dashboard/`);
      } else if (response.status === 400 && error) {
        return toast({
          title: error?.detail,
        });
      }
    },
    onError: () => {
      toast({
        title: "Something went wrong",
      });
    },
  });

  async function onSubmit(formData: LoginFormValues) {
    mutate(formData);
  }

  return (
    <div className="w-full md:max-w-[350px] flex flex-col gap-8">
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-2xl font-bold text-foreground">Worri</h1>
        <span className="text-xl">Welcome back</span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground">
                  Username
                </FormLabel>
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
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-muted-foreground">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-[#222838]"
                    autoComplete="current-password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Loading..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
