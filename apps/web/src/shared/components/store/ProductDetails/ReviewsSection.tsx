import { BadgeCheck, CheckCircle2, MessageSquare } from "lucide-react";

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
import { ReviewsSummary } from "@/shared/components/Store/ProductDetails/ReviewsSummary";

export type Review = {
  id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
};

type ReviewsSectionProps = {
  ratingRate: number;
  ratingCount: number;
  reviews: Review[];
};

export const ReviewsSection = ({ ratingRate, ratingCount, reviews }: ReviewsSectionProps) => {
  return (
    <section className="mb-32">
      <div className="mb-10 flex flex-col justify-between gap-4 border-b py-6 lg:flex-row">
        {/* Coluna da Esquerda: Informações */}
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

        {/* Coluna da Direita: Sumário das Avaliações */}
        <div className="w-full flex-1">
          <ReviewsSummary ratingRate={ratingRate} />
        </div>
      </div>

      {/* Área das Avaliações */}
      <div className="space-y-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Avaliações</h1>
            <span className="text-muted-foreground text-sm">
              Mostrando 10 avaliações de {ratingCount}
            </span>
          </div>
          {/* Área dos Selects (Filtro de Notas e Ordenação) */}
          <div className="flex items-center gap-4">
            {/* Select de Notas */}
            <Select defaultValue="todas">
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

            {/* Select de Ordenação */}
            <Select defaultValue="recentes">
              <SelectTrigger className="h-8 w-37 py-5">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="recentes">Mais recentes</SelectItem>
                  <SelectItem value="uteis">Mais relevantes</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              className="rounded-lg px-6 py-3 font-mono text-sm font-bold tracking-widest uppercase"
            >
              Ver mais avaliações
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
