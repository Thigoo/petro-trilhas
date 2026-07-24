import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Petro Trilhas | Trilhas de Petrópolis num só lugar",
  description:
    "Da caminhada leve em família à trilha que desafia. Distância, dificuldade e clima em tempo real. A serra te espera.",

  openGraph: {
    title: "Petro Trilhas | Trilhas de Petrópolis num só lugar",
    description:
      "Encontre sua próxima trilha em Petrópolis com dados reais e clima em tempo real.",
    url: "https://petro-trilhas.vercel.app",
    siteName: "Petro Trilhas",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://petro-trilhas.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Petro Trilhas - Guia de Trilhas de Petrópolis",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Petro Trilhas | Trilhas de Petrópolis num só lugar",
    description:
      "Encontre sua próxima trilha em Petrópolis com dados reais e clima em tempo real.",
    images: ["https://petro-trilhas.vercel.app/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Analytics />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
