// src/components/admin/AdminSidebar.tsx
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/components/ui/sidebar";
import { Map, LogOut, Mountain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Trilhas",
    url: "/admin/trilhas",
    icon: Map,
  },
  //   {
  //     title: "Dashboard",
  //     url: "/admin",
  //     icon: Home,
  //   },
  //   {
  //     title: "Usuários",
  //     url: "/admin/usuarios",
  //     icon: Users,
  //   },
  //   {
  //     title: "Configurações",
  //     url: "/admin/configuracoes",
  //     icon: Settings,
  //   },
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-slate-800 p-6">
        <div className="flex items-center gap-3">
          <Mountain className="h-6 w-6 text-green-700" />
          <div>
            <p className="font-bold text-xl text-green-700 tracking-tight">
              Petro Trilhas
            </p>
            <p className="text-xs text-800-500 -mt-1">Admin</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 px-4">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    onClick={() => {
                      if (isMobile) {
                        setOpenMobile(false);
                      }
                    }}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-800 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={"/trilhas"}
                className="w-full flex items-center gap-3 text-slate-400 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
                <span>Voltar para o app</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
