import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { generateSlug } from "@/modules/product/helpers/generateSlug";
import { ENV } from "@/shared/utils/env";

import { PrismaClient } from "../prisma/generated/client/client";

const connectionString = ENV.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { name: "Eletrônicos", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824658/cat_eletronics_pirhxe.webp" },
  { name: "Masculino", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824658/cat_mens_clothing_vrcraj.webp" },
  { name: "Feminino", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824659/cat_womens_clothing_irlkvw.jpg" },
  { name: "Joias", image: "https://res.cloudinary.com/lj6rrdyz/image/upload/f_auto,q_auto/v1784824659/joias_l42luj.jpg" },
] as const;

type CategoryName = (typeof CATEGORIES)[number]["name"];

type ProductLine = {
  name: string;
  weight: number;
  priceMin: number;
  priceMax: number;
};

type OptionGroup = {
  name: string;
  values: string[];
};

type CategoryTemplate = {
  brands: string[];
  lines: ProductLine[];
  colorsInTitle: string[];
  optionGroups: OptionGroup[];
  hasOptionChance: number;
  maxVariants: number;
};

const templates: Record<CategoryName, CategoryTemplate> = {
  Eletrônicos: {
    brands: [
      "Samsung",
      "Apple",
      "Sony",
      "Dell",
      "LG",
      "ASUS",
      "Logitech",
      "Acer",
      "Lenovo",
      "Microsoft",
    ],
    lines: [
      { name: "Galaxy Book 4", weight: 1.8, priceMin: 4500, priceMax: 8500 },
      { name: "MacBook Air M4", weight: 1.2, priceMin: 8000, priceMax: 12000 },
      { name: 'Monitor UltraFine 32" 4K', weight: 5.0, priceMin: 3500, priceMax: 6000 },
      { name: "Fone Wireless WH-1000XM", weight: 0.25, priceMin: 1200, priceMax: 2100 },
      { name: "Mouse Wireless MX Master 3S", weight: 0.14, priceMin: 250, priceMax: 400 },
      { name: "Magic Keyboard Touch ID", weight: 0.3, priceMin: 600, priceMax: 1200 },
      { name: "iPad Air M3", weight: 0.46, priceMin: 5000, priceMax: 9500 },
      { name: "Galaxy Watch 7 Bluetooth", weight: 0.06, priceMin: 1200, priceMax: 2800 },
      { name: "XPS 16 Intel Ultra 9", weight: 1.9, priceMin: 8000, priceMax: 15000 },
      { name: 'Monitor UltraGear 27" 240Hz', weight: 4.5, priceMin: 1500, priceMax: 3500 },
      { name: "ThinkPad X1 Carbon", weight: 1.1, priceMin: 6000, priceMax: 12000 },
      { name: "Surface Pro 11", weight: 0.9, priceMin: 7000, priceMax: 11000 },
    ],
    colorsInTitle: ["Preto", "Branco", "Prata", "Grafite"],
    optionGroups: [
      { name: "Cor", values: ["Preto", "Branco", "Prata", "Grafite", "Cinza Espacial"] },
      { name: "Capacidade", values: ["256GB", "512GB", "1TB"] },
      { name: "Tamanho", values: ['13"', '15"', '17"'] },
    ],
    hasOptionChance: 0.6,
    maxVariants: 6,
  },
  Masculino: {
    brands: [
      "Nike",
      "Adidas",
      "Levi's",
      "Calvin Klein",
      "Puma",
      "Under Armour",
      "Tommy Hilfiger",
      "Lacoste",
    ],
    lines: [
      { name: "Camiseta Running Dri-FIT", weight: 0.15, priceMin: 80, priceMax: 180 },
      { name: "Jeans 501 Original Fit", weight: 0.5, priceMin: 200, priceMax: 450 },
      { name: "Calça Jogger Essentials", weight: 0.4, priceMin: 150, priceMax: 300 },
      { name: "Camiseta Club Algodão", weight: 0.18, priceMin: 60, priceMax: 150 },
      { name: "Jaqueta Windrunner Sportswear", weight: 0.35, priceMin: 250, priceMax: 500 },
      { name: "Calça Chino Classic Fit", weight: 0.45, priceMin: 180, priceMax: 350 },
      { name: "Camisa Polo Performance", weight: 0.2, priceMin: 100, priceMax: 220 },
      { name: "Bermuda Ultimate Flex", weight: 0.15, priceMin: 80, priceMax: 160 },
      { name: "Suéter Heritage Gola Careca", weight: 0.4, priceMin: 200, priceMax: 400 },
      { name: "Colete Down Leve", weight: 0.3, priceMin: 300, priceMax: 600 },
      { name: "Tênis Racer TR21", weight: 0.35, priceMin: 250, priceMax: 500 },
    ],
    colorsInTitle: ["Preto", "Branco", "Azul", "Cinza", "Verde", "Marrom"],
    optionGroups: [
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Cor", values: ["Preto", "Branco", "Azul", "Cinza", "Verde"] },
    ],
    hasOptionChance: 0.7,
    maxVariants: 8,
  },
  Feminino: {
    brands: ["Zara", "H&M", "Nike", "Adidas", "Mango", "Forever 21", "Tracy", "Schutz"],
    lines: [
      { name: "Blazer Alfaiataria", weight: 0.4, priceMin: 250, priceMax: 600 },
      { name: "Top Crop Essential", weight: 0.1, priceMin: 50, priceMax: 120 },
      { name: "Jeans Mom Fit Cintura Alta", weight: 0.45, priceMin: 180, priceMax: 350 },
      { name: "Moletom Oversized", weight: 0.35, priceMin: 120, priceMax: 250 },
      { name: "Saia Mini Plissada", weight: 0.2, priceMin: 100, priceMax: 220 },
      { name: "Vestido Maxi Floral", weight: 0.3, priceMin: 150, priceMax: 350 },
      { name: "Jaqueta Moto Couro", weight: 0.5, priceMin: 400, priceMax: 800 },
      { name: "Pijama Algodão", weight: 0.25, priceMin: 80, priceMax: 180 },
      { name: "Trench Coat Longo", weight: 0.6, priceMin: 350, priceMax: 700 },
      { name: "Shorts Biker 2 em 1", weight: 0.12, priceMin: 60, priceMax: 130 },
      { name: "Cardigan Tricô Oversized", weight: 0.3, priceMin: 150, priceMax: 300 },
    ],
    colorsInTitle: ["Preto", "Branco", "Rosa", "Bege", "Vermelho", "Azul Marinho"],
    optionGroups: [
      { name: "Tamanho", values: ["PP", "P", "M", "G", "GG"] },
      { name: "Cor", values: ["Preto", "Branco", "Rosa", "Bege", "Vermelho", "Azul Marinho"] },
    ],
    hasOptionChance: 0.7,
    maxVariants: 8,
  },
  Joias: {
    brands: ["Tiffany & Co.", "Pandora", "Swarovski", "Cartier", "Vivara", "H.Stern"],
    lines: [
      { name: "Pingente Coração Prata 925", weight: 0.01, priceMin: 500, priceMax: 3000 },
      { name: "Pulseira Corrente Cobra", weight: 0.015, priceMin: 300, priceMax: 1500 },
      { name: "Brinco Drop Cristal", weight: 0.005, priceMin: 200, priceMax: 1000 },
      { name: "Anel Love 18k", weight: 0.008, priceMin: 800, priceMax: 5000 },
      { name: "Pulseira Tennis", weight: 0.02, priceMin: 1000, priceMax: 8000 },
      { name: "Brinco Pérola", weight: 0.003, priceMin: 300, priceMax: 1200 },
      { name: "Colar Solitário Diamante", weight: 0.01, priceMin: 2000, priceMax: 12000 },
      { name: "Brinco Argola Ouro", weight: 0.012, priceMin: 400, priceMax: 2000 },
      { name: "Anel Cocktail", weight: 0.01, priceMin: 600, priceMax: 3500 },
      { name: "Pulseira de Charms", weight: 0.025, priceMin: 400, priceMax: 1800 },
    ],
    colorsInTitle: ["Prata", "Ouro", "Ouro Rosa"],
    optionGroups: [{ name: "Material", values: ["Prata 925", "Ouro 18k", "Ouro Rosa 18k"] }],
    hasOptionChance: 0.5,
    maxVariants: 3,
  },
};

const descriptionTemplates: Record<CategoryName, string[]> = {
  Eletrônicos: [
    "{brand} {productLine} de última geração. Performance excepcional com tecnologia avançada. Ideal para profissionais e entusiastas.",
    "{brand} {productLine} original. Produto certificado com garantia oficial. Performance e durabilidade incomparáveis.",
    "{brand} {productLine} com alta performance e design moderno. Conectividade e velocidade para o seu dia a dia.",
    "Descubra o {brand} {productLine}. Potência e elegância em um só produto. Ideal para trabalho e lazer.",
    "{brand} {productLine} - Tecnologia de ponta para você. Produto original com nota fiscal e garantia.",
  ],
  Masculino: [
    "{brand} {productLine} - Conforto e estilo para o dia a dia. Corte moderno e tecido de alta qualidade.",
    "{brand} {productLine} original. Perfeito para qualquer ocasião, do casual ao esportivo.",
    "{brand} {productLine} desenvolvido para maximizar seu conforto. Alta durabilidade e acabamento premium.",
    "{brand} {productLine} - A combinação perfeita de estilo e funcionalidade para o homem moderno.",
    "{brand} {productLine}. Qualidade e design que fazem a diferença no seu visual.",
  ],
  Feminino: [
    "{brand} {productLine} - Elegância e conforto para o seu guarda-roupa. Peça versátil para todas as ocasiões.",
    "{brand} {productLine} original. Design pensado para valorizar seu estilo único.",
    "{brand} {productLine} com tecido de alta qualidade e modelagem perfeita. Conforto do início ao fim do dia.",
    "{brand} {productLine} - A peça que faltava no seu look. Moderna, confortável e cheia de personalidade.",
    "{brand} {productLine}. Moda feminina com a qualidade que você merece.",
  ],
  Joias: [
    "{brand} {productLine} - Luxo e sofisticação em cada detalhe. Peça certificada com garantia internacional.",
    "{brand} {productLine} original. Joia fina com material nobre e acabamento impecável.",
    "{brand} {productLine}. Elegância atemporal para momentos especiais. Acompanha estojo e certificado de autenticidade.",
    "{brand} {productLine} - A joia perfeita para presentear ou se presentear. Brilho e qualidade incomparáveis.",
    "{brand} {productLine}. Design exclusivo e materiais selecionados para você brilhar ainda mais.",
  ],
};

const SEED_COUNT = Number(process.env.SEED_COUNT) || 200;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }
  return result;
}

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function abbreviate(word: string, maxLength = 4): string {
  return word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, maxLength)
    .toUpperCase();
}

function generateShortHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36).toUpperCase().padEnd(4, "0").slice(0, 4);
}

function generateSku(name: string, attributes: Record<string, string>): string {
  const sortedKeys = Object.keys(attributes).sort();
  const attrParts = sortedKeys.map((key) => {
    const val = attributes[key];
    return abbreviate(val ?? "");
  });

  const fullAttrString = sortedKeys.map((key) => `${key}:${attributes[key]}`).join("|");
  const uniqueSeed = `${name.trim()}|${fullAttrString}`;
  const uniqueId = generateShortHash(uniqueSeed);

  const parts = [abbreviate(name), ...attrParts, uniqueId];
  return parts.join("-");
}

function makeTitle(brand: string, lineName: string, color: string): string {
  return `${brand} ${lineName} - ${color}`;
}

function generateVariantCombinations(groups: OptionGroup[], max: number): string[][] {
  if (groups.length === 1) {
    return groups[0]!.values.slice(0, max).map((v) => [v]);
  }

  const combos: string[][] = [];
  for (const v1 of groups[0]!.values) {
    for (const v2 of groups[1]!.values) {
      combos.push([v1, v2]);
    }
  }

  return shuffle(combos).slice(0, max);
}

async function main() {
  console.log("🚀 Iniciando seed em massa...\n");

  const count = SEED_COUNT;
  console.log(`🎯 Gerando ${count} produtos...\n`);

  // ── Limpeza ──
  console.log("🧹 Limpando tabelas existentes...");
  await prisma.$transaction(async (tx) => {
    await tx.productVariantOption.deleteMany();
    await tx.productOptionValue.deleteMany();
    await tx.productOption.deleteMany();
    await tx.cartItem.deleteMany();
    await tx.cart.deleteMany();
    await tx.orderItem.deleteMany();
    await tx.couponUsage.deleteMany();
    await tx.order.deleteMany();
    await tx.coupon.deleteMany();
    await tx.wishlistItem.deleteMany();
    await tx.wishlist.deleteMany();
    await tx.promotion.deleteMany();
    await tx.productVariant.deleteMany();
    await tx.product.deleteMany();
    await tx.category.deleteMany();
    await tx.user.deleteMany();
  });
  console.log("✅ Tabelas limpas!\n");

  // ── Criar categorias ──
  console.log("🌱 Criando categorias...");
  const createdCategories = await prisma.$transaction(
    CATEGORIES.map((cat) => prisma.category.create({ data: { name: cat.name, image: cat.image } }))
  );
  const categoryMap = new Map(createdCategories.map((c) => [c.name, c.id]));
  console.log(`✅ Categorias: ${createdCategories.map((c) => c.name).join(", ")}\n`);

  // ── Gerar produtos ──
  console.log(`🛍️  Gerando ${count} produtos...\n`);

  const categoryNames = CATEGORIES.map((c) => c.name);
  let totalVariants = 0;
  let totalOptions = 0;
  let totalPromotions = 0;

  for (let i = 0; i < count; i++) {
    const catName = pick(categoryNames) as CategoryName;
    const catId = categoryMap.get(catName);
    if (!catId) {
      console.error(`❌ Categoria não encontrada: ${catName}`);
      continue;
    }

    const template = templates[catName];
    const brand = pick(template.brands);
    const line = pick(template.lines);
    const color = pick(template.colorsInTitle);
    const title = makeTitle(brand, line.name, color);
    const slug = generateSlug(title);

    const ratingRate = randomFloat(1.0, 5.0);
    const ratingCount = randomInt(10, 5000);
    const weight = line.weight;

    const product = await prisma.product.create({
      data: {
        slug,
        title,
        description: pick(descriptionTemplates[catName])
          .replace("{brand}", brand)
          .replace("{productLine}", line.name),
        ratingRate,
        ratingCount,
        totalStock: 0,
        categoryId: catId,
      },
    });

    const hasOptions = Math.random() < template.hasOptionChance && template.optionGroups.length > 0;

    let variantIndex = 0;
    let productStock = 0;

    if (hasOptions) {
      const numGroups = Math.random() < 0.25 && template.optionGroups.length >= 2 ? 2 : 1;
      const selectedGroups = shuffle([...template.optionGroups]).slice(0, numGroups);

      const createdValues: { id: string; value: string; groupName: string }[] = [];

      for (const group of selectedGroups) {
        const option = await prisma.productOption.create({
          data: { name: group.name, productId: product.id },
        });

        for (const value of group.values) {
          const optVal = await prisma.productOptionValue.create({
            data: { value, productOptionId: option.id },
          });
          createdValues.push({ id: optVal.id, value, groupName: group.name });
        }
      }

      totalOptions += selectedGroups.length;

      const combos = generateVariantCombinations(selectedGroups, template.maxVariants);

      for (const combo of combos) {
        const price = randomFloat(line.priceMin, line.priceMax);
        const stock = randomInt(0, 100);
        const attributes: Record<string, string> = {};
        for (let gi = 0; gi < selectedGroups.length; gi++) {
          attributes[selectedGroups[gi]!.name] = combo[gi]!;
        }
        const sku = generateSku(title, attributes);
        const isActive = Math.random() < 0.9;

        const variant = await prisma.productVariant.create({
          data: {
            sku,
            price,
            stock,
            weight,
            isActive,
            productId: product.id,
          },
        });

        productStock += stock;

        for (const val of combo) {
          const createdVal = createdValues.find((cv) => cv.value === val);
          if (createdVal) {
            await prisma.productVariantOption.create({
              data: {
                productVariantId: variant.id,
                productOptionValueId: createdVal.id,
              },
            });
          }
        }

        await maybeAddPromotionToVariant(variant.id, price);

        variantIndex++;
      }
    } else {
      const price = randomFloat(line.priceMin, line.priceMax);
      const stock = randomInt(0, 100);
      const sku = generateSku(title, {});
      const isActive = Math.random() < 0.9;

      const variant = await prisma.productVariant.create({
        data: {
          sku,
          price,
          stock,
          weight,
          isActive,
          productId: product.id,
        },
      });

      productStock += stock;
      await maybeAddPromotionToVariant(variant.id, price);
      variantIndex++;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { totalStock: productStock },
    });

    await maybeAddPromotionToProduct(product.id);

    totalVariants += variantIndex;

    if ((i + 1) % 50 === 0) {
      console.log(`  ✅ ${i + 1}/${count} produtos criados...`);
    }
  }

  console.log(`\n📊 RESUMO:`);
  console.log(`   Produtos: ${count}`);
  console.log(`   Variantes: ${totalVariants}`);
  console.log(`   Opções (grupos): ${totalOptions}`);
  console.log(`   Promoções: ${totalPromotions}`);

  const dbCounts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    variants: await prisma.productVariant.count(),
    options: await prisma.productOption.count(),
    optionValues: await prisma.productOptionValue.count(),
    variantOptions: await prisma.productVariantOption.count(),
    promotions: await prisma.promotion.count(),
  };

  console.log(`\n📊 CONTAGENS FINAIS NO BANCO:`);
  console.log(`   ✓ Categorias: ${dbCounts.categories}`);
  console.log(`   ✓ Produtos: ${dbCounts.products}`);
  console.log(`   ✓ Variantes: ${dbCounts.variants}`);
  console.log(`   ✓ Opções: ${dbCounts.options}`);
  console.log(`   ✓ Valores de Opção: ${dbCounts.optionValues}`);
  console.log(`   ✓ Associações Variante-Valor: ${dbCounts.variantOptions}`);
  console.log(`   ✓ Promoções: ${dbCounts.promotions}`);

  console.log(`\n✅ SEED EM MASSA CONCLUÍDO! ✅\n`);

  async function maybeAddPromotionToVariant(variantId: string, price: number) {
    if (Math.random() < 0.1) {
      const discountValue = randomFloat(5, price * 0.4);
      await prisma.promotion.create({
        data: {
          name: `Promoção Relâmpago - ${discountValue.toFixed(0)}%`,
          type: "FIXED",
          discountValue,
          isActive: true,
          startsAt: new Date("2024-01-01"),
          endsAt: new Date("2030-12-31"),
          variantId,
        },
      });
      totalPromotions++;
    }
  }

  async function maybeAddPromotionToProduct(productId: string) {
    if (Math.random() < 0.2) {
      const discountPercent = randomInt(10, 30);
      await prisma.promotion.create({
        data: {
          name: `Oferta Especial - ${discountPercent}% OFF`,
          type: "PERCENTAGE",
          discountValue: discountPercent,
          isActive: true,
          startsAt: new Date("2024-01-01"),
          endsAt: new Date("2030-12-31"),
          productId,
        },
      });
      totalPromotions++;
    }
  }
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
