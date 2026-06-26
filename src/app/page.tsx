"use client";

import Link from "next/link";
import { Mountain, MapPin, Cloud, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-500 to-blue-500">
      {/* Hero Section — sem alterações */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-trilhas.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-16">
          <div className="flex items-center justify-center gap-3 mb-12 md:mb-16">
            <Mountain className="h-12 w-12 md:h-14 md:w-14 text-green-400" />
            <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Petro<span className="text-green-400">Trilhas</span>
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Descubra as trilhas
            <br />
            de <span className="text-green-400">Petrópolis</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            A natureza de Petrópolis na palma da sua mão.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/trilhas">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-7 text-lg w-full sm:w-auto"
              >
                Explorar Trilhas
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce hidden md:block">
          ↓ Role para conhecer
        </div>
      </section>

      {/* Bloco: Vitrine de trilhas — ponte entre o hero e os detalhes técnicos */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-green-600 tracking-wide uppercase">
              Onde a aventura começa
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
              Conheça a serra de Petrópolis
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              De caminhadas leves em família a trilhas que desafiam quem já tem
              experiência. A serra tem espaço pra todo mundo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Trilha do Castelinho */}
            <Link
              href="/trilhas/trilha-do-castelinho"
              className="group relative h-80 rounded-3xl overflow-hidden block"
            >
              <div className="absolute inset-0 bg-[url('/castelo-lp.jpg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="inline-block text-xs font-semibold bg-amber-500/90 rounded-full px-3 py-1 mb-3">
                  Moderada
                </span>
                <h3 className="text-2xl font-bold leading-tight">
                  Trilha do Castelinho
                </h3>
              </div>
            </Link>

            {/* Vale da Lua */}
            <Link
              href="/trilhas/vale-da-lua"
              className="group relative h-80 rounded-3xl overflow-hidden block"
            >
              <div className="absolute inset-0 bg-[url('/vale-da-lua-lp.jpeg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <span className="inline-block text-xs font-semibold bg-emerald-500/90 rounded-full px-3 py-1 mb-3">
                  Leve
                </span>
                <h3 className="text-2xl font-bold leading-tight">
                  Vale da Lua
                </h3>
              </div>
            </Link>

            {/* Terceira trilha — placeholder até você ter uma terceira imagem */}
            <Link
              href="/trilhas"
              className="group relative h-80 rounded-3xl overflow-hidden flex bg-slate-900 items-center justify-center"
            >
              <div className="text-center text-white px-6">
                <p className="text-lg font-semibold mb-2">E muitas outras</p>
                <p className="text-sm text-slate-300 mb-4">
                  Veja o catálogo completo de trilhas
                </p>
                <span className="inline-flex items-center gap-2 text-green-400 font-semibold group-hover:gap-3 transition-all">
                  Ver todas <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Bloco: Mapas + Clima, lado a lado, assimétrico */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            {/* Texto — 7 colunas */}
            <div className="md:col-span-7">
              <span className="text-sm font-semibold text-green-600 tracking-wide uppercase">
                Antes de sair de casa
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 leading-tight">
                Saiba exatamente
                <br />
                onde você vai pisar
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-md">
                Cada trilha de Petrópolis mapeada com distância, desnível e
                dificuldade reais, e o clima do momento exato em que você for.
              </p>
              <Link
                href="/trilhas"
                className="inline-flex items-center gap-2 text-green-600 font-semibold text-lg hover:gap-3 transition-all"
              >
                Ver o mapa das trilhas
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Visual — 5 colunas, cards sobrepostos */}
            <div className="md:col-span-5 relative h-80">
              <div className="absolute top-0 right-4 w-56 bg-slate-900 text-white rounded-2xl p-5 shadow-xl">
                <MapPin className="h-5 w-5 text-green-400 mb-3" />
                <p className="text-sm text-slate-300">Pedra do Sino</p>
                <p className="text-2xl font-bold">9.2 km</p>
                <p className="text-xs text-slate-400 mt-1">
                  Difícil · 5h estimadas
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-52 bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-xl">
                <Cloud className="h-5 w-5 text-blue-500 mb-3" />
                <p className="text-sm text-slate-500">Agora mesmo</p>
                <p className="text-2xl font-bold">18°C</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">
                  Condições favoráveis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Eventos / Comunidade — fundo escuro, tipografia grande */}
      <section className="py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 bottom-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <span className="text-sm font-semibold text-green-400 tracking-wide uppercase">
            Você não precisa ir sozinho
          </span>
          <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-8 leading-[1.1]">
            Bora junto?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl mx-auto">
            Encontre grupos saindo pra trilha, mutirões de limpeza e encontros
            organizados por quem já conhece a serra. Confirme presença com um
            clique e apareça.
          </p>
          <Link href="/eventos">
            <Button
              size="lg"
              variant="outline"
              className="bg-medium-green border-white/30 text-white hover:bg-light-green hover:text-white px-10 py-7 text-md transition-colors"
            >
              Ver próximos encontros
            </Button>
          </Link>
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
                className="bg-white text-medium-green hover:bg-gray-100 px-12 py-7 text-md font-semibold cursor-pointer"
              >
                Ver todas as trilhas
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className=" text-white hover:bg-slate-800  bg-slate-900 hover:text-white px-12 py-7 text-md font-semibold cursor-pointer"
              >
                Junte-se aos trilheiros
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="flex flex-col gap-2 max-w-6xl mx-auto px-6 text-center">
          <p>Petro Trilhas © 2026</p>
          {/* <a
            className="text-green-400 hover:text-slate-300 underline underline-offset-2"
            href="https://www.petropolis.rj.gov.br/turispetro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Secretaria de Turismo
          </a>
          <a
            className="text-green-400 hover:text-slate-300 underline underline-offset-2"
            href="https://www.petropolis.rj.gov.br/pmp/index.php/meio-ambiente/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Secretaria de Meio Ambiente
          </a> */}
          <p className="text-sm mt-2">
            Feito com ❤️ para quem ama a serra imperial
          </p>
        </div>
      </footer>
    </div>
  );
}
