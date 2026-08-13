import "./globals.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Kotta_One } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

import { Footer } from "@/shared/components/Footer";
import { Toaster } from "@/shared/components/shadcn-ui/sonner";
import { TooltipProvider } from "@/shared/components/shadcn-ui/tooltip";
import { Header } from "@/shared/components/Store/Header/Header";
import { NotFoundProvider } from "@/shared/contexts/not-found";
import { CartProvider } from "@/shared/providers/CartProvider";
import { QueryProvider } from "@/shared/providers/QueryProvider";
import { WishlistProvider } from "@/shared/providers/WishlistProvider";
import { ENV } from "@/shared/utils/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const kottaOne = Kotta_One({
  variable: "--font-kotta-one",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://veloce-ecommerce.vercel.app"),
  title: "Veloce | Sua Loja Online de Produtos",
  description:
    "Bem-vindo à Veloce Store! Explore nossa loja online e encontre os melhores produtos com qualidade e praticidade em um só lugar.",
  applicationName: "Veloce",
  icons: "/veloce-logo.jpeg",
  openGraph: {
    type: "website",
    siteName: "Veloce",
    locale: "pt_BR",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1897,
        height: 1061,
        alt: "Veloce — Sua Loja Online de Produtos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kottaOne.variable} antialiased`}
      >
        <Analytics />
        <Suspense fallback={null}>
          <QueryProvider>
            <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
              <CartProvider />
              <WishlistProvider />
              <NotFoundProvider>
                <TooltipProvider>
                  <Suspense fallback={null}>
                    <Header />
                  </Suspense>
                  <NuqsAdapter>
                    <div className="min-h-screen">{children}</div>
                  </NuqsAdapter>
                  <Suspense fallback={null}>
                    <Footer />
                  </Suspense>
                  <Toaster />
                </TooltipProvider>
              </NotFoundProvider>
            </GoogleOAuthProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
