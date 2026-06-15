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
import { Label } from "@/src/components/ui/label";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/src/providers/AuthProvider";
import { AppLogo } from "@/src/components/shared/AppLogo";
import { GoogleButton } from "@/src/components/shared/GoogleButton";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signUpError } = await signUp(email, password, fullName);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      alert("Conta criada com sucesso!");
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-3 mb-4">
            <AppLogo size="md" />
          </div>
        </div>

        <Card className="shadow-xl border-0 text-muted-foreground">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold">
              Criar minha conta
            </CardTitle>
            <CardDescription>
              Comece sua jornada pelas trilhas de Petrópolis
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-lg">
                  Nome completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  className="text-lg py-5 font-medium placeholder:text-zinc-400"
                  placeholder="Ex: João Silva"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-lg">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="text-lg py-5 font-medium placeholder:text-zinc-400"
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
                  className="text-lg py-5 font-medium placeholder:text-zinc-400"
                  placeholder="Mínimo de 6 caracteres"
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
                    Criando conta...
                  </>
                ) : (
                  "Criar conta grátis"
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
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:underline font-medium"
              >
                Entrar agora
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
