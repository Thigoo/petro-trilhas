"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mountain, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/src/lib/auth/AuthProvider";

export default function Header() {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Trilhas", href: "/trilhas" },
    { name: "Perfil", href: "/perfil" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    // z-[1000] garante que fique acima dos controles do Leaflet (que usam z-index 400-1000)
    <header className="sticky top-0 z-1001 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <Mountain className="h-6 w-6 text-green-700" />
          <span className="text-xl font-bold text-green-900 tracking-tight">
            Petro<span className="text-green-600">Trilhas</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-green-700 ${
                pathname === link.href
                  ? "text-green-700 border-b-2 border-green-700"
                  : "text-slate-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-red-600"
            >
              Sair
            </Button>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-green-700 hover:bg-green-800">
                Login
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
        <div className="md:hidden border-t bg-white animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={toggleMenu}
                className="text-base font-medium text-slate-700 border-b pb-2 last:border-0"
              >
                {link.name}
              </Link>
            ))}
            {!user && (
              <Link href="/login" onClick={toggleMenu}>
                <Button className="w-full bg-green-700">
                  Login / Cadastro
                </Button>
              </Link>
            )}
            {user && (
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="w-full border-red-200 text-red-600"
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
