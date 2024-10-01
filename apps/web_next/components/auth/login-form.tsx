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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(formData: LoginFormValues) {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setLoading(false);
        router.push("/app");
      } else if (response.status === 400) {
        const data = await response.json();
        return toast({
          title: data?.detail,
        });
      }
    } catch (error) {
      toast({ title: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full md:w-[400px] bg-transparent border-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Welcome Back!</CardTitle>
        <CardDescription>Login to your account</CardDescription>
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
                      autoComplete="current-password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
