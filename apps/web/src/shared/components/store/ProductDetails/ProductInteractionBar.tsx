"use client";
import { Copy, MessagesSquare, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

import { showNotification } from "@/shared/components/showNotification";

type ProductInteractionBarProps = {
  productTitle: string;
};

export const ProductInteractionBar = ({ productTitle }: ProductInteractionBarProps) => {
  const [canShare, setCanShare] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  const handleChat = () => {
    const msg = encodeURIComponent(
      `Olá! Vi esse produto "${productTitle}" na BeliBeli Store. Gostaria de saber mais detalhes sobre ele.\n\n${window.location.href}`
    );
    window.open(`https://wa.me/send?text=${msg}`)
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: productTitle,
        text: "Confira este produto incrível que encontrei na BeliBeli Store!",
        url,
      });
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      showNotification({
        type: "success",
        title: "Link Copiado!",
        message: "O link do produto foi copiado.",
      });
      setTimeout(() => setIsCopied(false), 2000);
      return;
    }

    showNotification({
      type: "error",
      title: "Não foi possível compartilhar",
      message: "Copie o link manualmente da barra de endereços.",
    });
  };

  return (
    <div className="border-border mt-6 flex items-center justify-around gap-8 border-t pt-6">
      <button
        onClick={handleChat}
        className="hover:text-secondary-foreground text-muted-foreground flex items-center gap-2 transition-colors"
      >
        <MessagesSquare size={16} />
        <span className="cursor-pointer text-xs font-semibold tracking-widest uppercase">Chat</span>
      </button>

      <button
        onClick={handleShare}
        className="hover:text-secondary-foreground text-muted-foreground flex items-center gap-2 transition-colors"
      >
        {canShare ? <Share2 size={16} /> : <Copy size={16} />}
        <span className="cursor-pointer text-xs font-semibold tracking-widest uppercase">
          {canShare ? "Compartilhe" : isCopied ? "Link Copiado!" : "Copiar Link"}
        </span>
      </button>
    </div>
  );
};
