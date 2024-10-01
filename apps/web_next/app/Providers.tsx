"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

export default Providers;
