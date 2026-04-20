"use client";

import Header from "@/src/components/shared/Header";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActiveTrailPage =
    pathname?.includes("/trilhas/") && pathname?.includes("/active");
  return (
    <div className="relative flex min-h-screen flex-col">
      {!isActiveTrailPage && <Header />}

      <main className="flex-1">{children}</main>
    </div>
  );
}
