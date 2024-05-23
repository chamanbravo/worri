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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { client } from "@/lib/utils";
import Cookies from "js-cookie";

const { GET, PATCH } = client;

const websiteFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters",
    })
    .max(30, {
      message: "Name must be less than 30 characters",
    }),
  domain: z
    .string()
    .min(5, {
      message: "Access code must be at least 5 characters",
    })
    .max(30, {
      message: "Access code must be less than 30 characters",
    }),
});

type WebsiteFormValues = z.infer<typeof websiteFormSchema>;

export default function WebsiteEditForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<WebsiteFormValues>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      name: "",
      domain: "",
    },
  });

  const onSubmit = async (formData: WebsiteFormValues) => {
    try {
      if (!id) return;
      setLoading(true);
      const { response } = await PATCH("/api/websites/{id}/", {
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": Cookies.get("csrftoken") || "",
        },
        params: {
          path: {
            id: +id,
          },
        },
        body: {
          name: formData.name,
          domain: formData.domain,
        },
      });
      if (response.ok) {
        toast({ title: "Website updated successfully." });
      }
      setLoading(false);
    } catch {
      //
    }
  };

  const fetchWebsiteInfo = async (signal: AbortSignal) => {
    try {
      if (!id) return;
      const { response, data } = await GET("/api/websites/{id}/", {
        signal,
        params: {
          path: {
            id: +id,
          },
        },
      });

      if (response.ok && data) {
        form.setValue("name", data?.name);
        form.setValue("domain", data?.domain);
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
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Code</FormLabel>
              <div className="inline-flex w-full gap-2">
                <FormControl>
                  <Input
                    autoComplete="family-name"
                    placeholder="example.com"
                    {...field}
                  />
                </FormControl>
              </div>
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
