/**
 * ========================================
 * SEED FINAL - 100% COMPATÍVEL COM SCHEMA
 * ========================================
 *
 * ANÁLISE COMPLETA DO SCHEMA:
 * ✅ Product NÃO tem campo "price" (só ProductVariant tem)
 * ✅ ProductOption usa campo "name" (não "type")
 * ✅ Promoções podem ser vinculadas a: category, product ou variant
 * ✅ Todos os campos opcionais tratados corretamente
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { ENV } from "@/shared/utils/env";

import { PrismaClient } from "./generated/client/client";

const connectionString = ENV.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ==========================================
// TIPOS
// ==========================================

type VariantData = {
  price: number;
  stock: number;
  weight: number;
  isActive?: boolean;
  options?: Record<string, string>;
  promotion?: {
    name: string;
    type: "FIXED" | "PERCENTAGE";
    discountValue: number;
    startsAt: Date;
    endsAt: Date;
    isActive: boolean;
  };
};

type ProductData = {
  title: string;
  description: string;
  image: string;
  totalStock: number;
  ratingRate: number;
  ratingCount: number;
  category: string;
  variants: VariantData[];
  productOptions: { name: string; values: string[] }[];
  promotions?: {
    name: string;
    type: "FIXED" | "PERCENTAGE";
    discountValue: number;
    startsAt: Date;
    endsAt: Date;
    isActive: boolean;
  }[];
};

// ==========================================
// HELPERS
// ==========================================

function generateSku(title: string, variantIndex: number = 0): string {
  const sanitized = title
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 40);

  const suffix = String(variantIndex).padStart(3, "0");
  return `${sanitized}-${suffix}`;
}

// ==========================================
// DADOS BASE
// ==========================================

const categories = ["men's clothing", "jewelery", "electronics", "women's clothing"];

// Promoções de categoria
const categoryPromotions = [
  {
    categoryName: "electronics",
    name: "Semana do Consumidor - Eletrônicos",
    type: "PERCENTAGE" as const,
    discountValue: 15,
    startsAt: new Date("2024-03-01"),
    endsAt: new Date("2030-03-31"),
    isActive: true,
  },
  {
    categoryName: "women's clothing",
    name: "Dia das Mulheres - Roupas Femininas",
    type: "PERCENTAGE" as const,
    discountValue: 20,
    startsAt: new Date("2024-03-01"),
    endsAt: new Date("2030-03-15"),
    isActive: true,
  },
];

const productsData: ProductData[] = [
  {
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    description: "Your perfect pack for everyday use and walks in the forest...",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    totalStock: 45,
    ratingRate: 3.9,
    ratingCount: 120,
    category: "men's clothing",
    variants: [
      { price: 109.95, stock: 15, weight: 1.2, isActive: true, options: { Cor: "Azul Marinho" } },
      { price: 109.95, stock: 15, weight: 1.2, isActive: true, options: { Cor: "Verde Oliva" } },
      { price: 109.95, stock: 15, weight: 1.2, isActive: true, options: { Cor: "Preto" } },
    ],
    productOptions: [{ name: "Cor", values: ["Azul Marinho", "Verde Oliva", "Preto"] }],
    promotions: [
      {
        name: "Black Friday - Fjallraven Backpack",
        type: "FIXED",
        discountValue: 20.0,
        startsAt: new Date("2024-01-01"),
        endsAt: new Date("2030-10-25"),
        isActive: true,
      },
    ],
  },
  {
    title: "Mens Casual Premium Slim Fit T-Shirts",
    description: "Slim-fitting style, contrast raglan long sleeve...",
    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png",
    totalStock: 95,
    ratingRate: 4.1,
    ratingCount: 259,
    category: "men's clothing",
    variants: [
      {
        price: 22.3,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "P", Cor: "Branco" },
      },
      {
        price: 22.3,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "M", Cor: "Branco" },
      },
      {
        price: 22.3,
        stock: 8,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "G", Cor: "Branco" },
      },
      {
        price: 22.3,
        stock: 7,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Branco" },
      },
      {
        price: 22.3,
        stock: 0,
        weight: 0.3,
        isActive: false,
        options: { Tamanho: "P", Cor: "Cinza Mescla" },
      },
      {
        price: 22.3,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "M", Cor: "Cinza Mescla" },
      },
      {
        price: 22.3,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "G", Cor: "Cinza Mescla" },
      },
      {
        price: 22.3,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Cinza Mescla" },
      },
      {
        price: 22.3,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "P", Cor: "Preto" },
      },
      {
        price: 22.3,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "M", Cor: "Preto" },
      },
      {
        price: 22.3,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "G", Cor: "Preto" },
      },
      {
        price: 22.3,
        stock: 0,
        weight: 0.3,
        isActive: false,
        options: { Tamanho: "GG", Cor: "Preto" },
      },
    ],
    productOptions: [
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Cor", values: ["Branco", "Cinza Mescla", "Preto"] },
    ],
    promotions: [
      {
        name: "Lançamento - Camisetas Slim Fit",
        type: "PERCENTAGE",
        discountValue: 10,
        startsAt: new Date("2024-01-01"),
        endsAt: new Date("2030-12-31"),
        isActive: true,
      },
    ],
  },
  {
    title: "Mens Cotton Jacket",
    description: "Great outerwear jackets for Spring/Autumn/Winter...",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png",
    totalStock: 30,
    ratingRate: 4.7,
    ratingCount: 500,
    category: "men's clothing",
    variants: [
      {
        price: 55.99,
        stock: 8,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "P", Cor: "Bege" },
        promotion: {
          name: "Promoção Tamanho P - Jaqueta Bege",
          type: "FIXED",
          discountValue: 15.0,
          startsAt: new Date("2024-01-01"),
          endsAt: new Date("2030-06-30"),
          isActive: true,
        },
      },
      {
        price: 55.99,
        stock: 8,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "M", Cor: "Bege" },
      },
      {
        price: 55.99,
        stock: 7,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "G", Cor: "Bege" },
      },
      {
        price: 55.99,
        stock: 7,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Bege" },
      },
      {
        price: 55.99,
        stock: 10,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "P", Cor: "Verde Militar" },
      },
      {
        price: 55.99,
        stock: 10,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "M", Cor: "Verde Militar" },
      },
      {
        price: 55.99,
        stock: 10,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "G", Cor: "Verde Militar" },
      },
      {
        price: 55.99,
        stock: 10,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Verde Militar" },
      },
    ],
    productOptions: [
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Cor", values: ["Bege", "Verde Militar"] },
    ],
  },
  {
    title: "Mens Casual Slim Fit",
    description: "The color could be slightly different between on the screen and in practice...",
    image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png",
    totalStock: 200,
    ratingRate: 2.1,
    ratingCount: 430,
    category: "men's clothing",
    variants: [
      {
        price: 15.99,
        stock: 50,
        weight: 0.25,
        isActive: true,
        options: { Tamanho: "P", Cor: "Preto" },
      },
      {
        price: 15.99,
        stock: 50,
        weight: 0.25,
        isActive: true,
        options: { Tamanho: "M", Cor: "Preto" },
      },
      {
        price: 15.99,
        stock: 50,
        weight: 0.25,
        isActive: true,
        options: { Tamanho: "G", Cor: "Preto" },
      },
      {
        price: 15.99,
        stock: 50,
        weight: 0.25,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Preto" },
      },
      {
        price: 15.99,
        stock: 20,
        weight: 0.25,
        isActive: true,
        options: { Tamanho: "P", Cor: "Azul" },
      },
      {
        price: 15.99,
        stock: 20,
        weight: 0.25,
        isActive: true,
        options: { Tamanho: "M", Cor: "Azul" },
      },
      {
        price: 15.99,
        stock: 20,
        weight: 0.25,
        isActive: true,
        options: { Tamanho: "G", Cor: "Azul" },
      },
      {
        price: 15.99,
        stock: 20,
        weight: 0.25,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Azul" },
      },
    ],
    productOptions: [
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Cor", values: ["Preto", "Azul"] },
    ],
  },
  {
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    description:
      "From our Legends Collection, the Naga was inspired by the mythical water dragon...",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png",
    totalStock: 8,
    ratingRate: 4.6,
    ratingCount: 400,
    category: "jewelery",
    variants: [
      { price: 695, stock: 5, weight: 0.2, isActive: true, options: { Material: "Prata" } },
      { price: 695, stock: 3, weight: 0.2, isActive: true, options: { Material: "Ouro Amarelo" } },
    ],
    productOptions: [{ name: "Material", values: ["Prata", "Ouro Amarelo"] }],
    promotions: [
      {
        name: "Desconto John Hardy Bracelet",
        type: "FIXED",
        discountValue: 146.0,
        startsAt: new Date("2024-01-01"),
        endsAt: new Date("2030-10-30"),
        isActive: true,
      },
    ],
  },
  {
    title: "Solid Gold Petite Micropave",
    description: "Satisfaction Guaranteed. Return or exchange any order within 30 days...",
    image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png",
    totalStock: 19,
    ratingRate: 3.9,
    ratingCount: 70,
    category: "jewelery",
    variants: [
      { price: 168, stock: 6, weight: 0.05, isActive: true, options: { "Tamanho do Anel": "14" } },
      { price: 168, stock: 0, weight: 0.05, isActive: false, options: { "Tamanho do Anel": "16" } },
      { price: 168, stock: 7, weight: 0.05, isActive: true, options: { "Tamanho do Anel": "18" } },
      { price: 168, stock: 6, weight: 0.05, isActive: true, options: { "Tamanho do Anel": "20" } },
    ],
    productOptions: [{ name: "Tamanho do Anel", values: ["14", "16", "18", "20"] }],
    promotions: [
      {
        name: "Queima de Estoque - Anéis",
        type: "PERCENTAGE",
        discountValue: 25,
        startsAt: new Date("2024-02-01"),
        endsAt: new Date("2030-02-28"),
        isActive: true,
      },
    ],
  },
  {
    title: "White Gold Plated Princess",
    description: "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her...",
    image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png",
    totalStock: 150,
    ratingRate: 3.0,
    ratingCount: 400,
    category: "jewelery",
    variants: [{ price: 9.99, stock: 150, weight: 0.04, isActive: true }],
    productOptions: [],
    promotions: [
      {
        name: "Promoção Anel Princesa",
        type: "FIXED",
        discountValue: 2.0,
        startsAt: new Date("2024-01-01"),
        endsAt: new Date("2030-10-23"),
        isActive: true,
      },
    ],
  },
  {
    title: "Pierced Owl Rose Gold Plated Stainless Steel Double",
    description: "Rose Gold Plated Double Flared Tunnel Plug Earrings...",
    image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png",
    totalStock: 300,
    ratingRate: 1.9,
    ratingCount: 100,
    category: "jewelery",
    variants: [{ price: 10.99, stock: 300, weight: 0.03, isActive: true }],
    productOptions: [],
  },
  {
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers...",
    image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png",
    totalStock: 80,
    ratingRate: 3.3,
    ratingCount: 203,
    category: "electronics",
    variants: [
      { price: 64, stock: 27, weight: 0.25, isActive: true, options: { Capacidade: "1TB" } },
      { price: 64, stock: 27, weight: 0.25, isActive: true, options: { Capacidade: "2TB" } },
      {
        price: 84,
        stock: 26,
        weight: 0.25,
        isActive: true,
        options: { Capacidade: "4TB" },
        promotion: {
          name: "Super Desconto 4TB",
          type: "PERCENTAGE",
          discountValue: 20,
          startsAt: new Date("2024-01-01"),
          endsAt: new Date("2030-12-31"),
          isActive: true,
        },
      },
    ],
    productOptions: [{ name: "Capacidade", values: ["1TB", "2TB", "4TB"] }],
  },
  {
    title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    description: "Easy upgrade for faster boot up, shutdown, application load and response...",
    image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png",
    totalStock: 50,
    ratingRate: 2.9,
    ratingCount: 470,
    category: "electronics",
    variants: [
      { price: 69, stock: 17, weight: 0.1, isActive: true, options: { Capacidade: "256GB" } },
      { price: 89, stock: 17, weight: 0.1, isActive: true, options: { Capacidade: "500GB" } },
      { price: 109, stock: 16, weight: 0.1, isActive: true, options: { Capacidade: "1TB" } },
    ],
    productOptions: [{ name: "Capacidade", values: ["256GB", "500GB", "1TB"] }],
    promotions: [
      {
        name: "Upgrade de SSD - Desconto Especial",
        type: "FIXED",
        discountValue: 15,
        startsAt: new Date("2024-01-15"),
        endsAt: new Date("2030-12-31"),
        isActive: true,
      },
    ],
  },
  {
    title: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
    description: "3D NAND flash are applied to deliver high transfer speeds...",
    image: "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_t.png",
    totalStock: 60,
    ratingRate: 4.8,
    ratingCount: 319,
    category: "electronics",
    variants: [
      { price: 109, stock: 20, weight: 0.12, isActive: true, options: { Capacidade: "256GB" } },
      { price: 129, stock: 20, weight: 0.12, isActive: true, options: { Capacidade: "512GB" } },
      { price: 149, stock: 20, weight: 0.12, isActive: true, options: { Capacidade: "1TB" } },
    ],
    productOptions: [{ name: "Capacidade", values: ["256GB", "512GB", "1TB"] }],
  },
  {
    title: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
    description: "Expand your PS4 gaming experience, Play anywhere Fast and easy...",
    image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_t.png",
    totalStock: 35,
    ratingRate: 4.8,
    ratingCount: 400,
    category: "electronics",
    variants: [
      { price: 114, stock: 20, weight: 0.3, isActive: true, options: { Compatibilidade: "PS4" } },
      { price: 114, stock: 15, weight: 0.3, isActive: true, options: { Compatibilidade: "PC" } },
    ],
    productOptions: [{ name: "Compatibilidade", values: ["PS4", "PC"] }],
    promotions: [
      {
        name: "Promoção Gamers - HD Externo",
        type: "PERCENTAGE",
        discountValue: 12,
        startsAt: new Date("2024-06-01"),
        endsAt: new Date("2030-06-30"),
        isActive: true,
      },
    ],
  },
  {
    title: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
    description: "21.5 inches Full HD widescreen IPS display...",
    image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_t.png",
    totalStock: 15,
    ratingRate: 2.9,
    ratingCount: 250,
    category: "electronics",
    variants: [
      { price: 599, stock: 8, weight: 1.5, isActive: true, options: { Tamanho: '21.5"' } },
      { price: 699, stock: 7, weight: 1.8, isActive: true, options: { Tamanho: '24"' } },
    ],
    productOptions: [{ name: "Tamanho", values: ['21.5"', '24"'] }],
  },
  {
    title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor – Super Ultrawide Screen QLED",
    description: "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR...",
    image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_t.png",
    totalStock: 8,
    ratingRate: 2.2,
    ratingCount: 140,
    category: "electronics",
    variants: [
      { price: 899.99, stock: 5, weight: 1.6, isActive: true, options: { Tamanho: '34"' } },
      { price: 999.99, stock: 3, weight: 2.0, isActive: true, options: { Tamanho: '49"' } },
    ],
    productOptions: [{ name: "Tamanho", values: ['49"', '34"'] }],
    promotions: [
      {
        name: "Monitor Gamer - Black Friday",
        type: "FIXED",
        discountValue: 200,
        startsAt: new Date("2024-11-01"),
        endsAt: new Date("2030-11-30"),
        isActive: true,
      },
    ],
  },
  {
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    description: "Note:The Jackets is US standard size...",
    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_t.png",
    totalStock: 55,
    ratingRate: 2.6,
    ratingCount: 235,
    category: "women's clothing",
    variants: [
      {
        price: 56.99,
        stock: 15,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "P", Cor: "Rosa" },
      },
      {
        price: 56.99,
        stock: 15,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "M", Cor: "Rosa" },
      },
      {
        price: 56.99,
        stock: 15,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "G", Cor: "Rosa" },
      },
      {
        price: 56.99,
        stock: 10,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Rosa" },
      },
      {
        price: 56.99,
        stock: 10,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "P", Cor: "Roxo" },
      },
      {
        price: 56.99,
        stock: 10,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "M", Cor: "Roxo" },
      },
      {
        price: 56.99,
        stock: 10,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "G", Cor: "Roxo" },
      },
      {
        price: 56.99,
        stock: 10,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Roxo" },
      },
      {
        price: 56.99,
        stock: 10,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "P", Cor: "Preto" },
      },
      {
        price: 56.99,
        stock: 10,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "M", Cor: "Preto" },
      },
      {
        price: 56.99,
        stock: 10,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "G", Cor: "Preto" },
      },
      {
        price: 56.99,
        stock: 10,
        weight: 0.5,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Preto" },
      },
    ],
    productOptions: [
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Cor", values: ["Rosa", "Roxo", "Preto"] },
    ],
  },
  {
    title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    description: "100% POLYURETHANE(shell) 100% POLYESTER(lining)...",
    image: "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_t.png",
    totalStock: 65,
    ratingRate: 2.9,
    ratingCount: 340,
    category: "women's clothing",
    variants: [
      {
        price: 29.95,
        stock: 20,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "P", Cor: "Preto" },
      },
      {
        price: 29.95,
        stock: 20,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "M", Cor: "Preto" },
      },
      {
        price: 29.95,
        stock: 15,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "G", Cor: "Preto" },
      },
      {
        price: 29.95,
        stock: 10,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Preto" },
      },
      {
        price: 29.95,
        stock: 15,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "P", Cor: "Marrom" },
      },
      {
        price: 29.95,
        stock: 15,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "M", Cor: "Marrom" },
      },
      {
        price: 29.95,
        stock: 15,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "G", Cor: "Marrom" },
      },
      {
        price: 29.95,
        stock: 15,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Marrom" },
      },
      {
        price: 29.95,
        stock: 15,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "P", Cor: "Vermelho" },
      },
      {
        price: 29.95,
        stock: 15,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "M", Cor: "Vermelho" },
      },
      {
        price: 29.95,
        stock: 15,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "G", Cor: "Vermelho" },
      },
      {
        price: 29.95,
        stock: 15,
        weight: 0.45,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Vermelho" },
      },
    ],
    productOptions: [
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Cor", values: ["Preto", "Marrom", "Vermelho"] },
    ],
    promotions: [
      {
        name: "Promoção Jaqueta Couro Fake",
        type: "FIXED",
        discountValue: 5.0,
        startsAt: new Date("2024-01-01"),
        endsAt: new Date("2030-10-26"),
        isActive: true,
      },
    ],
  },
  {
    title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    description: "Lightweight perfect for trip or casual wear...",
    image: "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2t.png",
    totalStock: 40,
    ratingRate: 3.8,
    ratingCount: 679,
    category: "women's clothing",
    variants: [
      {
        price: 39.99,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "P", Cor: "Azul" },
      },
      {
        price: 39.99,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "M", Cor: "Azul" },
      },
      {
        price: 39.99,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "G", Cor: "Azul" },
      },
      {
        price: 39.99,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Azul" },
      },
      {
        price: 39.99,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "P", Cor: "Branco" },
      },
      {
        price: 39.99,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "M", Cor: "Branco" },
      },
      {
        price: 39.99,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "G", Cor: "Branco" },
      },
      {
        price: 39.99,
        stock: 10,
        weight: 0.3,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Branco" },
      },
    ],
    productOptions: [
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Cor", values: ["Azul", "Branco"] },
    ],
  },
  {
    title: "MBJ Women's Solid Short Sleeve Boat Neck V",
    description: "95% RAYON 5% SPANDEX, Made in USA or Imported...",
    image: "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_t.png",
    totalStock: 25,
    ratingRate: 4.7,
    ratingCount: 130,
    category: "women's clothing",
    variants: [
      {
        price: 9.85,
        stock: 6,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "P", Cor: "Preto" },
      },
      {
        price: 9.85,
        stock: 6,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "M", Cor: "Preto" },
      },
      {
        price: 9.85,
        stock: 7,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "G", Cor: "Preto" },
      },
      {
        price: 9.85,
        stock: 6,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Preto" },
      },
      {
        price: 9.85,
        stock: 10,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "P", Cor: "Rosa" },
      },
      {
        price: 9.85,
        stock: 10,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "M", Cor: "Rosa" },
      },
      {
        price: 9.85,
        stock: 10,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "G", Cor: "Rosa" },
      },
      {
        price: 9.85,
        stock: 10,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Rosa" },
      },
      {
        price: 9.85,
        stock: 10,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "P", Cor: "Bege" },
      },
      {
        price: 9.85,
        stock: 10,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "M", Cor: "Bege" },
      },
      {
        price: 9.85,
        stock: 10,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "G", Cor: "Bege" },
      },
      {
        price: 9.85,
        stock: 10,
        weight: 0.2,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Bege" },
      },
    ],
    productOptions: [
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Cor", values: ["Preto", "Rosa", "Bege"] },
    ],
  },
  {
    title: "Opna Women's Short Sleeve Moisture",
    description: "100% Polyester, Machine wash...",
    image: "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_t.png",
    totalStock: 70,
    ratingRate: 4.5,
    ratingCount: 146,
    category: "women's clothing",
    variants: [
      {
        price: 7.95,
        stock: 18,
        weight: 0.15,
        isActive: true,
        options: { Tamanho: "P", Cor: "Cinza" },
      },
      {
        price: 7.95,
        stock: 17,
        weight: 0.15,
        isActive: true,
        options: { Tamanho: "M", Cor: "Cinza" },
      },
      {
        price: 7.95,
        stock: 18,
        weight: 0.15,
        isActive: true,
        options: { Tamanho: "G", Cor: "Cinza" },
      },
      {
        price: 7.95,
        stock: 17,
        weight: 0.15,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Cinza" },
      },
      {
        price: 7.95,
        stock: 15,
        weight: 0.15,
        isActive: true,
        options: { Tamanho: "P", Cor: "Azul Claro" },
      },
      {
        price: 7.95,
        stock: 15,
        weight: 0.15,
        isActive: true,
        options: { Tamanho: "M", Cor: "Azul Claro" },
      },
      {
        price: 7.95,
        stock: 15,
        weight: 0.15,
        isActive: true,
        options: { Tamanho: "G", Cor: "Azul Claro" },
      },
      {
        price: 7.95,
        stock: 15,
        weight: 0.15,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Azul Claro" },
      },
    ],
    productOptions: [
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Cor", values: ["Cinza", "Azul Claro"] },
    ],
    promotions: [
      {
        name: "Liquidação Verão - Blusas",
        type: "PERCENTAGE",
        discountValue: 30,
        startsAt: new Date("2024-01-01"),
        endsAt: new Date("2030-02-28"),
        isActive: true,
      },
    ],
  },
  {
    title: "DANVOUY Womens T Shirt Casual Cotton Short",
    description: "95%Cotton,5%Spandex, Features: Casual, Short Sleeve...",
    image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_t.png",
    totalStock: 90,
    ratingRate: 3.6,
    ratingCount: 145,
    category: "women's clothing",
    variants: [
      {
        price: 12.99,
        stock: 23,
        weight: 0.18,
        isActive: true,
        options: { Tamanho: "P", Cor: "Verde" },
      },
      {
        price: 12.99,
        stock: 22,
        weight: 0.18,
        isActive: true,
        options: { Tamanho: "M", Cor: "Verde" },
      },
      {
        price: 12.99,
        stock: 23,
        weight: 0.18,
        isActive: true,
        options: { Tamanho: "G", Cor: "Verde" },
      },
      {
        price: 12.99,
        stock: 22,
        weight: 0.18,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Verde" },
      },
      {
        price: 12.99,
        stock: 20,
        weight: 0.18,
        isActive: true,
        options: { Tamanho: "P", Cor: "Branco" },
      },
      {
        price: 12.99,
        stock: 20,
        weight: 0.18,
        isActive: true,
        options: { Tamanho: "M", Cor: "Branco" },
      },
      {
        price: 12.99,
        stock: 20,
        weight: 0.18,
        isActive: true,
        options: { Tamanho: "G", Cor: "Branco" },
      },
      {
        price: 12.99,
        stock: 20,
        weight: 0.18,
        isActive: true,
        options: { Tamanho: "GG", Cor: "Branco" },
      },
    ],
    productOptions: [
      { name: "Tamanho", values: ["P", "M", "G", "GG"] },
      { name: "Cor", values: ["Verde", "Branco"] },
    ],
  },
];

// ==========================================
// FUNÇÃO PRINCIPAL
// ==========================================

async function main() {
  console.log("🚀 Iniciando o processo de seed (VERSÃO FINAL - 100% COMPATÍVEL)...\n");

  // Limpeza
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
  console.log("✅ Tabelas limpas com sucesso!\n");

  // Categorias
  console.log("🌱 Inserindo categorias...");
  const createdCategories = await prisma.$transaction(
    categories.map((name) => prisma.category.create({ data: { name } }))
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

  // Produtos com variantes
  console.log("🛍️  Inserindo produtos com variantes e opções...");
  let totalVariants = 0;
  let totalPromotions = 0;
  let totalVariantPromotions = 0;

  for (const [i, data] of productsData.entries()) {
    const categoryId = categoryMap.get(data.category);

    if (!categoryId) {
      console.error(`❌ Categoria não encontrada: ${data.category}`);
      continue;
    }

    console.log(`  📦 Produto ${i + 1}/${productsData.length}: ${data.title.substring(0, 40)}...`);

    // Criar produto (SEM campo price!)
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.image,
        ratingRate: data.ratingRate,
        ratingCount: data.ratingCount,
        totalStock: data.variants.reduce((sum, v) => sum + v.stock, 0),
        categoryId: categoryId,
      },
    });

    // Criar ProductOptions e ProductOptionValues
    const optionValueMap = new Map<string, Map<string, string>>();

    for (const option of data.productOptions) {
      const productOption = await prisma.productOption.create({
        data: {
          name: option.name,
          productId: product.id,
        },
      });

      const valueMap = new Map<string, string>();

      for (const value of option.values) {
        const productOptionValue = await prisma.productOptionValue.create({
          data: {
            value: value,
            productOptionId: productOption.id,
          },
        });
        valueMap.set(value, productOptionValue.id);
      }

      optionValueMap.set(option.name, valueMap);
    }

    // Criar ProductVariants
    for (const [variantIndex, variantData] of data.variants.entries()) {
      const sku = generateSku(data.title, variantIndex);

      const variant = await prisma.productVariant.create({
        data: {
          sku: sku,
          price: variantData.price,
          stock: variantData.stock,
          weight: variantData.weight,
          isActive: variantData.isActive !== undefined ? variantData.isActive : true,
          productId: product.id,
        },
      });

      totalVariants++;

      // Associar opções à variant
      if (variantData.options) {
        for (const [optionName, optionValue] of Object.entries(variantData.options)) {
          const valueMap = optionValueMap.get(optionName);
          if (valueMap) {
            const optionValueId = valueMap.get(optionValue);
            if (optionValueId) {
              await prisma.productVariantOption.create({
                data: {
                  productVariantId: variant.id,
                  productOptionValueId: optionValueId,
                },
              });
            }
          }
        }
      }

      // Criar promoção específica da variante (se existir)
      if (variantData.promotion) {
        await prisma.promotion.create({
          data: {
            name: variantData.promotion.name,
            type: variantData.promotion.type,
            discountValue: variantData.promotion.discountValue,
            isActive: variantData.promotion.isActive,
            startsAt: variantData.promotion.startsAt,
            endsAt: variantData.promotion.endsAt,
            variantId: variant.id,
          },
        });
        totalVariantPromotions++;
      }
    }

    // Criar promoções do produto (vinculadas ao produto)
    if (data.promotions) {
      for (const promoData of data.promotions) {
        await prisma.promotion.create({
          data: {
            name: promoData.name,
            type: promoData.type,
            discountValue: promoData.discountValue,
            isActive: promoData.isActive,
            startsAt: promoData.startsAt,
            endsAt: promoData.endsAt,
            productId: product.id,
          },
        });
        totalPromotions++;
      }
    }
  }

  console.log(`✅ Produtos inseridos!`);
  console.log(`   - Variantes: ${totalVariants}`);
  console.log(`   - Promoções de produto: ${totalPromotions}`);
  console.log(`   - Promoções de variante: ${totalVariantPromotions}\n`);

  // Relatório final
  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    variants: await prisma.productVariant.count(),
    options: await prisma.productOption.count(),
    optionValues: await prisma.productOptionValue.count(),
    variantOptions: await prisma.productVariantOption.count(),
    promotions: await prisma.promotion.count(),
  };

  console.log("📊 CONTAGENS FINAIS:");
  console.log(`   ✓ Categorias: ${counts.categories}`);
  console.log(`   ✓ Produtos: ${counts.products}`);
  console.log(`   ✓ Variantes: ${counts.variants}`);
  console.log(`   ✓ Opções: ${counts.options}`);
  console.log(`   ✓ Valores de Opção: ${counts.optionValues}`);
  console.log(`   ✓ Associações: ${counts.variantOptions}`);
  console.log(`   ✓ Promoções TOTAIS: ${counts.promotions}`);
  console.log(`     • Categoria: ${categoryPromotions.length}`);
  console.log(`     • Produto: ${totalPromotions}`);
  console.log(`     • Variante: ${totalVariantPromotions}\n`);

  console.log("✅ SEED CONCLUÍDO COM SUCESSO! ✅\n");
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
