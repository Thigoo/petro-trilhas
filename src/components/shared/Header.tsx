"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useProfile } from "@/src/hooks/useProfile";
import { useAuth } from "@/src/providers/AuthProvider";
import { AppLogo } from "./AppLogo";

export default function Header() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAdmin } = useProfile();

  const GUIDE_URL =
    "https://www.petropolis.rj.gov.br/turispetro/downloads/Guias_Ecoturismo.pdf";

  const navigation = useMemo(() => {
    const base = [
      { name: "Início", href: "/" },
      { name: "Trilhas", href: "/trilhas" },
      { name: "Perfil", href: "/perfil" },
      { name: "Eventos", href: "/eventos" },
      { name: "Emergência", href: "/emergencia" },
    ];
    return isAdmin
      ? [...base, { name: "Admin", href: "/trilhas-admin" }]
      : base;
  }, [isAdmin]);

  const getDesktopNavClasses = (href: string) =>
    `text-sm font-semibold transition-colors hover:text-medium-green ${
      pathname === href
        ? "text-medium-green border-b-2 border-medium-green"
        : "text-muted-foreground"
    }`;

  const getMobileNavClasses = (href: string) =>
    `rounded-md px-3 py-2 text-base font-medium transition-colors ${
      pathname === href
        ? "bg-accent text-medium-green"
        : "text-muted-foreground hover:bg-accent"
    }`;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    // z-[1000] garante que fique acima dos controles do Leaflet (que usam z-index 400-1000)
    <header className="sticky top-0 z-1001 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <AppLogo size="sm" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={getDesktopNavClasses(link.href)}
            >
              {link.name}
            </Link>
          ))}

          <a
            href={GUIDE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-medium-green"
          >
            Encontre seu guia
          </a>

          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-destructive"
            >
              Sair
            </Button>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-medium-green hover:bg-dark-green">
                Entrar
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Expansível) */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-card animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-1 p-4">
            {navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className={getMobileNavClasses(link.href)}
              >
                {link.name}
              </Link>
            ))}

            <a
              href={GUIDE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-medium-green"
            >
              Encontre seu guia
            </a>

            {!user && (
              <Link href="/login" onClick={toggleMenu}>
                <Button className="mt-2 w-full bg-medium-green hover:bg-dark-green">
                  Entrar
                </Button>
              </Link>
            )}

            {user && (
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="mt-2 w-full"
              >
                Sair
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
