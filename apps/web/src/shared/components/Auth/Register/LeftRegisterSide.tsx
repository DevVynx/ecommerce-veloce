"use client";
import { motion } from "framer-motion";
import Link from "next/link";

import { GoogleSocialLoginButton } from "@/shared/components/Auth/GoogleSocialLoginButton";
import { OrDivider } from "@/shared/components/Auth/OrDivider";

import { RegisterForm } from "./RegisterForm";

export const LeftRegisterSide = () => {
  return (
    <motion.div
      layoutId="auth-form"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 30, mass: 1 }}
      className="bg-card justify-centerflex flex h-full w-full flex-1 flex-col items-center justify-center overflow-hidden p-6"
    >
      <div className="z-10 flex w-full max-w-lg flex-col items-center gap-3">
        <div className="mb-4 w-full space-y-2">
          <h1 className="text-card-foreground mt-5 text-center text-4xl font-bold lg:mb-2 lg:text-left">
            Registro
          </h1>
          <h2 className="text-muted-foreground text-center font-semibold lg:text-left">
            Preencha seus dados para começar
          </h2>
        </div>

        <RegisterForm />

        <div className="mt-2 flex flex-col items-center gap-3 text-sm text-black/60">
          <p className="text-center">
            Já possui uma conta?{" "}
            <Link
              href="/login"
              className="text-card-foreground hover:text-muted-foreground font-bold underline"
            >
              Faça login
            </Link>
          </p>

          <p className="text-center">
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
