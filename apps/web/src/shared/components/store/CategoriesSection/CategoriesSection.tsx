import type { StaticImageData } from "next/image";
import Image from "next/image";
import Link from "next/link";

type Category = {
  label: string;
  logo: StaticImageData;
  href: string;
};

type CategoriesSectionProps = {
  categories: Category[];
};

export const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
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
