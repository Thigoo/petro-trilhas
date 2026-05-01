"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { AdminSidebar } from "@/src/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />

        <main className="flex flex-1 flex-col gap-4 p-4">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </>
  );
}
