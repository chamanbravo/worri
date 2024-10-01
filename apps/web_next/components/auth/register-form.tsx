"use client";

import { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const registerFormSchema = z.object({
  username: z
    .string({ required_error: "This field may not be blank." })
    .min(3, { message: "Username must be at least 3 characters." })
    .max(30, { message: "Username must not be longer than 30 characters." }),
  password: z
    .string({ required_error: "This field may not be blank." })
    .min(8, { message: "Password must be at least 8 characters." })
    .max(30, { message: "Password must not be longer than 30 characters." }),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(formData: RegisterFormValues) {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        toast({
          title: "Account Created",
        });
        router.push("/app");
      } else if (response.status === 400) {
        const data = await response.json();
        if (data?.detail) {
          return toast({
            title: data?.detail,
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
    <Card className="w-full md:w-[400px] bg-transparent border-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your credentials below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
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
      </CardContent>
    </Card>
  );
}
