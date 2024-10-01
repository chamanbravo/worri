import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Worri | Web Analytics",
  description: "simple & privacy focused self hosted web analytics",
  openGraph: {
    title: "Worri | Web Analytics",
    description: "simple & privacy focused self hosted web analytics",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
