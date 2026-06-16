"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Loader2 } from "lucide-react";
import { Label } from "@/src/components/ui/label";
import { useAuth } from "@/src/providers/AuthProvider";
import { AppLogo } from "@/src/components/shared/AppLogo";
import { GoogleButton } from "@/src/components/shared/GoogleButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirect") || "/trilhas";
      router.push(redirectTo);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <AppLogo size="md" />
          </div>
        </div>

        <Card className="shadow-xl border-0 text-muted-foreground">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">
              Bem-vindo(a)
            </CardTitle>
            <CardDescription>
              Entre para explorar as trilhas da Serra Imperial
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="text-lg py-5 placeholder:text-zinc-400"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-lg">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="text-lg py-5 placeholder:text-zinc-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-medium-green hover:bg-dark-green text-lg py-6"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">
                  ou continue com
                </span>
              </div>
            </div>

            <GoogleButton />
          </CardContent>

          <CardFooter className="flex flex-col gap-4 text-center">
            <p className="text-sm text-slate-600">
              Não tem uma conta?{" "}
              <Link
                href="/cadastro"
                className="text-green-600 hover:underline font-medium"
              >
                Criar conta grátis
              </Link>
            </p>

            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              ← Voltar para a página inicial
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
