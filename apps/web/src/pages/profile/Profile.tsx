import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, toast } from "@ui/index";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/index";
import { Input } from "@ui/index";
import useUserStore from "@/store/userStore";
import { client } from "@/lib/utils";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";

const { POST } = client;

const accountFormSchema = z.object({
  firstname: z
    .string()
    .min(2, {
      message: "Required",
    })
    .max(30, {
      message: "Must be less than 30 characters.",
    }),
  lastname: z
    .string()
    .min(2, {
      message: "Required",
    })
    .max(30, {
      message: "Must be less than 30 characters.",
    }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstname: user.firstname,
      lastname: user.lastname,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: AccountFormValues) => {
      const { response, error } = await POST("/api/users/update-profile/", {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: {
          first_name: formData.firstname,
          last_name: formData.lastname,
        },
      });

      if (response.ok) {
        setUser(
          user.username,
          formData.firstname,
          formData.lastname,
          user.role,
          user.workspace
        );
        toast({
          title: "Profile updated successfully.",
        });
      } else if (error) {
        const errorRes = Object.values(error);
        toast({
          title: errorRes[0].toString(),
        });
      }
    },
  });

  const onSubmit = async (formData: AccountFormValues) => {
    mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="given-name"
                    placeholder="First Name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in
                  emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="family-name"
                    placeholder="Last Name"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile and in
                  emails.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Loading..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
