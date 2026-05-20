import React from "react";

type ProductCardSkeletonProps = {
  grid?: boolean;
};

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ grid }) => {
  return (
    // Usa as mesmas classes de largura do ProductCard para manter o layout
    <div
      className={`relative animate-pulse overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm ${
        grid ? "w-full" : "w-60 shrink-0"
      }`}
    >
      {/* Área da Imagem (simula o fundo e o botão de coração) */}
      <div className="relative flex aspect-square w-full items-center justify-center bg-neutral-200 p-4">
        {/* Simula o botão de coração */}
        <div className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full bg-white"></div>
      </div>

      {/* Área das Informações do Produto */}
      <div className="space-y-2 p-2">
        {/* Linha do Título (simula h1) */}
        <div className="h-4 w-3/4 rounded bg-neutral-200"></div>
        {/* Linha do Rating/Vendidos */}
        <div className="h-3 w-1/2 rounded bg-neutral-200"></div>
        {/* Linha do Preço */}
        <div className="h-4 w-1/3 rounded bg-neutral-200"></div>
        {/* Linha do Progress Bar (apenas se 'onSale' fosse true, então opcional) */}
        {/* <div className="mt-2 h-2 w-full rounded-full bg-gray-300"></div> */}
      </div>
    </div>
  );
};
