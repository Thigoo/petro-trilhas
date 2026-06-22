"use client";

import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import AdminRoute from "@/src/components/auth/AdminRoute";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminRoute>
      <SidebarProvider>
        <AdminSidebar />

        <main className="flex flex-1 flex-col gap-4 p-4">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </AdminRoute>
  );
}
