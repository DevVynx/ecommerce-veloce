"use client";
import { motion } from "framer-motion";
import Image from "next/image";

import emptyBoxSvg from "@/shared/assets/images/corporateMemphis/empty-box.svg";

type SearchEmptyProps = {
  searchTerm?: string;
};

export const SearchEmpty = ({ searchTerm }: SearchEmptyProps) => {
  return (
    <motion.div
      layoutId="search-empty"
      transition={{ type: "spring", stiffness: 220, damping: 30 }}
      className="mx-auto flex max-w-2xl flex-col items-center gap-8 py-16"
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative flex items-center justify-center"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Image
            alt="Nenhum produto encontrado"
            src={emptyBoxSvg}
            className="h-auto w-64 select-none md:w-80"
            priority
          />
        </motion.div>

        <motion.div
          className="bg-border/50 absolute -bottom-4 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-full blur-xl"
          animate={{
            scale: [1, 0.6, 1],
            opacity: [0.4, 0.15, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="space-y-2 text-center"
      >
        <h2 className="text-2xl font-bold md:text-3xl">Nenhum produto encontrado</h2>

        <p className="text-muted-foreground mx-auto max-w-sm text-sm md:text-base">
          {searchTerm ? (
            <>
              Não encontramos resultados para{" "}
              <span className="text-foreground font-bold">"{searchTerm}"</span>.
            </>
          ) : (
            "Tente ajustar os filtros para encontrar o que procura."
          )}
        </p>
      </motion.div>
    </motion.div>
  );
};
