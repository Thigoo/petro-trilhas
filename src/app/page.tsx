"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-500 to-blue-500">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-trilhas.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Descubra as trilhas
            <br />
            de <span className="text-green-400">Petrópolis</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Mapas seguros, alertas de risco e check-ins. O app que transforma
            sua experiência nas trilhas da Serra Imperial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trilhas">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-7 text-lg cursor-pointer"
              >
                Explorar Trilhas
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-green-600 hover:bg-gray-300 hover:text-green-600 px-10 py-7 text-lg cursor-pointer"
              >
                Entrar na minha conta
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
          ↓ Role para conhecer
        </div>
      </section>

      {/* Benefícios / Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">
            Por que usar o Petro Trilhas?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                🗺️
              </div>
              <h3 className="text-2xl font-semibold mb-3">Mapas Seguros</h3>
              <p className="text-slate-600">
                Trilhas mapeadas com alertas de risco climático e deslizamento
                em tempo real.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                🏆
              </div>
              <h3 className="text-2xl font-semibold mb-3">
                Check-ins e Certificados
              </h3>
              <p className="text-slate-600">
                Registre suas conquistas e ganhe certificados.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">
                🌱
              </div>
              <h3 className="text-2xl font-semibold mb-3">Impacto Real</h3>
              <p className="text-slate-600">
                Colete lixo, ganhe pontos e ajude a preservar as trilhas da
                nossa serra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chamada para ação final */}
      <section className="py-20 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para viver a serra com mais segurança e prazer?
          </h2>
          <p className="text-xl mb-10 text-green-100">
            Junte-se aos trilheiros que já estão descobrindo Petrópolis de forma
            inteligente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/trilhas">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-gray-100 px-12 py-7 text-lg font-semibold cursor-pointer"
              >
                Ver todas as trilhas
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button
                size="lg"
                variant="outline"
                className=" text-white hover:bg-white  bg-gray-600 hover:text-green-700 px-12 py-7 text-lg font-semibold cursor-pointer"
              >
                Criar minha conta grátis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer simples */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>
            Petro Trilhas © 2026 • Apoio à Lei Municipal das Trilhas nº
            9.214/2026
          </p>
          <p className="text-sm mt-2">
            Feito com ❤️ para quem ama a serra imperial
          </p>
        </div>
      </footer>
    </div>
  );
}
