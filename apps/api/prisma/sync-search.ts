import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Meilisearch } from "meilisearch";
import { Pool } from "pg";

import { productLogic } from "@/shared/utils/productLogic";

import { PrismaClient } from "./generated/client/client";

const MEILI_HOST = process.env.MEILI_HOST ?? "http://localhost:7700";

const MEILI_MASTER_KEY = process.env.MEILI_MASTER_KEY ?? "";

const INDEX_NAME = "products";

const connectionString = process.env.DATABASE_URL ?? "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const meili = new Meilisearch({ host: MEILI_HOST, apiKey: MEILI_MASTER_KEY });

type MeiliProductDocument = {
  id: string;
  title: string;
  description: string;
  price: number;
  salePrice: number;
  onSale: boolean;
  categoryId: string;
  categoryName: string;
  skus: string[];
  ratingRate: number;
  ratingCount: number;
  createdAt: string;
  optionValues: string[];
};

async function main() {
  console.log("Sincronizando produtos com Meilisearch...\n");

  const now = new Date();

  const products = await prisma.product.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
          promotions: {
            where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
          },
        },
      },
      promotions: {
        where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
      },
      productVariants: {
        select: {
          id: true,
          sku: true,
          price: true,
          stock: true,
          isActive: true,
          promotions: {
            where: { isActive: true, startsAt: { lte: now }, endsAt: { gte: now } },
          },
        },
      },
      productOptions: {
        select: {
          name: true,
          values: { select: { value: true } },
        },
      },
    },
  });

  console.log(`  ${products.length} produtos encontrados no banco\n`);

  const documents: MeiliProductDocument[] = [];

  for (const product of products) {
    const variantsWithEnrichment = product.productVariants.map((variant) => {
      const offer = productLogic.calculateEnrichment(variant, {
        variant: variant.promotions,
        product: product.promotions,
        category: product.category.promotions,
      });
      return { ...variant, offer };
    });

    const heroVariant = productLogic.pickHeroVariant(variantsWithEnrichment);

    if (!heroVariant) {
      console.log(`  Pulando produto sem variante disponível: ${product.title}`);
      continue;
    }

    const optionValues = product.productOptions.flatMap((opt) =>
      opt.values.map((v) => `${opt.name}::${v.value}`)
    );

    documents.push({
      id: product.id,
      title: product.title,
      description: product.description,
      price: Number(heroVariant.price),
      salePrice: Number(heroVariant.offer.salePrice),
      onSale: heroVariant.offer.isOnSale,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      skus: product.productVariants.map((v) => v.sku),
      ratingRate: Number(product.ratingRate),
      ratingCount: product.ratingCount,
      createdAt: product.createdAt.toISOString(),
      optionValues,
    });
  }

  try {
    await meili.index(INDEX_NAME).deleteAllDocuments();
    console.log("  Índice limpo");
  } catch {
    console.log("  Criando índice...");
  }

  const settings = {
    searchableAttributes: ["title", "description", "categoryName", "skus"],
    filterableAttributes: ["categoryId", "price", "salePrice", "categoryName", "onSale", "ratingRate", "id", "optionValues"],
    sortableAttributes: ["salePrice", "ratingRate", "createdAt"],
  };

  await meili.index(INDEX_NAME).updateSettings(settings);
  console.log("  Configurações aplicadas");

  const result = await meili.index(INDEX_NAME).addDocuments(documents);
  console.log(`  Documentos adicionados: ${result.taskUid}`);

  console.log(`\n  ${documents.length} produtos sincronizados com sucesso!`);
}

main()
  .catch((e) => {
    console.error("\nErro no sync:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
