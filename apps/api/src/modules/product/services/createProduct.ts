import type { CreateProductRequest } from "@repo/types/contracts";

import { productRepositories } from "@/modules/product/repositories";
import { db } from "@/shared/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

async function generateUniqueSlug(name: string): Promise<string> {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (await db.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export async function createProduct(data: CreateProductRequest) {
  const slug = await generateUniqueSlug(data.name);

  return await productRepositories.createProduct({ ...data, slug });
}
