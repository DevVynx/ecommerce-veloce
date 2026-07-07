"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@/shared/components/shadcn-ui/separator";

const sobreLinks = [
  { label: "Quem Somos" },
  { label: "Nossa História" },
  { label: "Blog" },
  { label: "Seja um Parceiro" },
];

const ajudaLinks = [
  { label: "FAQ" },
  { label: "Políticas de Privacidade" },
  { label: "Contate a Gente" },
  { label: "Trocas e Devoluções" },
];

const socialLinks = [
  {
    label: "Instagram",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
];

export const Footer = () => {
  const pathname = usePathname();

  const hideHeaderRoutes = ["/login", "/register", "/admin"];
  const shouldHideHeader = hideHeaderRoutes.some((route) => pathname.startsWith(route));

  if (shouldHideHeader) {
    return null;
  }

  return (
    <footer className="bg-muted border-border border-t px-3 py-12">
      <div className="mx-auto lg:container">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/">
              <h1 className="font-kotta text-foreground mb-2 text-2xl font-semibold">
                BeliBeli.com
              </h1>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sua loja online de produtos com qualidade e praticidade. Explore nossa seleção e
              encontre o que você precisa com a melhor experiência de compra.
            </p>
          </div>

          {/* Sobre Nós */}
          <div>
            <h2 className="text-foreground mb-3 text-sm font-semibold tracking-widest uppercase">
              Sobre Nós
            </h2>
            <div className="space-y-2">
              {sobreLinks.map((link) => (
                <div key={link.label}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Ajuda */}
          <div>
            <h2 className="text-foreground mb-3 text-sm font-semibold tracking-widest uppercase">
              Ajuda
            </h2>
            <div className="space-y-2">
              {ajudaLinks.map((link) => (
                <div key={link.label}>
                  <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="text-foreground mb-3 text-sm font-semibold tracking-widest uppercase">
              Redes Sociais
            </h2>
            <div className="space-y-4">
              {socialLinks.map((social) => (
                <button
                  type="button"
                  key={social.label}
                  className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-sm"
                >
                  {social.icon}
                  {social.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            © 2026 BeliBeli. Desenvolvido por{" "}
            <a
              href="https://github.com/DevVynx"
              target="_blank"
              className="cursor-pointer font-semibold hover:underline"
            >
              Vynx
            </a>
            .
          </p>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Política de Privacidade</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground text-xs">Termos e Condições</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
