import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Meilisearch } from "meilisearch";
import { Pool } from "pg";

import { ENV } from "@/shared/utils/env";

import { PrismaClient } from "../prisma/generated/client/client";

const MEILI_HOST = ENV.MEILI_HOST;
const MEILI_MASTER_KEY = ENV.MEILI_MASTER_KEY;
const INDEX_NAME = "admin_products";

const connectionString = process.env.DATABASE_URL ?? "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const meili = new Meilisearch({ host: MEILI_HOST, apiKey: MEILI_MASTER_KEY });

type AdminMeiliProductDocument = {
  id: string;
  title: string;
  slug: string;
  image: string;
  categoryId: string;
  categoryName: string;
  totalStock: number;
  activeCount: number;
  inactiveCount: number;
  minPrice: number;
  maxPrice: number;
  skus: string[];
  isActive: boolean;
  createdAt: string;
};

async function main() {
  console.log("Sincronizando produtos admin com Meilisearch...\n");

  const products = await prisma.product.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      image: true,
      totalStock: true,
      createdAt: true,
      categoryId: true,
      category: { select: { name: true } },
      productVariants: {
        select: {
          sku: true,
          price: true,
          stock: true,
          isActive: true,
        },
      },
    },
  });

  console.log(`  ${products.length} produtos encontrados no banco\n`);

  const documents: AdminMeiliProductDocument[] = [];

  for (const product of products) {
    const variants = product.productVariants;
    const activeVariants = variants.filter((v) => v.isActive);
    const activeCount = activeVariants.length;
    const inactiveCount = variants.length - activeCount;

    const prices = activeVariants.map((v) => Number(v.price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    documents.push({
      id: product.id,
      title: product.title,
      slug: product.slug,
      image: product.image,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      totalStock: product.totalStock,
      activeCount,
      inactiveCount,
      minPrice,
      maxPrice,
      skus: variants.map((v) => v.sku),
      isActive: activeCount > 0,
      createdAt: product.createdAt.toISOString(),
    });
  }

  async function waitForTask(taskUid: number) {
    while (true) {
      const task = await meili.tasks.getTask(taskUid);
      if (task.status === "succeeded") return task;
      if (task.status === "failed") {
        throw new Error(`Task ${taskUid} falhou: ${task.error?.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  try {
    const deleteTask = await meili.index(INDEX_NAME).deleteAllDocuments();
    await waitForTask(deleteTask.taskUid);
    const primaryKeyTask = await meili.index(INDEX_NAME).update({ primaryKey: "id" });
    await waitForTask(primaryKeyTask.taskUid);
    console.log("  Índice limpo");
  } catch {
    await meili.createIndex(INDEX_NAME, { primaryKey: "id" }).waitTask();
    console.log("  Índice criado");
  }

  const settings = {
    searchableAttributes: ["title", "categoryName", "skus"],
    filterableAttributes: [
      "categoryId",
      "totalStock",
      "activeCount",
      "inactiveCount",
      "minPrice",
      "maxPrice",
      "isActive",
    ],
    sortableAttributes: ["minPrice", "maxPrice", "totalStock", "createdAt"],
  };

  const settingsTask = await meili.index(INDEX_NAME).updateSettings(settings);
  await waitForTask(settingsTask.taskUid);
  console.log("  Configurações aplicadas");

  const addTask = await meili.index(INDEX_NAME).addDocuments(documents);
  await waitForTask(addTask.taskUid);

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
