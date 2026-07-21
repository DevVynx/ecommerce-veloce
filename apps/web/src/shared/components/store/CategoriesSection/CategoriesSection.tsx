import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

import { getCategories } from "@/shared/actions/products/getCategories";
import { CATEGORY_LOGO_MAP } from "@/shared/components/Store/CategoriesSection/categoryLogos";

type Category = {
  label: string;
  logo: StaticImageData;
  href: string;
};

export const CategoriesSection = async () => {
  const { data } = await getCategories();
  const categories =
    data?.categories
      .filter((cat) => CATEGORY_LOGO_MAP[cat.name])
      .map((cat) => ({
        label: cat.name,
        logo: CATEGORY_LOGO_MAP[cat.name]!,
        href: `/search?categoryId=${cat.id}`,
      })) ?? [];

  return (
    <section id="categoriesSection" className="overflow-x-auto">
      <div className="grid auto-cols-max grid-flow-col grid-rows-1 gap-6 py-10 sm:justify-center">
        {categories.map((cat) => (
          <CategoryItem key={cat.label} {...cat} />
        ))}
      </div>
    </section>
  );
};

const CategoryItem = ({ logo, label, href }: Category) => {
  return (
    <Link key={label} href={href}>
      <div className="flex cursor-pointer flex-col items-center justify-center px-3 transition hover:opacity-50 active:opacity-30">
        <div className="relative h-20 w-20 lg:h-30 lg:w-30">
          <Image src={logo} alt={label} fill className="rounded-full object-cover" />
        </div>
        <span className="font-bold">{label}</span>
      </div>
    </Link>
  );
};
