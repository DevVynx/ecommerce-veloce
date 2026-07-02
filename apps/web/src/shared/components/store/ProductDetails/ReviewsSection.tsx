"use client";
import type { ReviewDto } from "@repo/types/contracts";
import { BadgeCheck, CheckCircle2, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getReviews } from "@/shared/actions/reviews/getReviews";
import { Button } from "@/shared/components/shadcn-ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import { ReviewCard } from "@/shared/components/Store/ProductDetails/ReviewCard";
import { ReviewsModal } from "@/shared/components/Store/ProductDetails/ReviewsModal";
import { ReviewsSummary } from "@/shared/components/Store/ProductDetails/ReviewsSummary";

type ReviewsSectionProps = {
  productId: string;
  ratingRate: number;
  ratingDistribution: Record<number, number>;
  ratingCount: number;
};

export const ReviewsSection = ({
  productId,
  ratingRate,
  ratingDistribution,
  ratingCount,
}: ReviewsSectionProps) => {
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<"newest" | "relevant">("newest");
  const [modalOpen, setModalOpen] = useState(false);

  const [preview, setPreview] = useState<ReviewDto[]>([]);
  const [total, setTotal] = useState(0);

  const LIMIT = 10;

  useEffect(() => {
    getReviews({ productId, offset: 0, limit: LIMIT, rating: ratingFilter, sort }).then(
      (result) => {
        if (!result.data) return;
        setPreview(result.data.reviews);
        setTotal(result.data.pagination.total);
      }
    );
  }, [productId, ratingFilter, sort]);

  const handleRatingChange = useCallback((value: string) => {
    const newRating = value === "todas" ? undefined : Number(value);
    setRatingFilter(newRating);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSort(value as "newest" | "relevant");
  }, []);

  const visibleCount = Math.min(preview.length, total);

  return (
    <section className="mb-32">
      <div className="mb-10 flex flex-col justify-between gap-4 border-b py-6 lg:flex-row">
        <div className="flex-1">
          <div className="flex h-full max-w-xl flex-col justify-between gap-4 lg:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <BadgeCheck className="size-8 shrink-0 text-emerald-600" />
                <h2 className="text-xl font-bold lg:text-2xl">Avaliações Verificadas</h2>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed lg:text-base">
                Todas as avaliações são de clientes que compraram o produto. Compre com confiança.
              </p>
            </div>

            <div className="border-border bg-muted/30 mt-2 hidden rounded-lg border p-5 lg:block">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
                  <span className="text-sm font-medium lg:text-base">
                    Compras verificadas pelo sistema
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <MessageSquare className="size-5 shrink-0 text-emerald-600" />
                  <span className="text-sm font-medium lg:text-base">
                    Depoimentos de compradores reais
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full flex-1">
          <ReviewsSummary
            ratingRate={ratingRate}
            distribution={ratingDistribution}
            total={ratingCount}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Avaliações</h1>
            <span className="text-muted-foreground text-sm">
              Mostrando {visibleCount} avaliações de {total}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={ratingFilter ? String(ratingFilter) : "todas"}
              onValueChange={handleRatingChange}
            >
              <SelectTrigger className="h-8 w-35 py-5">
                <SelectValue placeholder="Filtrar por nota" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="todas">Todas as notas</SelectItem>
                  <SelectItem value="5">5 estrelas</SelectItem>
                  <SelectItem value="4">4 estrelas</SelectItem>
                  <SelectItem value="3">3 estrelas</SelectItem>
                  <SelectItem value="2">2 estrelas</SelectItem>
                  <SelectItem value="1">1 estrela</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="h-8 w-37 py-5">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="relevant">Mais relevantes</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {preview.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {total > LIMIT && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                className="rounded-lg px-6 py-3 font-mono text-sm font-bold tracking-widest uppercase"
                onClick={() => setModalOpen(true)}
              >
                Ver mais avaliações
              </Button>
            </div>
          )}
        </div>
      </div>

      <ReviewsModal
        productId={productId}
        ratingFilter={ratingFilter}
        sort={sort}
        onRatingChange={handleRatingChange}
        onSortChange={handleSortChange}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
};
