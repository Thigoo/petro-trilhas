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
import { Loader2, Mountain } from "lucide-react";
import { useAuth } from "@/src/lib/auth/AuthProvider";

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
      alert("Conta criada com sucesso! Verifique seu e-mail.");
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
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <Mountain className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-700">Petro Trilhas</h1>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl">Criar minha conta</CardTitle>
            <CardDescription>
              Comece sua jornada pelas trilhas de Petrópolis
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Ex: João Silva"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
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
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
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

            {/* Separador para futuro Login com Google */}
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

            <Button
              variant="outline"
              className="w-full py-6 text-base"
              disabled={loading}
              // onClick={handleGoogleSignUp} ← vamos adicionar depois
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.92c-.25 1.22-.98 2.26-2.07 2.96v2.6h3.35c1.96-1.81 3.1-4.46 3.1-7.82z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.35-2.6c-.93.63-2.12 1-3.93 1-3.03 0-5.64-2.05-6.56-4.81H2.18v3.02C4.01 20.65 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.37-1.1-.58-2.27-.58-3.5s.21-2.4.58-3.5H2.18C1.43 8.5 1 10.22 1 12s.43 3.5 1.18 4.91l2.66-2.82z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4.01 3.35 2.18 7.09l2.66 2.82C6.36 7.43 8.97 5.38 12 5.38z"
                />
              </svg>
              Continuar com Google
            </Button>
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
