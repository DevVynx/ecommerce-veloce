"use client";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import EmptyCartSvg from "@/shared/assets/images/corporateMemphis/empty-cart.svg";
import { Button } from "@/shared/components/shadcn-ui/button";

export const CartEmpty = () => {
  return (
    <motion.div
      layoutId="cart-empty"
      transition={{ type: "spring", stiffness: 220, damping: 30 }}
      className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-16"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
        className="relative flex items-center justify-center"
      >
        <motion.div
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            alt="Carrinho vazio"
            src={EmptyCartSvg}
            className="h-auto w-72 select-none md:w-96"
            priority
          />
        </motion.div>

        <motion.div
          className="bg-border/50 absolute -bottom-4 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-full blur-xl"
          animate={{
            scale: [1, 0.7, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="space-y-2 text-center"
      >
        <h1 className="text-2xl font-bold md:text-3xl">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm md:text-base">
          Que tal explorar nossos produtos? Temos várias opções incríveis esperando por você!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button asChild size="lg" className="cursor-pointer gap-2">
          <Link href="/">
            <ShoppingBag className="size-5" />
            Começar a comprar
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};
