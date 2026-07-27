"use client";
import { motion } from "framer-motion";
import Link from "next/link";

import { GoogleSocialLoginButton } from "@/shared/components/Auth/GoogleSocialLoginButton";
import { OrDivider } from "@/shared/components/Auth/OrDivider";

import { LoginForm } from "./LoginForm";

export const RightLoginSide = () => {
  return (
    <motion.div
      layoutId="auth-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 30, mass: 1 }}
      className="bg-card flex h-full w-full flex-1 flex-col items-center justify-center overflow-hidden p-6"
    >
      <div className="z-10 flex w-full max-w-lg flex-col items-center gap-3">
        <div className="mb-4 w-full space-y-2">
          <h1 className="text-card-foreground mt-5 text-center text-4xl font-bold lg:mb-2 lg:text-left">
            Login
          </h1>
          <h2 className="text-muted-foreground text-center font-semibold lg:text-left">
            Faça login para continuar comprando
          </h2>
        </div>

        <LoginForm />

        <div className="mt-2 flex flex-col items-center gap-3">
          <p className="text-center text-sm text-black/60">
            Não possui uma conta?{" "}
            <Link
              href="/register"
              className="text-card-foreground hover:text-muted-foreground font-bold underline"
            >
              Crie uma
            </Link>
          </p>

          <p className="text-center text-sm text-black/60">
            Apenas dando uma olhada?{" "}
            <Link
              href="/"
              className="text-card-foreground hover:text-muted-foreground font-bold underline"
            >
              Acesse a loja
            </Link>
          </p>
        </div>

        <div className="hidden w-full">
          <OrDivider />
          <div className="flex flex-col gap-3">
            <GoogleSocialLoginButton />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
