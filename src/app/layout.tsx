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
  title: "Petro Trilhas",
  description: "Explore as trilhas de Petrópolis com segurança e informação.",

  openGraph: {
    title: "Petro Trilhas",
    description: "O guia completo das trilhas de Petrópolis",
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
