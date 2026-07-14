import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

function createPrismaClient() {
  const raw = process.env.DATABASE_URL || "";
  const url = new URL(raw);
  url.password = decodeURIComponent(url.password);
  const adapter = new PrismaPg(url.toString());
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@bholefarms.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@bholefarms.com",
      hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created:", admin.email);

  const categories = [
    { name: "Vegetables", slug: "vegetables", order: 1 },
    { name: "Fruits", slug: "fruits", order: 2 },
    { name: "Grains & Pulses", slug: "grains-pulses", order: 3 },
    { name: "Dairy", slug: "dairy", order: 4 },
    { name: "Seasonal Specials", slug: "seasonal-specials", order: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Categories seeded:", categories.length);

  const defaultSettings = [
    { key: "site_name", value: "Bhole Farms" },
    { key: "site_description", value: "Fresh organic produce from farm to table" },
    { key: "contact_phone", value: "9881732998" },
    { key: "contact_email", value: "bholefarms21@gmail.com" },
    { key: "whatsapp_number", value: "919881732998" },
    { key: "address", value: "के. दत्तूभाऊ भोळे फार्महाउस देवगाव RV4J+69, Devgaon, Maharashtra 431123, India" },
    { key: "hero_headline", value: "Fresh from Our Farm to Your Table" },
    { key: "hero_subtext", value: "100% organic produce grown with care in Maharashtra" },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("Settings seeded:", defaultSettings.length);

  const fruitsCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "fruits" } });
  const veggiesCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "vegetables" } });
  const grainsCategory = await prisma.category.findUniqueOrThrow({ where: { slug: "grains-pulses" } });

  const products = [
    {
      name: "Kesar Mango",
      slug: "kesar-mango",
      description: "Sweet, rich in flavor and natural sweetness.",
      shortDescription: "Premium Kesar mangoes",
      price: 220,
      unit: "KG" as const,
      sku: "KES-001",
      categoryId: fruitsCategory.id,
      imagePath: "/images/kesar-mango.jpg",
      isFeatured: true,
      isSeasonal: true,
      season: "Summer",
      stock: 100,
    },
    {
      name: "Alphonso Mango",
      slug: "alphonso-mango",
      description: "Sweet, juicy and full of aroma. A summer favorite.",
      shortDescription: "The king of mangoes",
      price: 180,
      unit: "KG" as const,
      sku: "ALP-001",
      categoryId: fruitsCategory.id,
      imagePath: "/images/alphonso-mango.jpg",
      isFeatured: true,
      isSeasonal: true,
      season: "Summer",
      stock: 100,
    },
    {
      name: "Totapuri Mango",
      slug: "totapuri-mango",
      description: "Delicious & aromatic with a smooth texture.",
      shortDescription: "Tangy and delicious",
      price: 120,
      unit: "KG" as const,
      sku: "TOT-001",
      categoryId: fruitsCategory.id,
      imagePath: "/images/totapuri-mango.jpg",
      isFeatured: true,
      isSeasonal: true,
      season: "Summer",
      stock: 100,
    },
    {
      name: "Jambhul (Jamun)",
      slug: "jambhul-jamun",
      description: "Naturally sweet and healthy. Rich in antioxidants.",
      shortDescription: "Purple treasure of summer",
      price: 100,
      unit: "KG" as const,
      sku: "JAM-001",
      categoryId: fruitsCategory.id,
      imagePath: "/images/jambhul-jamun.jpg",
      isFeatured: true,
      isSeasonal: true,
      season: "Summer",
      stock: 100,
    },
    {
      name: "Guava (Peru)",
      slug: "guava-peru",
      description: "Crispy, juicy and rich in vitamin C.",
      shortDescription: "Farm fresh guava",
      price: 80,
      unit: "KG" as const,
      sku: "GUA-001",
      categoryId: fruitsCategory.id,
      imagePath: "/images/guava-peru.jpg",
      isFeatured: false,
      isSeasonal: false,
      season: null,
      stock: 100,
    },
    {
      name: "Pomegranate (Dalimb)",
      slug: "pomegranate-dalimb",
      description: "Full of nutrients and natural goodness.",
      shortDescription: "Fresh pomegranates",
      price: 130,
      unit: "KG" as const,
      sku: "POM-001",
      categoryId: fruitsCategory.id,
      imagePath: "/images/pomegranate-dalimb.jpg",
      isFeatured: false,
      isSeasonal: false,
      season: null,
      stock: 100,
    },
    {
      name: "Fresh Vegetables",
      slug: "fresh-vegetables",
      description: "A wide variety of seasonal organic vegetables.",
      shortDescription: "Seasonal veggies",
      price: 40,
      unit: "KG" as const,
      sku: "VEG-001",
      categoryId: veggiesCategory.id,
      imagePath: "/images/fresh-vegetables.jpg",
      isFeatured: false,
      isSeasonal: false,
      season: null,
      stock: 200,
    },
    {
      name: "Toor Dal (Organic)",
      slug: "toor-dal",
      description: "High quality organic pulses for a healthy life.",
      shortDescription: "Organic toor dal",
      price: 110,
      unit: "KG" as const,
      sku: "DAL-001",
      categoryId: grainsCategory.id,
      imagePath: "/images/toor-dal.jpg",
      isFeatured: false,
      isSeasonal: false,
      season: null,
      stock: 150,
    },
  ];

  for (const prod of products) {
    const { imagePath, ...prodData } = prod;
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prodData.name,
        description: prodData.description,
        shortDescription: prodData.shortDescription,
        price: prodData.price,
        unit: prodData.unit,
        sku: prodData.sku,
        categoryId: prodData.categoryId,
        isFeatured: prodData.isFeatured,
        isSeasonal: prodData.isSeasonal,
        season: prodData.season,
        stock: prodData.stock,
      },
      create: {
        name: prodData.name,
        slug: prod.slug,
        description: prodData.description,
        shortDescription: prodData.shortDescription,
        price: prodData.price,
        unit: prodData.unit,
        sku: prodData.sku,
        categoryId: prodData.categoryId,
        isFeatured: prodData.isFeatured,
        isSeasonal: prodData.isSeasonal,
        season: prodData.season,
        stock: prodData.stock,
      },
    });

    // Upsert thumbnail image for each product
    const existingImage = await prisma.productImage.findFirst({
      where: { productId: product.id, isThumbnail: true },
    });

    if (!existingImage) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imagePath: imagePath,
          sortOrder: 0,
          isThumbnail: true,
        },
      });
    }
  }

  console.log("Products seeded:", products.length);

  // Seed gallery items
  const galleryItems = [
    { title: "Sunrise at the Orchard", slug: "sunrise-orchard", category: "Farm Life", imagePath: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80", order: 1 },
    { title: "Alphonso Mango Harvest", slug: "alphonso-harvest", category: "Mangoes", imagePath: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80", order: 2 },
    { title: "Fresh Jamun Berries", slug: "fresh-jamun", category: "Jamun", imagePath: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80", order: 3 },
    { title: "Our Farmers", slug: "our-farmers", category: "Farm Life", imagePath: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", order: 4 },
    { title: "Green Fields", slug: "green-fields", category: "Harvest", imagePath: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80", order: 5 },
    { title: "Organic Farming", slug: "organic-farming", category: "Harvest", imagePath: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&q=80", order: 6 },
    { title: "Kesar Mangoes", slug: "kesar-mangoes-gallery", category: "Mangoes", imagePath: "https://images.unsplash.com/photo-1629828874514-d53eeea7a101?w=600&q=80", order: 7 },
    { title: "Farm Sunset", slug: "farm-sunset", category: "Farm Life", imagePath: "https://images.unsplash.com/photo-1536677813196-8fed27bcecdc?w=600&q=80", order: 8 },
    { title: "Drone View", slug: "drone-view", category: "Drone Shots", imagePath: "https://images.unsplash.com/photo-1574180566232-6e1a7e3b6e5b?w=600&q=80", order: 9 },
  ];

  for (const gItem of galleryItems) {
    const { imagePath, ...itemData } = gItem;
    const item = await prisma.galleryItem.upsert({
      where: { slug: gItem.slug },
      update: {
        title: itemData.title,
        category: itemData.category,
        order: itemData.order,
      },
      create: {
        title: itemData.title,
        slug: gItem.slug,
        category: itemData.category,
        order: itemData.order,
      },
    });

    // Add gallery image if not exists
    const existingGalleryImage = await prisma.galleryImage.findFirst({
      where: { galleryId: item.id },
    });

    if (!existingGalleryImage) {
      await prisma.galleryImage.create({
        data: {
          galleryId: item.id,
          imagePath: imagePath,
          sortOrder: 0,
        },
      });
    }
  }

  console.log("Gallery items seeded:", galleryItems.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
