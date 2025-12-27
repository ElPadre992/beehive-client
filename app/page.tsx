"use client"

import { apiFetch } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data: helloWorld, isLoading, error } = useQuery({
    queryKey: ["/"],
    queryFn: () => apiFetch<string>("/"),
    refetchInterval: 10000,         // refresh every 10s
    refetchOnWindowFocus: true,     // refresh on focus
    staleTime: 5000,
  });

  if (isLoading) return <p>Loading page...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-black">
      <div>
        <p className="font-primary text-sm">{helloWorld} ...</p>
        <h2 className="font-secondary text-xl font-semibold">{helloWorld} ...</h2>
      </div>
    </div >
  );
}
