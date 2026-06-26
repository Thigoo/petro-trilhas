"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, ShieldCheck, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useAuth } from "@/src/providers/AuthProvider";
import { useProfile } from "@/src/hooks/useProfile";
import { AppLogo } from "./AppLogo";
import { Button } from "../ui/button";

const GUIDE_URL =
  "https://www.petropolis.rj.gov.br/turispetro/downloads/Guias_Ecoturismo.pdf";

export default function Header() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useProfile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const mainNav = useMemo(
    () => [
      { name: "Início", href: "/" },
      { name: "Trilhas", href: "/trilhas" },
      { name: "Eventos", href: "/eventos" },
    ],
    [],
  );

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
    <header className="sticky top-0 z-1001 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setIsMenuOpen(false)}
        >
          <AppLogo size="sm" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {mainNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={getDesktopNavClasses(link.href)}
            >
              {link.name}
            </Link>
          ))}

          <div className="h-5 w-px bg-border" />

          <Link
            href="/emergencia"
            className="flex items-center gap-1.5 text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
          >
            <Phone className="h-3.5 w-3.5" />
            Emergência
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Conta
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-1100">
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />
                    Meu perfil
                  </Link>
                </DropdownMenuItem>

                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/trilhas-admin" className="cursor-pointer">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Administração
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <a
                    href={GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    Encontre seu guia
                  </a>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <a
                href={GUIDE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-medium-green"
              >
                Encontre seu guia
              </a>
              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-medium-green hover:bg-dark-green"
                >
                  Entrar
                </Button>
              </Link>
            </>
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-card animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-1 p-4">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className={getMobileNavClasses(link.href)}
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <Link
                href="/perfil"
                onClick={toggleMenu}
                className={getMobileNavClasses("/perfil")}
              >
                Meu perfil
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/trilhas-admin"
                onClick={toggleMenu}
                className={getMobileNavClasses("/trilhas-admin")}
              >
                Administração
              </Link>
            )}

            <div className="my-2 border-t" />

            <Link
              href="/emergencia"
              onClick={toggleMenu}
              className="rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Emergência
            </Link>

            <a
              href={GUIDE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={toggleMenu}
              className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-medium-green"
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
                onClick={() => {
                  signOut();
                  toggleMenu();
                }}
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
