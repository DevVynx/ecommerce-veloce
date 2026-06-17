import { redirect } from "next/navigation";
import { Suspense } from "react";

import { searchProducts } from "@/shared/actions/products/searchProducts";
import { SectionError } from "@/shared/components/SectionError";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { ActiveFilters } from "@/shared/components/Store/Search/ActiveFilters";
import { DesktopFilters } from "@/shared/components/Store/Search/DesktopFilters";
import { MobileFilters } from "@/shared/components/Store/Search/MobileFilters";
import { SearchEmpty } from "@/shared/components/Store/Search/SearchEmpty";
import { SearchResults } from "@/shared/components/Store/Search/SearchResults";
import { SearchPageSkeleton } from "@/shared/components/Store/Search/SearchResultsSkeleton";
import { SortSelect } from "@/shared/components/Store/Search/SortSelect";
import { parseOptionValues, toSearchRequest } from "@/shared/utils/store/search";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent searchParams={searchParams} />
    </Suspense>
  );
};

const SearchPageContent = async ({ searchParams }: SearchPageProps) => {
  const rawParams = await searchParams;

  const params = toSearchRequest(rawParams);

  if (!params.q && !params.categoryId) {
    redirect("/");
  }

  const { data, error } = await searchProducts(params);

  if (!data || error) {
    return (
      <SectionError
        title="Erro ao buscar produtos"
        description="Não foi possível carregar os resultados."
        toastDuration={6000}
        className="mt-10"
      />
    );
  }

  const selectedOptionValues = parseOptionValues(rawParams.optionValues);

  if (data.pagination.total === 0) {
    return (
      <main className="container mx-auto mt-10 px-2 py-8 md:px-0">
        {params.q && (
          <h1 className="text-muted-foreground mb-4 text-2xl tracking-tight md:text-4xl">
            Resultados para <span className="text-foreground font-bold">"{params.q}"</span>
          </h1>
        )}
        <Separator className="mb-6" />
        <SearchEmpty searchTerm={params.q} />
      </main>
    );
  }

  return (
    <main className="container mx-auto mt-10 px-2 py-8 md:px-0">
      {params.q && (
        <h1 className="text-muted-foreground mb-4 text-2xl tracking-tight md:text-4xl">
          Resultados para <span className="text-foreground font-bold">"{params.q}"</span>
        </h1>
      )}

      <div className="mb-2">
        <ActiveFilters params={rawParams} categories={data.filters.categories} />
      </div>

      <Separator className="mb-4" />

      <div className="mb-4 flex items-center justify-between gap-4 lg:hidden">
        <MobileFilters
          filters={data.filters}
          params={rawParams}
          selectedOptionValues={selectedOptionValues}
        />
        <SortSelect params={rawParams} />
      </div>

      <div className="gap-6 lg:flex">
        <DesktopFilters
          filters={data.filters}
          params={rawParams}
          selectedOptionValues={selectedOptionValues}
        />

        <section className="min-w-0 flex-1">
          <div className="mb-4 hidden items-center justify-between gap-4 lg:flex">
            <p className="text-sm text-gray-500">
              {data.pagination.total} produto{data.pagination.total !== 1 ? "s" : ""} encontrado
              {data.pagination.total !== 1 ? "s" : ""}
            </p>
            <SortSelect params={rawParams} />
          </div>

          <SearchResults
            initialProducts={data.products}
            total={data.pagination.total}
            params={rawParams}
          />
        </section>
      </div>
    </main>
  );
};

export default SearchPage;
