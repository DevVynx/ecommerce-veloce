import type { GetProductDetailsResponse, PublicProductDto } from "@repo/types/contracts";
import { useEffect, useState } from "react";

import { getProductById } from "@/shared/actions/products/getProductById";
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/shadcn-ui/dialog";

import { ProductDetails } from "./ProductDetails";

type ProductDetailsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: PublicProductDto | null;
};

export const ProductDetailsDialog = ({
  open,
  onOpenChange,
  product,
}: ProductDetailsDialogProps) => {
  const [productDetail, setProductDetail] = useState<GetProductDetailsResponse | null>(null);

  useEffect(() => {
    const getProductDetails = async () => {
      if (open && product) {
        const result = await getProductById(product.id);
        if (result.data) {
          setProductDetail(result.data);
        }
      }
    };

    getProductDetails();
  }, [open, product]);

  if (!product) return null;

  const displayProduct = productDetail?.product || product;
  const variants = productDetail?.variants || [];
  const options = productDetail?.options || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-6 md:p-10">
        <DialogTitle className="sr-only">{product.title}</DialogTitle>
        {productDetail ? (
          <ProductDetails
            selectedProduct={displayProduct}
            variants={variants}
            options={options}
            onClose={() => onOpenChange(false)}
          />
        ) : (
          <div className="flex h-125 items-center justify-center">
            <p>Carregando...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
