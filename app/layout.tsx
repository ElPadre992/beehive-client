import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ReactQueryProvider from "@/providers/react-query-provider";
import { RealtimeProvider } from "@/providers/realtime-provider";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beehive",
  description: "Under development!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en">
      <body
        className={"font-primary antialiased"}
      >
        <RealtimeProvider>
          <SidebarProvider defaultOpen={defaultOpen}>
            {/* Left sidebar */}
            <AppSidebar />

            {/* Page content */}
            <main className="flex p-6 w-full min-w-5xl bg-zinc-50 text-gray-900">
              <ReactQueryProvider>{children}</ReactQueryProvider>
            </main>
          </SidebarProvider>
        </RealtimeProvider>
      </body>
    </html>
  );
}
