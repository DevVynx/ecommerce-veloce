import "./globals.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Kotta_One } from "next/font/google";

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
  title: "BeliBeli | Sua Loja Online de Produtos",
  description:
    "Bem-vindo à BeliBeli Store! Explore nossa loja online e encontre os melhores produtos com qualidade e praticidade em um só lugar.",
  icons: "/belilogo.png",
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
        <QueryProvider>
          <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
            <CartProvider />
            <WishlistProvider />
            {children}
          </GoogleOAuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
