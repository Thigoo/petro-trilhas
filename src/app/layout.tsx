import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../providers/AuthProvider";

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
    images: [
      {
        url: "https://petro-trilhas.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Petro Trilhas",
      },
    ],
    siteName: "Petro Trilhas",
    locale: "pt_BR",
    type: "website",
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
