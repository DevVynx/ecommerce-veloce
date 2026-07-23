import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { ENV } from "@/shared/utils/env";

import { PrismaClient } from "../prisma/generated/client/client";
import { seedProducts } from "./seed-products";

const connectionString = ENV.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── Categories ──
const categories = [
  { name: "Masculino", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824658/cat_mens_clothing_vrcraj.webp" },
  { name: "Joias", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824659/joias_l42luj.jpg" },
  { name: "Eletrônicos", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824658/cat_eletronics_pirhxe.webp" },
  { name: "Feminino", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824659/cat_womens_clothing_irlkvw.jpg" },
  { name: "Beleza", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824176/beleza_spxf2s.jpg" },
  { name: "Perfumes", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824177/perfume_hlc7qy.webp" },
  { name: "Casa & Decoração", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824176/casa-decoracao_jpujav.jpg" },
  { name: "Alimentos", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824153/alimento_wpury8.jpg" },
  { name: "Cozinha", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824176/cozinha_crtdmv.webp" },
  { name: "Acessórios", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824176/Acessorios_t0vm3m.webp" },
  { name: "Esportes", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824176/esporte_aw6wwe.jpg" },
  { name: "Veículos", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824175/veiculos_zelfej.jpg" },
];

// Promoções de categoria
const categoryPromotions = [
  {
    categoryName: "Eletrônicos",
    name: "Semana do Consumidor - Eletrônicos",
    type: "PERCENTAGE" as const,
    discountValue: 15,
    startsAt: new Date("2024-03-01"),
    endsAt: new Date("2030-03-31"),
    isActive: true,
  },
  {
    categoryName: "Feminino",
    name: "Dia das Mulheres - Roupas Femininas",
    type: "PERCENTAGE" as const,
    discountValue: 20,
    startsAt: new Date("2024-03-01"),
    endsAt: new Date("2030-03-15"),
    isActive: true,
  },
  {
    categoryName: "Beleza",
    name: "Mês da Beleza",
    type: "PERCENTAGE" as const,
    discountValue: 10,
    startsAt: new Date("2024-06-01"),
    endsAt: new Date("2030-06-30"),
    isActive: true,
  },
  {
    categoryName: "Esportes",
    name: "Promoção Esportiva",
    type: "PERCENTAGE" as const,
    discountValue: 25,
    startsAt: new Date("2024-07-01"),
    endsAt: new Date("2030-07-31"),
    isActive: true,
  },
];

// ==========================================
// FUNÇÃO PRINCIPAL
// ==========================================

async function main() {
  console.log("🚀 Iniciando o processo de seed...\n");

  // Limpeza
  console.log("🧹 Limpando tabelas existentes...");
  await prisma.$transaction(async (tx) => {
    await tx.productVariantImage.deleteMany();
    await tx.productVariantOption.deleteMany();
    await tx.productOptionValue.deleteMany();
    await tx.productOption.deleteMany();
    await tx.wishlistItem.deleteMany();
    await tx.wishlist.deleteMany();
    await tx.cartItem.deleteMany();
    await tx.cart.deleteMany();
    await tx.orderItem.deleteMany();
    await tx.couponUsage.deleteMany();
    await tx.order.deleteMany();
    await tx.coupon.deleteMany();
    await tx.review.deleteMany();
    await tx.promotion.deleteMany();
    await tx.productVariant.deleteMany();
    await tx.product.deleteMany();
    await tx.category.deleteMany();
    await tx.refreshToken.deleteMany();
    await tx.address.deleteMany();
    await tx.user.deleteMany();
    await tx.searchSuggestion.deleteMany();
  });
  console.log("✅ Tabelas limpas com sucesso!\n");

  // Categorias
  console.log("🌱 Inserindo categorias...");
  const createdCategories = await prisma.$transaction(
    categories.map((cat) => prisma.category.create({ data: { name: cat.name, image: cat.image } }))
  );
  const categoryMap = new Map(createdCategories.map((cat) => [cat.name, cat.id]));
  console.log(`✨ ${createdCategories.length} categorias inseridas!\n`);

  // Promoções de categoria
  console.log("🎯 Inserindo promoções de categoria...");
  for (const catPromo of categoryPromotions) {
    const categoryId = categoryMap.get(catPromo.categoryName);
    if (categoryId) {
      await prisma.promotion.create({
        data: {
          name: catPromo.name,
          type: catPromo.type,
          discountValue: catPromo.discountValue,
          isActive: catPromo.isActive,
          startsAt: catPromo.startsAt,
          endsAt: catPromo.endsAt,
          categoryId: categoryId,
        },
      });
    }
  }
  console.log(`✨ ${categoryPromotions.length} promoções de categoria inseridas!\n`);

  // Produtos (via fake data)
  console.log("🛍️  Inserindo produtos a partir dos dados fake...");
  const result = await seedProducts(prisma, categoryMap);
  console.log(`   ✓ Produtos: ${result.products}`);
  console.log(`   ✓ Variantes: ${result.variants}`);
  console.log(`   ✓ Imagens: ${result.images}\n`);

  // Relatório final
  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    variants: await prisma.productVariant.count(),
    options: await prisma.productOption.count(),
    optionValues: await prisma.productOptionValue.count(),
    images: await prisma.productVariantImage.count(),
    promotions: await prisma.promotion.count(),
  };

  console.log("📊 CONTAGENS FINAIS:");
  for (const [key, val] of Object.entries(counts)) {
    console.log(`   ✓ ${key}: ${val}`);
  }

  console.log("\n✅ SEED CONCLUÍDO COM SUCESSO! ✅\n");
}

main()
  .catch(async (e) => {
    console.error("\n❌ ERRO NO SEED:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
