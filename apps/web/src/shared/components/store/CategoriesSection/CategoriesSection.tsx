import Image from "next/image";
import Link from "next/link";

import { getCategories } from "@/shared/actions/products/getCategories";
import { cn } from "@/shared/utils/lib/utils";

type Category = {
  label: string;
  image?: string;
  href: string;
};

export const CategoriesSection = async () => {
  const { data } = await getCategories();
  const categories: Category[] =
    data?.categories
      .filter((cat) => cat.image)
      .map((cat) => ({
        label: cat.name,
        image: cat.image,
        href: `/search?categoryId=${cat.id}`,
      })) ?? [];

  if (categories.length === 0) return null;

  return (
    <section id="categoriesSection" className="container mx-auto overflow-x-auto">
      <div className="grid grid-flow-col grid-rows-2 gap-6 py-10 lg:grid-flow-row lg:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
        {categories.map((cat) => (
          <CategoryItem key={cat.label} {...cat} />
        ))}
      </div>
    </section>
  );
};

const CategoryItem = ({ image, label, href }: Category) => {
  return (
    <Link key={label} href={href}>
      <div className="flex cursor-pointer flex-col items-center justify-center px-3 transition hover:opacity-50 active:opacity-30">
        <div className="relative h-20 w-20 lg:h-30 lg:w-30">
          {image ? (
            <Image src={image} alt={label} fill className="rounded-full object-cover" />
          ) : (
            <div
              className={cn(
                "bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded-full text-xs font-bold"
              )}
            >
              {label[0]}
            </div>
          )}
        </div>
        <span className="font-bold">{label}</span>
      </div>
    </Link>
  );
};
