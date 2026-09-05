import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "../providers/QueryProvider";
import { Toaster } from "sonner";
import { BASE_URL } from "../constants";
import MicrosoftClarity from "../components/analytics/MicrodoftClarity";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Petro Trilhas | A natureza de Petrópolis na palma da sua mão",
  description:
    "Explore as trilhas de Petrópolis em um só lugar. Descubra caminhos, cachoeiras e paisagens da serra com informações sobre distância, dificuldade, duração, localização e clima.",

  openGraph: {
    title: "Petro Trilhas | A natureza de Petrópolis na palma da sua mão",
    description:
      "Explore as trilhas de Petrópolis em um só lugar. Descubra caminhos, cachoeiras e paisagens da serra com informações sobre distância, dificuldade, duração, localização e clima.",
    url: BASE_URL,
    siteName: "Petro Trilhas",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Petro Trilhas - A natureza de Petrópolis na palma da sua mão",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Petro Trilhas | A natureza de Petrópolis na palma da sua mão",
    description:
      "Explore as trilhas de Petrópolis em um só lugar. Descubra caminhos, cachoeiras e paisagens da serra com informações sobre distância, dificuldade, duração, localização e clima.",
    images: [`${BASE_URL}/og-image.jpg`],
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
        <MicrosoftClarity />
        <Analytics />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
